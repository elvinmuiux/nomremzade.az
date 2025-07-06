import React from 'react';
import Image from 'next/image';
import styles from './Logo.module.css';
import { LogoProps } from '@/types/navigation';

const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'medium',
  src = '/logos/nomrezade-logo.svg',
  alt = 'Nomrezade Logo',
  title = 'nömre.zade',
  subtitle = 'Sizin Nömrələriniz bizdə.',
  showBrandInfo = true
}) => {
  // Complete logo area with brand information
  if (showBrandInfo) {
    return (
      <div className={`${styles.logoArea} ${className}`}>
        <div className={`${styles.logo} ${styles[size]}`}>
          {src ? (
            <div className={styles.logoContainer}>
              <Image
                src={src}
                alt={alt}
                width={size === 'small' ? 40 : size === 'large' ? 80 : 60}
                height={size === 'small' ? 40 : size === 'large' ? 80 : 60}
                className={styles.logoImage}
                priority
              />
            </div>
          ) : (
            <div className={styles.logoCircle}>
              <span className={styles.logoText}>NZ</span>
            </div>
          )}
        </div>
        <div className={styles.brandInfo}>
          <h1 className={styles.brandTitle}>{title}</h1>
          <p className={styles.brandSubtitle}>{subtitle}</p>
        </div>
      </div>
    );
  }

  // Simple logo only (for backward compatibility)
  if (src) {
    return (
      <div className={`${styles.logo} ${styles[size]} ${className}`}>
        <div className={styles.logoContainer}>
          <Image
            src={src}
            alt={alt}
            width={size === 'small' ? 40 : size === 'large' ? 80 : 60}
            height={size === 'small' ? 40 : size === 'large' ? 80 : 60}
            className={styles.logoImage}
            priority
          />
        </div>
      </div>
    );
  }

  // Fallback to text logo
  // return (
  //   <div className={`${styles.logo} ${styles[size]} ${className}`}>
  //     <div className={styles.logoCircle}>
  //       <span className={styles.logoText}>NZ</span>
  //     </div>
  //   </div>
  // );
};

export default Logo;
