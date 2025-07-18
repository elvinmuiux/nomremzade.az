'use client';

import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  X, 
  BarChart3,
  Users,
  TrendingUp,
  Settings,
  Filter,
  MessageCircle,
  Star,
  Crown,
  Gem
} from 'lucide-react';

// Types
interface Listing {
  id: string;
  prefix: string;
  number: string;
  price: number;
  type: 'standard' | 'gold' | 'premium';
  contact_phone: string;
  description: string | null;
  is_sold: boolean;
  createdAt: string;
}

interface NumberAd {
  id: number | string;
  phoneNumber: string;
  price: number;
  contactPhone?: string;
  type?: string;
  isVip?: boolean;
  description?: string;
  provider?: string;
  prefix?: string;
  is_sold?: boolean;
}

interface DashboardStats {
  totalListings: number;
  soldListings: number;
  totalRevenue: number;
  premiumListings: number;
}

const EMPTY_LISTING: Listing = {
  id: '',
  prefix: '',
  number: '',
  price: 0,
  type: 'standard',
  contact_phone: '',
  description: null,
  is_sold: false,
  createdAt: new Date().toISOString()
};

export default function AdminPage() {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Data
  const [listings, setListings] = useState<Listing[]>([]);
  const [numberAds, setNumberAds] = useState<NumberAd[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    soldListings: 0,
    totalRevenue: 0,
    premiumListings: 0
  });
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState<Listing>(EMPTY_LISTING);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'listings' | 'analytics'>('dashboard');

  // Data file configurations
  const dataFiles = [
    { file: '010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
    { file: '050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
    { file: '051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
    { file: '055.json', key: 'azercellAds', provider: 'Azercell', prefix: '055' },
    { file: '060.json', key: 'narAds', provider: 'Nar Mobile', prefix: '060' },
    { file: '070.json', key: 'narAds', provider: 'Nar Mobile', prefix: '070' },
    { file: '077.json', key: 'narAds', provider: 'Nar Mobile', prefix: '077' },
    { file: '099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' }
  ];

  // Authentication check
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchListings();
      fetchAllNumbers();
    }
  }, [isAuthenticated]);

  // Update stats when data changes
  useEffect(() => {
    if (listings.length > 0) {
      const totalListings = listings.length;
      const soldListings = listings.filter(l => l.is_sold).length;
      const totalRevenue = listings.filter(l => l.is_sold).reduce((sum, l) => sum + l.price, 0);
      const premiumListings = listings.filter(l => l.type === 'premium').length;
      
      setStats({
        totalListings,
        soldListings,
        totalRevenue,
        premiumListings
      });
    }
  }, [listings]);

  const handleLogin = () => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      alert('Yanlış parol!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with real API call
      const mockListings: Listing[] = [
        {
          id: '1',
          prefix: '050',
          number: '1234567',
          price: 100,
          type: 'premium',
          contact_phone: '0501234567',
          description: 'Premium nömrə',
          is_sold: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          prefix: '055',
          number: '9876543',
          price: 50,
          type: 'gold',
          contact_phone: '0559876543',
          description: 'Gold nömrə',
          is_sold: true,
          createdAt: new Date().toISOString()
        }
      ];
      setListings(mockListings);
    } catch (err) {
      setError('Elanlar yüklənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllNumbers = async () => {
    setIsLoading(true);
    try {
      const allNumbers: NumberAd[] = [];
      
      for (const config of dataFiles) {
        try {
          const response = await fetch(`/data/${config.file}`);
          if (response.ok) {
            const data = await response.json();
            const numbers = data[config.key] || [];
            const processedNumbers = numbers.map((num: any) => ({
              ...num,
              provider: config.provider,
              prefix: config.prefix,
              id: `${config.prefix}-${num.id || Math.random()}`
            }));
            allNumbers.push(...processedNumbers);
          }
        } catch (error) {
          console.error(`Error loading ${config.file}:`, error);
        }
      }
      
      setNumberAds(allNumbers);
    } catch (err) {
      setError('Nömrələr yüklənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentListing) return;
    
    setIsLoading(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/listings/${currentListing.id}` : '/api/listings';
      
      // Mock save - replace with real API call
      console.log('Saving listing:', { method, url, body: currentListing });
      
      if (isEditing) {
        setListings(prev => prev.map(l => l.id === currentListing.id ? currentListing : l));
      } else {
        const newListing = { ...currentListing, id: Date.now().toString() };
        setListings(prev => [...prev, newListing]);
      }
      
      alert('Elan uğurla saxlandı!');
      closeModal();
    } catch (err) {
      setError('Saxlama zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz?')) return;
    
    try {
      // Mock delete - replace with real API call
      setListings(prev => prev.filter(l => l.id !== id));
      alert('Elan silindi!');
    } catch (err) {
      setError('Silmə zamanı xəta baş verdi');
    }
  };

  const openModal = (listing: Listing | null = null) => {
    if (listing) {
      setCurrentListing(listing);
      setIsEditing(true);
    } else {
      setCurrentListing(EMPTY_LISTING);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentListing(EMPTY_LISTING);
    setIsEditing(false);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setCurrentListing(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.number.includes(searchTerm) || 
      listing.prefix.includes(searchTerm) ||
      listing.contact_phone.includes(searchTerm);
    
    const matchesType = selectedType === '' || listing.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'premium': return <Crown className={styles.typeIcon} />;
      case 'gold': return <Gem className={styles.typeIcon} />;
      default: return <Star className={styles.typeIcon} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'premium': return '#8B5CF6';
      case 'gold': return '#C69F32';
      default: return '#6B7280';
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <PageTemplate>
        <div className={styles.phoneContainer}>
          <div className={styles.phoneHeader}>
            <h1>Admin Paneli</h1>
          </div>
          <div className={styles.phoneLoginCard}>
            <div className={styles.phoneLoginForm}>
              <input
                type="password"
                placeholder="Parol daxil edin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className={styles.phoneInput}
              />
              <button onClick={handleLogin} className={styles.phoneLoginButton}>
                Daxil ol
              </button>
            </div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className={styles.phoneContainer}>
        {/* Header */}
        <div className={styles.phoneHeader}>
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className={styles.phoneLogoutButton}>
            Çıxış
          </button>
        </div>

        {/* Navigation */}
        <div className={styles.phoneNavigation}>
          <button 
            className={`${styles.phoneNavButton} ${activeSection === 'dashboard' ? styles.active : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>
          <button 
            className={`${styles.phoneNavButton} ${activeSection === 'listings' ? styles.active : ''}`}
            onClick={() => setActiveSection('listings')}
          >
            <Phone size={20} />
            Elanlar
          </button>
          <button 
            className={`${styles.phoneNavButton} ${activeSection === 'analytics' ? styles.active : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            <TrendingUp size={20} />
            Analitika
          </button>
        </div>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className={styles.phoneDashboard}>
            <div className={styles.phoneStatsGrid}>
              <div className={styles.phoneStatCard}>
                <div className={styles.phoneStatIcon}>
                  <Phone size={24} />
                </div>
                <div className={styles.phoneStatContent}>
                  <h3>Ümumi Elanlar</h3>
                  <p className={styles.phoneStatNumber}>{stats.totalListings}</p>
                </div>
              </div>
              
              <div className={styles.phoneStatCard}>
                <div className={styles.phoneStatIcon}>
                  <Users size={24} />
                </div>
                <div className={styles.phoneStatContent}>
                  <h3>Satılan Elanlar</h3>
                  <p className={styles.phoneStatNumber}>{stats.soldListings}</p>
                </div>
              </div>
              
              <div className={styles.phoneStatCard}>
                <div className={styles.phoneStatIcon}>
                  <TrendingUp size={24} />
                </div>
                <div className={styles.phoneStatContent}>
                  <h3>Ümumi Gəlir</h3>
                  <p className={styles.phoneStatNumber}>{stats.totalRevenue} AZN</p>
                </div>
              </div>
              
              <div className={styles.phoneStatCard}>
                <div className={styles.phoneStatIcon}>
                  <Crown size={24} />
                </div>
                <div className={styles.phoneStatContent}>
                  <h3>Premium Elanlar</h3>
                  <p className={styles.phoneStatNumber}>{stats.premiumListings}</p>
                </div>
              </div>
            </div>

            <div className={styles.phoneRecentActivity}>
              <h3>Son Fəaliyyətlər</h3>
              <div className={styles.phoneActivityList}>
                {listings.slice(0, 5).map(listing => (
                  <div key={listing.id} className={styles.phoneActivityItem}>
                    <div className={styles.phoneActivityIcon}>
                      {getTypeIcon(listing.type)}
                    </div>
                    <div className={styles.phoneActivityContent}>
                      <p>{listing.prefix}-{listing.number}</p>
                      <span>{listing.price} AZN</span>
                    </div>
                    <div className={styles.phoneActivityStatus}>
                      {listing.is_sold ? 'Satıldı' : 'Aktiv'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Listings Section */}
        {activeSection === 'listings' && (
          <div className={styles.phoneListings}>
            {/* Search and Filters */}
            <div className={styles.phoneFilters}>
              <div className={styles.phoneSearchContainer}>
                <Search size={18} className={styles.phoneSearchIcon} />
                <input
                  type="text"
                  placeholder="Nömrə axtar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.phoneSearchInput}
                />
                {searchTerm && (
                  <X 
                    size={18} 
                    className={styles.phoneClearIcon}
                    onClick={() => setSearchTerm('')}
                  />
                )}
              </div>
              
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.phoneTypeSelect}
              >
                <option value="">Bütün tiplər</option>
                <option value="standard">Standard</option>
                <option value="gold">Gold</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            {/* Add Button */}
            <button 
              className={styles.phoneAddButton}
              onClick={() => openModal()}
            >
              <Plus size={20} />
              Yeni Elan Əlavə Et
            </button>

            {/* Listings Summary */}
            <div className={styles.phoneListSummary}>
              {filteredListings.length} elan tapıldı
            </div>

            {/* Listings List */}
            {isLoading ? (
              <div className={styles.phoneLoading}>Yüklənir...</div>
            ) : (
              <div className={styles.phoneNumbersList}>
                {filteredListings.map(listing => (
                  <div key={listing.id} className={styles.phoneNumberCard}>
                    <div className={styles.phoneCardMain}>
                      <div className={styles.phoneNumberInfo}>
                        <div className={styles.phoneNumberText}>
                          {listing.prefix}-{listing.number}
                        </div>
                        <div 
                          className={styles.phoneTypeTag}
                          style={{ backgroundColor: getTypeColor(listing.type) }}
                        >
                          {getTypeIcon(listing.type)}
                          {listing.type}
                        </div>
                      </div>
                      <div className={styles.phonePriceText}>
                        {listing.price} AZN
                      </div>
                    </div>
                    
                    <div className={styles.phoneCardDetails}>
                      <div className={styles.phoneContactInfo}>
                        <Phone size={16} />
                        {listing.contact_phone}
                      </div>
                      {listing.description && (
                        <div className={styles.phoneDescription}>
                          {listing.description}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.phoneCardActions}>
                      <button 
                        className={`${styles.phoneActionBtn} ${styles.edit}`}
                        onClick={() => openModal(listing)}
                      >
                        <Edit size={16} />
                        Redaktə
                      </button>
                      <button 
                        className={`${styles.phoneActionBtn} ${styles.delete}`}
                        onClick={() => handleDelete(listing.id)}
                      >
                        <Trash2 size={16} />
                        Sil
                      </button>
                    </div>
                    
                    {listing.is_sold && (
                      <div className={styles.phoneSoldOverlay}>
                        SATILDI
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div className={styles.phoneAnalytics}>
            <h3>Analitika (Tezliklə)</h3>
            <p>Bu bölmə tezliklə əlavə ediləcək...</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className={styles.phoneModalOverlay}>
            <div className={styles.phoneModal}>
              <div className={styles.phoneModalHeader}>
                <h3>{isEditing ? 'Elanı Redaktə Et' : 'Yeni Elan Yarat'}</h3>
                <button onClick={closeModal} className={styles.phoneModalClose}>
                  <X size={20} />
                </button>
              </div>
              
              <div className={styles.phoneModalContent}>
                <div className={styles.phoneFormGroup}>
                  <label>Prefix:</label>
                  <input
                    type="text"
                    name="prefix"
                    value={currentListing.prefix}
                    onChange={handleModalChange}
                    className={styles.phoneInput}
                  />
                </div>
                
                <div className={styles.phoneFormGroup}>
                  <label>Nömrə:</label>
                  <input
                    type="text"
                    name="number"
                    value={currentListing.number}
                    onChange={handleModalChange}
                    className={styles.phoneInput}
                  />
                </div>
                
                <div className={styles.phoneFormGroup}>
                  <label>Qiymət (AZN):</label>
                  <input
                    type="number"
                    name="price"
                    value={currentListing.price}
                    onChange={handleModalChange}
                    className={styles.phoneInput}
                  />
                </div>
                
                <div className={styles.phoneFormGroup}>
                  <label>Tip:</label>
                  <select
                    name="type"
                    value={currentListing.type}
                    onChange={handleModalChange}
                    className={styles.phoneSelect}
                  >
                    <option value="standard">Standard</option>
                    <option value="gold">Gold</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                
                <div className={styles.phoneFormGroup}>
                  <label>Əlaqə Telefonu:</label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={currentListing.contact_phone}
                    onChange={handleModalChange}
                    className={styles.phoneInput}
                  />
                </div>
                
                <div className={styles.phoneFormGroup}>
                  <label>Açıqlama:</label>
                  <textarea
                    name="description"
                    value={currentListing.description || ''}
                    onChange={handleModalChange}
                    className={styles.phoneTextarea}
                    rows={3}
                  />
                </div>
                
                <div className={styles.phoneFormGroup}>
                  <label className={styles.phoneCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={currentListing.is_sold}
                      onChange={(e) => setCurrentListing(prev => ({ ...prev, is_sold: e.target.checked }))}
                    />
                    Satıldı
                  </label>
                </div>
              </div>
              
              <div className={styles.phoneModalActions}>
                <button onClick={closeModal} className={styles.phoneCancelButton}>
                  Ləğv et
                </button>
                <button onClick={handleSave} className={styles.phoneSaveButton} disabled={isLoading}>
                  {isLoading ? 'Saxlanır...' : 'Saxla'}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.phoneErrorMessage}>
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}
