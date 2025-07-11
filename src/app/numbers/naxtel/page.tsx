'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import PhonePageTemplate from '@/components/PhonePageTemplate/PhonePageTemplate';

export default function NaxtelPage() {
  const dataFiles = [
    { file: '060.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' }
  ];

  return (
    <>
      {/* Desktop Template */}
      <NumbersPageTemplate
        pageTitle="Naxtel nömrələri"
        dataFiles={dataFiles}
        operatorPrefixes={['060']}
        showProviderFilter={false}
        operatorName="naxtel"
      />
      
      {/* Mobile Template */}
      <PhonePageTemplate
        pageTitle="Naxtel nömrələri"
        dataFiles={dataFiles}
        operatorPrefixes={['060']}
        showProviderFilter={false}
        operatorName="naxtel"
      />
    </>
  );
}
