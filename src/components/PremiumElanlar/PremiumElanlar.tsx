'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Share2, Phone } from 'lucide-react';
import './PremiumElanlar.css';

interface ListingCardProps {
  phone: string;
  price: string;
  location: string;
  contactPhone: string;
  isActive?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  phone, 
  price, 
  location, 
  contactPhone,
  isActive = false 
}) => {
  const handleContact = (contactNumber: string) => {
    const confirmed = confirm(`${phone} nömrəsi üçün əlaqə qurmaq istəyirsiniz?\n\nİndi zəng etmək istəyirsinizmi?`);
    
    if (confirmed) {
      window.location.href = `tel:${contactNumber.replace(/[^0-9]/g, '')}`;
    }
  };

  const handleCopy = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber).then(() => {
      alert(`${phoneNumber} kopyalandı!`);
    });
  };

  const handleShare = (phoneNumber: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Premium Nömrə',
        text: `Bu premium nömrəyə baxın: ${phoneNumber}`,
        url: window.location.href
      });
    } else {
      handleCopy(phoneNumber);
    }
  };

  return (
    <div className={`premium-card ${isActive ? 'premium-card-active' : 'premium-card-default'}`}>
      <div className="premium-card-header">
        <div className="premium-card-info">
          <div className="premium-phone">{phone}</div>
          <div className="premium-price">₼{price}</div>
        </div>
      </div>
      
      <div className="premium-location">{location}</div>
      
      <div className="premium-card-footer">
        <button 
          className="premium-contact-btn"
          onClick={() => handleContact(contactPhone)}
          aria-label={`${phone} ilə əlaqə saxla`}
        >
          <span>Əlaqə et</span>
          <Phone size={14} />
        </button>
        
        <div className="premium-action-buttons">
          <button 
            className="premium-action-btn"
            onClick={() => handleShare(phone)}
            aria-label="Paylaş"
          >
            <Share2 size={14} />
          </button>
          <button 
            className="premium-action-btn"
            onClick={() => handleCopy(phone)}
            aria-label="Kopyala"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface Listing {
  phone: string;
  price: string;
  location: string;
  contactPhone: string;
  isActive?: boolean;
}

const PremiumElanlar: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const prefixes = ['010', '050', '051', '055', '060', '070', '077', '099'];
    const fetchAllListings = async () => {
      try {
        let allListings: Listing[] = [];
        for (const prefix of prefixes) {
          const response = await fetch(`/data/elan/${prefix}.json`);
          if (response.ok) {
            const data = await response.json();
            const formattedListings = data.map((item: any) => ({
              phone: item.phoneNumber,
              price: item.price.toString(),
              location: item.type || 'Bakı',
              contactPhone: item.contactPhone,
              isActive: item.isVip
            }));
            allListings = [...allListings, ...formattedListings];
          }
        }
        setListings(allListings);
      } catch (error) {
        console.error('Error fetching premium listings:', error);
      }
    };

    fetchAllListings();
  }, []);

  return (
    <div className="premium-container">
      <div className="premium-header">
        <h2 className="premium-title">
          {listings.length > 0 ? `${listings.length} Premium Elanlar` : 'Premium Elanlar'}
          <span className="premium-crown">👑</span>
        </h2>
      </div>

      <div className="premium-cards-container">
        {listings.map((listing, index) => (
          <div key={index} className="premium-card-wrapper">
            <ListingCard
              phone={listing.phone}
              price={listing.price}
              location={listing.location}
              contactPhone={listing.contactPhone}
              isActive={listing.isActive}
            />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="premium-progress">
        <div className="premium-progress-bar"></div>
      </div>
    </div>
  );
};

export default PremiumElanlar;
