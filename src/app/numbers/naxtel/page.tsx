'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const PhonePageMainTemplate = dynamic(() => import('@/components/PhonePageTemplate/PhonePageMainTemplate'), { ssr: false });

export default function NaxtelPage() {
  return (
    <>
      {/* Desktop Template */}
      <div key="naxtel-desktop" className="hidden md:block">
        <NumbersPageTemplate
          showProviderFilter={false}
        />
      </div>
      
      {/* Mobile Template */}
      <div key="naxtel-mobile" className="block md:hidden">
        <PhonePageMainTemplate
          pageTitle="Naxtel Nömrələri"
        />
      </div>
    </>
  );
}
