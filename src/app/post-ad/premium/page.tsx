import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

const ComingSoon = () => {
  return (
    <div className={styles.comingSoonContainer}>
        <h1 className={styles.pageTitle}>Premium Elan Yerləşdirmə</h1>
        <div className={styles.comingSoon}>
            <span className={styles.comingSoonText}>TEZLİKLƏ</span>
            <p className={styles.comingSoonMessage}>Bu xidmət hazırda aktiv deyil və tezliklə istifadəyə veriləcək.</p>
        </div>
    </div>
  );
};

export default function PremiumAdPage() {
  return (
    <PageTemplate>
      <ComingSoon />
    </PageTemplate>
  );
}
