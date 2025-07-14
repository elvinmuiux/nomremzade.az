'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Copy, Share2, Gem } from 'lucide-react';
import './GoldElanlar.css';

interface ListingCardProps {
  phone: string;
  price: string;
  isActive?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  phone, 
  price, 
  isActive = false 
}) => {
  

  const handleCopy = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber).then(() => {
      alert(`${phoneNumber} kopyalandı!`);
    });
  };

  const handleShare = (phoneNumber: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Gold Nömrə',
        text: `Bu gold nömrəyə baxın: ${phoneNumber}`,
        url: window.location.href
      });
    } else {
      handleCopy(phoneNumber);
    }
  };

  return (
    <div className={`gold-card ${isActive ? 'gold-card-active' : 'gold-card-default'}`}>
      <div className="gold-card-header">
        <div className="gold-card-info">
          <div className="gold-phone">{phone}</div>
          <div className="gold-price">₼{price}</div>
        </div>
      </div>
      
      <div className="gold-card-footer">
        <div className="gold-action-buttons">
          <button 
            className="gold-action-btn"
            onClick={() => handleShare(phone)}
            aria-label="Paylaş"
          >
            <Share2 size={14} />
          </button>
          <button 
            className="gold-action-btn"
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
  isActive?: boolean;
}

const GoldElanlar: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const prefixes = ['010', '050', '051', '055', '06', '070', '077', '099'];
    const fetchAllListings = async () => {
      try {
        let allListings: Listing[] = [];
        for (const prefix of prefixes) {
          const response = await fetch(`/data/gold/${prefix}.json`);
          if (response.ok) {
            const data = await response.json();
                                    const goldListings = data;
                                    const formattedListings = goldListings.map((item: { phoneNumber: string; price: number; type?: string; contactPhone: string; isVip?: boolean; }) => ({
              phone: item.phoneNumber,
              price: item.price.toString(),
              
              isActive: item.isVip
            }));
            allListings = [...allListings, ...formattedListings];
          }
        }
        setListings(allListings);
      } catch (error) {
        console.error('Error fetching gold listings:', error);
      }
    };

    fetchAllListings();
  }, []);

  return (
    <div className="gold-container">
      <div className="gold-header">
        <h2 className="gold-title">
          {listings.length > 0 ? `${listings.length} Gold Elanlar` : 'Gold Elanlar'}
          <Gem className="gold-crown" />
        </h2>
        <Link href="/gold-elanlar" className="see-all-btn">
          Hamısına bax
        </Link>
      </div>

      <div className="gold-cards-container">
        {listings.map((listing, index) => (
          <div key={index} className="gold-card-wrapper">
            <ListingCard
              phone={listing.phone}
              price={listing.price}
              isActive={listing.isActive}
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default GoldElanlar;
