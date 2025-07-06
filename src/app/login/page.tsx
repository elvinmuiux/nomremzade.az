'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  registrationDate: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Bütün sahələri doldurun');
      return;
    }

    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      const users: UserData[] = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (user) {
        // Set current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        setIsLoading(false);
        
        // Redirect to premium ad form
        router.push('/post-ad/premium?loggedIn=true');
      } else {
        setError('Email və ya şifrə yanlışdır');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.loginPage}>
        <section className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Giriş</h1>
            <p className={styles.pageDescription}>
              Hesabınıza daxil olun və premium elan imkanlarından istifadə edin
            </p>
          </div>
        </section>

        <div className={styles.contentWrapper}>
          <div className={styles.formSection}>
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className={styles.loginForm}>
                {error && (
                  <div className={styles.errorAlert}>
                    <span className={styles.errorIcon}>⚠️</span>
                    {error}
                  </div>
                )}

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
                  <label htmlFor="password" className={styles.label}>
                    Şifrə *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Şifrənizi daxil edin"
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
                      Giriş edilir...
                    </>
                  ) : (
                    'Giriş Et'
                  )}
                </button>

                <div className={styles.authLinks}>
                  <p>
                    Hesabınız yoxdur? 
                    <button 
                      type="button" 
                      onClick={() => router.push('/register')} 
                      className={styles.linkButton}
                    >
                      Qeydiyyatdan keçin
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className={styles.welcomeSection}>
            <div className={styles.welcomeContainer}>
              <h3 className={styles.welcomeTitle}>Xoş Gəlmisiniz!</h3>
              
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>🚀</span>
                  <div className={styles.featureContent}>
                    <h4>Sürətli Giriş</h4>
                    <p>Bir kliklə hesabınıza daxil olun</p>
                  </div>
                </div>
                
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>💎</span>
                  <div className={styles.featureContent}>
                    <h4>Premium İmkanlar</h4>
                    <p>Xüsusi elan yerləşdirmə səlahiyyətləri</p>
                  </div>
                </div>
                
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>📊</span>
                  <div className={styles.featureContent}>
                    <h4>Elan İdarəsi</h4>
                    <p>Elanlarınızı asanlıqla idarə edin</p>
                  </div>
                </div>
                
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>🔒</span>
                  <div className={styles.featureContent}>
                    <h4>Təhlükəsiz Giriş</h4>
                    <p>Hesabınız tam təhlükəsizlik altındadır</p>
                  </div>
                </div>
              </div>

              <div className={styles.statsContainer}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>500+</span>
                  <span className={styles.statLabel}>Aktiv İstifadəçi</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>1000+</span>
                  <span className={styles.statLabel}>Premium Elan</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>30</span>
                  <span className={styles.statLabel}>Gün Aktiv</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
