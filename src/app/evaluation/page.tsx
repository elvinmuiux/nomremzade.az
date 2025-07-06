'use client';

import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

interface FeedbackData {
  name: string;
  email: string;
  phone: string;
  rating: string;
  feedbackType: string;
  subject: string;
  message: string;
  date: string;
}

export default function EvaluationPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  const loadFeedbacks = () => {
    // Load feedbacks from localStorage
    const storedFeedbacks = localStorage.getItem('feedbacks');
    if (storedFeedbacks) {
      const allFeedbacks = JSON.parse(storedFeedbacks);
      setFeedbacks(allFeedbacks);
      setTotalFeedbacks(allFeedbacks.length);

      // Calculate average rating
      const ratingsOnly = allFeedbacks.filter((f: FeedbackData) => f.rating && f.rating !== '');
      if (ratingsOnly.length > 0) {
        const sum = ratingsOnly.reduce((acc: number, f: FeedbackData) => acc + parseInt(f.rating), 0);
        setAverageRating(sum / ratingsOnly.length);
      }
    } else {
      setFeedbacks([]);
      setTotalFeedbacks(0);
      setAverageRating(0);
    }
  };

  useEffect(() => {
    loadFeedbacks();

    // Set width for rating bars after component mounts
    setTimeout(() => {
      const bars = document.querySelectorAll('[data-percentage]');
      bars.forEach((bar) => {
        const percentage = bar.getAttribute('data-percentage');
        if (percentage) {
          (bar as HTMLElement).style.width = `${percentage}%`;
        }
      });
    }, 100);
  }, []);

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach(feedback => {
      if (feedback.rating && feedback.rating !== '') {
        const rating = parseInt(feedback.rating);
        if (rating >= 1 && rating <= 5) {
          distribution[rating as keyof typeof distribution]++;
        }
      }
    });
    return distribution;
  };

  const getFeedbackTypeDistribution = () => {
    const distribution: { [key: string]: number } = {};
    feedbacks.forEach(feedback => {
      const type = feedback.feedbackType;
      distribution[type] = (distribution[type] || 0) + 1;
    });
    return distribution;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'suggestion': return 'Təklif';
      case 'complaint': return 'İrad/Şikayət';
      case 'bug': return 'Texniki Problem';
      case 'general': return 'Ümumi Rəy';
      case 'other': return 'Digər';
      default: return type;
    }
  };

  const ratingDistribution = getRatingDistribution();
  const typeDistribution = getFeedbackTypeDistribution();

  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.evaluationPage}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>Saytın Ümumi Qiymətləndirməsi</h1>
          <p className={styles.pageDescription}>
            İstifadəçilərimizin rəy və qiymətləndirmələri əsasında saytımızın ümumi vəziyyəti
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.overviewCards}>
            <div className={styles.overviewCard}>
              <div className={styles.cardIcon}>📊</div>
              <h3>Ümumi Qiymət</h3>
              <div className={styles.rating}>
                <span className={styles.ratingNumber}>{averageRating.toFixed(1)}</span>
                <div className={styles.stars}>
                  {'⭐'.repeat(Math.round(averageRating))}
                </div>
              </div>
            </div>
            
            <div className={styles.overviewCard}>
              <div className={styles.cardIcon}>💬</div>
              <h3>Cəmi Feedback</h3>
              <div className={styles.statNumber}>{totalFeedbacks}</div>
            </div>
            
            <div className={styles.overviewCard}>
              <div className={styles.cardIcon}>👥</div>
              <h3>Aktiv İstifadəçilər</h3>
              <div className={styles.statNumber}>{feedbacks.filter(f => f.rating && parseInt(f.rating) >= 4).length}</div>
              <small>4+ ulduz verənlər</small>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Qiymətləndirmə Paylanması</h2>
          <div className={styles.ratingChart}>
            {[5, 4, 3, 2, 1].map(rating => {
              const percentage = totalFeedbacks > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / totalFeedbacks) * 100 : 0;
              return (
                <div key={rating} className={styles.ratingRow}>
                  <span className={styles.ratingLabel}>
                    {rating} ⭐
                  </span>
                  <div className={styles.ratingBar}>
                    <div 
                      className={styles.ratingFill}
                      data-percentage={percentage}
                    ></div>
                  </div>
                  <span className={styles.ratingCount}>
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Feedback Növləri</h2>
          <div className={styles.typeStats}>
            {Object.entries(typeDistribution).map(([type, count]) => (
              <div key={type} className={styles.typeStat}>
                <div className={styles.typeLabel}>{getTypeLabel(type)}</div>
                <div className={styles.typeCount}>{count}</div>
                <div className={styles.typePercentage}>
                  {totalFeedbacks > 0 ? Math.round((count / totalFeedbacks) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Bütün İstifadəçi Rəyləri</h2>
          <div className={styles.allFeedbacks}>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <div key={index} className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    <h4>{feedback.subject}</h4>
                    <div className={styles.feedbackMeta}>
                      <span className={styles.feedbackType}>{getTypeLabel(feedback.feedbackType)}</span>
                      {feedback.rating && (
                        <span className={styles.feedbackRating}>
                          {'⭐'.repeat(parseInt(feedback.rating))}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={styles.feedbackMessage}>{feedback.message}</p>
                  <div className={styles.feedbackFooter}>
                    <span>- {feedback.name}</span>
                    <span>{feedback.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noFeedbacks}>
                <p>Hələ ki heç bir rəy yazılmayıb. İlk rəyi siz yazın!</p>
                <a href="/feedback" className={styles.feedbackLink}>Rəy yaz</a>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}
