'use client';

import React from 'react';
import { Copy, Share2, Phone } from 'lucide-react';
import './PremiumElanlar.css';

interface ListingCardProps {
  phone: string;
  price: string;
  location: string;
  isActive?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  phone, 
  price, 
  location, 
  isActive = false 
}) => {
  const handleContact = (phoneNumber: string) => {
    const confirmed = confirm(`${phoneNumber} nömrəsi üçün əlaqə qurmaq istəyirsiniz?\n\nİndi zəng etmək istəyirsinizmi?`);
    
    if (confirmed) {
      window.location.href = `tel:${phoneNumber.replace(/[^0-9]/g, '')}`;
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
          onClick={() => handleContact(phone)}
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

const PremiumElanlar: React.FC = () => {
  const listings = [
    {
      phone: "055 883 88 88",
      price: "5000",
      location: "Sirac, 0504444420",
      isActive: true
    },
    {
      phone: "051 777 77 74",
      price: "5000",
      location: "Elvin, 0504444420"
    },
    {
      phone: "051 999 44 44",
      price: "4000",
      location: "Samir, 0504444422"
    },
    {
      phone: "055 685 86 86",
      price: "3800",
      location: "Azercell, 0504444422"
    },
    {
      phone: "070 200 85 75",
      price: "6500",
      location: "Nomrezade, 0504444422"
    },
    {
      phone: "077 888 77 77",
      price: "7200",
      location: "Premium, 0504444420"
    },
    {
      phone: "050 555 55 55",
      price: "8500",
      location: "VIP nömrə, 0504444422",
      isActive: true
    },
    {
      phone: "060 111 11 11",
      price: "9000",
      location: "Eksklüziv, 0504444420"
    },
    {
      phone: "099 666 66 66",
      price: "4500",
      location: "Özel, 0504444422"
    },
    {
      phone: "010 777 88 99",
      price: "5500",
      location: "Premium, 0504444420"
    }
  ];

  return (
    <div className="premium-container">
      <div className="premium-header">
        <h2 className="premium-title">
          Premium Elanlar
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
