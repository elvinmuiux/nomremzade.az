import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.aboutPage}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>Haqqımızda</h1>
          <p className={styles.pageDescription}>
            Nomrezade.az - Azərbaycanın ən böyük və etibarlı nömrə bazarı
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.content}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>Bizim Missiyamız</h2>
              <p className={styles.text}>
                Nomrezade.az platforması olaraq missiyamız Azərbaycanda nömrə alqı-satqısı 
                sahəsində ən etibarlı və rahat xidməti təqdim etməkdir. Biz hər kəsin 
                arzuladığı nömrəni tapa biləcəyi və öz nömrəsini asanlıqla sata biləcəyi 
                təhlükəsiz bir mühit yaratmışıq.
              </p>
            </div>
            <div className={styles.statsContainer}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10,000+</span>
                <span className={styles.statLabel}>Aktiv İstifadəçi</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>50,000+</span>
                <span className={styles.statLabel}>Satılmış Nömrə</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>24/7</span>
                <span className={styles.statLabel}>Dəstək Xidməti</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Niyə Nomrezade.az?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Təhlükəsizlik</h3>
              <p>Bütün əməliyyatlar SSL şifrələməsi ilə qorunur və tam təhlükəsizlik təmin edilir.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Sürətli Xidmət</h3>
              <p>Nömrə axtarışından satışa qədər bütün proseslər maksimum sürətlə həyata keçirilir.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Bütün Operatorlar</h3>
              <p>Azərcell, Bakcell, Nar Mobile və Naxtel - bütün operatorların nömrələri bizdə.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💎</div>
              <h3>Premium Seçim</h3>
              <p>Adi nömrələrdən tutmuş VIP və ekskluziv nömrələrə qədər geniş seçim imkanı.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Dəqiq Axtarış</h3>
              <p>Prefiks, nümunə və qiymət aralığına görə dəqiq axtarış imkanları.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🤝</div>
              <h3>Etibarlı Dəstək</h3>
              <p>Peşəkar komandamız sizə 24/7 kömək etmək üçün həmişə hazırdır.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Bizim Komanda</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <h4>Sırac Əhmədov</h4>
              <p>CEO | nomrezade.az</p>
            </div>
            <div className={styles.teamMember}>
              <h4>Dizayn və texniki nəzarət</h4>
              <p>Vizual və texnoloji yanaşma</p>
              <p>
                <a href="https://www.descube.com" target="_blank" rel="noopener noreferrer">
                  www.descube.com
                </a>
              </p>
            </div>
            <div className={styles.teamMember}>
              <h4>Müştəri Xidmətləri</h4>
              <p>
                <a href="tel:+994504444422">+994 50 444 44 22</a>
              </p>
              <p>
                <a href="mailto:info@nomrezade.az">info@nomrezade.az</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}
