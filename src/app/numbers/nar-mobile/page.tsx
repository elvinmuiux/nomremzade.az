'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import PhonePageTemplate from '@/components/PhonePageTemplate/PhonePageTemplate';

export default function NarMobilePage() {
  const dataFiles = [
    { file: '070.json', key: 'narMobileAds', provider: 'Nar Mobile', prefix: '070' },
    { file: '077.json', key: 'narMobileAds', provider: 'Nar Mobile', prefix: '077' },
    // Uncomment the following lines if you want to include more prefixes
    
  ];

  return (
    <>
      {/* Desktop Template */}
      <NumbersPageTemplate
        pageTitle="Nar Mobile nömrələri"
        dataFiles={dataFiles}
        operatorPrefixes={['070', '077']}
        showProviderFilter={false}
        operatorName="nar-mobile"
      />
      
      {/* Mobile Template */}
      <PhonePageTemplate
        pageTitle="Nar Mobile nömrələri"
        dataFiles={dataFiles}
        operatorPrefixes={['070', '077']}
        showProviderFilter={false}
        operatorName="nar-mobile"
      />
    </>
  );
}
