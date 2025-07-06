import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

export default function FeedbackPage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.feedbackPage}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>İrad və Təkliflər</h1>
          <p className={styles.pageDescription}>
            Bizə iradlarınızı və təkliflərinizi bildirin, birlikdə daha yaxşı xidmət təqdim edək
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.feedbackInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>💡</div>
              <h3>Təklifləriniz</h3>
              <p>Xidmətimizi necə təkmilləşdirə bilərik? Fikirlərinizi bizə bildirin.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🐛</div>
              <h3>Problemlər</h3>
              <p>Saytda rastlaşdığınız texniki problemləri bildirin.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>⭐</div>
              <h3>Dəyərləndirmə</h3>
              <p>Xidmətimizi necə qiymətləndirirsiniz? Rəyiniz bizim üçün dəyərlidir.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Feedback Formu</h2>
          <div className={styles.formContainer}>
            <form className={styles.feedbackForm}>
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
                  <label htmlFor="phone" className={styles.label}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="050 123 45 67"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
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
                <div className={styles.formGroup}>
                  <label htmlFor="rating" className={styles.label}>
                    Qiymətləndirmə
                  </label>
                  <select id="rating" name="rating" className={styles.select}>
                    <option value="">Seçin</option>
                    <option value="5">⭐⭐⭐⭐⭐ Əla</option>
                    <option value="4">⭐⭐⭐⭐ Yaxşı</option>
                    <option value="3">⭐⭐⭐ Orta</option>
                    <option value="2">⭐⭐ Zəif</option>
                    <option value="1">⭐ Çox zəif</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="feedback_type" className={styles.label}>
                  Feedback Növü *
                </label>
                <select id="feedback_type" name="feedback_type" className={styles.select} required>
                  <option value="">Seçin</option>
                  <option value="suggestion">Təklif</option>
                  <option value="complaint">İrad/Şikayət</option>
                  <option value="bug">Texniki Problem</option>
                  <option value="general">Ümumi Rəy</option>
                  <option value="other">Digər</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>
                  Mövzu *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Qısaca mövzunu yazın"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Mesaj *
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="İradınızı və ya təklifinizi ətraflı yazın..."
                  className={styles.textarea}
                  rows={6}
                  required
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="attachment" className={styles.label}>
                  Fayl əlavə edin (şəkil, sənəd)
                </label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  accept="image/*,.pdf,.doc,.docx"
                  className={styles.fileInput}
                />
                <small className={styles.fileNote}>
                  JPG, PNG, PDF, DOC formatları qəbul edilir. Maksimum 5MB.
                </small>
              </div>

              <div className={styles.privacyNote}>
                <p>
                  * Məlumatlarınız gizlilik siyasəti çərçivəsində qorunur və yalnız xidmətin 
                  keyfiyyətini artırmaq məqsədilə istifadə edilir.
                </p>
              </div>

              <button type="submit" className={styles.submitButton}>
                Feedback Göndər
              </button>
            </form>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Digər Əlaqə Yolları</h2>
          <div className={styles.alternativeContact}>
            <div className={styles.contactOption}>
              <div className={styles.contactIcon}>📞</div>
              <h4>Telefon</h4>
              <a href="tel:+994504444422" className={styles.contactLink}>
                +994 50 444 44 22
              </a>
              <p>İş saatları: 09:00 - 18:00</p>
            </div>
            <div className={styles.contactOption}>
              <div className={styles.contactIcon}>💬</div>
              <h4>WhatsApp</h4>
              <a href="https://wa.me/994504444422" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                +994 50 444 44 22
              </a>
              <p>24/7 cavab veririk</p>
            </div>
            <div className={styles.contactOption}>
              <div className={styles.contactIcon}>📧</div>
              <h4>E-poçt</h4>
              <a href="mailto:info@nomrezade.az" className={styles.contactLink}>
                info@nomrezade.az
              </a>
              <p>24 saat ərzində cavab</p>
            </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}
