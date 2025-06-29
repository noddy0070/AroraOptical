import dotenv from 'dotenv';
import shiprocketAPI from './utils/shiprocket.js';

dotenv.config();

async function testShiprocketIntegration() {
  console.log('🚀 Testing Shiprocket Integration...\n');

  try {
    // Test 1: Authentication
    console.log('1. Testing Authentication...');
    const token = await shiprocketAPI.getToken();
    console.log('✅ Authentication successful\n');

    // Test 2: Get Pickup Locations
    console.log('2. Testing Pickup Locations...');
    const locations = await shiprocketAPI.getPickupLocations();
    console.log('✅ Pickup locations:', locations.data?.length || 0, 'locations found\n');

    // Test 3: Create Pickup Location if needed
    console.log('3. Testing Pickup Location Creation...');
    const createdLocation = await shiprocketAPI.createPickupLocationIfNeeded();
    if (createdLocation) {
      console.log('✅ Created new pickup location\n');
    } else {
      console.log('✅ Pickup location already exists\n');
    }

    // Test 4: Check Serviceability
    console.log('4. Testing Serviceability Check...');
    const serviceability = await shiprocketAPI.checkServiceability('400001', '110001', 0.5);
    console.log('✅ Serviceability check successful');
    console.log('Available couriers:', serviceability.data?.length || 0, '\n');

    // Test 5: Get Courier List
    console.log('5. Testing Courier List...');
    const couriers = await shiprocketAPI.getCourierList();
    console.log('✅ Courier list retrieved successfully\n');

    console.log('🎉 All tests passed! Shiprocket integration is working properly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the test
testShiprocketIntegration(); 