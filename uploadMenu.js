const fs = require('fs');

// Read the menu.json file
const menuData = JSON.parse(fs.readFileSync('./menu.json', 'utf8'));

// API endpoint URL
const API_URL = 'http://localhost:3000/api/menu';

// Function to upload each menu item
async function uploadMenuItem(item) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✓ Uploaded: ${item.label}`);
      return { success: true, item: item.label };
    } else {
      console.error(`✗ Failed: ${item.label} - ${result.message || result.error}`);
      return { success: false, item: item.label, error: result.message };
    }
  } catch (error) {
    console.error(`✗ Error uploading ${item.label}:`, error.message);
    return { success: false, item: item.label, error: error.message };
  }
}

// Main function to upload all items
async function uploadAllMenuItems() {
  console.log(`Starting upload of ${menuData.length} menu items...\n`);

  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  // Upload items one by one with a small delay to avoid overwhelming the server
  for (let i = 0; i < menuData.length; i++) {
    const item = menuData[i];
    const result = await uploadMenuItem(item);

    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push({ item: result.item, error: result.error });
    }

    // Add a small delay between requests (100ms)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Upload Summary:');
  console.log(`✓ Successfully uploaded: ${results.success}`);
  console.log(`✗ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\nFailed items:');
    results.errors.forEach(err => {
      console.log(`  - ${err.item}: ${err.error}`);
    });
  }
  console.log('='.repeat(50));
}

// Run the upload
uploadAllMenuItems().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
