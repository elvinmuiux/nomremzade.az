'use client';

import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

export default function NaxtelPage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.container}>
        <div className={styles.comingSoon}>
          <h1 className={styles.title}>Bütün Nömrələri</h1>
          <p className={styles.message}>Tezliklə...</p>
        </div>
      </div>
    </PageTemplate>
  );
}
