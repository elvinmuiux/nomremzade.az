'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import StatisticsManager from '@/lib/statistics';
import { loadAllElanData, filterByPrefix, searchNumbers, ElanData } from '@/lib/elanData';
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
  const [showAll, setShowAll] = useState(false);
  
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

  // Show only first 3 numbers if showAll is false
  const displayedNumbers = showAll ? numbers : numbers.slice(0, 3);
  const hasMoreNumbers = numbers.length > 3;

  return (
    <div className="mb-6">
      <br />
      <h2 className="text-lg font-semibold text-blue-600 mb-4">Toplam Premium elan ({numbers.length})</h2>
      <p className="text-sm text-gray-500 mb-4">
      <br />
      </p>
      
      
      <div className="premium-numbers-container">
        {displayedNumbers.map((item) => (
          <div 
            key={item.id} 
            className="bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-between text-white transition-colors cursor-pointer shadow-sm premium-number-card"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">{item.number}</span>
              <div className="flex items-center gap-1 text-blue-100 price-display-large">
                <span className="price-currency-large">₼</span>
                <span className="price-amount-large">{item.price}</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleOrder(item.number, item.price)}
              className="phone-order-btn"
            >
              Sifariş et
            </button>
          </div>
        ))}
      </div>
      
      {/* View All Link - Only show if there are more than 3 numbers */}
      {hasMoreNumbers && (
        <div className="text-right mt-4">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            {showAll ? 'Daha az göstər...' : 'Hamısına bax...'}
          </button>
        </div>
      )}
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
  const [elanData, setElanData] = useState<ElanData>({ premium: [], gold: [], standard: [] });

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

  // Load numbers data from new elan structure
  useEffect(() => {
    const loadNumbers = async () => {
      try {
        // Load from new elan data structure
        const newElanData = await loadAllElanData();
        setElanData(newElanData);
        
        // Convert elan data to ads format for compatibility
        const allNumbers: NumberAd[] = [];
        
        // Add premium numbers
        newElanData.premium.forEach(num => {
          allNumbers.push({
            id: num.id,
            phoneNumber: num.phoneNumber,
            price: num.price,
            contactPhone: num.contactPhone,
            type: num.type,
            isVip: num.isVip,
            description: num.description,
            provider: num.provider,
            prefix: num.prefix
          });
        });
        
        // Add gold numbers
        newElanData.gold.forEach(num => {
          allNumbers.push({
            id: num.id,
            phoneNumber: num.phoneNumber,
            price: num.price,
            contactPhone: num.contactPhone,
            type: num.type,
            isVip: num.isVip,
            description: num.description,
            provider: num.provider,
            prefix: num.prefix
          });
        });
        
        // Add standard numbers
        newElanData.standard.forEach(num => {
          allNumbers.push({
            id: num.id,
            phoneNumber: num.phoneNumber,
            price: num.price,
            contactPhone: num.contactPhone,
            type: num.type,
            isVip: num.isVip,
            description: num.description,
            provider: num.provider,
            prefix: num.prefix
          });
        });

        // Also load legacy data for backward compatibility
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
                  id: item.id || (index + 1000), // Offset to avoid conflicts
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

  // Helper function to get prefixes for each operator
  const getOperatorPrefixes = (operator: string): string[] => {
    switch (operator) {
      case 'azercell':
        return ['050', '051', '010'];
      case 'bakcell':
        return ['055', '099'];
      case 'nar-mobile':
        return ['070', '077'];
      case 'naxtel':
        return ['060'];
      default:
        return [];
    }
  };

  const filteredAds = useMemo(() => {
    if (!ads.length) return [];
    
    let filteredData = { premium: [...elanData.premium], gold: [...elanData.gold], standard: [...elanData.standard] };
    
    // Apply operator filter
    if (showProviderFilter && selectedProvider && selectedProvider !== 'all') {
      const operatorPrefixes = getOperatorPrefixes(selectedProvider);
      filteredData = {
        premium: filteredData.premium.filter(num => operatorPrefixes.includes(num.prefix)),
        gold: filteredData.gold.filter(num => operatorPrefixes.includes(num.prefix)),
        standard: filteredData.standard.filter(num => operatorPrefixes.includes(num.prefix))
      };
    }
    
    // Apply prefix filter
    if (selectedPrefix && selectedPrefix !== 'all') {
      filteredData = filterByPrefix(filteredData, selectedPrefix);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      filteredData = searchNumbers(filteredData, searchTerm);
    }
    
    // Convert back to ads format and merge with legacy data
    const filteredNumbers: NumberAd[] = [];
    
    [...filteredData.premium, ...filteredData.gold, ...filteredData.standard].forEach(num => {
      filteredNumbers.push({
        id: num.id,
        phoneNumber: num.phoneNumber,
        price: num.price,
        contactPhone: num.contactPhone,
        type: num.type,
        isVip: num.isVip,
        description: num.description,
        provider: num.provider,
        prefix: num.prefix
      });
    });
    
    // Add legacy filtered data
    const legacyFiltered = ads.filter(ad => {
      if (!ad || !ad.phoneNumber) return false;
      if (ad.id < 1000) return false; // Only include legacy data (id >= 1000)
      
      const phoneDigits = ad.phoneNumber.replace(/[^0-9]/g, '');
      
      // Apply operator filter to legacy data
      if (showProviderFilter && selectedProvider && selectedProvider !== 'all') {
        const operatorPrefixes = getOperatorPrefixes(selectedProvider);
        if (!operatorPrefixes.includes(ad.prefix)) return false;
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
    
    return [...filteredNumbers, ...legacyFiltered];
  }, [ads, searchTerm, selectedPrefix, selectedProvider, showProviderFilter, elanData]);

  const getUniqueProviders = () => {
    return [
      { value: 'all', label: 'Operator seçin' },
      { value: 'azercell', label: 'Azercell' },
      { value: 'bakcell', label: 'Bakcell' },
      { value: 'nar-mobile', label: 'Nar Mobile' },
      { value: 'naxtel', label: 'Naxtel' }
    ];
  };

  const getUniquePrefixes = () => {
    let prefixes: string[] = [];
    
    if (showProviderFilter && selectedProvider && selectedProvider !== 'all') {
      // Get prefixes for the selected operator
      prefixes = getOperatorPrefixes(selectedProvider);
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

  // Get premium numbers from elan data
  const premiumNumbers = useMemo(() => {
    const allPremiumNumbers = [...elanData.premium, ...elanData.gold];
    
    // Apply filters to premium numbers
    let filteredPremium = allPremiumNumbers;
    
    // Apply operator filter to premium numbers
    if (showProviderFilter && selectedProvider && selectedProvider !== 'all') {
      const operatorPrefixes = getOperatorPrefixes(selectedProvider);
      filteredPremium = filteredPremium.filter(num => operatorPrefixes.includes(num.prefix));
    }
    
    if (selectedPrefix && selectedPrefix !== 'all') {
      filteredPremium = filteredPremium.filter(num => num.prefix === selectedPrefix);
    }
    
    if (searchTerm.trim()) {
      const searchDigits = searchTerm.replace(/\D/g, '');
      if (searchDigits) {
        filteredPremium = filteredPremium.filter(num => 
          num.phoneNumber.replace(/\D/g, '').includes(searchDigits)
        );
      } else {
        const searchText = searchTerm.toLowerCase();
        filteredPremium = filteredPremium.filter(num => 
          num.phoneNumber.toLowerCase().includes(searchText) ||
          num.description.toLowerCase().includes(searchText)
        );
      }
    }
    
    return filteredPremium.map(num => ({
      id: num.id,
      number: num.phoneNumber,
      views: Math.floor(Math.random() * 9000) + 1000, // Random views for demo
      price: num.price,
      operator: num.prefix,
      status: num.status
    }));
  }, [elanData, selectedProvider, selectedPrefix, searchTerm, showProviderFilter]);

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
                  className="bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-between text-white transition-colors cursor-pointer shadow-sm phone-number-card"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium phone-number-display">{highlightSearchTerm(ad.phoneNumber, searchTerm)}</span>
                    <div className="flex items-center gap-1 text-blue-100 price-display-large">
                      <span className="price-currency-large">₼</span>
                      <span className="price-amount-large">{ad.price}</span>
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
                    className="phone-order-btn"
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