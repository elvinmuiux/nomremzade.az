'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Phone, Smartphone, Diamond, MessageCircle, Heart } from 'lucide-react';
import { loadElanData, loadAllElanData, ElanData, ElanNumber } from '@/lib/elanData';
import StatisticsManager from '@/lib/statistics';
import './PhonePageTemplate.css';

interface DataFileConfig {
  file: string;
  key: string;
  provider: string;
  prefix: string;
}

interface PhonePageTemplateProps {
  operator?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  dataFiles?: DataFileConfig[];
  showAllNumbers?: boolean;
  showProviderFilter?: boolean;
}

const PhonePageTemplate: React.FC<PhonePageTemplateProps> = ({ 
  operator,
  title = "Nömrələr",
  subtitle = "Telefon nömrələri",
  icon = <Phone size={24} />,
  color = "#3B82F6",
  dataFiles = [],
  showAllNumbers = false,
  showProviderFilter = false
}) => {
  const [showExpanded, setShowExpanded] = useState(false);
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [selectedLength, setSelectedLength] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');
  const [elanData, setElanData] = useState<ElanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (showAllNumbers) {
          const data = await loadAllElanData();
          setElanData(data);
        } else if (operator) {
          const data = await loadElanData(operator);
          setElanData(data);
        }
      } catch (error) {
        console.error('Error loading elan data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [operator, showAllNumbers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.phone-custom-select')) {
        setShowOperatorDropdown(false);
      }
    };

    if (showOperatorDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showOperatorDropdown]);

  // Get unique providers from dataFiles
  const providers = useMemo(() => {
    if (!showAllNumbers || !dataFiles.length) return [];
    const uniqueProviders = [...new Set(dataFiles.map(file => file.provider))];
    return uniqueProviders;
  }, [dataFiles, showAllNumbers]);

  // Operator options - Using simple logos for now
  const operatorOptions = useMemo(() => [
    { 
      value: 'azercell', 
      label: 'Azercell', 
      icon: 'A',
      color: '#0066CC'
    },
    { 
      value: 'bakcell', 
      label: 'Bakcell', 
      icon: 'B',
      color: '#00A651'
    },
    { 
      value: 'nar-mobile', 
      label: 'Nar Mobile', 
      icon: 'N',
      color: '#FF6B00'
    },
    { 
      value: 'naxtel', 
      label: 'Naxtel', 
      icon: 'X',
      color: '#E30613'
    }
  ], []);

  // Prefix options based on selected operator
  const prefixOptions = useMemo(() => {
    const prefixMap: { [key: string]: string[] } = {
      'azercell': ['050', '051', '055', '010'],
      'bakcell': ['055', '099'],
      'nar-mobile': ['070', '077'],
      'naxtel': ['060']
    };
    
    if (!selectedOperator) return [];
    return prefixMap[selectedOperator] || [];
  }, [selectedOperator]);

  const filteredNumbers = useMemo(() => {
    if (!elanData?.standard) return [];
    
    return elanData.standard.filter((number: ElanNumber) => {
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

      const matchesOperator = selectedOperator === '' || 
        number.provider.toLowerCase().includes(selectedOperator.toLowerCase());

      const matchesPrefix = selectedPrefix === '' || 
        number.phoneNumber.startsWith(selectedPrefix);
      
      return matchesSearch && matchesPrice && matchesLength && matchesProvider && matchesOperator && matchesPrefix;
    });
  }, [elanData, searchTerm, selectedPrice, selectedLength, selectedProvider, selectedOperator, selectedPrefix]);

  const filteredPremiumNumbers = useMemo(() => {
    if (!elanData?.premium) return [];
    
    return elanData.premium.filter((number: ElanNumber) => {
      const matchesSearch = searchTerm === '' || 
        number.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvider = selectedProvider === '' || 
        number.provider === selectedProvider;

      const matchesOperator = selectedOperator === '' || 
        number.provider.toLowerCase().includes(selectedOperator.toLowerCase());

      const matchesPrefix = selectedPrefix === '' || 
        number.phoneNumber.startsWith(selectedPrefix);
      
      return matchesSearch && matchesProvider && matchesOperator && matchesPrefix;
    });
  }, [elanData, searchTerm, selectedProvider, selectedOperator, selectedPrefix]);

  const filteredGoldNumbers = useMemo(() => {
    if (!elanData?.gold) return [];
    
    return elanData.gold.filter((number: ElanNumber) => {
      const matchesSearch = searchTerm === '' || 
        number.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvider = selectedProvider === '' || 
        number.provider === selectedProvider;

      const matchesOperator = selectedOperator === '' || 
        number.provider.toLowerCase().includes(selectedOperator.toLowerCase());

      const matchesPrefix = selectedPrefix === '' || 
        number.phoneNumber.startsWith(selectedPrefix);
      
      return matchesSearch && matchesProvider && matchesOperator && matchesPrefix;
    });
  }, [elanData, searchTerm, selectedProvider, selectedOperator, selectedPrefix]);

  const highlightNumber = (number: string) => {
    if (!searchTerm) return number;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return number.replace(regex, '<span class="phone-highlight">$1</span>');
  };

  const handleOrderClick = (number: string, price: number) => {
    StatisticsManager.incrementSoldNumbers();
    const confirmed = confirm(`${number} nömrəsi üçün sifarişiniz qeydə alındı!\nQiymət: ₼${price}\n\nƏn qısa zamanda sizinlə əlaqə saxlanacaq.\n\nİndi zəng etmək istəyirsiniz? (0550 444-44-22)`);
    if (confirmed) {
      window.location.href = 'tel:+994550444422';
    }
  };

  const getOperatorIcon = (provider: string) => {
    const normalizedProvider = provider.toLowerCase().replace(/[-\s]/g, '');
    
    const iconMap: { [key: string]: string } = {
      'azercell': 'A',
      'bakcell': 'B',
      'narmobile': 'N',
      'nar': 'N',
      'naxtel': 'X'
    };
    
    return iconMap[normalizedProvider] || '📱';
  };

  const handleWhatsAppClick = (number: string) => {
    window.open(`https://wa.me/994501234567?text=Salam, ${number} nömrəsini sifarış etmək istəyirəm`, '_blank');
  };

  const handleSearch = () => {
    // The filtering is already reactive via useMemo
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedPrice('');
    setSelectedLength('');
    setSelectedProvider('');
    setSelectedOperator('');
    setSelectedPrefix('');
  };

  // Remove mobile-only restriction to show on all devices
  // if (!isMobile) {
  //   return null; // Mobile template only renders on mobile
  // }

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
        {/* Page Header - Numbers Page Style */}
        <div className="phone-page-header">
          <div className="phone-page-title-wrapper">
            <div className="phone-page-icon" data-color={color}>
              {icon}
            </div>
            <div className="phone-page-title-content">
              <h1 className="phone-page-title">{title}</h1>
              <p className="phone-page-subtitle">{subtitle}</p>
            </div>
          </div>
          <div className="phone-page-stats">
            <div className="phone-stat-item">
              <Diamond size={16} />
              <span>{filteredPremiumNumbers.length}</span>
            </div>
            <div className="phone-stat-item">
              <Heart size={16} />
              <span>{filteredGoldNumbers.length}</span>
            </div>
            <div className="phone-stat-item">
              <Phone size={16} />
              <span>{filteredNumbers.length}</span>
            </div>
          </div>
        </div>

        {/* Search Interface - Enhanced with Operator, Prefix and Search Button */}
        <div className="phone-search-container">
          <div className="phone-search-input-wrapper">
            <div className="phone-custom-select">
              <div 
                className={`phone-select-trigger ${showOperatorDropdown ? 'active' : ''}`}
                onClick={() => setShowOperatorDropdown(!showOperatorDropdown)}
              >
                <div className="phone-select-value">
                  {selectedOperator ? (
                    <>
                      <span 
                        className={`phone-operator-icon ${selectedOperator}`}
                      >
                        {operatorOptions.find(op => op.value === selectedOperator)?.icon}
                      </span>
                      <span>{operatorOptions.find(op => op.value === selectedOperator)?.label}</span>
                    </>
                  ) : (
                    <span>Bütün operatorlar</span>
                  )}
                </div>
                <div className="phone-select-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
              
              {showOperatorDropdown && (
                <div className="phone-select-dropdown">
                  <div 
                    className="phone-select-option"
                    onClick={() => {
                      setSelectedOperator('');
                      setSelectedPrefix('');
                      setShowOperatorDropdown(false);
                    }}
                  >
                    <span>Bütün operatorlar</span>
                  </div>
                  {operatorOptions.map(option => (
                    <div 
                      key={option.value}
                      className="phone-select-option"
                      onClick={() => {
                        setSelectedOperator(option.value);
                        setSelectedPrefix('');
                        setShowOperatorDropdown(false);
                      }}
                    >
                      <span className={`phone-operator-icon ${option.value}`}>
                        {option.icon}
                      </span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="phone-search-input-wrapper">
            <select 
              value={selectedPrefix} 
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="phone-select"
              aria-label="Prefiks seçin"
              disabled={!selectedOperator}
            >
              <option value="">Bütün prefikslər</option>
              {prefixOptions.map(prefix => (
                <option key={prefix} value={prefix}>
                  {prefix}
                </option>
              ))}
            </select>
          </div>
          
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
          
          <button 
            onClick={handleSearch}
            className="phone-search-button"
            aria-label="Axtarış et"
          >
            <Search size={20} />
          </button>
          
          <button 
            onClick={() => setShowExpanded(!showExpanded)}
            className="phone-filter-button"
            aria-label="Əlavə filtrlər"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Expandable Search Box - Enhanced Filters */}
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
            
            {/* Provider Filter */}
            {showProviderFilter && providers.length > 0 && (
              <div className="phone-search-input-wrapper">
                <select 
                  value={selectedProvider} 
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="phone-select"
                  aria-label="Provider seçin"
                >
                  <option value="">Bütün providerlər</option>
                  {providers.map(provider => (
                    <option key={provider} value={provider}>
                      {getOperatorIcon(provider)} {provider}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="phone-search-actions">
              <button 
                onClick={handleSearch}
                className="phone-search-action-btn phone-search-btn"
              >
                <Search size={16} />
                Axtarış et
              </button>
              
              <button 
                onClick={handleClearFilters}
                className="phone-search-action-btn phone-clear-btn"
              >
                Təmizlə
              </button>
            </div>
          </div>
        )}

        {/* Premium Numbers Section - Numbers Page Style */}
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
                        onClick={() => handleOrderClick(number.phoneNumber, number.price)}
                        className="phone-premium-order-btn"
                      >
                        <Phone size={16} />
                        Sifariş et
                      </button>
                      
                      <button 
                        onClick={() => handleWhatsAppClick(number.phoneNumber)}
                        className="phone-premium-whatsapp-btn"
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gold Numbers Section - Numbers Page Style */}
        {filteredGoldNumbers.length > 0 && (
          <div className="phone-gold-section">
            <div className="phone-section-header">
              <Heart size={20} />
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
                      <Heart size={14} />
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
                        onClick={() => handleOrderClick(number.phoneNumber, number.price)}
                        className="phone-gold-order-btn"
                      >
                        <Phone size={16} />
                        Sifariş et
                      </button>
                      
                      <button 
                        onClick={() => handleWhatsAppClick(number.phoneNumber)}
                        className="phone-gold-whatsapp-btn"
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standard Numbers Section - Numbers Page Style */}
        {filteredNumbers.length > 0 && (
          <div className="phone-standard-section">
            <div className="phone-section-header">
              <Phone size={20} />
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
                      onClick={() => handleOrderClick(number.phoneNumber, number.price)}
                      className="phone-standard-order-btn"
                    >
                      <Phone size={16} />
                      Sifariş et
                    </button>
                    
                    <button 
                      onClick={() => handleWhatsAppClick(number.phoneNumber)}
                      className="phone-standard-whatsapp-btn"
                      aria-label="WhatsApp ilə əlaqə"
                    >
                      <MessageCircle size={16} />
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
                onClick={handleClearFilters}
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

export default PhonePageTemplate;
