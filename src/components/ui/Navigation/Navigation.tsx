'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';
import { NavigationItem } from '@/types/navigation';
import {
  Home,
  Phone,
  Info,
  Edit3,
  MessageSquare,
  Handshake,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
  BarChart3
} from 'lucide-react';

export interface NavigationProps {
  className?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Əsas Səhifə',
    href: '/',
    icon: Home
  },
  {
    id: 'numbers',
    label: 'Nömrələr',
    href: '/numbers',
    icon: Phone,
    hasDropdown: true,
    children: [
      { id: 'azercell', label: 'Azərcell', href: '/numbers/azercell' },
      { id: 'bakcell', label: 'Bakcell', href: '/numbers/bakcell' },
      { id: 'nar-mobile', label: 'Nar Mobile', href: '/numbers/nar-mobile' },
      { id: 'naxtel', label: 'Naxtel', href: '/numbers/naxtel' }
    ]
  },
  {
    id: 'post-ad',
    label: 'Elan yerləşdir',
    href: '/post-ad',
    icon: Edit3
  },
  {
    id: 'cooperation',
    label: 'Bizimla əməkdaşlıq',
    href: '/cooperation',
    icon: Handshake
  },
  {
    id: 'about',
    label: 'Haqqımızda',
    href: '/about',
    icon: Info
  },
  {
    id: 'qa',
    label: 'Sual - Cavab',
    href: '/qa',
    icon: HelpCircle
  },
  {
    id: 'feedback',
    label: 'İrad və təkliflər',
    href: '/feedback',
    icon: MessageSquare
  },
  {
    id: 'evaluation',
    label: 'Sayt Qiymətləndirməsi',
    href: '/evaluation',
    icon: BarChart3
  },
];

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Function to check if a menu item is active
  const isItemActive = (item: NavigationItem): boolean => {
    // Exact match for home page
    if (item.href === '/' && pathname === '/') {
      return true;
    }
    
    // For other pages, check if pathname starts with the item href (but not for home)
    if (item.href !== '/' && pathname.startsWith(item.href)) {
      return true;
    }
    
    // Check if any child is active (for dropdowns)
    if (item.children) {
      return item.children.some(child => pathname === child.href);
    }
    
    return false;
  };

  // Function to check if a dropdown child is active
  const isChildActive = (childHref: string): boolean => {
    return pathname === childHref;
  };

  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navigationRef.current && !navigationRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      ref={navigationRef}
      className={`${styles.navigation} ${className}`}
      data-mobile-open={isMobileMenuOpen}
    >
      {/* Mobile hamburger button */}
      <button
        className={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Navigation menu */}
      <ul
        className={`${styles.navList} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
        data-mobile-open={isMobileMenuOpen}
      >
        {navigationItems.map((item) => (
          <li key={item.id} className={styles.navItem}>
            <a
              href={item.href}
              className={`${styles.navLink} ${isItemActive(item) ? styles.active : ''}`}
              onClick={(e) => {
                if (item.hasDropdown) {
                  e.preventDefault();
                  toggleDropdown(item.id);
                } else {
                  // Close mobile menu when navigating to a page
                  closeMobileMenu();
                }
              }}
            >
              <span className={styles.navIcon}>
                {item.icon && React.createElement(item.icon, { size: 18 })}
              </span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.hasDropdown && (
                <span className={`${styles.dropdownIcon} ${openDropdowns.includes(item.id) ? styles.open : ''}`}>
                  <ChevronDown size={14} />
                </span>
              )}
            </a>

            {item.hasDropdown && item.children && openDropdowns.includes(item.id) && (
              <ul className={styles.dropdown}>
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={child.href}
                      className={`${styles.dropdownLink} ${isChildActive(child.href) ? styles.active : ''}`}
                      onClick={() => closeMobileMenu()}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
