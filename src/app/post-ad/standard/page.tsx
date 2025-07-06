import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from '../premium/page.module.css';

export default function StandardAdPage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.adFormPage}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>Standart Elan Yerləşdir</h1>
          <p className={styles.pageDescription}>
            Standart elanınızla nömrənizi satışa çıxarın.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.formContainer}>
            <form className={styles.adForm}>
              <div className={styles.formGroup}>
                <label htmlFor="number" className={styles.label}>
                  Telefon Nömrəsi *
                </label>
                <input
                  type="tel"
                  id="number"
                  name="number"
                  placeholder="050-266-63-66"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="operator" className={styles.label}>
                  Operator *
                </label>
                <select id="operator" name="operator" className={styles.select} required>
                  <option value="">Operator seçin</option>
                  <option value="azercell">Azərcell</option>
                  <option value="bakcell">Bakcell</option>
                  <option value="nar-mobile">Nar Mobile</option>
                  <option value="naxtel">Naxtel</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Qiymət (AZN) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="150"
                  className={styles.input}
                  min="1"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contact" className={styles.label}>
                  Əlaqə Nömrəsi *
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  placeholder="050-444-44-22"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Təsvir
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Nömrəniz haqqında əlavə məlumat..."
                  className={styles.textarea}
                  rows={3}
                ></textarea>
              </div>

              <div className={styles.priceInfo}>
                <h3>Standart Elan - 1 AZN</h3>
                <ul>
                  <li>10 gün aktiv</li>
                  <li>Standart göstərim</li>
                  <li>Əsas xüsusiyyətlər</li>
                </ul>
              </div>

              <button type="submit" className={styles.submitButton}>
                Standart Elan Yerləşdir
              </button>
            </form>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}
