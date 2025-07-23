'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ArrowLeft, Phone } from 'lucide-react';
import Link from 'next/link';
import { StatisticsManager } from '@/lib/statistics';
import './PhonePremium.css';

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

interface PremiumListing {
  id: string;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: string;
  isVip: boolean;
}

const PhonePremium: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState<PremiumListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllListings = async () => {
      setLoading(true);
      try {
        // Fetch all listings from API endpoint
        const response = await fetch('/api/listings');
        if (response.ok) {
          const allApiListings = await response.json();
          
          // Filter only premium type listings
          const premiumListings = allApiListings.filter((listing: ApiListing) => listing.type === 'premium');
          
          // Format for PhonePremium component
          const formattedListings = premiumListings.map((listing: ApiListing) => ({
            id: listing.id,
            phoneNumber: `${listing.prefix}-${listing.number}`,
            price: Number(listing.price),
            contactPhone: listing.contact_phone || '050-444-44-22',
            type: listing.type,
            isVip: listing.type === 'premium',
          }));
          
          setListings(formattedListings);
        } else {
          console.error('Failed to fetch listings from API');
        }
      } catch (error) {
        console.error('Error fetching premium listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllListings();
  }, []);

  const filteredListings = useMemo(() => {
    if (!searchTerm) {
      return listings;
    }
    const cleanSearchTerm = searchTerm.replace(/[^0-9*]/g, '');
    if (!cleanSearchTerm) return listings;

    return listings.filter(listing => {
      const phoneNumberDigits = listing.phoneNumber.replace(/[^0-9]/g, '');
      const searchTermDigits = cleanSearchTerm.replace(/\*/g, '');
      return phoneNumberDigits.includes(searchTermDigits);
    });
  }, [listings, searchTerm]);

  const handleContact = (contactNumber: string, phoneNumber: string) => {
    const confirmed = confirm(`${phoneNumber} nömrəsi üçün əlaqə qurmaq istəyirsiniz?\n\nİndi zəng etmək istəyirsinizmi?`);
    if (confirmed) {
      // Increment the sold numbers count
      StatisticsManager.incrementSoldNumbers();
      // Proceed with the call
      window.location.href = `tel:${contactNumber.replace(/[^0-9]/g, '')}`;
    }
  };
  
  const highlightSearchTerm = (phoneNumber: string, term: string) => {
    const cleanSearchTerm = term.replace(/[^0-9*]/g, '');
    if (!cleanSearchTerm) return phoneNumber;

    const parts = phoneNumber.split(new RegExp(`(${cleanSearchTerm.replace(/\*/g, '.')})`, 'g'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === cleanSearchTerm.toLowerCase() ? (
            <span key={i} className="highlight">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="phone-premium-container">
      <div className="phone-header">
        <Link href="/" className="back-button">
          <ArrowLeft size={20} />
          <span>Geri</span>
        </Link>
        <h1>
          Premium Nömrələr
          {listings.length > 0 && <span className="listing-count">({listings.length})</span>}
        </h1>
        <div className="header-placeholder"></div>
      </div>

      <div className="phone-search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Nömrə axtar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && <X className="clear-icon" onClick={() => setSearchTerm('')} />}
      </div>

      <div className="phone-list-container">
        {loading ? (
          <div className="loading-state">Yüklənir...</div>
        ) : filteredListings.length > 0 ? (
          <table className="phone-table">
            <tbody>
              {filteredListings.map((ad) => (
                <tr key={ad.id}>
                  <td className="phone-number-cell">
                    {highlightSearchTerm(ad.phoneNumber, searchTerm)}
                  </td>
                  <td className="price-cell">{ad.price} ₼</td>
                  <td className="action-cell">
                    <button onClick={() => handleContact(ad.contactPhone, ad.phoneNumber)} className="contact-button">
                      <Phone size={16} />
                      <span>Əlaqə</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-listings-message">
            Hal-hazırda Premium nömrəsi mövcud deyil
          </div>
        )}
      </div>
    </div>
  );
};

export default PhonePremium;
