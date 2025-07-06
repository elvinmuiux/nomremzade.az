'use client';

import { useEffect } from 'react';

interface VisitorData {
  date: string;
  count: number;
  uniqueVisitors: Set<string>;
}

interface StorageVisitorData {
  date: string;
  count: number;
  uniqueVisitors: string[];
}

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = () => {
      const today = new Date().toDateString();
      const visitorsKey = 'daily_visitors';
      const sessionKey = 'visitor_session';
      
      // Check if this is a new session
      const existingSession = sessionStorage.getItem(sessionKey);
      
      if (!existingSession) {
        // Generate a simple visitor ID for this session
        const visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem(sessionKey, visitorId);
        
        // Get existing visitor data
        const existingData = localStorage.getItem(visitorsKey);
        const visitorStats: { [key: string]: VisitorData } = {};
        
        if (existingData) {
          const parsed = JSON.parse(existingData);
          // Convert back to proper format with Set objects
          Object.keys(parsed).forEach(date => {
            visitorStats[date] = {
              date: parsed[date].date,
              count: parsed[date].count,
              uniqueVisitors: new Set(parsed[date].uniqueVisitors || [])
            };
          });
        }
        
        // Initialize today's data if it doesn't exist
        if (!visitorStats[today]) {
          visitorStats[today] = {
            date: today,
            count: 0,
            uniqueVisitors: new Set()
          };
        }
        
        // Add this visitor to today's stats
        visitorStats[today].uniqueVisitors.add(visitorId);
        visitorStats[today].count = visitorStats[today].uniqueVisitors.size;
        
        // Clean up old data (keep only last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        Object.keys(visitorStats).forEach(date => {
          if (new Date(date) < thirtyDaysAgo) {
            delete visitorStats[date];
          }
        });
        
        // Convert Sets to arrays for storage
        const storageData: { [key: string]: StorageVisitorData } = {};
        Object.keys(visitorStats).forEach(date => {
          storageData[date] = {
            date: visitorStats[date].date,
            count: visitorStats[date].count,
            uniqueVisitors: Array.from(visitorStats[date].uniqueVisitors)
          };
        });
        
        // Save updated data
        localStorage.setItem(visitorsKey, JSON.stringify(storageData));
      }
    };
    
    // Track visitor on component mount
    trackVisitor();
  }, []);

  return null; // This component doesn't render anything
};

export default VisitorTracker;
