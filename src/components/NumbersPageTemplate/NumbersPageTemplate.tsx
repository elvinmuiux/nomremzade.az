'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Phone, MessageCircle, Bookmark, Heart, Diamond } from 'lucide-react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import StatisticsManager from '@/lib/statistics';
import PremiumElanlar from '@/components/PremiumElanlar/PremiumElanlar';
import GoldElanlar from '@/components/GoldElanlar/GoldElanlar';
import Image from 'next/image';
import Link from 'next/link';
import './NumbersPageTemplate.css';

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

interface NumbersPageTemplateProps {
  pageTitle: string;
  dataFiles: DataFileConfig[];
  operatorPrefixes?: string[];
  showProviderFilter?: boolean;
  operatorName?: string; // Add operator name for logo display
}

export default function NumbersPageTemplate({
  pageTitle,
  dataFiles,
  operatorPrefixes,
  showProviderFilter = false,
  operatorName
}: NumbersPageTemplateProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ads, setAds] = useState<NumberAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  // Helper function to get operator logo path
  const getOperatorLogo = (operatorName: string) => {
    const logoMap: { [key: string]: string } = {
      'azercell': '/images/operators/azercell.svg',
      'bakcell': '/images/operators/bakcell.svg',
      'nar-mobile': '/images/operators/nar-mobile.svg',
      'narmobile': '/images/operators/nar-mobile.svg', // Alternative naming
      'naxtel': '/images/operators/naxtel.svg'
    };
    
    return logoMap[operatorName.toLowerCase()] || null;
  };

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
                const actualPrefix = phoneDigits.slice(0, 3); // Extract first 3 digits as prefix
                
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
                  prefix: actualPrefix // Use actual prefix from phone number
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
      
      // Filter by provider if selected (only for all numbers page)
      if (showProviderFilter && selectedProvider && ad.provider !== selectedProvider) {
        return false;
      }
      
      // ✅ PRIORITY: Filter by prefix FIRST - this is the most important filter
      if (selectedPrefix) {
        const cleanPrefix = selectedPrefix.replace(/[^0-9]/g, '');
        if (!phoneDigits.startsWith(cleanPrefix)) return false;
      }
      
      // ✅ IMPROVED: Search filtering works WITHIN the selected prefix
      if (searchTerm.trim()) {
        const searchDigits = searchTerm.replace(/\D/g, '');
        
        // If search contains digits, search in phone digits
        if (searchDigits) {
          // Check if phone number contains the search digits anywhere
          if (!phoneDigits.includes(searchDigits)) return false;
        } else {
          // Text search - check if phone number contains the search text
          const searchText = searchTerm.toLowerCase().trim();
          const phoneText = ad.phoneNumber.toLowerCase();
          if (!phoneText.includes(searchText)) return false;
        }
      }
      
      return true;
    });
  }, [ads, searchTerm, selectedPrefix, selectedProvider, showProviderFilter]);

  const handleOrderNumber = (phoneNumber: string) => {
    // Increment sold numbers statistics
    StatisticsManager.incrementSoldNumbers();
    
    // Show success message with clickable phone number
    const confirmed = confirm(`${phoneNumber} nömrəsi üçün sifarişiniz qeydə alındı! Ən qısa zamanda sizinlə əlaqə saxlanacaq.\n\nİndi zəng etmək istəyirsiniz? (0550 444-44-22)`);
    
    if (confirmed) {
      window.location.href = 'tel:+994550444422';
    }
  };

  const handleWhatsAppContact = (phoneNumber: string) => {
    const message = encodeURIComponent(`Salam! ${phoneNumber} nömrəsi barədə məlumat almaq istərdim.`);
    window.open(`https://wa.me/994${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const isSearching = searchTerm.trim() !== '';
  const hasSearchResults = filteredAds.length > 0;

  const handleReset = () => {
    setSearchTerm('');
    setSelectedPrefix('');
    if (showProviderFilter) {
      setSelectedProvider('');
    }
  };

  const getUniqueProviders = () => {
    const providers = [...new Set(ads.map(ad => ad.provider))];
    return providers.sort();
  };

  const getUniquePrefixes = () => {
    // Ana sayfada (showProviderFilter=true) ise, seçilen operatora göre prefiks listesi getir
    if (showProviderFilter && selectedProvider) {
      const filteredPrefixes = ads
        .filter(ad => ad.provider === selectedProvider)
        .map(ad => ad.prefix);
      return [...new Set(filteredPrefixes)].sort();
    }
    
    // Operator sayfalarında da dinamik prefiksleri kullan
    if (ads.length > 0) {
      const prefixes = [...new Set(ads.map(ad => ad.prefix))];
      return prefixes.sort();
    }
    
    // Fallback olarak operatorPrefixes kullan
    return operatorPrefixes || [];
  };

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
          <span className="highlight">
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
          <span className="highlight">
            {phoneNumber.slice(highlightStart, highlightEnd)}
          </span>
          {phoneNumber.slice(highlightEnd)}
        </>
      );
    }
    
    return phoneNumber;
  };

  if (loading) {
    return (
      <PageTemplate showTopNav={false}>
        <div className="numbers-container">
          <div className="empty-state">
            <div>{pageTitle} yüklənir...</div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate showTopNav={false}>
      <div className="numbers-container">
        <div className="page-header">
          {operatorName && getOperatorLogo(operatorName) && (
            <div className="operator-logo-container">
              <Link href="/" className="operator-logo-link">
                <Image 
                  src={getOperatorLogo(operatorName)!} 
                  alt={`${operatorName} logo`}
                  className="operator-logo"
                  width={120}
                  height={60}
                  priority
                />
              </Link>
            </div>
          )}
          <h1 className="numbers-title">{pageTitle}</h1>
        </div>

        <div className="search-controls">
          <div className="controls-row">
            <div className="left-controls">
              <div className="control-group">
                {showProviderFilter && (
                  <div>
                    <select
                      value={selectedProvider}
                      onChange={(e) => {
                        setSelectedProvider(e.target.value);
                        setSelectedPrefix(''); // Prefiks seçimini sıfırla
                        setSearchTerm(''); // Arama terimini sıfırla
                      }}
                      className="select-input"
                      aria-label="Operator seçin"
                    >
                      <option value="">Operator seçin</option>
                      {getUniqueProviders().map(provider => (
                        <option key={provider} value={provider}>{provider}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <select
                    value={selectedPrefix}
                    onChange={(e) => {
                      const newPrefix = e.target.value;
                      setSelectedPrefix(newPrefix);
                      // ✅ IMPROVED: Keep search term when prefix is selected
                      // This allows prefix + search combination to work together
                    }}
                    className="select-input"
                    aria-label="Prefiks seçin"
                  >
                    <option value="">Prefiks seçin</option>
                    {getUniquePrefixes().map(prefix => (
                      <option key={prefix} value={prefix}>{prefix}</option>
                    ))}
                  </select>
                </div>
                <div className="search-container">
                  <div className="search-icon">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder={selectedPrefix ? 
                      `${selectedPrefix} prefiksi daxilində axtar (266, 777...)` : 
                      "Əvvəlcə prefix seçin, sonra axtar (266, 777...)"
                    }
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => {
                      const newSearchTerm = e.target.value;
                      setSearchTerm(newSearchTerm);
                      
                      // ✅ IMPROVED: Keep prefix selection even when user starts typing
                      // This ensures prefix filtering is always maintained
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchTerm.trim()) {
                        console.log(`Enter ile arama: "${searchTerm}"`);
                      }
                    }}
                  />
                  <button 
                    className="search-button"
                    onClick={() => {
                      // ✅ Search button functionality - manually trigger search
                      if (searchTerm.trim()) {
                        console.log(`Buton ile arama: "${searchTerm}"`);
                      }
                    }}
                    aria-label="Axtar"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Premium Elanlar - Show only on main page */}
        {showProviderFilter && (
          <>
            <PremiumElanlar />
            <GoldElanlar />
          </>
        )}

        {/* Total Count Display - Left Aligned */}
        <div className="total-count-left">
          {searchTerm.trim() && selectedPrefix ? (
            `${selectedPrefix} prefiksində "${searchTerm}" için ${filteredAds.length} nömrə`
          ) : searchTerm.trim() ? (
            `"${searchTerm}" axtarışı üçün ${filteredAds.length} nömrə`
          ) : selectedPrefix ? (
            `${selectedPrefix} prefiksi: ${filteredAds.length} nömrə`
          ) : selectedProvider ? (
            `${selectedProvider}: ${filteredAds.length} nömrə`
          ) : (
            `Toplam ${filteredAds.length} nömrə`
          )}
        </div>

        {/* Divider Line */}
        <div className="count-divider"></div>

        <div className="numbers-list">
            {isSearching && !hasSearchResults ? (
              <div className="empty-state">
                <p className="empty-title">Axtarışa uyğun nömrə tapılmadı</p>
                <p className="empty-subtitle">Axtardığınız nömrə: <span className="bold-text">{searchTerm}</span></p>
              </div>
            ) : filteredAds.length > 0 ? (
              [...filteredAds]
                .sort((a, b) => b.price - a.price)
                .map((ad) => (
                  <div key={`${ad.provider}-${ad.id}`} className="number-card">
                    <div className="phone-number">
                      {highlightSearchTerm(ad.phoneNumber, searchTerm)}
                    </div>

                    <div className="price-display">
                      <span>₼</span>
                      <span>{ad.price}</span>
                    </div>

                    <Diamond className="diamond-icon" size={25} />

                    <div className="provider-name">{ad.provider}</div>

                    <div className="contact-info">
                      <div className="action-buttons">
                        <button 
                          className="action-button"
                          onClick={() => handleWhatsAppContact(ad.phoneNumber)}
                          aria-label="WhatsApp ilə əlaqə saxla"
                        >
                          <MessageCircle size={20} />
                        </button>
                        <a href={`tel:${ad.contactPhone?.replace(/\D/g, '')}`} className="action-button" aria-label="Zəng et">
                          <Phone size={20} />
                        </a>
                      </div>
                      <span className="contact-phone">{ad.contactPhone}</span>
                      <div className="favorite-buttons">
                        <button className="favorite-button heart" aria-label="Sevimli olaraq əlavə et">
                          <Heart size={20} />
                        </button>
                        <button className="favorite-button bookmark" aria-label="Əlfəcinlərə əlavə et">
                          <Bookmark size={20} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOrderNumber(ad.phoneNumber)}
                      className="order-button"
                      aria-label={`${ad.phoneNumber} nömrəsini sifariş et`}
                    >
                      Sifariş
                    </button>
                  </div>
                ))
            ) : (
              <div className="empty-state">
                {searchTerm ? (
                  <>
                    <p className="empty-title">Axtarışa uyğun nömrə tapılmadı</p>
                    <p className="empty-subtitle">Axtardığınız nömrə: {searchTerm}</p>
                  </>
                ) : (
                  <p className="empty-title">Hal-hazırda mövcud nömrə yoxdur</p>
                )}
                {(searchTerm || selectedProvider || selectedPrefix) && (
                  <button 
                    onClick={handleReset}
                    className="order-button margin-top-16"
                    aria-label="Bütün filtrləri sıfırla"
                  >
                    Filtrləri Sıfırla
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
