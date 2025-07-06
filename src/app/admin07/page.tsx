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

interface DailyVisitorData {
  date: string;
  count: number;
  uniqueVisitors: string[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [showStats, setShowStats] = useState(true);
  const [dailyVisitors, setDailyVisitors] = useState(0);
  const [totalVisitorsThisWeek, setTotalVisitorsThisWeek] = useState(0);

  // Admin girişi üçün sadə şifrə (production-da daha təhlükəsiz olmalıdır)
  const ADMIN_PASSWORD = '04062022Ms';

  const loadFeedbacks = () => {
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
      } else {
        setAverageRating(0);
      }
    } else {
      setFeedbacks([]);
      setTotalFeedbacks(0);
      setAverageRating(0);
    }
  };

  const loadVisitorStats = () => {
    const visitorsData = localStorage.getItem('daily_visitors');
    if (visitorsData) {
      const parsedData: { [key: string]: DailyVisitorData } = JSON.parse(visitorsData);
      const today = new Date().toDateString();
      
      // Get today's visitors
      const todayData = parsedData[today];
      setDailyVisitors(todayData ? todayData.count : 0);
      
      // Calculate this week's visitors (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      let weeklyTotal = 0;
      Object.values(parsedData).forEach((data: DailyVisitorData) => {
        const dataDate = new Date(data.date);
        if (dataDate >= weekAgo) {
          weeklyTotal += data.count;
        }
      });
      setTotalVisitorsThisWeek(weeklyTotal);
    } else {
      setDailyVisitors(0);
      setTotalVisitorsThisWeek(0);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      loadFeedbacks();
      loadVisitorStats();
    } else {
      alert('Yanlış şifrə! Zəhmət olmasa yenidən cəhd edin.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const deleteFeedback = (indexToDelete: number) => {
    if (confirm('Bu rəyi silmək istədiyinizə əminsiniz?')) {
      const updatedFeedbacks = feedbacks.filter((_, index) => index !== indexToDelete);
      localStorage.setItem('feedbacks', JSON.stringify(updatedFeedbacks));
      loadFeedbacks(); // Reload all data
      loadVisitorStats(); // Reload visitor stats
      alert('Rəy uğurla silindi!');
    }
  };

  const clearAllFeedbacks = () => {
    if (confirm('XƏBƏRDARLIQ: Bütün rəyləri silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz!')) {
      if (confirm('Son təsdiq: Həqiqətən bütün rəyləri silmək istəyirsiniz?')) {
        localStorage.removeItem('feedbacks');
        loadFeedbacks();
        loadVisitorStats();
        alert('Bütün rəylər uğurla silindi!');
      }
    }
  };

  const exportFeedbacks = () => {
    if (feedbacks.length === 0) {
      alert('Export etmək üçün rəy mövcud deyil!');
      return;
    }

    const dataStr = JSON.stringify(feedbacks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `feedbacks_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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

  const getFeedbackTypeDistribution = () => {
    const distribution: { [key: string]: number } = {};
    feedbacks.forEach(feedback => {
      const type = feedback.feedbackType;
      distribution[type] = (distribution[type] || 0) + 1;
    });
    return distribution;
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFeedbacks();
      loadVisitorStats();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <PageTemplate showTopNav={false}>
        <div className={styles.adminPage}>
          <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
              <h1 className={styles.loginTitle}>🔐 Admin Panel Girişi</h1>
              <p className={styles.loginDescription}>
                Sayt idarəetməsi üçün şifrənizi daxil edin
              </p>
              
              <form onSubmit={handleLogin} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.inputLabel}>
                    Admin Şifrəsi
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrənizi daxil edin"
                    className={styles.passwordInput}
                    required
                  />
                </div>
                
                <button type="submit" className={styles.loginButton}>
                  🚀 Giriş Et
                </button>
              </form>
              
              <div className={styles.loginInfo}>
                <p>🛡️ Bu səhifə yalnız administratorlar üçündür</p>
              </div>
            </div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  const typeDistribution = getFeedbackTypeDistribution();

  return (
    <PageTemplate showTopNav={false}>
      <div className={styles.adminPage}>
        {/* Header */}
        <section className={styles.adminHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.adminTitle}>⚡ Admin Panel</h1>
            <p className={styles.adminSubtitle}>Nomrezade.az Sayt İdarəetməsi</p>
            <button onClick={handleLogout} className={styles.logoutButton}>
              🚪 Çıxış Et
            </button>
          </div>
        </section>

        {/* Quick Stats */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statContent}>
                <h3>Cəmi Rəy</h3>
                <span className={styles.statNumber}>{totalFeedbacks}</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statContent}>
                <h3>Orta Qiymət</h3>
                <span className={styles.statNumber}>{averageRating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <h3>Məmnun Müştəri</h3>
                <span className={styles.statNumber}>
                  {feedbacks.filter(f => f.rating && parseInt(f.rating) >= 4).length}
                </span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🌟</div>
              <div className={styles.statContent}>
                <h3>Bugünkü Ziyarətçi</h3>
                <span className={styles.statNumber}>{dailyVisitors}</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📈</div>
              <div className={styles.statContent}>
                <h3>Həftəlik Ziyarətçi</h3>
                <span className={styles.statNumber}>{totalVisitorsThisWeek}</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statContent}>
                <h3>Bugünkü Tarix</h3>
                <span className={styles.statDate}>{new Date().toLocaleDateString('az-AZ')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Management Actions */}
        <section className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>⚙️ İdarəetmə Əməliyyatları</h2>
          <div className={styles.actionsGrid}>
            <button 
              onClick={() => setShowStats(!showStats)}
              className={styles.actionButton}
            >
              📈 {showStats ? 'Statistikaları Gizlə' : 'Statistikaları Göstər'}
            </button>
            
            <button 
              onClick={exportFeedbacks}
              className={styles.actionButton}
              disabled={totalFeedbacks === 0}
            >
              💾 Rəyləri Export Et
            </button>
            
            <button 
              onClick={() => window.open('/evaluation', '_blank')}
              className={styles.actionButton}
            >
              👁️ İstifadəçi Görünüşü
            </button>
            
            <button 
              onClick={clearAllFeedbacks}
              className={styles.dangerButton}
              disabled={totalFeedbacks === 0}
            >
              🗑️ Bütün Rəyləri Sil
            </button>
          </div>
        </section>

        {/* Detailed Stats */}
        {showStats && totalFeedbacks > 0 && (
          <section className={styles.detailedStats}>
            <h2 className={styles.sectionTitle}>📊 Ətraflı Statistikalar</h2>
            <div className={styles.typeDistribution}>
              {Object.entries(typeDistribution).map(([type, count]) => (
                <div key={type} className={styles.typeItem}>
                  <span className={styles.typeLabel}>{getTypeLabel(type)}</span>
                  <span className={styles.typeCount}>{count}</span>
                  <span className={styles.typePercentage}>
                    ({Math.round((count / totalFeedbacks) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Feedback Management */}
        <section className={styles.feedbackSection}>
          <h2 className={styles.sectionTitle}>💬 Rəy İdarəetməsi</h2>
          
          {totalFeedbacks === 0 ? (
            <div className={styles.noFeedbacks}>
              <p>📝 Hələ ki heç bir rəy mövcud deyil</p>
            </div>
          ) : (
            <div className={styles.feedbackList}>
              {feedbacks.map((feedback, index) => (
                <div key={index} className={styles.feedbackItem}>
                  <div className={styles.feedbackHeader}>
                    <h4 className={styles.feedbackSubject}>{feedback.subject}</h4>
                    <div className={styles.feedbackMeta}>
                      <span className={styles.feedbackType}>
                        {getTypeLabel(feedback.feedbackType)}
                      </span>
                      {feedback.rating && (
                        <span className={styles.feedbackRating}>
                          {'⭐'.repeat(parseInt(feedback.rating))}
                        </span>
                      )}
                      <button
                        onClick={() => deleteFeedback(index)}
                        className={styles.deleteButton}
                        title="Bu rəyi sil"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <p className={styles.feedbackMessage}>{feedback.message}</p>
                  
                  <div className={styles.feedbackFooter}>
                    <div className={styles.feedbackAuthor}>
                      <strong>{feedback.name}</strong>
                      {feedback.email && <span> • {feedback.email}</span>}
                      {feedback.phone && <span> • {feedback.phone}</span>}
                    </div>
                    <span className={styles.feedbackDate}>{feedback.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTemplate>
  );
}
