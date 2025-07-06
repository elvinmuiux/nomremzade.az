import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  hasDropdown?: boolean;
  children?: NavigationItem[];
}

export interface SidebarProps {
  className?: string;
}

export interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  showBrandInfo?: boolean;
}
