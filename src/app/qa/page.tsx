import React from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

export default function QAPage() {
  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.qaPage}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>Sual - Cavab</h1>
          <p className={styles.pageDescription}>
            Nomrezade.az haqqında ən çox verilən suallar və cavabları
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.faqContainer}>
            <div className={styles.faqItem}>
              <h3 className={styles.question}>Nömrə necə alıram?</h3>
              <p className={styles.answer}>
                İstədiyiniz nömrəni tapdıqdan sonra satıcı ilə əlaqə saxlayın və razılaşdıqdan sonra 
                ödəniş edərək nömrəni əldə edə bilərsiniz. Bütün proseslər təhlükəsizlik çərçivəsində həyata keçirilir.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Nömrəmi necə satıram?</h3>
              <p className={styles.answer}>
                &ldquo;Elan yerləşdir&rdquo; bölməsinə keçərək nömrənizin məlumatlarını daxil edin, qiymət təyin edin 
                və elan növünüzü seçin. Elanınız təsdiqləndikcə saytda yayımlanacaq.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Ödəniş metodları hansılardır?</h3>
              <p className={styles.answer}>
                Nağd ödəniş, bank kartı, bank köçürməsi, eManat, Kapital Bank və digər elektron 
                ödəniş üsulları mövcuddur. Bütün ödənişlər SSL şifrələməsi ilə qorunur.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Nömrə köçürülməsi necə həyata keçirilir?</h3>
              <p className={styles.answer}>
                Nömrə köçürülməsi operator tərəfindən həyata keçirilir. Satıcı və alıcı operatorun 
                təlimatlarına uyğun olaraq sənədləri təqdim etməlidirlər. Prosedur 1-3 iş günü çəkir.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Elan qiymətləri nə qədərdir?</h3>
              <p className={styles.answer}>
                Standart elan - 15 AZN (10 gün), Gold elan - 30 AZN (20 gün), 
                Premium elan - 50 AZN (30 gün). Premium elanlar ən yuxarıda göstərilir və əlavə imkanlar təklif edir.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Nömrə məlumatları necə yoxlanılır?</h3>
              <p className={styles.answer}>
                Bütün nömrələr administrasiya tərəfindən yoxlanılır. Yanlış və ya saxta məlumatlar 
                saytdan silinir. Şikayət edə biləcəyiniz səhifə də mövcuddur.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>VIP nömrələr hansılardır?</h3>
              <p className={styles.answer}>
                777-77-77, 888-88-88, 999-99-99 kimi təkrar edilən rəqəmlər, 123-45-67 kimi ardıcıl 
                nömrələr və ya xüsusi kombinasiyalar VIP hesab edilir və daha yüksək qiymətə satılır.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Hansı operatorlarla işləyirsiniz?</h3>
              <p className={styles.answer}>
                Azərcell (050, 051, 055), Bakcell (070, 077), Nar Mobile (099) və Naxtel (012) 
                operatorlarının bütün nömrələri saytımızda mövcuddur.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Dəstək xidməti necə əlaqə saxlayım?</h3>
              <p className={styles.answer}>
                WhatsApp: +994 50 123 45 67, Telefon: +994 70 123 45 67, E-poçt: info@nomrezade.az 
                vasitəsilə 24/7 dəstək xidməti ilə əlaqə saxlaya bilərsiniz.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.question}>Nömrə qeydiyyatı pulludur?</h3>
              <p className={styles.answer}>
                Yox, saytda qeydiyyat tamamilə pulsuzdur. Yalnız elan yerləşdirərkən və ya premium 
                xidmətlərdən istifadə edərkən ödəniş tələb olunur.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sualınız var?</h2>
          <div className={styles.contactInfo}>
            <p>Cavabını tapa bilmədiyiniz sual varsa, bizimlə əlaqə saxlayın:</p>
            <div className={styles.contactMethods}>
              <div className={styles.contactMethod}>
                <span className={styles.contactIcon}>📞</span>
                <a href="tel:+994504444422" className={styles.contactLink}>+994 50 444 44 22</a>
              </div>
              <div className={styles.contactMethod}>
                <span className={styles.contactIcon}>💬</span>
                <a href="https://wa.me/994504444422" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>WhatsApp: +994 50 444 44 22</a>
              </div>
              <div className={styles.contactMethod}>
                <span className={styles.contactIcon}>📧</span>
                <a href="mailto:info@nomrezade.az" className={styles.contactLink}>info@nomrezade.az</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}
