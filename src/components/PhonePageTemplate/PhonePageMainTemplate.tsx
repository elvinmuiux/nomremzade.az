'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Phone, MessageCircle, X } from 'lucide-react';
import './PhonePageMainTemplate.css';

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
  dataFiles: DataFileConfig[];
  showProviderFilter?: boolean;
}

export default function PhonePageMainTemplate({
  pageTitle,
  dataFiles,
  showProviderFilter = false,
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
        for (const dataFile of dataFiles) {
          const response = await fetch(`/data/${dataFile.file}`);
          if (response.ok) {
            const data = await response.json();
            const adsArray = data[dataFile.key] || [];
            const processedAds = adsArray.map((item: any, index: number) => ({
              id: item.id || index + 1,
              phoneNumber: String(item.phoneNumber || item.numara || ''),
              price: Number(item.price || item.fiyat || 0),
              contactPhone: String(item.contactPhone || '(050) 444-44-22'),
              provider: dataFile.provider,
              prefix: String(item.phoneNumber || item.numara || '').replace(/[^0-9]/g, '').slice(0, 3),
            }));
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
    return ads.filter(ad => {
      const phoneDigits = ad.phoneNumber.replace(/[^0-9]/g, '');
      if (showProviderFilter && selectedProvider && ad.provider !== selectedProvider) return false;
      if (selectedPrefix && !phoneDigits.startsWith(selectedPrefix)) return false;
      if (searchTerm && !phoneDigits.includes(searchTerm.replace(/\D/g, ''))) return false;
      return true;
    });
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
    if (showProviderFilter && selectedProvider) {
      const filteredPrefixes = ads
        .filter(ad => ad.provider === selectedProvider)
        .map(ad => ad.prefix);
      return [...new Set(filteredPrefixes)].sort();
    }
    const prefixes = ads.map(ad => ad.prefix);
    return [...new Set(prefixes)].sort();
  };
  
  const highlightSearchTerm = (phoneNumber: string, term: string) => {
    if (!term) return phoneNumber;
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = phoneNumber.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="highlight">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="phone-view-container">
      <div className="phone-header">
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
              {getUniqueProviders().map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
        )}
        <select
          className="phone-prefix-select"
          value={selectedPrefix}
          onChange={(e) => setSelectedPrefix(e.target.value)}
        >
          <option value="">Prefiks</option>
          {getUniquePrefixes().map(prefix => (
            <option key={prefix} value={prefix}>{prefix}</option>
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
