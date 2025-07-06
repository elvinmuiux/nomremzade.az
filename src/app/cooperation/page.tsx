import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

export default function CooperationPage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.cooperationPage}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>Bizimla Əməkdaşlıq</h1>
          <p className={styles.pageDescription}>
            Nomrezade.az ailəsinə qoşulun və birlikdə uğura doğru addımlayın
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Əməkdaşlıq İmkanları</h2>
          <div className={styles.opportunitiesGrid}>
            <div className={styles.opportunity}>
              <div className={styles.opportunityIcon}>🤝</div>
              <h3>Diler Proqramı</h3>
              <p>Bizim rəsmi dilerimiz olaraq öz ərazinizdə nömrə satışı həyata keçirin.</p>
              <ul>
                <li>Yüksək komissiya faizi</li>
                <li>Marketing dəstəyi</li>
                <li>Özel qiymətləndirmə</li>
                <li>Texniki dəstək</li>
              </ul>
            </div>

            <div className={styles.opportunity}>
              <div className={styles.opportunityIcon}>💼</div>
              <h3>Biznes Tərəfdaşlığı</h3>
              <p>Böyük həcmli nömrə alqı-satqısı üçün xüsusi tərəfdaşlıq təklifləri.</p>
              <ul>
                <li>Topdan satış qiymətləri</li>
                <li>Xüsusi kredit xətti</li>
                <li>Prioritet dəstək</li>
                <li>Müstəqil panel</li>
              </ul>
            </div>

            <div className={styles.opportunity}>
              <div className={styles.opportunityIcon}>📱</div>
              <h3>Mobil Tətbiq</h3>
              <p>Gələcəkdə mobil tətbiqimizin inkişafında tərəfdaş ola bilərsiniz.</p>
              <ul>
                <li>Texniki həllər</li>
                <li>UI/UX dizayn</li>
                <li>Test və inkişaf</li>
                <li>İnvestisiya imkanları</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Əlaqə Məlumatları</h2>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <h4>📞 Telefon</h4>
              <a href="tel:+994504444422" className={styles.contactLink}>+994 50 444 44 22</a>
            </div>
            <div className={styles.contactCard}>
              <h4>📧 E-poçt</h4>
              <a href="mailto:info@nomrezade.az" className={styles.contactLink}>info@nomrezade.az</a>
            </div>
            <div className={styles.contactCard}>
              <h4>📍 Ünvan</h4>
              <a href="https://www.google.com/maps/place/Baku,+Azerbaijan" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>Azərbaycan, Bakı ş.</a>
            </div>
            <div className={styles.contactCard}>
              <h4>💬 WhatsApp</h4>
              <a href="https://wa.me/994504444422" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>+994 50 444 44 22</a>
              <p>İş saatları: 09:00 - 20:00</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Əməkdaşlıq Formu</h2>
          <div className={styles.formContainer}>
            <form className={styles.cooperationForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Adınızı daxil edin"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.label}>
                    Şirkət/Təşkilat
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Şirkət adını daxil edin"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="050 123 45 67"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    E-poçt *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email@domain.com"
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cooperation_type" className={styles.label}>
                  Əməkdaşlıq Növü *
                </label>
                <select id="cooperation_type" name="cooperation_type" className={styles.select} required>
                  <option value="">Seçin</option>
                  <option value="dealer">Diler Proqramı</option>
                  <option value="business">Biznes Tərəfdaşlığı</option>
                  <option value="mobile">Mobil Tətbiq</option>
                  <option value="other">Digər</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Mesaj *
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Əməkdaşlıq təklifi və ya suallarınızı yazın..."
                  className={styles.textarea}
                  rows={5}
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                Təklif Göndər
              </button>
            </form>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}
