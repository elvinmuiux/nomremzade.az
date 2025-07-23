'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const PhonePageMainTemplate = dynamic(() => import('@/components/PhonePageTemplate/PhonePageMainTemplate'), { ssr: false });

export default function NarMobilePage() {
  return (
    <>
      {/* Desktop Template */}
      <div key="nar-desktop" className="hidden md:block">
        <NumbersPageTemplate
          showProviderFilter={false}
        />
      </div>
      
      {/* Mobile Template */}
      <div key="nar-mobile" className="block md:hidden">
        <PhonePageMainTemplate
          pageTitle="Nar Mobile Nömrələri"
        />
      </div>
    </>
  );
}
