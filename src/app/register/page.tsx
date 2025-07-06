'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import SecureDatabase from '@/lib/database';
import styles from './page.module.css';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectPath, setRedirectPath] = useState('/post-ad/premium');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check URL parameters to determine redirect path
    const from = searchParams.get('from');
    if (from === 'gold') {
      setRedirectPath('/post-ad/gold');
    } else if (from === 'standard') {
      setRedirectPath('/post-ad/standard');
    } else {
      setRedirectPath('/post-ad/premium');
    }
  }, [searchParams]);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Etibarlı email daxil edin');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Telefon nömrəsi tələb olunur');
      return false;
    }

    if (!formData.password.trim()) {
      setError('Şifrə tələb olunur');
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

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if user already exists
      const existingUser = SecureDatabase.getUserByEmail(formData.email);
      if (existingUser) {
        setError('Bu email ünvanı ilə istifadəçi artıq mövcuddur');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        isPremium: true, // All users are premium by default now
        createdAt: new Date().toISOString()
      };

      // Save user
      SecureDatabase.saveUser(newUser);

      // Set as current user
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      setSuccessMessage('Qeydiyyat uğurla tamamlandı!');
      
      // Redirect to the appropriate ad page
      setTimeout(() => {
        router.push(`${redirectPath}?registered=true`);
      }, 1500);

    } catch (error) {
      console.error('Registration error:', error);
      setError('Qeydiyyat zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.registerPage}>
        <section className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Qeydiyyat</h1>
            <p className={styles.pageDescription}>
              Premium nömrə elanı yerləşdirmək üçün qeydiyyatdan keçin
            </p>
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Ad və Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Adınız və soyadınız"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="email@missal.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="+994 XX XXX XX XX"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Şifrə
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Şifrəniz"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Şifrəni Təkrarla
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Şifrənizi təkrarlayın"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              {successMessage && (
                <div className={styles.successMessage}>
                  {successMessage}
                </div>
              )}

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

              <div className={styles.loginLink}>
                Artıq hesabınız var? <a href="/login">Daxil olun</a>
              </div>
            </form>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className={styles.loadingFallback}>Yüklənir...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
