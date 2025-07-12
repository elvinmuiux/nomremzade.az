import React from 'react';

// Azercell Logo SVG
export const AzercellLogo: React.FC<{ size?: number; className?: string }> = ({ 
  size = 20, 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill="none"
  >
    <circle cx="12" cy="12" r="10" fill="#0066CC" />
    <path 
      d="M8 16L12 8L16 16H14L13 14H11L10 16H8ZM12 10L11.2 12H12.8L12 10Z" 
      fill="white"
    />
  </svg>
);

// Bakcell Logo SVG
export const BakcellLogo: React.FC<{ size?: number; className?: string }> = ({ 
  size = 20, 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill="none"
  >
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#00A651" />
    <path 
      d="M7 8H10C11.1 8 12 8.9 12 10C12 10.5 11.8 11 11.5 11.3C11.8 11.6 12 12.1 12 12.6C12 13.7 11.1 14.6 10 14.6H7V8ZM9 10.2V11H10C10.3 11 10.5 10.8 10.5 10.5S10.3 10 10 10H9V10.2ZM9 12.2V13H10.2C10.5 13 10.7 12.8 10.7 12.5S10.5 12.2 10.2 12.2H9Z" 
      fill="white"
    />
  </svg>
);

// Nar Mobile Logo SVG
export const NarMobileLogo: React.FC<{ size?: number; className?: string }> = ({ 
  size = 20, 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill="none"
  >
    <circle cx="12" cy="12" r="10" fill="#FF6B00" />
    <path 
      d="M8 16V8H9.5L12.5 13L15.5 8H17V16H15.5V10.5L13 15H12L9.5 10.5V16H8Z" 
      fill="white"
    />
  </svg>
);

// Naxtel Logo SVG  
export const NaxtelLogo: React.FC<{ size?: number; className?: string }> = ({ 
  size = 20, 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill="none"
  >
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#E30613" />
    <path 
      d="M8 16V8H9.5L13.5 13V8H15V16H13.5L9.5 11V16H8Z" 
      fill="white"
    />
  </svg>
);

// Operator logos map
export const operatorLogos = {
  azercell: AzercellLogo,
  bakcell: BakcellLogo,
  'nar-mobile': NarMobileLogo,
  naxtel: NaxtelLogo
};

// Helper function to render operator logo
export const renderOperatorLogo = (operator: string, size?: number, className?: string) => {
  const LogoComponent = operatorLogos[operator as keyof typeof operatorLogos];
  return LogoComponent ? <LogoComponent size={size} className={className} /> : null;
};
