'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';

export default function AzercellPage() {
  const dataFiles = [
    { file: '010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
    { file: '050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
    { file: '051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' }
  ];

  return (
    <NumbersPageTemplate
      pageTitle="Azercell nömrələri"
      dataFiles={dataFiles}
      operatorPrefixes={['010', '050', '051']}
      showProviderFilter={false}
    />
  );
}
