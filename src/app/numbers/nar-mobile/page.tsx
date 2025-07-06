'use client';

import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import Image from 'next/image';
import styles from './page.module.css';

export default function NarMobilePage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.container}>
        <div className={styles.comingSoon}>
          <div className={styles.titleWrapper}>
            <Image
              src="/images/operators/nar-mobile.svg"
              alt="Nar Mobile"
              width={40}
              height={40}
              className={styles.logo}
            />
            <h1 className={styles.title}>Nar Mobile Nömrələri</h1>
          </div>
          <p className={styles.message}>Tezliklə...</p>
        </div>
      </div>
    </PageTemplate>
  );
}
