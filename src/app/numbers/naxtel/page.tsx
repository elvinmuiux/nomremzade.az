'use client';

import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import Image from 'next/image';
import styles from './page.module.css';

export default function NaxtelPage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.container}>
        <div className={styles.comingSoon}>
          <div className={styles.titleWrapper}>
            <Image
              src="/images/operators/naxtel.svg"
              alt="Naxtel"
              width={40}
              height={40}
              className={styles.logo}
            />
            <h1 className={styles.title}>Naxtel Nömrələri</h1>
          </div>
          <p className={styles.message}>Tezliklə...</p>
        </div>
      </div>
    </PageTemplate>
  );
}
