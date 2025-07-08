// ==============================================
// FIXED: React/Next.js Phone Number Filtering
// ==============================================

import React, { useState, useMemo, useEffect } from 'react';

// Example of the FIXED filtering logic
const NumbersPageTemplate = ({ dataFiles, showProviderFilter = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrefix, setSelectedPrefix] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from JSON files
  useEffect(() => {
    const loadNumbers = async () => {
      try {
        const allNumbers = [];

        for (const dataFile of dataFiles) {
          try {
            const response = await fetch(`/data/${dataFile.file}`);
            if (response.ok) {
              const data = await response.json();
              const adsArray = data[dataFile.key] || [];
              
              const processedAds = adsArray.map((item, index) => {
                const phoneNumber = String(item.phoneNumber || item.numara || '');
                const phoneDigits = phoneNumber.replace(/[^0-9]/g, '');
                const actualPrefix = phoneDigits.slice(0, 3);
                
                return {
                  id: item.id || index + 1,
                  phoneNumber: phoneNumber,
                  price: item.price || 0,
                  contactPhone: String(item.contactPhone || '(050) 444-44-22'),
                  type: item.type || 'standard',
                  isVip: Boolean(item.isVip),
                  description: item.description || '',
                  provider: dataFile.provider,
                  prefix: actualPrefix
                };
              });

              allNumbers.push(...processedAds);
            }
          } catch (error) {
            console.error(`Error loading ${dataFile.file}:`, error);
          }
        }

        setAds(allNumbers);
      } catch (err) {
        console.error('Error loading numbers:', err);
      } finally {
        setLoading(false);
      }
    };

    if (dataFiles && dataFiles.length > 0) {
      loadNumbers();
    }
  }, [dataFiles]);

  // Helper function to get unique providers
  const getUniqueProviders = () => {
    const providers = [...new Set(ads.map(ad => ad.provider))];
    return providers.sort();
  };

  // Helper function to get unique prefixes
  const getUniquePrefixes = () => {
    if (showProviderFilter && selectedProvider) {
      const filteredPrefixes = ads
        .filter(ad => ad.provider === selectedProvider)
        .map(ad => ad.prefix);
      return [...new Set(filteredPrefixes)].sort();
    }
    
    if (ads.length > 0) {
      const prefixes = [...new Set(ads.map(ad => ad.prefix))];
      return prefixes.sort();
    }
    
    return ['010', '050', '051', '055', '060', '070', '077', '099'];
  };

  // ✅ FIXED: Simplified and corrected filtering logic
  const filteredAds = useMemo(() => {
    if (!ads.length) return [];
    
    return ads.filter(ad => {
      if (!ad || !ad.phoneNumber) return false;
      
      const phoneDigits = ad.phoneNumber.replace(/[^0-9]/g, '');
      
      // Filter by provider if selected (only for all numbers page)
      if (showProviderFilter && selectedProvider && ad.provider !== selectedProvider) {
        return false;
      }
      
      // ✅ FIXED: Filter by prefix if selected (works independently)
      if (selectedPrefix) {
        const cleanPrefix = selectedPrefix.replace(/[^0-9]/g, '');
        if (!phoneDigits.startsWith(cleanPrefix)) return false;
      }
      
      // ✅ FIXED: Filter by search term only when actively searching
      // Key fix: searchTerm !== selectedPrefix prevents interference
      if (searchTerm.trim() && searchTerm !== selectedPrefix) {
        const searchDigits = searchTerm.replace(/\D/g, '');
        if (searchDigits) {
          // For prefix-only search (3 digits), just check if it starts with the prefix
          if (searchDigits.length === 3) {
            if (!phoneDigits.startsWith(searchDigits)) return false;
          }
          // For longer searches, use more precise matching
          else if (searchDigits.length >= 4) {
            // Check if the phone number contains the search digits
            if (!phoneDigits.includes(searchDigits)) return false;
          }
        } else {
          // Text search - check if phone number contains the search text
          const searchText = searchTerm.toLowerCase().trim();
          const phoneText = ad.phoneNumber.toLowerCase();
          if (!phoneText.includes(searchText)) return false;
        }
      }
      
      return true;
    });
  }, [ads, searchTerm, selectedPrefix, selectedProvider, showProviderFilter]);

  // ✅ FIXED: Prefix selection handler (no automatic search term filling)
  const handlePrefixChange = (e) => {
    const newPrefix = e.target.value;
    setSelectedPrefix(newPrefix);
    // ✅ KEY FIX: Don't automatically fill search term
    // This prevents search logic from interfering with prefix filtering
  };

  // ✅ FIXED: Search input handler with smart prefix detection
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    // Auto-select prefix if user types 3 digits that match available prefixes
    if (newSearchTerm.length >= 3) {
      const searchDigits = newSearchTerm.replace(/\D/g, '');
      if (searchDigits.length >= 3) {
        const searchPrefix = searchDigits.slice(0, 3);
        const availablePrefixes = getUniquePrefixes();
        
        if (availablePrefixes.includes(searchPrefix) && selectedPrefix !== searchPrefix) {
          setSelectedPrefix(searchPrefix);
        }
      }
    }
    // Clear prefix selection if search is cleared
    else if (newSearchTerm === '') {
      setSelectedPrefix('');
    }
  };

  // Provider selection handler
  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
    setSelectedPrefix(''); // Reset prefix when provider changes
    setSearchTerm(''); // Reset search when provider changes
  };

  return (
    <div>
      {loading ? (
        <div>Yüklənir...</div>
      ) : (
        <>
          {/* Provider dropdown - only show if showProviderFilter is true */}
          {showProviderFilter && (
            <select value={selectedProvider} onChange={handleProviderChange}>
              <option value="">Operator seçin</option>
              {getUniqueProviders().map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          )}

          {/* ✅ FIXED: Prefix dropdown */}
          <select value={selectedPrefix} onChange={handlePrefixChange}>
            <option value="">Prefiks seçin</option>
            {getUniquePrefixes().map(prefix => (
              <option key={prefix} value={prefix}>{prefix}</option>
            ))}
          </select>

          {/* ✅ FIXED: Search input */}
          <input
            type="text"
            placeholder="Nömrə axtar (050, 051, 010... və ya tam nömrə)"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* ✅ FIXED: Results message */}
          <div className="results-info">
            {searchTerm.trim() && searchTerm !== selectedPrefix ? (
              filteredAds.length === 1 ? (
                <span>&ldquo;{searchTerm}&rdquo; axtarışına uyğun nömrə tapıldı</span>
              ) : filteredAds.length > 1 ? (
                <span>&ldquo;{searchTerm}&rdquo; üçün {filteredAds.length} nəticə</span>
              ) : (
                <span>&ldquo;{searchTerm}&rdquo; üçün heç bir nəticə tapılmadı</span>
              )
            ) : selectedPrefix ? (
              <span>{selectedPrefix} prefiksi: {filteredAds.length} nömrə</span>
            ) : selectedProvider ? (
              <span>{selectedProvider}: {filteredAds.length} nömrə</span>
            ) : (
              <span>Cəmi {filteredAds.length} nömrə</span>
            )}
          </div>

          {/* ✅ Numbers display */}
          <div className="numbers-list">
            {filteredAds.map(ad => (
              <div key={ad.id} className="number-card">
                <span className="phone-number">{ad.phoneNumber}</span>
                <span className="price">{ad.price} AZN</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ==============================================
// KEY FIXES SUMMARY:
// ==============================================

/*
1. ✅ SEPARATED PREFIX AND SEARCH LOGIC
   - Prefix selection works independently
   - Search doesn't interfere with prefix filtering
   - Added condition: searchTerm !== selectedPrefix

2. ✅ FIXED RESULTS MESSAGE LOGIC
   - Shows correct messages for different states
   - No "No results" when prefix is selected and working
   - Proper differentiation between search and prefix filtering

3. ✅ SIMPLIFIED FILTERING LOGIC
   - Removed overly complex search conditions
   - Made prefix filtering more predictable
   - Better handling of edge cases

4. ✅ IMPROVED STATE MANAGEMENT
   - Prefix and search work independently
   - Smart auto-completion still works
   - Clean reset functionality
*/

export default NumbersPageTemplate;
