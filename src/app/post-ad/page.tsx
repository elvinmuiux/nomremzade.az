import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

export default function PostAdPage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.postAdPage}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>Elan Yerləşdir</h1>
          <p className={styles.pageDescription}>
            Nömrənizi satmaq üçün elan yerləşdirin və geniş auditoriyaya çatın.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Elan Növləri</h2>
          <div className={styles.adTypesGrid}>
            <div className={styles.adTypeCard}>
              <div className={styles.adTypeHeader}>
                <h3>Premium Elan</h3>
                <span className={styles.comingSoon}>TEZLİKLƏ</span>
              </div>
              <ul className={styles.featuresList}>
                <li>30 gün aktiv olacaq</li>
                <li>Səhifə yuxarısında göstəriləcək</li>
                <li>Əlavə rəng vurğusu</li>
                <li>Sosial media paylaşımı</li>
                <li>WhatsApp dəstəyi</li>
              </ul>
              <button className={styles.disabledButton} disabled>
                TEZLİKLƏ
              </button>
            </div>

            <div className={styles.adTypeCard}>
              <div className={styles.adTypeHeader}>
                <h3>Gold Elan</h3>
                <span className={styles.comingSoon}>TEZLİKLƏ</span>
              </div>
              <ul className={styles.featuresList}>
                <li>20 gün aktiv olacaq</li>
                <li>Orta hissədə göstəriləcək</li>
                <li>Gold vurğu</li>
                <li>WhatsApp dəstəyi</li>
              </ul>
              <button className={styles.disabledButton} disabled>
                TEZLİKLƏ
              </button>
            </div>

            <div className={styles.adTypeCard}>
              <div className={styles.adTypeHeader}>
                <h3>Standart Elan</h3>
                <span className={styles.comingSoon}>TEZLİKLƏ</span>
              </div>
              <ul className={styles.featuresList}>
                <li>10 gün aktiv olacaq</li>
                <li>Standart göstərim</li>
                <li>Əsas xüsusiyyətlər</li>
              </ul>
              <button className={styles.disabledButton} disabled>
                TEZLİKLƏ
              </button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Elan Vermə Qaydaları</h2>
          <div className={styles.rulesContainer}>
            <div className={styles.rule}>
              <h4>1. Nömrə Məlumatları</h4>
              <p>Nömrənizin tam və düzgün məlumatlarını daxil edin.</p>
            </div>
            <div className={styles.rule}>
              <h4>2. Qiymət Təyin Etmə</h4>
              <p>Bazar qiymətinə uyğun qiymət təyin edin.</p>
            </div>
            <div className={styles.rule}>
              <h4>3. Əlaqə Məlumatları</h4>
              <p>Aktiv telefon nömrəsi və ya WhatsApp əlaqəsi təmin edin.</p>
            </div>
            <div className={styles.rule}>
              <h4>4. Foto və Təsvir</h4>
              <p>Nömrənizin görünüşünü əks etdirən foto əlavə edin.</p>
            </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}
