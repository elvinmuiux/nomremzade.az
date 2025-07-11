'use client';

import React, { useState } from 'react';
import { addNewNumber } from '@/lib/elanData';

interface AddNumberFormProps {
  onNumberAdded?: () => void;
}

const AddNumberForm: React.FC<AddNumberFormProps> = ({ onNumberAdded }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    price: '',
    contactPhone: '(050) 444-44-22',
    type: 'standard' as 'premium' | 'gold' | 'standard',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const success = await addNewNumber({
        phoneNumber: formData.phoneNumber,
        price: parseInt(formData.price) || 0,
        contactPhone: formData.contactPhone,
        type: formData.type,
        isVip: formData.type === 'premium',
        description: formData.description,
        provider: formData.phoneNumber.replace(/\D/g, '').substring(0, 3),
        prefix: formData.phoneNumber.replace(/\D/g, '').substring(0, 3),
        status: formData.status,
        category: formData.type
      });

      if (success) {
        setMessage('Nömrə uğurla əlavə edildi!');
        setFormData({
          phoneNumber: '',
          price: '',
          contactPhone: '(050) 444-44-22',
          type: 'standard',
          description: '',
          status: 'active'
        });
        onNumberAdded?.();
      } else {
        setMessage('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      }
    } catch (error) {
      console.error('Error adding number:', error);
      setMessage('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-number-form">
      <h3 className="text-xl font-bold mb-4">Yeni Nömrə Əlavə Et</h3>
      
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('uğurla') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Telefon Nömrəsi *
          </label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            placeholder="050-123-45-67"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Qiymət (AZN) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Əlaqə Telefonu
          </label>
          <input
            type="text"
            value={formData.contactPhone}
            onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
            placeholder="(050) 444-44-22"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Növ *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value as 'premium' | 'gold' | 'standard'})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Nömrə növünü seçin"
          >
            <option value="standard">Standart</option>
            <option value="gold">Qızıl</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Təsvir
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Nömrə haqqında qısa təsvir..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Status seçin"
          >
            <option value="active">Aktiv</option>
            <option value="inactive">Passiv</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Əlavə edilir...' : 'Nömrə Əlavə Et'}
        </button>
      </form>
    </div>
  );
};

export default AddNumberForm;
