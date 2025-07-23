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
  TrendingUp,
  Settings,
  Star,
  Crown,
  Gem,
  RefreshCw
} from 'lucide-react';

// Types
interface Listing {
  id: string;
  prefix: string;
  number: string;
  price: number;
  type: 'standard' | 'gold' | 'premium';
  contact_phone?: string;
  description: string | null;
  provider?: string;
  createdAt: string;
}

interface ParsedNumber {
  phoneNumber: string;
  operator: string;
  price: number;
  type: string;
  error?: string;
}

interface UploadResults {
  success: ParsedNumber[];
  totalNumbers: number;
  validNumbers: string[];
  invalidNumbers: string[];
  duplicateNumbers: string[];
  duplicates: ParsedNumber[];
  errors: ParsedNumber[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
  };
}

interface DashboardStats {
  totalListings: number;
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
  provider: '',
  createdAt: new Date().toISOString()
};

export default function AdminPage() {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Data
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
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
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'listings' | 'analytics' | 'bulk-upload'>('dashboard');
  
  // Bulk upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bulkUploadSettings, setBulkUploadSettings] = useState({
    defaultType: 'standard' as 'standard' | 'gold' | 'premium',
    defaultPrice: 50,
    contactPhone: '050-444-44-22'
  });
  const [uploadResults, setUploadResults] = useState<UploadResults | null>(null);



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
    }
  }, [isAuthenticated]);

  // Update stats when data changes
  useEffect(() => {
    if (listings.length > 0) {
      const totalListings = listings.length;
      const totalRevenue = listings.reduce((sum, l) => sum + l.price, 0);
      const premiumListings = listings.filter(l => l.type === 'premium').length;
      
      setStats({
        totalListings,
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
      // Use unified API endpoint
      const response = await fetch('/api/listings');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allListings = await response.json();
      setListings(allListings);
    } catch (error) {
      console.error('Error in fetchListings:', error);
      setError('Elanlar yüklənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };



  const handleSave = async () => {
    if (!currentListing) return;
    
    setIsLoading(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = '/api/listings';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentListing),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Saxlama zamanı xəta baş verdi');
      }

      const result = await response.json();
      
      if (isEditing) {
        // Update local state
        setListings(prev => prev.map(l => l.id === currentListing.id ? currentListing : l));
        alert('Elan uğurla yeniləndi! Dəyişikliklər Numbers səhifəsində də tətbiq olundu.');
      } else {
        // Add new listing to local state
        const newListing = result;
        setListings(prev => [...prev, newListing]);
        alert('Yeni elan uğurla əlavə edildi!');
      }
      
      closeModal();
      
      // Refresh the listings to show updated data
      await fetchListings();
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Saxlama zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/listings?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Silmə zamanı xəta baş verdi');
      }

      // Remove from local state
      setListings(prev => prev.filter(l => l.id !== id));
      alert('Elan uğurla silindi! Dəyişiklik Numbers səhifəsində də tətbiq olundu.');
      
      // Refresh the listings to show updated data
      await fetchListings();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Silmə zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
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
    
    let updatedListing = {
      ...currentListing,
      [name]: type === 'number' ? Number(value) : value
    };
    
    // Auto-set provider based on prefix
    if (name === 'prefix') {
      const prefixToProvider: { [key: string]: string } = {
        '010': 'Azercell',
        '050': 'Azercell', 
        '051': 'Azercell',
        '055': 'Bakcell',
        '060': 'Naxtel',
        '070': 'Nar Mobile',
        '077': 'Nar Mobile',
        '099': 'Bakcell'
      };
      
      updatedListing = { ...updatedListing, provider: prefixToProvider[value] || '' };
    }
    
    setCurrentListing(updatedListing);
  };

  // Bulk operations
  const handleSelectListing = (id: string) => {
    setSelectedListings(prev => 
      prev.includes(id) 
        ? prev.filter(listingId => listingId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedListings.length === filteredListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(filteredListings.map(l => l.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedListings.length === 0) return;
    
    if (!confirm(`${selectedListings.length} elanı silmək istədiyinizə əminsiniz?`)) return;
    
    setIsLoading(true);
    try {
      const deletePromises = selectedListings.map(id => 
        fetch(`/api/listings?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      
      // Update local state
      setListings(prev => prev.filter(l => !selectedListings.includes(l.id)));
      setSelectedListings([]);
      alert(`${selectedListings.length} elan uğurla silindi!`);
      
      // Refresh data
      await fetchListings();
    } catch (err) {
      console.error('Bulk delete error:', err);
      setError('Toplu silmə zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };



  const handleExportData = () => {
    const dataToExport = filteredListings.map(listing => ({
      'Nömrə': `${listing.prefix}-${listing.number}`,
      'Qiymət': `${listing.price} AZN`,
      'Tip': listing.type,
      'Operator': listing.provider,
      'Əlaqə': listing.contact_phone,
      'Təsvir': listing.description,
      'Yaradılma Tarixi': new Date(listing.createdAt).toLocaleDateString('az-AZ')
    }));
    
    const csv = [
      Object.keys(dataToExport[0] || {}).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `elanlar-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk upload functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResults(null); // Clear previous results
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('defaultType', bulkUploadSettings.defaultType);
      formData.append('defaultPrice', bulkUploadSettings.defaultPrice.toString());
      formData.append('contactPhone', bulkUploadSettings.contactPhone);
      
      const response = await fetch('/api/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fayl yükləmə zamanı xəta baş verdi');
      }
      
      const results = await response.json();
      setUploadResults(results);
      
      if (results.summary.valid > 0) {
        alert(`Fayl uğurla analiz edildi! ${results.summary.valid} keçərli nömrə tapıldı.`);
      } else {
        alert('Faylda keçərli nömrə tapılmadı.');
      }
      
    } catch (err) {
      console.error('Bulk upload error:', err);
      setError(err instanceof Error ? err.message : 'Fayl yükləmə zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBulkUpload = async () => {
    if (!uploadResults || uploadResults.success.length === 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/bulk-upload', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numbers: uploadResults.success,
          contactPhone: bulkUploadSettings.contactPhone
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nömrələri saxlama zamanı xəta baş verdi');
      }
      
      const result = await response.json();
      alert(`${result.count} nömrə uğurla əlavə edildi! Bütün səhifələrdə görünəcək.`);
      
      // Clear the upload results and refresh listings
      setUploadResults(null);
      setSelectedFile(null);
      await fetchListings();
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (err) {
      console.error('Bulk save error:', err);
      setError(err instanceof Error ? err.message : 'Nömrələri saxlama zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.number.includes(searchTerm) || 
      listing.prefix.includes(searchTerm) ||
      (listing.contact_phone && listing.contact_phone.includes(searchTerm));
    
    const matchesType = selectedType === '' || listing.type === selectedType;
    const matchesProvider = selectedProvider === '' || listing.provider === selectedProvider;
    
    return matchesSearch && matchesType && matchesProvider;
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
          <button 
            className={`${styles.phoneNavButton} ${activeSection === 'bulk-upload' ? styles.active : ''}`}
            onClick={() => setActiveSection('bulk-upload')}
          >
            <Plus size={20} />
            Toplu Yüklə
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
                  <div key={`activity-${listing.prefix}-${listing.number}-${listing.id}`} className={styles.phoneActivityItem}>
                    <div className={styles.phoneActivityIcon}>
                      {getTypeIcon(listing.type)}
                    </div>
                    <div className={styles.phoneActivityContent}>
                      <p>{listing.prefix}-{listing.number}</p>
                      <span>{listing.price} AZN</span>
                    </div>
                    <div className={styles.phoneActivityStatus}>
                      Aktiv
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
              
              <select 
                value={selectedProvider} 
                onChange={(e) => setSelectedProvider(e.target.value)}
                className={styles.phoneTypeSelect}
              >
                <option value="">Bütün operatorlar</option>
                <option value="Azercell">Azercell</option>
                <option value="Bakcell">Bakcell</option>
                <option value="Nar Mobile">Nar Mobile</option>
                <option value="Naxtel">Naxtel</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className={styles.phoneActionButtons}>
              <button 
                className={styles.phoneAddButton}
                onClick={() => openModal()}
              >
                <Plus size={20} />
                Yeni Elan Əlavə Et
              </button>
              
              <button 
                className={styles.phoneRefreshButton}
                onClick={fetchListings}
                disabled={isLoading}
              >
                <RefreshCw size={20} />
                Yenilə
              </button>
              
              <button 
                className={styles.phoneExportButton}
                onClick={handleExportData}
                disabled={filteredListings.length === 0}
              >
                <TrendingUp size={20} />
                Export CSV
              </button>
              
              {selectedListings.length > 0 && (
                <div className={styles.phoneBulkActions}>
                  <span className={styles.phoneSelectedCount}>
                    {selectedListings.length} seçildi
                  </span>
                  <button 
                    className={styles.phoneBulkDeleteButton}
                    onClick={handleBulkDelete}
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                    Seçilənləri Sil
                  </button>

                </div>
              )}
            </div>

            {/* Listings Summary */}
            <div className={styles.phoneListSummary}>
              <div className={styles.phoneSelectAllSection}>
                <label className={styles.phoneSelectAllLabel}>
                  <input
                    type="checkbox"
                    checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                    onChange={handleSelectAll}
                    className={styles.phoneSelectAllCheckbox}
                  />
                  <span>Hamısını seç</span>
                </label>
              </div>
              <div className={styles.phoneSummaryStats}>
                <span><strong>{filteredListings.length}</strong> elan tapıldı</span>
                <span><strong>{filteredListings.reduce((sum, l) => sum + l.price, 0)}</strong> AZN ümumi dəyər</span>
              </div>
            </div>

            {/* Listings List */}
            {isLoading ? (
              <div className={styles.phoneLoading}>Yüklənir...</div>
            ) : (
              <div className={styles.phoneNumbersList}>
                {filteredListings.map(listing => (
                  <div key={`listing-${listing.prefix}-${listing.number}-${listing.id}`} className={`${styles.phoneNumberCard} ${selectedListings.includes(listing.id) ? styles.selectedCard : ''}`}>
                    <div className={styles.phoneCardMain}>
                      <div className={styles.phoneCardCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={() => handleSelectListing(listing.id)}
                          className={styles.phoneListingCheckbox}
                        />
                      </div>
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
                      {listing.contact_phone && (
                        <div className={styles.phoneContactInfo}>
                          <Phone size={16} />
                          {listing.contact_phone}
                        </div>
                      )}
                      {listing.provider && (
                        <div className={styles.phoneProviderInfo}>
                          <Settings size={16} />
                          {listing.provider}
                        </div>
                      )}
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

        {/* Bulk Upload Section */}
        {activeSection === 'bulk-upload' && (
          <div className={styles.phoneBulkUpload}>
            <h3>Toplu Nömrə Yükləmə</h3>
            <div className={styles.phoneBulkUploadCard}>
              <div className={styles.phoneBulkUploadForm}>
                <div className={styles.phoneFormGroup}>
                  <label>Fayl Seçin (PDF, Excel, Word):</label>
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.docx,.txt"
                    onChange={handleFileSelect}
                    className={styles.phoneFileInput}
                  />
                </div>
                
                <div className={styles.phoneFormGroup}>
                  <label>Standart Tip:</label>
                  <select
                    value={bulkUploadSettings.defaultType}
                    onChange={(e) => setBulkUploadSettings(prev => ({...prev, defaultType: e.target.value as 'standard' | 'gold' | 'premium'}))}
                    className={styles.phoneSelect}
                  >
                    <option value="standard">Standard</option>
                    <option value="gold">Gold</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                
                <div className={styles.phoneFormGroup}>
                  <label>Standart Qiymət (AZN):</label>
                  <input
                    type="number"
                    value={bulkUploadSettings.defaultPrice}
                    onChange={(e) => setBulkUploadSettings(prev => ({...prev, defaultPrice: Number(e.target.value)}))}
                    className={styles.phoneInput}
                    placeholder="50"
                  />
                </div>
                
                <div className={styles.phoneFormGroup}>
                  <label>Əlaqə Nömrəsi:</label>
                  <input
                    type="text"
                    value={bulkUploadSettings.contactPhone}
                    onChange={(e) => setBulkUploadSettings(prev => ({...prev, contactPhone: e.target.value}))}
                    className={styles.phoneInput}
                    placeholder="050-444-44-22"
                  />
                </div>
                
                <button
                  onClick={handleBulkUpload}
                  disabled={!selectedFile || isLoading}
                  className={styles.phoneBulkUploadButton}
                >
                  {isLoading ? 'Yüklənir...' : 'Faylı Analiz Et'}
                </button>
              </div>
            </div>
            
            {/* Upload Results */}
            {uploadResults && (
              <div className={styles.phoneBulkResults}>
                <h4>Analiz Nəticələri</h4>
                <div className={styles.phoneResultsStats}>
                  <div className={styles.phoneResultStat}>
                    <span>Ümumi: {uploadResults.summary.total}</span>
                  </div>
                  <div className={styles.phoneResultStat}>
                    <span>Keçərli: {uploadResults.summary.valid}</span>
                  </div>
                  <div className={styles.phoneResultStat}>
                    <span>Səhv: {uploadResults.summary.invalid}</span>
                  </div>
                  <div className={styles.phoneResultStat}>
                    <span>Təkrar: {uploadResults.summary.duplicates}</span>
                  </div>
                </div>
                
                {uploadResults.success.length > 0 && (
                  <div className={styles.phoneResultsSection}>
                    <h5>Keçərli Nömrələr ({uploadResults.success.length})</h5>
                    <div className={styles.phoneResultsList}>
                      {uploadResults.success.slice(0, 10).map((number: ParsedNumber, index: number) => (
                        <div key={index} className={styles.phoneResultItem}>
                          <span>{number.phoneNumber}</span>
                          <span>{number.operator}</span>
                          <span>{number.price} AZN</span>
                          <span>{number.type}</span>
                        </div>
                      ))}
                      {uploadResults.success.length > 10 && (
                        <p>... və daha {uploadResults.success.length - 10} nömrə</p>
                      )}
                    </div>
                    
                    <button
                      onClick={handleConfirmBulkUpload}
                      disabled={isLoading}
                      className={styles.phoneConfirmButton}
                    >
                      {isLoading ? 'Saxlanılır...' : `${uploadResults.success.length} Nömrəni Saxla`}
                    </button>
                  </div>
                )}
                
                {uploadResults.errors.length > 0 && (
                  <div className={styles.phoneResultsSection}>
                    <h5>Səhvli Nömrələr ({uploadResults.errors.length})</h5>
                    <div className={styles.phoneResultsList}>
                      {uploadResults.errors.slice(0, 5).map((number: ParsedNumber, index: number) => (
                        <div key={index} className={styles.phoneResultItem + ' ' + styles.error}>
                          <span>{number.phoneNumber}</span>
                          <span>{number.error}</span>
                        </div>
                      ))}
                      {uploadResults.errors.length > 5 && (
                        <p>... və daha {uploadResults.errors.length - 5} səhv</p>
                      )}
                    </div>
                  </div>
                )}
                
                {uploadResults.duplicates.length > 0 && (
                  <div className={styles.phoneResultsSection}>
                    <h5>Təkrar Nömrələr ({uploadResults.duplicates.length})</h5>
                    <div className={styles.phoneResultsList}>
                      {uploadResults.duplicates.slice(0, 5).map((number: ParsedNumber, index: number) => (
                        <div key={index} className={styles.phoneResultItem + ' ' + styles.duplicate}>
                          <span>{number.phoneNumber}</span>
                          <span>Artıq mövcuddur</span>
                        </div>
                      ))}
                      {uploadResults.duplicates.length > 5 && (
                        <p>... və daha {uploadResults.duplicates.length - 5} təkrar</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className={styles.phoneModalOverlay}>
            <div className={styles.phoneModal}>
              <div className={styles.phoneModalHeader}>
                <div className={styles.phoneModalTitle}>
                  <h3>{isEditing ? 'Elanı Redaktə Et' : 'Yeni Elan Yarat'}</h3>

                </div>
                <button onClick={closeModal} className={styles.phoneModalClose}>
                  <X size={20} />
                </button>
              </div>
              
              <div className={styles.phoneModalContent}>
                <div className={styles.phoneFormGroup}>
                  <label>Prefix:</label>
                  <select
                    name="prefix"
                    value={currentListing.prefix}
                    onChange={handleModalChange}
                    className={styles.phoneSelect}
                  >
                    <option value="">Prefix seçin</option>
                    <option value="010">010 - Azercell</option>
                    <option value="050">050 - Azercell</option>
                    <option value="051">051 - Azercell</option>
                    <option value="055">055 - Bakcell</option>
                    <option value="060">060 - Naxtel</option>
                    <option value="070">070 - Nar Mobile</option>
                    <option value="077">077 - Nar Mobile</option>
                    <option value="099">099 - Bakcell</option>
                  </select>
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
                  <label>Operator:</label>
                  <input
                    type="text"
                    name="provider"
                    value={currentListing.provider || 'Prefix seçin'}
                    readOnly
                    className={`${styles.phoneInput} ${styles.phoneReadOnlyInput}`}
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#6c757d', fontSize: '12px' }}>Operator prefix-ə görə avtomatik seçilir</small>
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
