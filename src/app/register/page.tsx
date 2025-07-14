"use client";

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { registerUser } from './actions';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';
import { RegisterState } from '@/lib/definitions';

const initialState: RegisterState = { message: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={styles.submitButton}>
      {pending ? 'Qeydiyyatdan keçirilir...' : 'Hesab Yarat'}
    </button>
  );
}

function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, dispatch] = useFormState(registerUser, initialState);

  useEffect(() => {
    if (state.user) {
      const callbackUrl = searchParams.get('callbackUrl') || '/';
      router.push(callbackUrl);
    }
  }, [state.user, router, searchParams]);

  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.registerContainer}>
        <form action={dispatch} className={styles.registerForm}>
          <h2>Hesab yarat</h2>
          {state.error && (
            <p className={styles.error}>{state.error}</p>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="name">Ad</label>
            <input type="text" id="name" name="name" required />
            {state.issues?.name && <p className={styles.error}>{state.issues.name[0]}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
            {state.issues?.email && <p className={styles.error}>{state.issues.email[0]}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Telefon</label>
            <input type="tel" id="phone" name="phone" required />
            {state.issues?.phone && <p className={styles.error}>{state.issues.phone[0]}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Şifrə</label>
            <input type="password" id="password" name="password" required />
            {state.issues?.password && <p className={styles.error}>{state.issues.password[0]}</p>}
          </div>
          <SubmitButton />
        </form>
      </div>
    </PageTemplate>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Yüklənir...</div>}>
      <Register />
    </Suspense>
  );
}
