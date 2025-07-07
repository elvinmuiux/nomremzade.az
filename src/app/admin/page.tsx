'use client';

import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import SecureDatabase from '@/lib/database';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isPremium: boolean;
  createdAt: string;
}

interface PremiumAd {
  id: string;
  userId: string;
  phoneNumber: string;
  operator: string;
  price: number;
  contactPhone: string;
  whatsappNumber?: string;
  description?: string;
  adType: 'premium' | 'gold' | 'standard';
  status: 'active' | 'expired' | 'deleted';
  createdAt: string;
  expiresAt: string;
  views: number;
  featured: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [ads, setAds] = useState<PremiumAd[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredAds, setFilteredAds] = useState<PremiumAd[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [adSearchTerm, setAdSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingAd, setEditingAd] = useState<PremiumAd | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAds: 0,
    activeAds: 0,
    premiumUsers: 0
  });

  useEffect(() => {
    // Check if already authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = () => {
    if (password === '04062022Ms') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      loadData();
    } else {
      alert('Şifrə səhvdir!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  const loadData = () => {
    const allUsers = SecureDatabase.getAllUsers();
    const allAds = SecureDatabase.getAllAds();
    
    setUsers(allUsers);
    setAds(allAds);
    setFilteredUsers(allUsers);
    setFilteredAds(allAds);
    
    setStats({
      totalUsers: allUsers.length,
      totalAds: allAds.length,
      activeAds: allAds.filter((ad: PremiumAd) => ad.status === 'active').length,
      premiumUsers: allUsers.filter((user: User) => user.isPremium).length
    });
  };

  const addTestData = () => {
    // Sample test users
    const testUsers = [
      {
        id: 'user_test_001',
        name: 'Əli Məmmədov',
        email: 'ali@test.com',
        phone: '0504444422',
        password: '123456',
        isPremium: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_test_002', 
        name: 'Aysel Həsənova',
        email: 'aysel@test.com',
        phone: '0554443322',
        password: '123456',
        isPremium: true,
        createdAt: new Date().toISOString()
      }
    ];

    // Sample premium ads
    const testAds = [
      {
        id: 'ad_test_001',
        userId: 'user_test_001',
        phoneNumber: '055 266 63 66',
        operator: 'azercell',
        price: 150,
        contactPhone: '0504444422',
        whatsappNumber: '0504444422',
        description: 'Gözəl və asan yadda qalan nömrə',
        adType: 'premium' as const,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        views: 45,
        featured: true
      },
      {
        id: 'ad_test_002',
        userId: 'user_test_002',
        phoneNumber: '070 777 77 77',
        operator: 'nar-mobile',
        price: 300,
        contactPhone: '0554443322',
        whatsappNumber: '0554443322',
        description: 'Premium 7li nömrə - çox xüsusi',
        adType: 'premium' as const,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        views: 78,
        featured: true
      },
      {
        id: 'ad_test_003',
        userId: 'user_test_001',
        phoneNumber: '050 555 55 55',
        operator: 'bakcell',
        price: 200,
        contactPhone: '0504444422',
        description: '5li nömrə - VIP',
        adType: 'gold' as const,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        views: 32,
        featured: false
      }
    ];

    // Save test data
    testUsers.forEach(user => SecureDatabase.saveUser(user));
    testAds.forEach(ad => SecureDatabase.savePremiumAd(ad));
    
    alert('Test verilər əlavə edildi!');
    loadData(); // Refresh data
  };

  // Search and filter functions
  const handleUserSearch = (searchTerm: string) => {
    setUserSearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAdSearch = (searchTerm: string) => {
    setAdSearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredAds(ads);
    } else {
      const filtered = ads.filter(ad => 
        ad.phoneNumber.includes(searchTerm) ||
        ad.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.contactPhone.includes(searchTerm)
      );
      setFilteredAds(filtered);
    }
  };

  // Edit functions
  const startEditUser = (user: User) => {
    setEditingUser({ ...user });
  };

  const startEditAd = (ad: PremiumAd) => {
    setEditingAd({ ...ad });
  };

  const saveUserEdit = () => {
    if (editingUser) {
      // Get the original user with password
      const originalUser = SecureDatabase.getUserById(editingUser.id);
      if (originalUser) {
        const updatedUser = {
          ...originalUser,
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone
        };
        SecureDatabase.saveUser(updatedUser);
        setEditingUser(null);
        loadData();
        alert('İstifadəçi məlumatları yeniləndi!');
      }
    }
  };

  const saveAdEdit = () => {
    if (editingAd) {
      SecureDatabase.savePremiumAd(editingAd);
      setEditingAd(null);
      loadData();
      alert('Elan məlumatları yeniləndi!');
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditingAd(null);
  };

  const deleteUser = (userId: string) => {
    if (confirm('Bu istifadəçini silmək istediyinizə əminsiniz?')) {
      const success = SecureDatabase.deleteUser(userId);
      if (success) {
        alert('İstifadəçi uğurla silindi!');
        loadData(); // Refresh the data
      } else {
        alert('İstifadəçi silinərkən xəta baş verdi!');
      }
    }
  };

  const deleteAd = (adId: string) => {
    if (confirm('Bu elanı silmək istədiyinizə əminsiniz?')) {
      const success = SecureDatabase.deleteAd(adId);
      if (success) {
        alert('Elan uğurla silindi!');
        loadData(); // Refresh the data
      } else {
        alert('Elan silinərkən xəta baş verdi!');
      }
    }
  };

  // Helper function to highlight search terms
  const highlightSearchTerm = (text: string, searchTerm: string, isNumber: boolean = false) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <span 
            key={index} 
            className={`${styles.highlighted} ${isNumber ? styles.number : ''}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (!isAuthenticated) {
    return (
      <PageTemplate>
        <div className={styles.loginContainer}>
          <div className={styles.loginBox}>
            <h1>Admin Girişi</h1>
            <input
              type="password"
              placeholder="Admin şifresi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className={styles.passwordInput}
            />
            <button onClick={handleLogin} className={styles.loginButton}>
              Giriş Et
            </button>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className={styles.adminContainer}>
        <div className={styles.header}>
          <h1>Admin Panel</h1>
          <div className={styles.headerButtons}>
            <button onClick={addTestData} className={styles.testDataButton}>
              Test Verilər Əlavə Et
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Çıkış Et
            </button>
          </div>
        </div>

        {/* İstatistikler */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Toplam İstifadəçi</h3>
            <p className={styles.statNumber}>{stats.totalUsers}</p>
            {userSearchTerm && (
              <small>Axtarış: {filteredUsers.length} nəticə</small>
            )}
          </div>
          <div className={styles.statCard}>
            <h3>Toplam Elan</h3>
            <p className={styles.statNumber}>{stats.totalAds}</p>
            {adSearchTerm && (
              <small>Axtarış: {filteredAds.length} nəticə</small>
            )}
          </div>
          <div className={styles.statCard}>
            <h3>Aktif Elan</h3>
            <p className={styles.statNumber}>{stats.activeAds}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Premium İstifadəçi</h3>
            <p className={styles.statNumber}>{stats.premiumUsers}</p>
          </div>
        </div>

        {/* İstifadəçilər */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>İstifadəçilər</h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="İstifadəçi axtarın (ad, email, telefon nömrəsi)..."
                value={userSearchTerm}
                onChange={(e) => handleUserSearch(e.target.value)}
                className={styles.searchInput}
              />
              {userSearchTerm && (
                <button
                  onClick={() => handleUserSearch('')}
                  className={styles.clearButton}
                  title="Axtarışı təmizlə"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Premium</th>
                  <th>Qeydiyyat Tarixi</th>
                  <th>İşləmlər</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      {editingUser && editingUser.id === user.id ? (
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                          className={styles.editInput}
                          placeholder="Ad"
                        />
                      ) : (
                        <span>{highlightSearchTerm(user.name, userSearchTerm)}</span>
                      )}
                    </td>
                    <td>
                      {editingUser && editingUser.id === user.id ? (
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                          className={styles.editInput}
                          placeholder="Email"
                        />
                      ) : (
                        <span>{highlightSearchTerm(user.email, userSearchTerm)}</span>
                      )}
                    </td>
                    <td>
                      {editingUser && editingUser.id === user.id ? (
                        <input
                          type="text"
                          value={editingUser.phone}
                          onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                          className={styles.editInput}
                          placeholder="Telefon"
                        />
                      ) : (
                        <span>{highlightSearchTerm(user.phone, userSearchTerm, true)}</span>
                      )}
                    </td>
                    <td>{user.isPremium ? '✅' : '❌'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        {editingUser && editingUser.id === user.id ? (
                          <>
                            <button onClick={saveUserEdit} className={styles.saveButton}>Yadda saxla</button>
                            <button onClick={cancelEdit} className={styles.cancelButton}>Ləğv et</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEditUser(user)} className={styles.editButton}>Düzəlt</button>
                            <button onClick={() => deleteUser(user.id)} className={styles.deleteButton}>Sil</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* İlanlar */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Elanlar</h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Elan axtarın (telefon nömrəsi, operator, əlaqə nömrəsi)..."
                value={adSearchTerm}
                onChange={(e) => handleAdSearch(e.target.value)}
                className={styles.searchInput}
              />
              {adSearchTerm && (
                <button
                  onClick={() => handleAdSearch('')}
                  className={styles.clearButton}
                  title="Axtarışı təmizlə"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nömrə</th>
                  <th>Operator</th>
                  <th>Qiymət</th>
                  <th>Əlaqə Telefonu</th>
                  <th>Tip</th>
                  <th>Durum</th>
                  <th>Görüntülənmə</th>
                  <th>İşləmlər</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map(ad => (
                  <tr key={ad.id}>
                    <td>
                      {editingAd && editingAd.id === ad.id ? (
                        <input
                          type="text"
                          value={editingAd.phoneNumber}
                          onChange={(e) => setEditingAd({...editingAd, phoneNumber: e.target.value})}
                          className={styles.editInput}
                          placeholder="Telefon nömrəsi"
                        />
                      ) : (
                        <span>{highlightSearchTerm(ad.phoneNumber, adSearchTerm, true)}</span>
                      )}
                    </td>
                    <td>
                      {editingAd && editingAd.id === ad.id ? (
                        <select
                          value={editingAd.operator}
                          onChange={(e) => setEditingAd({...editingAd, operator: e.target.value})}
                          className={styles.editSelect}
                          title="Operator seçin"
                        >
                          <option value="azercell">Azercell</option>
                          <option value="bakcell">Bakcell</option>
                          <option value="nar-mobile">Nar Mobile</option>
                          <option value="naxtel">Naxtel</option>
                        </select>
                      ) : (
                        <span>{highlightSearchTerm(ad.operator, adSearchTerm)}</span>
                      )}
                    </td>
                    <td>
                      {editingAd && editingAd.id === ad.id ? (
                        <input
                          type="number"
                          value={editingAd.price}
                          onChange={(e) => setEditingAd({...editingAd, price: parseFloat(e.target.value) || 0})}
                          className={styles.editInput}
                          placeholder="Qiymət"
                        />
                      ) : (
                        `${ad.price} AZN`
                      )}
                    </td>
                    <td>
                      {editingAd && editingAd.id === ad.id ? (
                        <input
                          type="text"
                          value={editingAd.contactPhone}
                          onChange={(e) => setEditingAd({...editingAd, contactPhone: e.target.value})}
                          className={styles.editInput}
                          placeholder="Əlaqə telefonu"
                        />
                      ) : (
                        <span>{highlightSearchTerm(ad.contactPhone, adSearchTerm, true)}</span>
                      )}
                    </td>
                    <td>{ad.adType}</td>
                    <td>
                      {editingAd && editingAd.id === ad.id ? (
                        <select
                          value={editingAd.status}
                          onChange={(e) => setEditingAd({...editingAd, status: e.target.value as 'active' | 'expired' | 'deleted'})}
                          className={styles.editSelect}
                          title="Status seçin"
                        >
                          <option value="active">Aktiv</option>
                          <option value="expired">Müddəti bitmiş</option>
                          <option value="deleted">Silinmiş</option>
                        </select>
                      ) : (
                        ad.status
                      )}
                    </td>
                    <td>{ad.views}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        {editingAd && editingAd.id === ad.id ? (
                          <>
                            <button onClick={saveAdEdit} className={styles.saveButton}>Yadda saxla</button>
                            <button onClick={cancelEdit} className={styles.cancelButton}>Ləğv et</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEditAd(ad)} className={styles.editButton}>Düzəlt</button>
                            <button onClick={() => deleteAd(ad.id)} className={styles.deleteButton}>Sil</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
