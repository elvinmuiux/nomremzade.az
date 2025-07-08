'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';

export default function BakcellPage() {
  const dataFiles = [
    { file: '055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
    { file: '099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' }
  ];

  return (
    <NumbersPageTemplate
      pageTitle="Bakcell nömrələri"
      dataFiles={dataFiles}
      operatorPrefixes={['055', '099']}
      showProviderFilter={false}
      operatorName="bakcell"
    />
  );
}
