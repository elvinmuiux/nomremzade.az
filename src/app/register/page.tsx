'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import PaymentForm from '@/components/ui/PaymentForm/PaymentForm';
import SecureDatabase from '@/lib/database';
import styles from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Ad və soyad tələb olunur');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email tələb olunur');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Düzgün email formatı daxil edin');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Telefon nömrəsi tələb olunur');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Şifrə ən azı 6 simvol olmalıdır');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifrələr uyğun gəlmir');
      return false;
    }

    // Check if email already exists
    const existingUser = SecureDatabase.getUserByEmail(formData.email);
    if (existingUser) {
      setError('Bu email artıq istifadə olunur');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newUser = {
        id: newUserId,
        email: formData.email,
        phone: formData.phone,
        fullName: formData.name,
        registeredAt: new Date().toISOString(),
        isPremium: false,
        paymentHistory: []
      };

      // Save user data with SecureDatabase
      SecureDatabase.saveUser(newUser);

      // Set current user session
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      setIsLoading(false);
      
      // Show payment form
      setShowPayment(true);
    }, 1500);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // Redirect to premium ad page with success message
    router.push('/post-ad/premium?registered=true&payment=success');
  };

  const handlePaymentError = (error: string) => {
    setError(`Ödəmə xətası: ${error}`);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setError('Ödəmə ləğv edildi. Premium elan yerləşdirmək üçün ödəmə tələb olunur.');
  };

  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.registerPage}>
        <section className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Qeydiyyat</h1>
            <p className={styles.pageDescription}>
              Premium elan yerləşdirmək üçün hesab yaradın və xüsusi imkanlardan yararlanın
            </p>
          </div>
        </section>

        <div className={styles.contentWrapper}>
          <div className={styles.formSection}>
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className={styles.registerForm}>
                {error && (
                  <div className={styles.errorAlert}>
                    <span className={styles.errorIcon}>⚠️</span>
                    {error}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Ad və Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Adınızı və soyadınızı daxil edin"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@domain.com"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Telefon Nömrəsi *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="050-444-44-22"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Şifrə *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Ən azı 6 simvol"
                    className={styles.input}
                    minLength={6}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Şifrəni Təsdiqlə *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Şifrəni təkrar daxil edin"
                    className={styles.input}
                    required
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
                      Qeydiyyat edilir...
                    </>
                  ) : (
                    'Qeydiyyatdan Keç'
                  )}
                </button>

                <div className={styles.authLinks}>
                  <p>
                    Artıq hesabınız var? 
                    <button 
                      type="button" 
                      onClick={() => router.push('/login')} 
                      className={styles.linkButton}
                    >
                      Giriş edin
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className={styles.benefitsSection}>
            <div className={styles.benefitsContainer}>
              <h3 className={styles.benefitsTitle}>Üzvlük Üstünlükləri</h3>
              <div className={styles.benefitsList}>
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>🎯</span>
                  <div className={styles.benefitContent}>
                    <h4>Premium Elan Yerləşdir</h4>
                    <p>Nömrənizi ən yaxşı şəkildə təqdim edin</p>
                  </div>
                </div>
                
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>⏰</span>
                  <div className={styles.benefitContent}>
                    <h4>30 Gün Aktiv</h4>
                    <p>Elanınız tam bir ay aktiv qalır</p>
                  </div>
                </div>
                
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>🔝</span>
                  <div className={styles.benefitContent}>
                    <h4>Öncelikli Göstərim</h4>
                    <p>Səhifə yuxarısında prioritet ilə göstərilir</p>
                  </div>
                </div>
                
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>🎨</span>
                  <div className={styles.benefitContent}>
                    <h4>Xüsusi Dizayn</h4>
                    <p>Əlavə rəng vurğusu və modern görünüş</p>
                  </div>
                </div>
                
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>📱</span>
                  <div className={styles.benefitContent}>
                    <h4>WhatsApp Dəstəyi</h4>
                    <p>Birbaşa WhatsApp əlaqə imkanı</p>
                  </div>
                </div>
                
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>📢</span>
                  <div className={styles.benefitContent}>
                    <h4>Sosial Media</h4>
                    <p>Elanınızı asanlıqla paylaşın</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {showPayment && (
          <PaymentForm
            amount={5.00}
            currency="AZN"
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        )}
      </div>
    </PageTemplate>
  );
}
