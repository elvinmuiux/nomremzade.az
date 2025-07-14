// Statistics management for the site
export interface Statistics {
  activeUsers: number;
  soldNumbers: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'site_statistics';

const DEFAULT_STATS: Statistics = {
  activeUsers: 10000,
  soldNumbers: 50000,
  lastUpdated: new Date().toISOString()
};

export class StatisticsManager {
  static getStats(): Statistics {
    if (typeof window === 'undefined') return DEFAULT_STATS;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_STATS;
      }
    }
    
    // Initialize with default stats if not found
    this.saveStats(DEFAULT_STATS);
    return DEFAULT_STATS;
  }

  static saveStats(stats: Statistics): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('statisticsUpdated', { 
      detail: stats 
    }));
  }

  static incrementActiveUsers(): Statistics {
    const currentStats = this.getStats();
    currentStats.activeUsers += 1;
    currentStats.lastUpdated = new Date().toISOString();
    this.saveStats(currentStats);
    return currentStats;
  }

  static incrementSoldNumbers(): Statistics {
    const currentStats = this.getStats();
    currentStats.soldNumbers += 1;
    currentStats.lastUpdated = new Date().toISOString();
    this.saveStats(currentStats);
    return currentStats;
  }



  static formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + ',000+';
    }
    return num.toString();
  }

  static resetStats(): Statistics {
    this.saveStats(DEFAULT_STATS);
    return DEFAULT_STATS;
  }
}

export default StatisticsManager;
