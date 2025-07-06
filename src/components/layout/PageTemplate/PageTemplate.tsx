import React from 'react';
import styles from './PageTemplate.module.css';

interface PageTemplateProps {
  children: React.ReactNode;
  showTopNav?: boolean;
  showAlert?: boolean;
  alertMessage?: string;
  className?: string;
  selectedPrefix?: string;
  onPrefixChange?: (prefix: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  showTopNav = true,
  showAlert = false,
  alertMessage = '',
  className = '',
  selectedPrefix = '',
  onPrefixChange,
  searchTerm = '',
  onSearchChange
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {/* Top Navigation Bar */}
      {showTopNav && (
        <div className={styles.topNav}>
          <div className={styles.prefixDropdown}>
            <select 
              className={styles.prefixSelect} 
              title="Nömrə prefiksi seçin"
              value={selectedPrefix}
              onChange={(e) => onPrefixChange?.(e.target.value)}
            >
              <option value="">Prefiks</option>
              <option value="050">050</option>
              <option value="051">051</option>
              <option value="010">010</option>
              <option value="055">055</option>
              <option value="099">099</option>
              <option value="070">070</option>
              <option value="077">077</option>
              <option value="060">060</option>
            </select>
          </div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Axtarış..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <button className={styles.searchButton}>🔍</button>
          </div>
        </div>
      )}

      {/* Alert Banner */}
      {showAlert && alertMessage && (
        <div className={styles.alertBanner}>
          <span className={styles.alertIcon}>⚠️</span>
          <p className={styles.alertText}>
            {alertMessage}
          </p>
        </div>
      )}

      {/* Page Content */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;
