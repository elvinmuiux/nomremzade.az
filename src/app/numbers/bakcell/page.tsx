'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const PhonePageTemplate = dynamic(() => import('@/components/PhonePageTemplate/PhonePageMainTemplate'), { ssr: false });

export default function BakcellPage() {
  return (
    <>
      {/* Desktop Template */}
      <div key="bakcell-desktop" className="hidden md:block">
        <NumbersPageTemplate
          showProviderFilter={false}
        />
      </div>

      {/* Mobile Template */}
      <div key="bakcell-mobile" className="block md:hidden">
        <PhonePageTemplate
          pageTitle="Bakcell Nömrələri"
        />
      </div>
    </>
  );
}
