'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Phone, X } from 'lucide-react';
import './PhonePremium.css';

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
    const prefixes = ['010', '050', '051', '055', '060', '070', '077', '099'];
    const fetchAllListings = async () => {
      setLoading(true);
      try {
        let allListings: PremiumListing[] = [];
        for (const prefix of prefixes) {
          const response = await fetch(`/data/elan/${prefix}.json`);
          if (response.ok) {
            const data = await response.json();
            const formattedListings = data.map((item: Omit<PremiumListing, 'id'>, index: number) => ({
              id: `${prefix}-${index}`,
              phoneNumber: item.phoneNumber,
              price: Number(item.price),
              contactPhone: item.contactPhone,
              type: item.type,
              isVip: item.isVip,
            }));
            allListings = [...allListings, ...formattedListings];
          }
        }
        setListings(allListings);
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
        <h1>Premium Nömrələr</h1>
      </div>

      <div className="phone-search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Nömrədə axtar... (məs: 555, *77*)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && <X className="clear-icon" onClick={() => setSearchTerm('')} />}
      </div>

      <div className="phone-list-container">
        {loading ? (
          <p>Yüklənir...</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default PhonePremium;
