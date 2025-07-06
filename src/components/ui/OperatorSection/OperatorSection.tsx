import React from 'react';
import Image from 'next/image';
import styles from './OperatorSection.module.css';

export interface OperatorSectionProps {
  className?: string;
  title?: string;
}

interface OperatorLogo {
  id: string;
  name: string;
  src: string;
  alt: string;
}

const operatorLogos: OperatorLogo[] = [
  {
    id: 'azercell',
    name: 'Azercell',
    src: '/images/operators/azercell.svg',
    alt: 'Azercell operator logo'
  },
  {
    id: 'bakcell',
    name: 'Bakcell',
    src: '/images/operators/bakcell.svg',
    alt: 'Bakcell operator logo'
  },
  {
    id: 'nar-mobile',
    name: 'Nar Mobile',
    src: '/images/operators/nar-mobile.svg',
    alt: 'Nar Mobile operator logo'
  },
  {
    id: 'naxtel',
    name: 'Naxtel',
    src: '/images/operators/naxtel.svg',
    alt: 'Naxtel operator logo'
  }
];

const OperatorSection: React.FC<OperatorSectionProps> = ({ 
  className = '', 
  title = 'Mövcud operator' 
}) => {
  return (
    <div className={`${styles.operatorSection} ${className}`}>
      <h3 className={styles.operatorTitle}>{title}</h3>
      <div className={styles.operatorLogos}>
        {operatorLogos.map((operator, index) => (
          <div 
            key={operator.id} 
            className={styles.operatorLogo}
            style={{ zIndex: operatorLogos.length - index }}
          >
            <Image
              src={operator.src}
              alt={operator.alt}
              width={40}
              height={40}
              className={styles.operatorImage}
              title={operator.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatorSection;
