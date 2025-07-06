'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import SecureDatabase, { User, PremiumAd } from '@/lib/database';
import styles from './page.module.css';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function PremiumAdPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    operator: '',
    price: '',
    contactPhone: '',
    whatsappNumber: '',
    description: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    } else {
      // Redirect to registration if not logged in
      router.push('/register?from=premium');
      return;
    }

    // Check if user just registered
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setSuccessMessage('Qeydiyyat uğurludur! İndi premium elanınızı yerləşdirə bilərsiniz.');
    }
  }, [router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.phoneNumber.trim()) {
      alert('Telefon nömrəsi daxil edin');
      return false;
    }
    if (!formData.operator) {
      alert('Operator seçin');
      return false;
    }
    if (!formData.price.trim()) {
      alert('Qiymət daxil edin');
      return false;
    }
    if (!formData.contactPhone.trim()) {
      alert('Əlaqə telefonu daxil edin');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentUser) {
      return;
    }

    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      try {
        // Create premium ad
        const newAd: PremiumAd = {
          id: `premium_${Date.now()}`,
          userId: currentUser.id,
          phoneNumber: formData.phoneNumber,
          operator: formData.operator,
          price: parseFloat(formData.price),
          contactPhone: formData.contactPhone,
          whatsappNumber: formData.whatsappNumber,
          description: formData.description,
          adType: 'premium',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          views: 0,
          featured: true
        };

        // Save ad
        SecureDatabase.savePremiumAd(newAd);

        setSuccessMessage('Premium elanınız uğurla yerləşdirildi! 30 gün aktiv olacaq.');
        
        // Reset form
        setFormData({
          phoneNumber: '',
          operator: '',
          price: '',
          contactPhone: '',
          whatsappNumber: '',
          description: ''
        });

        // Redirect to numbers page after 3 seconds
        setTimeout(() => {
          router.push('/numbers');
        }, 3000);

      } catch (error) {
        console.error('Error creating ad:', error);
        alert('Elan yerləşdirmə zamanı xəta baş verdi');
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  if (!currentUser) {
    return (
      <PageTemplate>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Yönləndirilir...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className={styles.premiumAdPage}>
        <section className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Premium Elan</h1>
            <p className={styles.pageDescription}>
              Premium elanınız 30 gün aktiv olacaq və xüsusi vurğulanacaq
            </p>
            <div className={styles.comingSoon}>
              <span className={styles.comingSoonText}>TEZLİKLƏ</span>
              <p className={styles.comingSoonMessage}>Bu xidmət tezliklə aktiv olacaq</p>
            </div>
          </div>
        </section>

        {successMessage && (
          <div className={styles.successBanner}>
            <div className={styles.successIcon}>✅</div>
            <div className={styles.successText}>
              {successMessage}
            </div>
          </div>
        )}

        <section className={styles.formSection}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.adForm}>
              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber" className={styles.label}>
                  Telefon Nömrəsi
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="055 123 45 67"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="operator" className={styles.label}>
                  Operator
                </label>
                <select
                  id="operator"
                  name="operator"
                  value={formData.operator}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                  disabled={isLoading}
                >
                  <option value="">Operator seçin</option>
                  <option value="azercell">Azercell</option>
                  <option value="bakcell">Bakcell</option>
                  <option value="nar-mobile">Nar Mobile</option>
                  <option value="naxtel">Naxtel</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Qiymət (AZN)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="100"
                  min="1"
                  step="0.01"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contactPhone" className={styles.label}>
                  Əlaqə Telefonu
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="050 123 45 67"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="whatsappNumber" className={styles.label}>
                  WhatsApp Nömrəsi (İstəyə görə)
                </label>
                <input
                  type="text"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="050 123 45 67"
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Əlavə Məlumat (İstəyə görə)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Nömrə haqqında əlavə məlumatlar..."
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Elan yerləşdirilir...
                  </>
                ) : (
                  'Premium Elan Yerləşdir'
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}

export default function PremiumAdPage() {
  return (
    <Suspense fallback={<div>Yüklənir...</div>}>
      <PremiumAdPageContent />
    </Suspense>
  );
}
