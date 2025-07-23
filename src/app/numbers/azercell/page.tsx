'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const PhonePageTemplate = dynamic(() => import('@/components/PhonePageTemplate/PhonePageMainTemplate'), { ssr: false });

export default function AzercellPage() {
  return (
    <>
      {/* Desktop Template */}
      <div key="azercell-desktop" className="hidden md:block">
        <NumbersPageTemplate
          showProviderFilter={false}
        />
      </div>
      
      {/* Mobile Template */}
      <div key="azercell-mobile" className="block md:hidden">
        <PhonePageTemplate
          pageTitle="Azercell Nömrələri"
        />
      </div>
    </>
  );
}
