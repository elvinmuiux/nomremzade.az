'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Search, Phone, MessageCircle, X } from 'lucide-react';
import './PhonePageMainTemplate.css';

const PremiumElanlar = dynamic(() => import('@/components/PremiumElanlar/PremiumElanlar'), { ssr: false });
const GoldElanlar = dynamic(() => import('@/components/GoldElanlar/GoldElanlar'), { ssr: false });

interface NumberAd {
  id: number;
  phoneNumber: string;
  price: number;
  contactPhone?: string;
  provider: string;
  prefix: string;
}

interface RawAd {
  phoneNumber?: string;
  numara?: string;
  price?: number;
  fiyat?: number;
  contactPhone?: string;
}

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
      setLoading(true);
      try {
        const allNumbers: NumberAd[] = [];
        let uniqueIdCounter = 1;
        for (const dataFile of dataFiles) {
          const response = await fetch(`/data/${dataFile.file}`);
          if (response.ok) {
            const data = await response.json();
            const adsArray = data[dataFile.key] || [];
            const processedAds = adsArray.map((item: RawAd) => {
              const phoneNumber = String(item.phoneNumber || item.numara || '');
              return {
                id: `${uniqueIdCounter++}-${phoneNumber}`,
                phoneNumber: phoneNumber,
                price: Number(item.price || item.fiyat || 0),
                contactPhone: String(item.contactPhone || '(050) 444-44-22'),
                provider: dataFile.provider,
                prefix: phoneNumber.replace(/[^0-9]/g, '').slice(0, 3),
              };
            });
            allNumbers.push(...processedAds);
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
    const confirmed = confirm(`${phoneNumber} nömrəsi üçün sifarişiniz qeydə alındı! Ən qısa zamanda sizinlə əlaqə saxlanacaq.\n\nİndi zəng etmək istəyirsiniz? (050) 444-44-22`);
    if (confirmed) {
      window.location.href = 'tel:+994504444422';
    }
  };

  const handleWhatsAppContact = (phoneNumber: string) => {
    const message = encodeURIComponent(`Salam! ${phoneNumber} nömrəsi barədə məlumat almaq istərdim.`);
    window.open(`https://wa.me/994${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
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
                <option key={`${provider}-${index}`} value={provider}>{provider}</option>
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
            <option key={`${prefix}-${index}`} value={prefix}>{prefix}</option>
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
          {filteredAds.map(ad => (
            <div key={ad.id} className="phone-number-card">
              <div className="phone-card-main">
                <span className="phone-number-text">
                  {highlightSearchTerm(ad.phoneNumber, searchTerm)}
                </span>
                <span className="phone-price-text">{ad.price} AZN</span>
              </div>
              <div className="phone-card-actions">
                <button className="phone-action-btn whatsapp" onClick={() => handleWhatsAppContact(ad.phoneNumber)}>
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
