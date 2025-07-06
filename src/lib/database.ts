// Secure database operations for user data and payments
// This file handles all sensitive data operations

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  registeredAt: string;
  isPremium: boolean;
  paymentHistory: Payment[];
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  cardLast4: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  processedAt?: string;
  transactionId?: string;
}

export interface PremiumAd {
  id: string;
  userId: string;
  phoneNumber: string;
  operator: string;
  description?: string;
  price?: number;
  createdAt: string;
  isActive: boolean;
  paymentId: string;
}

// Secure storage keys (in production, these would be environment variables)
const STORAGE_KEYS = {
  USERS: 'secure_users_db',
  PAYMENTS: 'secure_payments_db',
  PREMIUM_ADS: 'secure_premium_ads_db',
  PAYMENT_CONFIG: 'payment_config'
};

// Payment configuration (kept secure)
const PAYMENT_CONFIG = {
  MERCHANT_CARD: '4169738829007545', // Your specified card number
  PREMIUM_AD_PRICE: 5.00, // 5 AZN for premium ad
  CURRENCY: 'AZN'
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

  // Payment operations
  static savePayment(payment: Payment): void {
    const payments = this.getAllPayments();
    const existingIndex = payments.findIndex(p => p.id === payment.id);
    
    if (existingIndex >= 0) {
      payments[existingIndex] = payment;
    } else {
      payments.push(payment);
    }
    
    const encrypted = this.encryptData(payments);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, encrypted);
  }

  static getAllPayments(): Payment[] {
    const encrypted = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!encrypted) return [];
    
    const decrypted = this.decryptData(encrypted) as Payment[];
    return Array.isArray(decrypted) ? decrypted : [];
  }

  static getPaymentsByUserId(userId: string): Payment[] {
    const payments = this.getAllPayments();
    return payments.filter(p => p.userId === userId);
  }

  // Premium ads operations
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

  static getAdsByUserId(userId: string): PremiumAd[] {
    const ads = this.getAllPremiumAds();
    return ads.filter(a => a.userId === userId);
  }

  static getActiveAds(): PremiumAd[] {
    const ads = this.getAllPremiumAds();
    return ads.filter(a => a.isActive);
  }

  // Payment processing
  static async processPayment(
    userId: string,
    cardNumber: string
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      // Generate unique payment ID
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create payment record
      const payment: Payment = {
        id: paymentId,
        userId,
        amount: PAYMENT_CONFIG.PREMIUM_AD_PRICE,
        currency: PAYMENT_CONFIG.CURRENCY,
        cardLast4: cardNumber.slice(-4),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save payment
      this.savePayment(payment);

      // Simulate payment processing (in production, integrate with real payment gateway)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment status
      payment.status = 'completed';
      payment.processedAt = new Date().toISOString();
      payment.transactionId = `txn_${Date.now()}`;
      
      this.savePayment(payment);

      // Update user premium status
      const user = this.getUserById(userId);
      if (user) {
        user.isPremium = true;
        user.paymentHistory.push(payment);
        this.saveUser(user);
      }

      return { success: true, paymentId };
    } catch {
      return { success: false, error: 'Payment processing failed' };
    }
  }

  // Get payment configuration
  static getPaymentConfig() {
    return PAYMENT_CONFIG;
  }

  // Clear all data (for development/testing)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Export data for admin (encrypted)
  static exportData(): string {
    const data = {
      users: this.getAllUsers(),
      payments: this.getAllPayments(),
      premiumAds: this.getAllPremiumAds(),
      exportedAt: new Date().toISOString()
    };
    
    return this.encryptData(data);
  }
}

export default SecureDatabase;
