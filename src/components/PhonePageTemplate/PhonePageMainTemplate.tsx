'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Phone, Smartphone, Diamond } from 'lucide-react';
import { loadAllElanData, ElanData, ElanNumber } from '@/lib/elanData';
import './PhonePageTemplate.css';

interface DataFileConfig {
  file: string;
  key: string;
  provider: string;
  prefix: string;
}

interface PhonePageMainTemplateProps {
  pageTitle: string;
  dataFiles: DataFileConfig[];
  showProviderFilter?: boolean;
}

const PhonePageMainTemplate: React.FC<PhonePageMainTemplateProps> = ({ 
  pageTitle,
  dataFiles,
  showProviderFilter = false
}) => {
  const [showExpanded, setShowExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [selectedLength, setSelectedLength] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [allElanData, setAllElanData] = useState<ElanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const data = await loadAllElanData();
        setAllElanData(data);
      } catch (error) {
        console.error('Error loading all elan data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Get unique providers from dataFiles
  const providers = useMemo(() => {
    const uniqueProviders = [...new Set(dataFiles.map(file => file.provider))];
    return uniqueProviders;
  }, [dataFiles]);

  // Filter numbers based on search criteria
  const filteredNumbers = useMemo(() => {
    if (!allElanData?.standard) return [];
    
    return allElanData.standard.filter((number: ElanNumber) => {
      const matchesSearch = searchTerm === '' || 
        number.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = selectedPrice === '' || 
        (selectedPrice === 'low' && number.price < 100) ||
        (selectedPrice === 'medium' && number.price >= 100 && number.price < 500) ||
        (selectedPrice === 'high' && number.price >= 500);
      
      const matchesLength = selectedLength === '' || 
        (selectedLength === 'short' && number.phoneNumber.length <= 10) ||
        (selectedLength === 'medium' && number.phoneNumber.length > 10 && number.phoneNumber.length <= 12) ||
        (selectedLength === 'long' && number.phoneNumber.length > 12);

      const matchesProvider = selectedProvider === '' || 
        number.provider === selectedProvider;
      
      return matchesSearch && matchesPrice && matchesLength && matchesProvider;
    });
  }, [allElanData, searchTerm, selectedPrice, selectedLength, selectedProvider]);

  // Filter premium numbers
  const filteredPremiumNumbers = useMemo(() => {
    if (!allElanData?.premium) return [];
    
    return allElanData.premium.filter((number: ElanNumber) => {
      const matchesSearch = searchTerm === '' || 
        number.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvider = selectedProvider === '' || 
        number.provider === selectedProvider;
      
      return matchesSearch && matchesProvider;
    });
  }, [allElanData, searchTerm, selectedProvider]);

  // Filter gold numbers
  const filteredGoldNumbers = useMemo(() => {
    if (!allElanData?.gold) return [];
    
    return allElanData.gold.filter((number: ElanNumber) => {
      const matchesSearch = searchTerm === '' || 
        number.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvider = selectedProvider === '' || 
        number.provider === selectedProvider;
      
      return matchesSearch && matchesProvider;
    });
  }, [allElanData, searchTerm, selectedProvider]);

  const highlightNumber = (number: string) => {
    if (!searchTerm) return number;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return number.replace(regex, '<span class="phone-highlight">$1</span>');
  };

  const handleOrderClick = (number: string) => {
    const confirmed = confirm(`${number} nömrəsi üçün sifarişiniz qeydə alındı!\n\nƏn qısa zamanda sizinlə əlaqə saxlanacaq.\n\nİndi zəng etmək istəyirsiniz? (0550 444-44-22)`);
    if (confirmed) {
      window.location.href = 'tel:+994550444422';
    }
  };

  const getOperatorIcon = (provider: string) => {
    const iconMap: { [key: string]: string } = {
      'Azercell': '🔵',
      'Bakcell': '🟢', 
      'Nar Mobile': '🟡',
      'Naxtel': '🔴'
    };
    return iconMap[provider] || '📱';
  };

  if (!isMobile) {
    return null; // Mobile template only renders on mobile
  }

  if (loading) {
    return (
      <div className="phone-page-container">
        <div className="phone-search-section">
          <div className="phone-loading">
            <Smartphone size={32} />
            <span>Nömrələr yüklənir...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-page-container">
      <div className="phone-search-section">
        {/* Page Header */}
        <div className="phone-page-header">
          <div className="phone-page-title-wrapper">
            <div className="phone-page-icon">
              <Phone size={24} />
            </div>
            <div className="phone-page-title-content">
              <h1 className="phone-page-title">{pageTitle}</h1>
              <p className="phone-page-subtitle">
                {filteredNumbers.length + filteredPremiumNumbers.length + filteredGoldNumbers.length} nömrə tapıldı
              </p>
            </div>
          </div>
          <div className="phone-page-stats">
            <div className="phone-stat-item">
              <Diamond size={16} />
              <span>{filteredPremiumNumbers.length}</span>
            </div>
            <div className="phone-stat-item">
              <Phone size={16} />
              <span>{filteredGoldNumbers.length}</span>
            </div>
            <div className="phone-stat-item">
              <Smartphone size={16} />
              <span>{filteredNumbers.length}</span>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="phone-search-container">
          <div className="phone-search-input-wrapper">
            <select 
              value={selectedPrice} 
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="phone-select"
              aria-label="Qiymət seçin"
            >
              <option value="">Bütün qiymətlər</option>
              <option value="low">0-100 AZN</option>
              <option value="medium">100-500 AZN</option>
              <option value="high">500+ AZN</option>
            </select>
          </div>
          
          <div className="phone-search-input-wrapper">
            <select 
              value={selectedLength} 
              onChange={(e) => setSelectedLength(e.target.value)}
              className="phone-select"
              aria-label="Uzunluq seçin"
            >
              <option value="">Bütün uzunluqlar</option>
              <option value="short">Qısa (≤10)</option>
              <option value="medium">Orta (11-12)</option>
              <option value="long">Uzun (&gt;12)</option>
            </select>
          </div>
          
          <button 
            onClick={() => setShowExpanded(!showExpanded)}
            className="phone-filter-button"
            aria-label="Daha çox filtr seçənəyi"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Expandable Search Box */}
        {showExpanded && (
          <div className="phone-search-expandable">
            <div className="phone-search-input-wrapper">
              <input
                type="text"
                placeholder="Nömrə axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="phone-search-input"
              />
              <Search size={20} className="phone-search-icon" />
            </div>
            
            {/* Provider Filter */}
            {showProviderFilter && (
              <div className="phone-search-input-wrapper">
                <select 
                  value={selectedProvider} 
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="phone-select"
                  aria-label="Operator seçin"
                >
                  <option value="">Bütün operatorlar</option>
                  {providers.map(provider => (
                    <option key={provider} value={provider}>
                      {getOperatorIcon(provider)} {provider}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Premium Numbers Section */}
        {filteredPremiumNumbers.length > 0 && (
          <div className="phone-premium-section">
            <div className="phone-section-header">
              <Diamond size={20} />
              <h2>Premium Nömrələr</h2>
              <span className="phone-section-count">{filteredPremiumNumbers.length}</span>
            </div>
            
            <div className="phone-premium-grid">
              {filteredPremiumNumbers.map((number: ElanNumber, index: number) => (
                <div key={index} className="phone-premium-card">
                  <div className="phone-premium-header">
                    <div className="phone-premium-number">
                      <span dangerouslySetInnerHTML={{ __html: highlightNumber(number.phoneNumber) }} />
                    </div>
                    <div className="phone-premium-badge">
                      <Diamond size={14} />
                      <span>Premium</span>
                    </div>
                  </div>
                  
                  <div className="phone-premium-details">
                    <div className="phone-premium-price">
                      <span className="phone-price-currency">₼</span>
                      <span className="phone-price-amount">{number.price}</span>
                    </div>
                    
                    <div className="phone-premium-actions">
                      <button 
                        onClick={() => handleOrderClick(number.phoneNumber)}
                        className="phone-premium-order-btn"
                      >
                        <Phone size={16} />
                        Sifariş et
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gold Numbers Section */}
        {filteredGoldNumbers.length > 0 && (
          <div className="phone-gold-section">
            <div className="phone-section-header">
              <Phone size={20} />
              <h2>Gold Nömrələr</h2>
              <span className="phone-section-count">{filteredGoldNumbers.length}</span>
            </div>
            
            <div className="phone-gold-grid">
              {filteredGoldNumbers.map((number: ElanNumber, index: number) => (
                <div key={index} className="phone-gold-card">
                  <div className="phone-gold-header">
                    <div className="phone-gold-number">
                      <span dangerouslySetInnerHTML={{ __html: highlightNumber(number.phoneNumber) }} />
                    </div>
                    <div className="phone-gold-badge">
                      <Phone size={14} />
                      <span>Gold</span>
                    </div>
                  </div>
                  
                  <div className="phone-gold-details">
                    <div className="phone-gold-price">
                      <span className="phone-price-currency">₼</span>
                      <span className="phone-price-amount">{number.price}</span>
                    </div>
                    
                    <div className="phone-gold-actions">
                      <button 
                        onClick={() => handleOrderClick(number.phoneNumber)}
                        className="phone-gold-order-btn"
                      >
                        <Phone size={16} />
                        Sifariş et
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standard Numbers Section */}
        {filteredNumbers.length > 0 && (
          <div className="phone-standard-section">
            <div className="phone-section-header">
              <Smartphone size={20} />
              <h2>Standart Nömrələr</h2>
              <span className="phone-section-count">{filteredNumbers.length}</span>
            </div>
            
            <div className="phone-standard-list">
              {filteredNumbers.map((number: ElanNumber, index: number) => (
                <div key={index} className="phone-standard-card">
                  <div className="phone-standard-info">
                    <div className="phone-standard-number">
                      <span dangerouslySetInnerHTML={{ __html: highlightNumber(number.phoneNumber) }} />
                    </div>
                    <div className="phone-standard-price">
                      <span className="phone-price-currency">₼</span>
                      <span className="phone-price-amount">{number.price}</span>
                    </div>
                  </div>
                  
                  <div className="phone-standard-actions">
                    <button 
                      onClick={() => handleOrderClick(number.phoneNumber)}
                      className="phone-standard-order-btn"
                    >
                      <Phone size={16} />
                      Sifariş et
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {filteredNumbers.length === 0 && filteredPremiumNumbers.length === 0 && filteredGoldNumbers.length === 0 && !loading && (
          <div className="phone-no-results">
            <div className="phone-no-results-content">
              <Search size={48} />
              <h3>Heç bir nömrə tapılmadı</h3>
              <p>Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPrice('');
                  setSelectedLength('');
                  setSelectedProvider('');
                }}
                className="phone-clear-filters-btn"
              >
                Filtrləri təmizlə
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhonePageMainTemplate;
