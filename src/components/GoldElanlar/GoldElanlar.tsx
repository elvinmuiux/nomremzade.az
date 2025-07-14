'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import './GoldElanlar.css';

const brands = [
  { name: 'Trendyol', bgColor: 'bg-light-gray', textColor: 'text-dark' },
  { name: 'Milla', bgColor: 'bg-purple', textColor: 'text-white' },
  { name: 'LC Waikiki', bgColor: 'bg-green', textColor: 'text-white' },
  { name: 'DeFacto', bgColor: 'bg-blue', textColor: 'text-white' },
  { name: 'Koton', bgColor: 'bg-dark-gray', textColor: 'text-white' },
  { name: 'ZARA', bgColor: 'bg-red', textColor: 'text-white' },
  { name: 'Bershka', bgColor: 'bg-pink', textColor: 'text-white' },
  { name: 'Pull&Bear', bgColor: 'bg-blue', textColor: 'text-white' },
];

const GoldElanlar: React.FC = () => {
  return (
    <div className="gold-container">
      <div className="gold-header">
        <h2 className="gold-title">
          <Crown className="gold-crown" size={24} />
          Gold Brendlər
        </h2>
      </div>
      <div className="gold-brands-container">
        {brands.map((brand, index) => (
          <div key={index} className={`gold-brand-card ${brand.bgColor}`}>
            <span className={`gold-brand-logo ${brand.textColor}`}>{brand.name}</span>
          </div>
        ))}
      </div>
      <div className="gold-progress">
        <div className="gold-progress-bar"></div>
      </div>
    </div>
  );
};

export default GoldElanlar;
