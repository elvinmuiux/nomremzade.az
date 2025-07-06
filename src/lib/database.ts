// Secure database operations for user data and ads
// This file handles all sensitive data operations

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isPremium: boolean;
  createdAt: string;
}

export interface PremiumAd {
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

// Secure storage keys
const STORAGE_KEYS = {
  USERS: 'secure_users_db',
  PREMIUM_ADS: 'secure_premium_ads_db'
};

// Utility functions for secure storage
class SecureDatabase {
  private static encryptData(data: unknown): string {
    // In production, implement proper encryption
    return btoa(JSON.stringify(data));
  }

  private static decryptData(encryptedData: string): unknown {
    try {
      return JSON.parse(atob(encryptedData));
    } catch {
      return null;
    }
  }

  // User operations
  static saveUser(user: User): void {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    const encrypted = this.encryptData(users);
    localStorage.setItem(STORAGE_KEYS.USERS, encrypted);
  }

  static getAllUsers(): User[] {
    const encrypted = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!encrypted) return [];
    
    const decrypted = this.decryptData(encrypted) as User[];
    return Array.isArray(decrypted) ? decrypted : [];
  }

  static getUserById(id: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.id === id) || null;
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.email === email) || null;
  }

  static authenticateUser(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  // Premium ad operations
  static savePremiumAd(ad: PremiumAd): void {
    const ads = this.getAllPremiumAds();
    const existingIndex = ads.findIndex(a => a.id === ad.id);
    
    if (existingIndex >= 0) {
      ads[existingIndex] = ad;
    } else {
      ads.push(ad);
    }
    
    const encrypted = this.encryptData(ads);
    localStorage.setItem(STORAGE_KEYS.PREMIUM_ADS, encrypted);
  }

  static getAllPremiumAds(): PremiumAd[] {
    const encrypted = localStorage.getItem(STORAGE_KEYS.PREMIUM_ADS);
    if (!encrypted) return [];
    
    const decrypted = this.decryptData(encrypted) as PremiumAd[];
    return Array.isArray(decrypted) ? decrypted : [];
  }

  static getActivePremiumAds(): PremiumAd[] {
    const allAds = this.getAllPremiumAds();
    const now = new Date();
    
    return allAds.filter(ad => {
      const expiryDate = new Date(ad.expiresAt);
      return ad.status === 'active' && expiryDate > now;
    }).sort((a, b) => {
      // Sort by priority: featured first, then by creation date
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  static getPremiumAdById(id: string): PremiumAd | null {
    const ads = this.getAllPremiumAds();
    return ads.find(a => a.id === id) || null;
  }

  static getUserAds(userId: string): PremiumAd[] {
    const allAds = this.getAllPremiumAds();
    return allAds.filter(ad => ad.userId === userId);
  }

  static incrementAdViews(adId: string): void {
    const ad = this.getPremiumAdById(adId);
    if (ad) {
      ad.views = (ad.views || 0) + 1;
      this.savePremiumAd(ad);
    }
  }

  static deleteAd(adId: string): boolean {
    const ads = this.getAllPremiumAds();
    const adIndex = ads.findIndex(a => a.id === adId);
    
    if (adIndex >= 0) {
      ads.splice(adIndex, 1); // Completely remove the ad from array
      const encrypted = this.encryptData(ads);
      localStorage.setItem(STORAGE_KEYS.PREMIUM_ADS, encrypted);
      return true;
    }
    
    return false;
  }

  static deleteUser(userId: string): boolean {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      users.splice(userIndex, 1);
      const encrypted = this.encryptData(users);
      localStorage.setItem(STORAGE_KEYS.USERS, encrypted);
      return true;
    }
    
    return false;
  }

  static getAllAds(): PremiumAd[] {
    return this.getAllPremiumAds();
  }

  // Utility methods
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static exportData(): object {
    const data: Record<string, unknown> = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const encrypted = localStorage.getItem(key);
      if (encrypted) {
        data[name] = this.decryptData(encrypted);
      }
    });
    return data;
  }

  static importData(data: Record<string, unknown>): void {
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      if (data[name]) {
        const encrypted = this.encryptData(data[name]);
        localStorage.setItem(key, encrypted);
      }
    });
  }
}

export default SecureDatabase;
