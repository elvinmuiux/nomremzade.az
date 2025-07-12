'use client';

import React from 'react';
import { Smartphone } from 'lucide-react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import PhonePageTemplate from '@/components/PhonePageTemplate/PhonePageTemplate';

export default function BakcellPage() {
  const dataFiles = [
    { file: '055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
    { file: '099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' },
    // Uncomment the following lines if you want to include more prefixes
    
  ];

  return (
    <>
      {/* Desktop Template */}
      <NumbersPageTemplate
        pageTitle="Bakcell nömrələri"
        dataFiles={dataFiles}
        operatorPrefixes={['055', '099']}
        showProviderFilter={false}
        operatorName="bakcell"
      />
      
      {/* Mobile Template */}
      <PhonePageTemplate
        operator="055"
        title="Bakcell Nömrələri"
        subtitle="Bakcell operatoru üçün premium və standart nömrələr"
        icon={<Smartphone size={24} />}
        color="#10B981"
        dataFiles={dataFiles}
        showAllNumbers={true}
        showProviderFilter={false}
      />
    </>
  );
}
