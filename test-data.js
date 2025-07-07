// Test data script - Run this in browser console to add sample premium ads
// Go to admin panel and run this script to add test data

function addTestData() {
  // Sample test users
  const testUsers = [
    {
      id: 'user_001',
      name: 'Əli Məmmədov',
      email: 'ali@test.com',
      phone: '0504444422',
      password: '123456',
      isPremium: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_002', 
      name: 'Aysel Həsənova',
      email: 'aysel@test.com',
      phone: '0554443322',
      password: '123456',
      isPremium: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Sample premium ads
  const testAds = [
    {
      id: 'ad_001',
      userId: 'user_001',
      phoneNumber: '055 266 63 66',
      operator: 'azercell',
      price: 150,
      contactPhone: '0504444422',
      whatsappNumber: '0504444422',
      description: 'Gözəl və asan yadda qalan nömrə',
      adType: 'premium',
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      views: 45,
      featured: true
    },
    {
      id: 'ad_002',
      userId: 'user_002',
      phoneNumber: '070 777 77 77',
      operator: 'nar-mobile',
      price: 300,
      contactPhone: '0554443322',
      whatsappNumber: '0554443322',
      description: 'Premium 7li nömrə - çox xüsusi',
      adType: 'premium',
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      views: 78,
      featured: true
    },
    {
      id: 'ad_003',
      userId: 'user_001',
      phoneNumber: '050 555 55 55',
      operator: 'bakcell',
      price: 200,
      contactPhone: '0504444422',
      description: '5li nömrə - VIP',
      adType: 'gold',
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      views: 32,
      featured: false
    }
  ];

  // Use SecureDatabase if available, otherwise use localStorage directly
  if (window.SecureDatabase) {
    testUsers.forEach(user => SecureDatabase.saveUser(user));
    testAds.forEach(ad => SecureDatabase.savePremiumAd(ad));
  } else {
    // Direct localStorage approach
    const encryptData = (data) => btoa(JSON.stringify(data));
    
    // Save users
    localStorage.setItem('secure_users_db', encryptData(testUsers));
    
    // Save ads
    localStorage.setItem('secure_premium_ads_db', encryptData(testAds));
  }

  console.log('Test data added successfully!');
  console.log('Users:', testUsers.length);
  console.log('Ads:', testAds.length);
  
  // Refresh the page to see changes
  window.location.reload();
}

// Run the function
addTestData();
