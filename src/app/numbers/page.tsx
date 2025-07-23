'use client';

import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const PhonePageMainTemplate = dynamic(() => import('@/components/PhonePageTemplate/PhonePageMainTemplate'), { ssr: false });

export default function NumbersPage() {
  return (
    <>
      {/* Desktop Template */}
      <div key="numbers-desktop" className="hidden md:block">
        <NumbersPageTemplate
          showProviderFilter={true}
        />
      </div>
      
      {/* Mobile Template */}
      <div key="numbers-mobile" className="block md:hidden">
        <PhonePageMainTemplate
          pageTitle="Bütün Nömrələr"
        />
      </div>
    </>
  );
}
