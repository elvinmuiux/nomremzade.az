'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

  const handleShare = (phoneNumber: string, price: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Nömrəm.az - Gözəl Nömrə Elanı',
        text: `Nömrə: ${phoneNumber}\nQiymət: ${price} AZN\n\nElana baxmaq üçün: nomremzade.az`,
        url: 'https://nomremzade.az' // Saytın linkini bura əlavə edə bilərik
      }).catch((error) => console.log('Paylaşım zamanı xəta:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy(`${phoneNumber} - ${price} AZN`);
      alert('Paylaşım funksiyası dəstəklənmir. Məlumat kopyalandı.');
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
            onClick={() => handleShare(phone, price)}
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
    const fetchPremiumListings = async () => {
      try {
        // Fetch directly from JSON files with cache busting
        const timestamp = new Date().getTime();
        const prefixes = ['010', '050', '051', '055', '060', '070', '077', '099'];
        const allListings: Listing[] = [];
        
        // Fetch from premium directory
        for (const prefix of prefixes) {
          try {
            const response = await fetch(`/data/premium/${prefix}.json?t=${timestamp}`);
            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data) && data.length > 0) {
                const formattedListings = data.map((item: Record<string, unknown>) => ({
                  phone: (item.phoneNumber as string) || `${prefix}-${item.number as string}`,
                  price: (item.price as number)?.toString() || '0',
                  location: (item.type as string) || 'Premium',
                  contactPhone: (item.contactPhone as string) || '050-444-44-22',
                  isActive: !(item.is_sold as boolean) && !(item.isSold as boolean)
                }));
                allListings.push(...formattedListings);
              }
            }
          } catch (error) {
            console.log(`No premium data for prefix ${prefix}:`, error);
          }
        }
        
        setListings(allListings);
      } catch (error) {
        console.error('Error fetching premium listings:', error);
      }
    };

    fetchPremiumListings();
  }, []);

  return (
    <div className="premium-container">
      <div className="premium-header">
        <h2 className="premium-title">
          {listings.length > 0 ? `${listings.length} Premium Elanlar` : 'Premium Elanlar'}
          <span className="premium-crown">👑</span>
        </h2>
        <Link href="/premium-elanlar" className="see-all-btn">
          Hamısına bax
        </Link>
      </div>

      <div className="premium-cards-container">
        {listings.map((listing, index) => (
          <div key={`premium-${listing.phone}-${index}`} className="premium-card-wrapper">
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
