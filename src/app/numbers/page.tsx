'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import SecureDatabase, { PremiumAd } from '@/lib/database';
import styles from './page.module.css';

export default function NumbersPage() {
  const [premiumAds, setPremiumAds] = useState<PremiumAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load premium ads from secure database
    const loadPremiumAds = () => {
      try {
        const ads = SecureDatabase.getActivePremiumAds();
        setPremiumAds(ads);
      } catch (error) {
        console.error('Failed to load premium ads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPremiumAds();
  }, []);

  const formatPrice = (price?: number) => {
    if (!price) return 'Qiymət razılaşma ilə';
    return `${price} AZN`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOperatorLogo = (operator: string) => {
    const operatorLogos: { [key: string]: string } = {
      'azercell': '/images/operators/azercell.svg',
      'bakcell': '/images/operators/bakcell.svg',
      'nar-mobile': '/images/operators/nar-mobile.svg',
      'naxtel': '/images/operators/naxtel.svg'
    };
    return operatorLogos[operator.toLowerCase()] || '';
  };

  const handleWhatsAppContact = (phoneNumber: string) => {
    const message = encodeURIComponent(`Salam! ${phoneNumber} nömrəsi barədə məlumat almaq istərdim.`);
    window.open(`https://wa.me/994${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <PageTemplate showTopNav={false}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Premium elanlar yüklənir...</p>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Premium Nömrələr</h1>
          <p className={styles.subtitle}>
            Ödənişli üzvlərimizin premium elanları
          </p>
        </div>

        {premiumAds.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📱</div>
            <h3>Hələ premium elan yoxdur</h3>
            <p>Premium elan yerləşdirmək üçün qeydiyyatdan keçin</p>
            <a href="/register" className={styles.registerButton}>
              Qeydiyyat
            </a>
          </div>
        ) : (
          <div className={styles.adsGrid}>
            {premiumAds.map((ad) => (
              <div key={ad.id} className={styles.premiumAdCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.operatorInfo}>
                    <Image 
                      src={getOperatorLogo(ad.operator)} 
                      alt={ad.operator}
                      width={24}
                      height={24}
                      className={styles.operatorLogo}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className={styles.operatorName}>
                      {ad.operator.charAt(0).toUpperCase() + ad.operator.slice(1)}
                    </span>
                  </div>
                  <div className={styles.premiumBadge}>
                    ⭐ Premium
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.phoneNumber}>
                    {ad.phoneNumber}
                  </div>
                  
                  {ad.description && (
                    <p className={styles.description}>
                      {ad.description}
                    </p>
                  )}
                  
                  <div className={styles.priceSection}>
                    <span className={styles.price}>
                      {formatPrice(ad.price)}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.publishDate}>
                    {formatDate(ad.createdAt)}
                  </div>
                  
                  <div className={styles.contactButtons}>
                    <button 
                      className={styles.whatsappButton}
                      onClick={() => handleWhatsAppContact(ad.phoneNumber)}
                    >
                      <span className={styles.whatsappIcon}>📱</span>
                      WhatsApp
                    </button>
                    
                    <a 
                      href={`tel:${ad.phoneNumber}`}
                      className={styles.callButton}
                    >
                      <span className={styles.callIcon}>📞</span>
                      Zəng
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Premium Elan Yerləşdir</h3>
            <p>Nömrənizi ən yaxşı şəkildə təqdim edin və daha çox müştəri cəlb edin.</p>
            <ul className={styles.featuresList}>
              <li>✅ 30 gün aktiv qalır</li>
              <li>✅ Səhifə yuxarısında göstərilir</li>
              <li>✅ WhatsApp əlaqə imkanı</li>
              <li>✅ Xüsusi dizayn</li>
            </ul>
            <a href="/register" className={styles.postAdButton}>
              Premium Elan Ver
            </a>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
