'use client';

import React, { useState, useEffect } from 'react';
import './NumbersPageTemplate.css';
// import StatisticsTracker from '../StatisticsTracker/StatisticsTracker';
// import VisitorTracker from '../VisitorTracker/VisitorTracker';

interface NumberAd {
  id: string;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: string;
  isVip: boolean;
  description: string;
  provider: string;
  prefix: string;
}

interface ApiListing {
  id: string;
  prefix: string;
  number: string;
  price: number;
  contact_phone: string;
  type: 'standard' | 'gold' | 'premium';
  is_sold: boolean;
  description?: string;
  created_at: string;
}

interface DataFile {
  prefix: string;
  provider: string;
}

interface NumbersPageTemplateProps {
  dataFiles?: DataFile[];
  showProviderFilter?: boolean;
}

const NumbersPageTemplate: React.FC<NumbersPageTemplateProps> = ({ 
  dataFiles: _dataFiles, // eslint-disable-line @typescript-eslint/no-unused-vars
  showProviderFilter = true 
}) => {
  const [ads, setAds] = useState<NumberAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedPrefix, setSelectedPrefix] = useState('');

  useEffect(() => {
    const loadNumbers = async () => {
      try {
        setLoading(true);
        
        // Add cache busting to API call
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/listings?t=${timestamp}`);
        
        if (response.ok) {
          const allListings = await response.json();
          
          const processedAds = allListings.map((listing: ApiListing) => {
            const phoneNumber = listing.number ? `${listing.prefix}-${listing.number.replace(/^0+/, '')}` : '';
            
            // Get provider based on prefix
            let provider = 'Unknown';
            if (['010', '050', '051'].includes(listing.prefix)) provider = 'Azercell';
            else if (['055', '099'].includes(listing.prefix)) provider = 'Bakcell';
            else if (listing.prefix === '060') provider = 'Naxtel';
            else if (['070', '077'].includes(listing.prefix)) provider = 'Nar Mobile';
            
            return {
              id: listing.id,
              phoneNumber: phoneNumber,
              price: listing.price || 0,
              contactPhone: listing.contact_phone || '(050) 444-44-22',
              type: listing.type || 'standard',
              isVip: listing.type === 'premium',
              description: listing.description || '',
              provider: provider,
              prefix: listing.prefix
            };
          });
          
          setAds(processedAds);
          console.log('Numbers loaded from API:', processedAds.length);
        }
      } catch (error) {
        console.error('Error loading numbers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNumbers();
  }, []);

  // Filter ads based on search and selection
  const filteredAds = ads.filter(ad => {
    const matchesSearch = !searchTerm || 
      ad.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvider = !selectedProvider || ad.provider === selectedProvider;
    const matchesPrefix = !selectedPrefix || ad.prefix === selectedPrefix;
    
    return matchesSearch && matchesProvider && matchesPrefix;
  });

  // Get unique providers
  const uniqueProviders = [...new Set(ads.map(ad => ad.provider))];

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Nömrələr yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* <StatisticsTracker /> */}
      {/* <VisitorTracker /> */}
      
      <div className="header" style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        <h1 className="page-title" style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#425C5B',
          marginBottom: '10px'
        }}>Telefon Nömrələri</h1>
        <p className="subtitle" style={{
          fontSize: '1.1rem',
          color: '#666',
          margin: '0'
        }}>
          Toplam {ads.length} nömrə • {filteredAds.length} nəticə göstərilir
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="controls" style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <div className="search-box" style={{
          flex: '1',
          minWidth: '300px'
        }}>
          <input
            type="text"
            placeholder="Nömrə və ya açıqlama axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              outline: 'none'
            }}
          />
        </div>
        
        {showProviderFilter && (
          <div className="numbers-container">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="filter-select"
            >
              <option value="">Bütün operatorlar</option>
              {uniqueProviders.map(provider => (
                <option key={`desktop-provider-${provider}`} value={provider}>{provider}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="results-container">
        {filteredAds.length === 0 ? (
          <div className="no-results">
            <p>Heç bir nömrə tapılmadı</p>
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedProvider('');
                  setSelectedPrefix('');
                }}
                className="filter-button"
              >
                Filtri təmizlə
              </button>
            )}
          </div>
        ) : (
          <div className="numbers-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            padding: '20px 0'
          }}>
            {filteredAds.map((ad, index) => (
              <div key={`desktop-${ad.id}-${ad.prefix}-${ad.phoneNumber}-${index}`} className="ad-card" style={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                cursor: 'pointer'
              }}>
                <div className="page-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span className="phone-number" style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#2c5aa0'
                  }}>{ad.phoneNumber}</span>
                  {ad.isVip && <span className="vip-badge" style={{
                    backgroundColor: '#ffd700',
                    color: '#000',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>VIP</span>}
                </div>
                <div className="operator-section">
                  <h2 className="operator-title" style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#e74c3c',
                    margin: '10px 0'
                  }}>{ad.price} AZN</h2>
                  <p className="provider" style={{
                    fontSize: '1.1rem',
                    color: '#425C5B',
                    fontWeight: '600',
                    margin: '8px 0'
                  }}>{ad.provider}</p>
                  {ad.description && (
                    <p className="description" style={{
                      color: '#666',
                      fontSize: '0.9rem',
                      margin: '8px 0'
                    }}>{ad.description}</p>
                  )}
                  <p className="contact" style={{
                    color: '#2c5aa0',
                    fontWeight: '500',
                    margin: '8px 0'
                  }}>Əlaqə: {ad.contactPhone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NumbersPageTemplate;
