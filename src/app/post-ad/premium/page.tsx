import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

export default function PremiumAdPage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.adFormPage}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>Premium Elan Yerləşdir</h1>
          <p className={styles.pageDescription}>
            Premium elanınızla nömrənizi ən yaxşı şəkildə təqdim edin.
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
                  placeholder="050-444-44-22"
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
                  placeholder="500"
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
                  placeholder="050-266-63-66"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="whatsapp" className={styles.label}>
                  WhatsApp Nömrəsi
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="050-444-44-22"
                  className={styles.input}
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
                  rows={4}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image" className={styles.label}>
                  Şəkil
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className={styles.fileInput}
                />
              </div>

              <div className={styles.priceInfo}>
                <h3>Premium Elan - 5 AZN</h3>
                <ul>
                  <li>30 gün aktiv</li>
                  <li>Səhifə yuxarısında göstərilir</li>
                  <li>Əlavə rəng vurğusu</li>
                  <li>Sosial media paylaşımı</li>
                  <li>WhatsApp dəstəyi</li>
                </ul>
              </div>

              <button type="submit" className={styles.submitButton}>
                Premium Elan Yerləşdir
              </button>
            </form>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}
