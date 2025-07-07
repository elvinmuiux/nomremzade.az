'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Phone, MessageCircle, Bookmark, Heart, Diamond, Filter, X } from 'lucide-react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import StatisticsManager from '@/lib/statistics';
import '../numbers.css';

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

export default function BakcellPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ads, setAds] = useState<NumberAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number | null]>([0, null]);
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');

  useEffect(() => {
    const loadNumbers = async () => {
      try {
        // Load Bakcell JSON files from public/data
        const dataFiles = [
          { file: '055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
          { file: '099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' }
        ];

        const allNumbers: NumberAd[] = [];

        for (const dataFile of dataFiles) {
          try {
            const response = await fetch(`/data/${dataFile.file}`);
            if (response.ok) {
              const data = await response.json();
              const adsArray = data[dataFile.key] || [];
              
              const processedAds = adsArray.map((item: Record<string, unknown>, index: number) => ({
                id: item.id || index + 1,
                phoneNumber: String(item.phoneNumber || ''),
                price: Number(item.price) || 0,
                contactPhone: String(item.contactPhone || '(050) 444-44-22'),
                type: item.type || 'standard',
                isVip: Boolean(item.isVip),
                description: item.description || '',
                provider: dataFile.provider,
                prefix: dataFile.prefix
              }));

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
  }, []);

  const filteredAds = useMemo(() => {
    if (!ads.length) return [];
    
    return ads.filter(ad => {
      if (!ad || !ad.phoneNumber) return false;
      
      const phoneDigits = ad.phoneNumber.replace(/[^0-9]/g, '');
      
      // Filter by prefix if selected
      if (selectedPrefix) {
        const cleanPrefix = selectedPrefix.replace(/[^0-9]/g, '');
        if (!phoneDigits.startsWith(cleanPrefix)) return false;
      }
      
      // Filter by search term if provided
      if (searchTerm.trim()) {
        const searchDigits = searchTerm.replace(/\D/g, '');
        if (searchDigits && !phoneDigits.includes(searchDigits)) return false;
      }
      
      // Filter by price range
      const [minPrice, maxPrice] = priceRange;
      if (minPrice > 0 && ad.price < minPrice) return false;
      if (maxPrice !== null && ad.price > maxPrice) return false;
      
      return true;
    });
  }, [ads, searchTerm, selectedPrefix, priceRange]);

  const handleOrderNumber = (phoneNumber: string) => {
    StatisticsManager.incrementSoldNumbers();
    alert(`${phoneNumber} nömrəsi üçün sifarişiniz qeydə alındı! Ən qısa zamanda sizinlə əlaqə saxlanacaq.`);
  };

  const handleWhatsAppContact = (phoneNumber: string) => {
    const message = encodeURIComponent(`Salam! ${phoneNumber} nömrəsi barədə məlumat almaq istərdim.`);
    window.open(`https://wa.me/994${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const isSearching = searchTerm.trim() !== '';
  const hasSearchResults = filteredAds.length > 0;

  const handleReset = () => {
    setSearchTerm('');
    setPriceRange([0, null]);
    setSelectedPrefix('');
  };

  const getUniquePrefixes = () => {
    const prefixes = [...new Set(ads.map(ad => ad.prefix))];
    return prefixes.sort();
  };

  const highlightSearchTerm = (phoneNumber: string, searchTerm: string) => {
    if (!searchTerm.trim()) return phoneNumber;
    
    const searchDigits = searchTerm.replace(/\D/g, '');
    if (!searchDigits) return phoneNumber;
    
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
            <div>Bakcell nömrələri yüklənir...</div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate showTopNav={false}>
      <div className="numbers-container">
        <h1 className="numbers-title">Bakcell nömrələri</h1>

        <div className="search-controls">
          <div className="controls-row">
            <div className="left-controls">
              <div className="control-group">
                <div>
                  <select
                    value={selectedPrefix}
                    onChange={(e) => {
                      setSelectedPrefix(e.target.value);
                      setSearchTerm('');
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
                  <input
                    type="text"
                    placeholder="Nömrə axtar..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="search-icon">
                    <Search size={20} />
                  </div>
                </div>
                <div className="results-info">
                  {searchTerm ? (
                    <span>Axtarılan nömrə: {searchTerm}</span>
                  ) : (
                    <span>Mövcud nömrə sayısı: {filteredAds.length}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (showFilters) {
                  setPriceRange([0, null]);
                  setSelectedPrefix('');
                  setSearchTerm('');
                }
                setShowFilters(!showFilters);
              }}
              className="filter-button"
              aria-label={showFilters ? 'Filtrləri bağla' : 'Filtrləri aç'}
            >
              {showFilters ? <X size={24} /> : <Filter size={20} />}
              {showFilters ? 'Filtrləri bağla' : 'Filtrlə'}
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Qiymət aralığı (₼)</label>
                  <div className="price-range">
                    <input
                      type="number"
                      min="0"
                      value={priceRange[0] === 0 ? '' : priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="price-input"
                      placeholder="Min"
                    />
                    <span className="price-separator">-</span>
                    <input
                      type="number"
                      min="0"
                      value={priceRange[1] === null ? '' : priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], e.target.value ? parseInt(e.target.value) : null])}
                      className="price-input"
                      placeholder="Maks"
                    />
                  </div>
                </div>

                <div className="filter-actions">
                  <div className="filter-group">
                    <label className="filter-label">Prefiks</label>
                    <select
                      value={selectedPrefix}
                      onChange={(e) => {
                        setSelectedPrefix(e.target.value);
                        setSearchTerm('');
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
                  <button
                    onClick={handleReset}
                    className="reset-button"
                    aria-label="Bütün filtrləri sıfırla"
                  >
                    Filtrləri sıfırla
                  </button>
                </div>
              </div>
            </div>
          )}

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
                  <p className="empty-title">Hal-hazırda mövcud Bakcell nömrəsi yoxdur</p>
                )}
                {(searchTerm || priceRange[0] > 0 || priceRange[1] || selectedPrefix) && (
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
