'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Phone, ArrowLeft, Gem } from 'lucide-react';

import './PhoneGold.css';

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

interface GoldListing {
  id: string;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: string;
  isVip: boolean;
  description: string;
}

export default function PhoneGold() {
  const [listings, setListings] = useState<GoldListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  useEffect(() => {
    const fetchAllListings = async () => {
      setLoading(true);
      try {
        // Fetch all listings from API endpoint
        const response = await fetch('/api/listings');
        if (response.ok) {
          const allApiListings = await response.json();
          
          // Filter only gold type listings
          const goldListings = allApiListings.filter((listing: ApiListing) => listing.type === 'gold');
          
          // Format for PhoneGold component
          const formattedListings = goldListings.map((listing: ApiListing) => ({
            id: listing.id,
            phoneNumber: `${listing.prefix}-${listing.number}`,
            price: listing.price,
            contactPhone: listing.contact_phone || '050-444-44-22',
            type: listing.type,
            description: listing.description || ''
          }));
          
          setListings(formattedListings);
        } else {
          console.error('Failed to fetch listings from API');
        }
      } catch (error) {
        console.error('Error fetching gold listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllListings();
  }, []);

  const handleCall = async (phoneNumber: string) => {
    // Dynamically import the StatisticsManager only on the client-side
    const { StatisticsManager } = await import('@/lib/statistics');
    // Increment the sold numbers count
    StatisticsManager.incrementSoldNumbers();
    // Proceed with the call
    window.location.href = `tel:${phoneNumber.replace(/[^0-9]/g, '')}`;
  };

  const filteredListings = listings.filter(listing =>
    listing.phoneNumber.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
  );

  return (
    <div className="phone-gold-container">
      <div className="phone-gold-header">
        <Link href="/" className="back-button">
          <ArrowLeft size={24} />
        </Link>
        <div className="header-title-container">
          <h1>
            <Gem size={20} className="header-icon" />
            <span>Gold Elanlar</span>
            <span className="listing-count">({filteredListings.length})</span>
          </h1>
        </div>
        {/* Placeholder to balance the back button and keep the title perfectly centered */}
        <div style={{ width: '40px', height: '40px' }}></div>
      </div>

      <div className="phone-gold-search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Nömrə axtar..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Yüklənir...</div>
      ) : filteredListings.length > 0 ? (
        <div className="phone-gold-list">
          {filteredListings.map(listing => (
            <div key={listing.id} className="phone-gold-listing-item">
              <div className="phone-number-container">
                <span className="phone-number">{getHighlightedText(listing.phoneNumber, searchTerm)}</span>
              </div>
              <span className="price">{listing.price} ₼</span>
              <button className="call-button" onClick={() => handleCall(listing.contactPhone)} aria-label={`Zəng et ${listing.contactPhone}`}>
                <Phone size={16} />
                <span>Əlaqə</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-listings-message">
          Hal-hazırda Gold nömrəsi mövcud deyil
        </div>
      )}
    </div>
  );
}
