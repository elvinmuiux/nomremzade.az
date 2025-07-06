'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogIn, UserPlus, LogOut } from 'lucide-react';
import styles from './AuthButtons.module.css';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  registrationDate: string;
}
const AuthButtons: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = () => {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setShowUserMenu(false);
    router.push('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  if (currentUser) {
    return (
      <div className={styles.authSection}>
        <div className={styles.userInfo}>
          <button 
            className={styles.userButton}
            onClick={toggleUserMenu}
          >
            <User size={20} />
            <span className={styles.userName}>{currentUser.name}</span>
          </button>
          
          {showUserMenu && (
            <div className={styles.userMenu}>
              <div className={styles.userDetails}>
                <p className={styles.userEmail}>{currentUser.email}</p>
                <p className={styles.userPhone}>{currentUser.phone}</p>
              </div>
              <hr className={styles.menuDivider} />
              <button 
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Çıxış
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authSection}>
      <div className={styles.authButtons}>
        <button 
          className={styles.loginButton}
          onClick={handleLogin}
        >
          <LogIn size={18} />
          <span>Giriş</span>
        </button>
        
        <button 
          className={styles.registerButton}
          onClick={handleRegister}
        >
          <UserPlus size={18} />
          <span>Qeydiyyat</span>
        </button>
      </div>
    </div>
  );
};

export default AuthButtons;
