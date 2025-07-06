import React, { useState } from 'react';
import styles from './PaymentForm.module.css';

interface PaymentFormProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Card number validation
    const cardDigits = formData.cardNumber.replace(/\D/g, '');
    if (!cardDigits) {
      newErrors.cardNumber = 'Kart nömrəsi tələb olunur';
    } else if (cardDigits.length !== 16) {
      newErrors.cardNumber = 'Kart nömrəsi 16 rəqəm olmalıdır';
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Son istifadə tarixi tələb olunur';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Düzgün format: MM/YY';
    }

    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV tələb olunur';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV 3-4 rəqəm olmalıdır';
    }

    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Kart sahibinin adı tələb olunur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock payment ID
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      onPaymentSuccess(paymentId);
    } catch {
      onPaymentError('Ödəmə zamanı xəta baş verdi. Yenidən cəhd edin.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.paymentModal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Ödəmə</h2>
          <button 
            className={styles.closeButton} 
            onClick={onCancel}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className={styles.paymentInfo}>
          <div className={styles.amountSection}>
            <span className={styles.amountLabel}>Məbləğ:</span>
            <span className={styles.amount}>{amount} {currency}</span>
          </div>
          <p className={styles.description}>
            Premium elan yerləşdirmək üçün ödəmə
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Kart Nömrəsi</label>
            <input
              type="text"
              className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`}
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Son İstifadə</label>
              <input
                type="text"
                className={`${styles.input} ${errors.expiryDate ? styles.inputError : ''}`}
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiryDate && <span className={styles.error}>{errors.expiryDate}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>CVV</label>
              <input
                type="text"
                className={`${styles.input} ${errors.cvv ? styles.inputError : ''}`}
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Kart Sahibinin Adı</label>
            <input
              type="text"
              className={`${styles.input} ${errors.cardholderName ? styles.inputError : ''}`}
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value.toUpperCase())}
              placeholder="CARDHOLDER NAME"
            />
            {errors.cardholderName && <span className={styles.error}>{errors.cardholderName}</span>}
          </div>

          <div className={styles.securityNote}>
            <p>🔒 Ödəməniz SSL şifrələməsi ilə təhlükəsizdir</p>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={isProcessing}
            >
              İmtina
            </button>
            <button 
              type="submit" 
              className={styles.payButton}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className={styles.spinner}></span>
                  Ödəmə edilir...
                </>
              ) : (
                `${amount} ${currency} Ödə`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
