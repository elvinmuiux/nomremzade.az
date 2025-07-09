'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import './GoldElanlar.css';

interface BrandCardProps {
  name: string;
  logo: string;
  backgroundColor: string;
  textColor?: string;
}

const BrandCard: React.FC<BrandCardProps> = ({ 
  logo, 
  backgroundColor, 
  textColor = 'default-text' 
}) => {
  return (
    <div className={`gold-brand-card ${backgroundColor} ${textColor}`}>
      <div className="gold-brand-logo">
        {logo}
      </div>
    </div>
  );
};

const GoldElanlar: React.FC = () => {
  const brands = [
    {
      name: "NZ",
      logo: "NZ",
      backgroundColor: "bg-light-gray",
      textColor: "text-dark"
    },
    {
      name: "Premium",
      logo: "Premium",
      backgroundColor: "bg-purple",
      textColor: "text-white"
    },
    {
      name: "WT",
      logo: "🍎",
      backgroundColor: "bg-green",
      textColor: "text-white"
    },
    {
      name: "UJ",
      logo: "UJ",
      backgroundColor: "bg-light-gray",
      textColor: "text-blue"
    },
    {
      name: "ir.şəd",
      logo: "ir.şəd",
      backgroundColor: "bg-dark-gray",
      textColor: "text-white"
    },
    {
      name: "Bakcell",
      logo: "🔴 bakcell",
      backgroundColor: "bg-red",
      textColor: "text-white"
    },
    {
      name: "Nar",
      logo: "nar",
      backgroundColor: "bg-pink",
      textColor: "text-white"
    },
    {
      name: "Azercell",
      logo: "azercell",
      backgroundColor: "bg-blue",
      textColor: "text-white"
    }
  ];

  return (
    <div className="gold-container">
      <div className="gold-header">
        <h2 className="gold-title">
          Gold Elanlar
          <Crown className="gold-crown" size={24} />
        </h2>
      </div>

      <div className="gold-brands-container">
        {brands.map((brand, index) => (
          <BrandCard
            key={index}
            name={brand.name}
            logo={brand.logo}
            backgroundColor={brand.backgroundColor}
            textColor={brand.textColor}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="gold-progress">
        <div className="gold-progress-bar"></div>
      </div>
    </div>
  );
};

export default GoldElanlar;
