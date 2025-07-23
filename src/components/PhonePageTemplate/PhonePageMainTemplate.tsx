'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Search, Phone, MessageCircle, X } from 'lucide-react';
import './PhonePageMainTemplate.css';

const PremiumElanlar = dynamic(() => import('@/components/PremiumElanlar/PremiumElanlar'), { ssr: false });
const GoldElanlar = dynamic(() => import('@/components/GoldElanlar/GoldElanlar'), { ssr: false });

interface ApiListing {
  id: string;
  prefix: string;
  number: string;
  price: number;
  type: 'standard' | 'gold' | 'premium';
  contact_phone?: string;
  description?: string;
  provider?: string;
  createdAt: string;
}

interface NumberAd {
  id: number;
  phoneNumber: string;
  price: number;
  contactPhone?: string;
  provider: string;
  prefix: string;
}

interface DataFileConfig {
  file: string;
  key: string;
  provider: string;
  prefix: string;
}

interface PhonePageMainTemplateProps {
  pageTitle: string;
  dataFiles?: DataFileConfig[]; // Make optional
  showProviderFilter?: boolean;
  operatorName?: string;
}

export default function PhonePageMainTemplate({
  pageTitle,
  dataFiles,
  showProviderFilter = false,
  operatorName,
}: PhonePageMainTemplateProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ads, setAds] = useState<NumberAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  useEffect(() => {
    const loadNumbers = async () => {
      try {
        // Call API to get all listings
        const response = await fetch('/api/listings');
        if (response.ok) {
          const allListings = await response.json();
          
          // Process all listings
          const allNumbers: NumberAd[] = [];
          
          if (dataFiles && dataFiles.length > 0) {
            // If dataFiles provided, filter by those prefixes
            for (const dataFile of dataFiles) {
              const adsArray = allListings.filter((listing: ApiListing) => listing.prefix === dataFile.prefix);
              
              const processedAds = adsArray.map((listing: ApiListing) => {
                // Format phone number properly: prefix + number
                const phoneNumber = listing.number ? `${listing.prefix}-${listing.number.replace(/^0+/, '')}` : '';
                
                return {
                  id: listing.id,
                  phoneNumber: phoneNumber,
                  price: listing.price || 0,
                  contactPhone: listing.contact_phone || '(050) 444-44-22',
                  provider: dataFile.provider,
                  prefix: listing.prefix
                };
              });

              allNumbers.push(...processedAds);
            }
          } else {
            // If no dataFiles, show all listings
            const processedAds = allListings.map((listing: ApiListing) => {
              // Format phone number properly: prefix + number
              const phoneNumber = listing.number ? `${listing.prefix}-${listing.number.replace(/^0+/, '')}` : '';
              
              // Map prefix to provider
              const getProviderByPrefix = (prefix: string) => {
                if (['010', '050', '051'].includes(prefix)) return 'Azercell';
                if (['055', '099'].includes(prefix)) return 'Bakcell';
                if (['070', '077'].includes(prefix)) return 'Nar Mobile';
                if (['060'].includes(prefix)) return 'Naxtel';
                return 'Unknown';
              };
              
              return {
                id: listing.id,
                phoneNumber: phoneNumber,
                price: listing.price || 0,
                contactPhone: listing.contact_phone || '(050) 444-44-22',
                provider: getProviderByPrefix(listing.prefix),
                prefix: listing.prefix
              };
            });

            allNumbers.push(...processedAds);
          }
          
          // Remove duplicates based on phone number and provider
          const uniqueNumbers = allNumbers.filter((ad, index, self) => 
            index === self.findIndex(item => 
              item.phoneNumber === ad.phoneNumber && item.provider === ad.provider
            )
          );
          
          setAds(uniqueNumbers);
        }
      } catch (err) {
        console.error('Error loading numbers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNumbers();
  }, [dataFiles]);

  const filteredAds = useMemo(() => {
    let filtered = [...ads];

    if (showProviderFilter && selectedProvider) {
      filtered = filtered.filter(ad => ad.provider === selectedProvider);
    }

    if (selectedPrefix) {
      filtered = filtered.filter(ad => ad.prefix === selectedPrefix);
    }

    if (searchTerm) {
      const cleanSearchTerm = searchTerm.replace(/[^0-9]/g, '');
      if (cleanSearchTerm) {
        filtered = filtered.filter(ad => 
          ad.phoneNumber.replace(/[^0-9]/g, '').slice(3).startsWith(cleanSearchTerm)
        );
      }
    }

    return filtered;
  }, [ads, searchTerm, selectedPrefix, selectedProvider, showProviderFilter]);

  const handleOrderNumber = (phoneNumber: string) => {
    const confirmed = confirm(`${phoneNumber} nömrəsini sifariş etmək istədiyinizə əminsiniz?\n\nİndi zəng edin! (050) 444-44-22`);
    if (confirmed) {
      window.location.href = 'tel:+994504444422';
    }
  };

  const handleWhatsAppContact = (phoneNumber: string, contactPhone: string) => {
    const message = encodeURIComponent(`Salam! ${phoneNumber} nömrəsi barədə məlumat almaq istərdim.`);
    window.open(`https://wa.me/994${contactPhone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const getUniqueProviders = () => {
    const providers = [...new Set(ads.map(ad => ad.provider))];
    return providers.sort();
  };

  const getUniquePrefixes = () => {
    let relevantAds = ads;
    if (showProviderFilter && selectedProvider) {
      relevantAds = ads.filter(ad => ad.provider === selectedProvider);
    }
    const prefixes = relevantAds.map(ad => ad.prefix);
    return [...new Set(prefixes)].sort();
  };
  
  const highlightSearchTerm = (phoneNumber: string, term: string) => {
    const cleanSearchTerm = term.replace(/[^0-9]/g, '');
    if (!cleanSearchTerm) return phoneNumber;

    const parts = [];
    let lastIndex = 0;
    let currentIndex = 0;

    for (let i = 0; i < phoneNumber.length; i++) {
      if (/[0-9]/.test(phoneNumber[i])) {
        if (currentIndex < cleanSearchTerm.length && phoneNumber[i] === cleanSearchTerm[currentIndex]) {
          currentIndex++;
        } else {
          currentIndex = 0;
          if (currentIndex < cleanSearchTerm.length && phoneNumber[i] === cleanSearchTerm[currentIndex]) {
            currentIndex++;
          }
        }
      } else {
        if (currentIndex === cleanSearchTerm.length) {
          break; 
        }
      }
      if (currentIndex === cleanSearchTerm.length) {
        let startIndex = -1;
        let tempIndex = i;
        let digitsFound = 0;
        while (tempIndex >= 0 && digitsFound < cleanSearchTerm.length) {
          if (/[0-9]/.test(phoneNumber[tempIndex])) {
            digitsFound++;
          }
          startIndex = tempIndex;
          tempIndex--;
        }

        if (startIndex !== -1) {
          if (startIndex > lastIndex) {
            parts.push(phoneNumber.substring(lastIndex, startIndex));
          }
          const highlightContent = phoneNumber.substring(startIndex, i + 1);
          parts.push(<span key={`${i}-${highlightContent}`} className="highlight">{highlightContent}</span>);
          lastIndex = i + 1;
          currentIndex = 0; 
        }
      }
    }

    if (lastIndex < phoneNumber.length) {
      parts.push(phoneNumber.substring(lastIndex));
    }

    return <>{parts}</>;
  };

  return (
    <div className="phone-view-container">
      <div className="phone-header">
        {operatorName && <Image src={`/images/operators/${operatorName}.svg`} alt={`${operatorName} logo`} className="phone-operator-logo" width={24} height={24} />}
        <h1>{pageTitle}</h1>
      </div>

      <div className="phone-filters">
        {showProviderFilter && (
            <select
              className="phone-provider-select"
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                setSelectedPrefix('');
              }}
            >
              <option value="">Operator</option>
              {getUniqueProviders().map((provider, index) => (
                <option key={`mobile-provider-${provider}-${index}`} value={provider}>{provider}</option>
              ))}
            </select>
        )}
        <select
          className="phone-prefix-select"
          value={selectedPrefix}
          onChange={(e) => setSelectedPrefix(e.target.value)}
        >
          <option value="">Prefiks</option>
          {getUniquePrefixes().map((prefix, index) => (
            <option key={`mobile-prefix-${prefix}-${index}`} value={prefix}>{prefix}</option>
          ))}
        </select>
      </div>

      <div className="phone-search-container">
        <Search className="phone-search-icon" size={20} />
        <input
          type="text"
          placeholder="Nömrəni daxil edin..."
          className="phone-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && <X className='phone-clear-icon' size={20} onClick={() => setSearchTerm('')}/>}
      </div>

      <>
        <PremiumElanlar />
        <GoldElanlar />
      </>

      {loading ? (
        <div className="phone-loading">Yüklənir...</div>
      ) : (
        <div className="phone-numbers-list">
          <div className="phone-list-summary">
            {filteredAds.length} nömrə tapıldı
          </div>
          {filteredAds.map((ad, index) => (
            <div key={`mobile-${ad.id}-${ad.prefix}-${ad.phoneNumber}-${index}`} className="phone-number-card">
              <div className="phone-card-main">
                <span className="phone-number-text">
                  {highlightSearchTerm(ad.phoneNumber, searchTerm)}
                </span>
                <span className="phone-price-text">{ad.price} AZN</span>
              </div>
              <div className="phone-card-actions">
                <button className="phone-action-btn whatsapp" onClick={() => handleWhatsAppContact(ad.phoneNumber, ad.contactPhone || "0504444422")}>
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </button>
                <button className="phone-action-btn order" onClick={() => handleOrderNumber(ad.phoneNumber)}>
                  <Phone size={18} />
                  <span>Sifariş et</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
