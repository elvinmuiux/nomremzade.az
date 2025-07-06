'use client';

import React from 'react';
import styles from './Sidebar.module.css';
import Logo from '@/components/ui/Logo/Logo';
import Navigation from '@/components/ui/Navigation/Navigation';
import OperatorSection from '@/components/ui/OperatorSection/OperatorSection';
import { SidebarProps } from '@/types/navigation';

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {

  return (
    <aside className={`${styles.sidebar} ${className}`}>
      <Logo />

      <Navigation />

      <OperatorSection />
    </aside>
  );
};

export default Sidebar;
