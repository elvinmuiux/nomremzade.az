'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';

export default function NarMobilePage() {
  const dataFiles = [
    { file: '070.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '070' },
    { file: '077.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '077' }
  ];

  return (
    <NumbersPageTemplate
      pageTitle="Nar Mobile nömrələri"
      dataFiles={dataFiles}
      operatorPrefixes={['070', '077']}
      showProviderFilter={false}
      operatorName="nar-mobile"
    />
  );
}
