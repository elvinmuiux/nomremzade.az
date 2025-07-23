'use client';

import NumbersPageTemplate from '@/components/NumbersPageTemplate/NumbersPageTemplate';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const PhonePageTemplate = dynamic(
  () => import('@/components/PhonePageTemplate/PhonePageMainTemplate'),
  { 
    ssr: false,
    loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Yüklənir...</div>
  }
);

function HomePage() {
  return (
    <>
      {/* Desktop Template */}
      <div key="desktop-template" className="hidden md:block">
        <NumbersPageTemplate
          showProviderFilter={true}
        />
      </div>
      
      {/* Mobile Template */}
      <div key="mobile-template" className="block md:hidden">
        <PhonePageTemplate
          pageTitle="Bütün Nömrələr"
          showProviderFilter={true}
        />
      </div>
    </>
  );
}

export default HomePage;
