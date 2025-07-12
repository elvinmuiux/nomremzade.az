'use client';

import React from 'react';
import { Phone } from 'lucide-react';
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
        operator="070"
        title="Nar Mobile Nömrələri"
        subtitle="Nar Mobile operatoru üçün premium və standart nömrələr"
        icon={<Phone size={24} />}
        color="#F59E0B"
        dataFiles={dataFiles}
        showAllNumbers={true}
        showProviderFilter={false}
      />
    </>
  );
}
