'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import StatisticsManager from '@/lib/statistics';
import './PhonePageTemplate.css';

interface NumberAd {
  id: number;
  phoneNumber: string;
  price: number;
  contactPhone?: string;
  type?: string;
  isVip?: boolean;
  description?: string;
  provider: string;
  prefix: string;
}

interface DataFileConfig {
  file: string;
  key: string;
  provider: string;
  prefix: string;
}

interface PhonePageTemplateProps {
  pageTitle: string;
  dataFiles: DataFileConfig[];
  operatorPrefixes?: string[];
  showProviderFilter?: boolean;
  operatorName?: string;
}

// Premium Numbers Component for Mobile
interface PremiumNumber {
  id: number;
  number: string;
  views: number;
  price: number;
  operator: string;
  status: string;
}

interface PremiumNumbersProps {
  numbers?: PremiumNumber[];
}

const PremiumNumbers: React.FC<PremiumNumbersProps> = ({ numbers = [] }) => {
  const handleOrder = (number: string, price: number) => {
    StatisticsManager.incrementSoldNumbers();
    const confirmed = confirm(`${number} nömrəsi üçün sifarişiniz qeydə alındı!\nQiymət: ₼${price}\n\nƏn qısa zamanda sizinlə əlaqə saxlanacaq.\n\nİndi zəng etmək istəyirsiniz? (0550 444-44-22)`);
    if (confirmed) {
      window.location.href = 'tel:+994550444422';
    }
  };

  if (!numbers || numbers.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-blue-600 mb-4">Premium nömrələr</h2>
      
      <div className="premium-numbers-container">
        {numbers.map((item) => (
          <div 
            key={item.id} 
            className="bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-between text-white transition-colors cursor-pointer shadow-sm premium-number-card"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">{item.number}</span>
              <div className="flex items-center gap-1 text-blue-100">
                <TrendingUp size={16} />
                <span className="text-sm">{item.views}</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleOrder(item.number, item.price)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full font-medium transition-colors shadow-sm"
            >
              Sifariş et
            </button>
          </div>
        ))}
      </div>
      
      {/* View All Link */}
      <div className="text-right mt-4">
        <button className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
          Hamısına bax...
        </button>
      </div>
    </div>
  );
};

// Gold Numbers Component for Mobile  
interface GoldNumber {
  id: number;
  number: string;
  views: number;
  price: number;
  operator: string;
  status: string;
}

interface GoldNumbersProps {
  numbers?: GoldNumber[];
}

const GoldNumbers: React.FC<GoldNumbersProps> = ({ numbers = [] }) => {
  const handleOrder = (number: string, price: number) => {
    StatisticsManager.incrementSoldNumbers();
    const confirmed = confirm(`${number} nömrəsi üçün sifarişiniz qeydə alındı!\nQiymət: ₼${price}\n\nƏn qısa zamanda sizinlə əlaqə saxlanacaq.\n\nİndi zəng etmək istəyirsiniz? (0550 444-44-22)`);
    if (confirmed) {
      window.location.href = 'tel:+994550444422';
    }
  };

  if (!numbers || numbers.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-yellow-600 mb-4">Gold nömrələr</h2>
      
      <div className="gold-numbers-container">
        {numbers.map((item) => (
          <div 
            key={item.id} 
            className="bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-between text-white transition-colors cursor-pointer shadow-sm gold-number-card"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">{item.number}</span>
              <div className="flex items-center gap-1 text-yellow-100">
                <TrendingUp size={16} />
                <span className="text-sm">{item.views}</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleOrder(item.number, item.price)}
              className="bg-white text-yellow-600 hover:bg-yellow-50 px-6 py-2 rounded-full font-medium transition-colors shadow-sm"
            >
              Sifariş et
            </button>
          </div>
        ))}
      </div>
      
      {/* View All Link */}
      <div className="text-right mt-4">
        <button className="text-sm text-yellow-500 hover:text-yellow-600 transition-colors">
          Hamısına bax...
        </button>
      </div>
    </div>
  );
};

export default function PhonePageTemplate({
  dataFiles,
  operatorPrefixes,
  showProviderFilter = false
}: PhonePageTemplateProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ads, setAds] = useState<NumberAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on client side and if device is mobile
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 767;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load numbers data
  useEffect(() => {
    const loadNumbers = async () => {
      try {
        const allNumbers: NumberAd[] = [];

        for (const dataFile of dataFiles) {
          try {
            const response = await fetch(`/data/${dataFile.file}`);
            if (response.ok) {
              const data = await response.json();
              const adsArray = data[dataFile.key] || [];
              
              const processedAds = adsArray.map((item: Record<string, unknown>, index: number) => {
                const phoneNumber = String(item.phoneNumber || item.numara || '');
                const phoneDigits = phoneNumber.replace(/[^0-9]/g, '');
                const actualPrefix = phoneDigits.slice(0, 3);
                
                return {
                  id: item.id || index + 1,
                  phoneNumber: phoneNumber,
                  price: (() => {
                    if (item.price) return Number(item.price);
                    if (item.fiyat) {
                      if (item.fiyat === null) return 0;
                      const priceStr = String(item.fiyat);
                      const numericPrice = priceStr.replace(/[^0-9]/g, '');
                      return numericPrice ? Number(numericPrice) : 0;
                    }
                    return 0;
                  })(),
                  contactPhone: String(item.contactPhone || '(050) 444-44-22'),
                  type: item.type || 'standard',
                  isVip: Boolean(item.isVip),
                  description: item.description || '',
                  provider: dataFile.provider,
                  prefix: actualPrefix
                };
              });

              allNumbers.push(...processedAds);
            }
          } catch (error) {
            console.error(`Error loading ${dataFile.file}:`, error);
          }
        }

        setAds(allNumbers);
      } catch (err) {
        console.error('Error loading numbers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNumbers();
  }, [dataFiles]);

  const filteredAds = useMemo(() => {
    if (!ads.length) return [];
    
    return ads.filter(ad => {
      if (!ad || !ad.phoneNumber) return false;
      
      const phoneDigits = ad.phoneNumber.replace(/[^0-9]/g, '');
      
      if (showProviderFilter && selectedProvider && selectedProvider !== 'all' && ad.provider !== selectedProvider) {
        return false;
      }
      
      if (selectedPrefix && selectedPrefix !== 'all') {
        const cleanPrefix = selectedPrefix.replace(/[^0-9]/g, '');
        if (!phoneDigits.startsWith(cleanPrefix)) return false;
      }
      
      if (searchTerm.trim()) {
        const searchDigits = searchTerm.replace(/\D/g, '');
        
        if (searchDigits) {
          if (!phoneDigits.includes(searchDigits)) return false;
        } else {
          const searchText = searchTerm.toLowerCase().trim();
          const phoneText = ad.phoneNumber.toLowerCase();
          if (!phoneText.includes(searchText)) return false;
        }
      }
      
      return true;
    });
  }, [ads, searchTerm, selectedPrefix, selectedProvider, showProviderFilter]);

  const getUniqueProviders = () => {
    const providers = [...new Set(ads.map(ad => ad.provider))];
    return [
      { value: 'all', label: 'Operator seçin' },
      ...providers.sort().map(provider => ({ value: provider, label: provider }))
    ];
  };

  const getUniquePrefixes = () => {
    let prefixes: string[] = [];
    
    if (showProviderFilter && selectedProvider && selectedProvider !== 'all') {
      prefixes = ads
        .filter(ad => ad.provider === selectedProvider)
        .map(ad => ad.prefix);
    } else if (ads.length > 0) {
      prefixes = ads.map(ad => ad.prefix);
    } else {
      prefixes = operatorPrefixes || [];
    }
    
    const uniquePrefixes = [...new Set(prefixes)].sort();
    return [
      { value: 'all', label: 'Prefiks seçin' },
      ...uniquePrefixes.map(prefix => ({ value: prefix, label: prefix }))
    ];
  };

  // Sample data for premium and gold numbers
  const premiumNumbers = [
    { id: 1, number: "050-266-63-66", views: 5758, price: 1500, operator: "050", status: "active" },
    { id: 2, number: "051-555-55-55", views: 4321, price: 1200, operator: "051", status: "active" },
    { id: 3, number: "055-777-77-77", views: 3456, price: 800, operator: "055", status: "active" }
  ];

  const goldNumbers: GoldNumber[] = [];

  // Highlight search term in phone number (only matching digits)
  const highlightSearchTerm = (phoneNumber: string, searchTerm: string) => {
    if (!searchTerm.trim()) return phoneNumber;
    
    const searchDigits = searchTerm.replace(/\D/g, '');
    if (!searchDigits) {
      // Metin araması için
      const searchText = searchTerm.toLowerCase();
      const phoneText = phoneNumber.toLowerCase();
      const matchIndex = phoneText.indexOf(searchText);
      if (matchIndex === -1) return phoneNumber;
      
      return (
        <>
          {phoneNumber.slice(0, matchIndex)}
          <span className="phone-highlight">
            {phoneNumber.slice(matchIndex, matchIndex + searchTerm.length)}
          </span>
          {phoneNumber.slice(matchIndex + searchTerm.length)}
        </>
      );
    }
    
    // Sayı araması için
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    const matchIndex = phoneDigits.indexOf(searchDigits);
    if (matchIndex === -1) return phoneNumber;
    
    let digitCount = 0;
    let highlightStart = null;
    let highlightEnd = null;
    
    for (let i = 0; i < phoneNumber.length; i++) {
      if (/\d/.test(phoneNumber[i])) {
        if (digitCount === matchIndex) highlightStart = i;
        if (digitCount === matchIndex + searchDigits.length - 1) {
          highlightEnd = i + 1;
          break;
        }
        digitCount++;
      }
    }
    
    if (highlightStart !== null && highlightEnd !== null) {
      return (
        <>
          {phoneNumber.slice(0, highlightStart)}
          <span className="phone-highlight">
            {phoneNumber.slice(highlightStart, highlightEnd)}
          </span>
          {phoneNumber.slice(highlightEnd)}
        </>
      );
    }
    
    return phoneNumber;
  };

  // Only render on client side and mobile devices
  if (!isClient || !isMobile) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center py-12 text-gray-500">
            <p>Yüklənir...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-page-container">
      {/* Page Title */}
      <div className="phone-page-title">
        <h1>Esas səhifə</h1>
      </div>
      
      <div className="phone-search-section">
        {/* Filter Controls */}
        <div className="phone-search-container">
          {/* Operator Dropdown */}
          {showProviderFilter && (
            <div className="phone-search-input-wrapper">
              <select 
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  setSelectedPrefix('all');
                  setSearchTerm('');
                }}
                className="phone-select"
                title="Operator seçin"
                aria-label="Operator seçin"
              >
                {getUniqueProviders().map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Prefix Dropdown */}
          <div className="phone-search-input-wrapper">
            <select 
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="phone-select"
              title="Prefiks seçin"
              aria-label="Prefiks seçin"
            >
              {getUniquePrefixes().map((prefix) => (
                <option key={prefix.value} value={prefix.value}>
                  {prefix.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Search Input */}
          <div className="phone-search-input-wrapper">
            <input
              type="text"
              placeholder="Nömrə axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="phone-search-input"
            />
            <Search className="phone-search-icon" />
          </div>
          
          {/* Filter Button */}
          <button className="phone-filter-button" title="Axtarış et">
           
          </button>
        </div>

        {/* Premium Numbers Section - Only show on main page */}
        {showProviderFilter && (
          <PremiumNumbers numbers={premiumNumbers} />
        )}

        {/* Gold Numbers Section - Only show on main page */}
        {showProviderFilter && (
          <GoldNumbers numbers={goldNumbers} />
        )}

        {/* Standard Numbers List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {searchTerm.trim() && selectedPrefix && selectedPrefix !== 'all' ? (
              `${selectedPrefix} prefiksində "${searchTerm}" için ${filteredAds.length} nömrə`
            ) : searchTerm.trim() ? (
              `"${searchTerm}" axtarışı üçün ${filteredAds.length} nömrə`
            ) : selectedPrefix && selectedPrefix !== 'all' ? (
              `${selectedPrefix} prefiksi: ${filteredAds.length} nömrə`
            ) : selectedProvider && selectedProvider !== 'all' ? (
              `${selectedProvider}: ${filteredAds.length} nömrə`
            ) : (
              `Toplam ${filteredAds.length} nömrə`
            )}
          </h2>
          
          {filteredAds.length > 0 ? (
            [...filteredAds]
              .sort((a, b) => b.price - a.price)
              .map((ad) => (
                <div 
                  key={`${ad.provider}-${ad.id}`} 
                  className="phone-number-card"
                >
                  <div className="phone-number-card-left">
                    <span className="phone-number-display">{highlightSearchTerm(ad.phoneNumber, searchTerm)}</span>
                    <div className="phone-number-card-views">
                      <TrendingUp size={16} />
                      <span>0</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      StatisticsManager.incrementSoldNumbers();
                      const confirmed = confirm(`${ad.phoneNumber} nömrəsi üçün sifarişiniz qeydə alındı!\nQiymət: ₼${ad.price}\n\nƏn qısa zamanda sizinlə əlaqə saxlanacaq.\n\nİndi zəng etmək istəyirsiniz? (0550 444-44-22)`);
                      if (confirmed) {
                        window.location.href = 'tel:+994550444422';
                      }
                    }}
                    className="phone-order-button"
                  >
                    Sifariş et
                  </button>
                </div>
              ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">Nömrə tapılmadı</h3>
              <p className="mb-4">
                {searchTerm ? `"${searchTerm}" axtarışına uyğun nömrə yoxdur` : 'Hal-hazırda mövcud nömrə yoxdur'}
              </p>
              {(searchTerm || (selectedProvider && selectedProvider !== 'all') || (selectedPrefix && selectedPrefix !== 'all')) && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPrefix('all');
                    setSelectedProvider('all');
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Filtrləri Sıfırla
                </button>
              )}
            </div>
          )}
        </div>

        {/* Spacer for additional content */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}