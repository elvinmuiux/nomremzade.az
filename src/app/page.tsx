import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

function HomePage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.container}>
        <div className={styles.comingSoon}>
          <h1 className={styles.title}>Əsas Səhifə</h1>
          <p className={styles.message}>Tezliklə...</p>
        </div>
      </div>
    </PageTemplate>
  );
}

export default HomePage;
