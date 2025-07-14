'use client';

import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

// Prisma modelinə uyğun tip. Verilənlər bazası hazır olduqda bu, avtomatik generasiya olunacaq.
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

const EMPTY_LISTING: Omit<Listing, 'id' | 'createdAt'> = {
  prefix: '',
  number: '',
  price: 0,
  type: 'standard',
  contact_phone: '',
  description: '',
  is_sold: false,
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Partial<Listing> | null>(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchListings();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === '04062022Ms') { 
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      alert('Şifrə səhvdir!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  // --- API Funksiyaları (Verilənlər bazası hazır olduqda doldurulacaq) ---

  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Bu hissə real API ilə əvəz olunacaq
      // const response = await fetch('/api/listings');
      // if (!response.ok) throw new Error('Məlumatları yükləmək alınmadı');
      // const data = await response.json();
      // setListings(data);
      console.log('Fetching listings (mocked)...');
      // Nümunə məlumatlar
      const mockListings: Listing[] = [
        {
          id: '1',
          prefix: '050',
          number: '1234567',
          price: 100,
          type: 'gold',
          contact_phone: '0501234567',
          description: 'Super nömrə',
          is_sold: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          prefix: '055',
          number: '7654321',
          price: 250,
          type: 'premium',
          contact_phone: '0557654321',
          description: 'Çox özəl nömrə',
          is_sold: true,
          createdAt: new Date().toISOString(),
        }
      ];
      setListings(mockListings);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Bilinməyən bir xəta baş verdi');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingListing) return;

    const method = 'id' in editingListing ? 'PUT' : 'POST';
    const url = 'id' in editingListing ? `/api/listings/${editingListing.id}` : '/api/listings';

    try {
      // TODO: Bu hissə real API ilə əvəz olunacaq
      console.log('Saving listing (mocked):', { method, url, body: editingListing });
      alert('Elan yadda saxlandı (simulyasiya)! Verilənlər bazası qoşulduqda bu, real olacaq.');
      closeModal();
      fetchListings(); // Siyahını yenilə
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Xəta: ${err.message}`);
      } else {
        alert('Bilinməyən bir xəta baş verdi');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz?')) return;

    try {
      // TODO: Bu hissə real API ilə əvəz olunacaq
      console.log('Deleting listing (mocked):', id);
      alert('Elan silindi (simulyasiya)!');
      fetchListings(); // Siyahını yenilə
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Xəta: ${err.message}`);
      } else {
        alert('Bilinməyən bir xəta baş verdi');
      }
    }
  };

  // --- Modal Funksiyaları ---

  const openModal = (listing: Listing | null = null) => {
    if (listing) {
      setEditingListing({ ...listing });
    } else {
      setEditingListing(EMPTY_LISTING);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingListing(null);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean = value;

    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = parseFloat(value) || 0;
        finalValue = parseFloat(value) || 0;
    }

    setEditingListing(prev => prev ? { ...prev, [name]: finalValue } : null);
  };


  // --- Giriş Ekranı ---
  if (!isAuthenticated) {
    return (
      <PageTemplate>
        <div className={styles.loginContainer}>
          <div className={styles.loginBox}>
            <h1>Admin Girişi</h1>
            <input
              type="password"
              placeholder="Admin şifrəsi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className={styles.passwordInput}
            />
            <button onClick={handleLogin} className={styles.loginButton}>Giriş Et</button>
          </div>
        </div>
      </PageTemplate>
    );
  }

  // --- Əsas Admin Paneli ---
  return (
    <PageTemplate>
      <div className={styles.adminContainer}>
        <div className={styles.header}>
          <h1>Elanların İdarə Paneli</h1>
          <div>
            <button onClick={() => openModal()} className={styles.addButton}>Yeni Elan Əlavə Et</button>
            <button onClick={handleLogout} className={styles.logoutButton}>Çıxış Et</button>
          </div>
        </div>

        {isLoading && <p>Yüklənir...</p>}
        {error && <p className={styles.error}>Xəta: {error}</p>}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nömrə</th>
                <th>Qiymət</th>
                <th>Tip</th>
                <th>Status</th>
                <th>Əlaqə</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {listings.length > 0 ? listings.map(listing => (
                <tr key={listing.id}>
                  <td>{listing.prefix}-{listing.number}</td>
                  <td>{listing.price} AZN</td>
                  <td>{listing.type}</td>
                  <td>{listing.is_sold ? 'Satılıb' : 'Aktiv'}</td>
                  <td>{listing.contact_phone}</td>
                  <td>
                    <button onClick={() => openModal(listing)} className={styles.editButton}>Redaktə</button>
                    <button onClick={() => handleDelete(listing.id)} className={styles.deleteButton}>Sil</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6}>Heç bir elan tapılmadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal (Yeni / Redaktə) */}
        {isModalOpen && editingListing && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
              <h2>{'id' in editingListing && editingListing.id ? 'Elanı Redaktə Et' : 'Yeni Elan Yarat'}</h2>
              
              <div className={styles.formGrid}>
                  <input type="text" name="prefix" value={editingListing.prefix} onChange={handleModalChange} placeholder="Prefiks (məs: 050)" />
                  <input type="text" name="number" value={editingListing.number} onChange={handleModalChange} placeholder="Nömrə (məs: 1234567)" />
                  <input type="number" name="price" value={editingListing.price} onChange={handleModalChange} placeholder="Qiymət" />
                  <select name="type" value={editingListing.type} onChange={handleModalChange}>
                      <option value="elan">Elan</option>
                      <option value="gold">Gold</option>
                      <option value="premium">Premium</option>
                  </select>
                  <input type="text" name="contact_phone" value={editingListing.contact_phone} onChange={handleModalChange} placeholder="Əlaqə Nömrəsi" />
              </div>

              <textarea name="description" value={editingListing.description || ''} onChange={handleModalChange} placeholder="Əlavə məlumat"></textarea>
              
              <div className={styles.checkboxContainer}>
                <label htmlFor="is_sold">Satılıb?</label>
                <input id="is_sold" type="checkbox" name="is_sold" checked={editingListing.is_sold} onChange={handleModalChange} />
              </div>

              <div className={styles.modalActions}>
                <button onClick={closeModal} className={styles.cancelButton}>Ləğv Et</button>
                <button onClick={handleSave} className={styles.saveButton}>Yadda Saxla</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}
