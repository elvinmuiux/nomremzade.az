'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import PhonePageTemplate from '@/components/PhonePageTemplate/PhonePageTemplate';

export default function AzercellPage() {
  const dataFiles = [
    { file: '050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
    { file: '051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
    { file: '010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },

    // Uncomment the following lines if you want to include more prefixes
    
  ];

  return (
    <>
      {/* Desktop Template */}
      <NumbersPageTemplate
        pageTitle="Azercell nömrələri"
        dataFiles={dataFiles}
        operatorPrefixes={['010', '050', '051']}
        showProviderFilter={false}
        operatorName="azercell"
      />
      
      {/* Mobile Template */}
      <PhonePageTemplate
        operator="050"
        title="Azercell Nömrələri"
        subtitle="Azercell operatoru üçün premium və standart nömrələr"
        icon={<Phone size={24} />}
        color="#3B82F6"
        dataFiles={dataFiles}
        showAllNumbers={true}
        showProviderFilter={false}
      />
    </>
  );
}
