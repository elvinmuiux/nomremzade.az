'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import PhonePageTemplate from '@/components/PhonePageTemplate/PhonePageMainTemplate';

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
        pageTitle="Azercell Nömrələri"
        dataFiles={dataFiles}
        operatorName="azercell"
      />
    </>
  );
}
