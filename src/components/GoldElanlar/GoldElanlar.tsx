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

  const handleShare = (phoneNumber: string, price: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Nömrəm.az - Gold Nömrə Elanı',
        text: `Nömrə: ${phoneNumber}\nQiymət: ${price} AZN\n\nElana baxmaq üçün: nomremzade.az`,
        url: 'https://nomremzade.az'
      }).catch((error) => console.log('Paylaşım zamanı xəta:', error));
    } else {
      handleCopy(`${phoneNumber} - ${price} AZN`);
      alert('Paylaşım funksiyası dəstəklənmir. Məlumat kopyalandı.');
    }
  };

  return (
    <div className={`gold-card ${isActive ? 'active-gold' : ''}`}>
      <div className="gold-card-content">
        <div className="gold-card-header">
          {isActive && <Gem size={18} className="gold-badge" />}
          <span className="gold-phone-number">{phone}</span>
        </div>
        <div className="gold-card-price">
          <span>{price} AZN</span>
        </div>
      </div>
      
      <div className="gold-card-footer">
        <div className="gold-action-buttons">
          <button 
            className="gold-action-btn"
            onClick={() => handleShare(phone, price)}
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
  location: string;
  contactPhone: string;
  isActive?: boolean;
}

const GoldElanlar: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchGoldListings = async () => {
      try {
        // Fetch directly from JSON files with cache busting
        const timestamp = new Date().getTime();
        const prefixes = ['010', '050', '051', '055', '060', '070', '077', '099'];
        const allListings: Listing[] = [];
        
        // Fetch from gold directory
        for (const prefix of prefixes) {
          try {
            const response = await fetch(`/data/gold/${prefix}.json?t=${timestamp}`);
            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data) && data.length > 0) {
                const formattedListings = data.map((item: Record<string, unknown>) => ({
                  phone: (item.phoneNumber as string) || `${prefix}-${item.number as string}`,
                  price: (item.price as number)?.toString() || '0',
                  location: (item.type as string) || 'Gold',
                  contactPhone: (item.contactPhone as string) || '050-444-44-22',
                  isActive: !(item.is_sold as boolean) && !(item.isSold as boolean)
                }));
                allListings.push(...formattedListings);
              }
            }
          } catch (error) {
            console.log(`No gold data for prefix ${prefix}:`, error);
          }
        }
        
        setListings(allListings);
        console.log('Gold listings loaded:', allListings);
      } catch (error) {
        console.error('Error fetching gold listings:', error);
      }
    };

    fetchGoldListings();
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
          <div key={`gold-${listing.phone}-${index}`} className="gold-card-wrapper">
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
