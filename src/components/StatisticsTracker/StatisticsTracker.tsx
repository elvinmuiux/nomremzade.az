'use client';

import { useEffect } from 'react';
import { StatisticsManager } from '@/lib/statistics';

const SESSION_KEY = 'session_tracked';

const StatisticsTracker = () => {
  useEffect(() => {
    // Check if this session has already been tracked
    if (sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    // Increment active users and mark session as tracked
    StatisticsManager.incrementActiveUsers();
    sessionStorage.setItem(SESSION_KEY, 'true');
  }, []);

  return null; // This component does not render anything
};

export default StatisticsTracker;
