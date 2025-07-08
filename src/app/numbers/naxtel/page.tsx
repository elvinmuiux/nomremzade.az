'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';

export default function NaxtelPage() {
  const dataFiles = [
    { file: '060.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' }
  ];

  return (
    <NumbersPageTemplate
      pageTitle="Naxtel nömrələri"
      dataFiles={dataFiles}
      operatorPrefixes={['060']}
      showProviderFilter={false}
      operatorName="naxtel"
    />
  );
}
