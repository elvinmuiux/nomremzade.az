const fs = require('fs');
const path = require('path');

// Directory containing JSON files
const dataDir = path.join(__dirname, 'public', 'data');

// Get all JSON files in the directory
const jsonFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

// Process each file
jsonFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  
  try {
    // Read the file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Check if the file has azercellAds property
    if (data.azercellAds && Array.isArray(data.azercellAds)) {
      console.log(`Processing ${file}...`);
      
      // Count entries before filtering
      const beforeCount = data.azercellAds.length;
      
      // Filter out entries with price 600
      data.azercellAds = data.azercellAds.filter(entry => entry.price !== 600);
      
      // Count entries after filtering
      const afterCount = data.azercellAds.length;
      const removedCount = beforeCount - afterCount;
      
      // Write the filtered data back to the file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      
      console.log(`${file}: Removed ${removedCount} entries with price 600. Remaining entries: ${afterCount}`);
    } else {
      console.log(`${file}: No azercellAds array found or it's not an array.`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('All files processed successfully.');
