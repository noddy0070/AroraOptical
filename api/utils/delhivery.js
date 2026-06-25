/**
 * Delhivery API Wrapper
 *
 * Env vars required:
 *   DELHIVERY_API_TOKEN      - Bearer token from the Delhivery merchant dashboard
 *   DELHIVERY_PICKUP_LOCATION - Exact (case-sensitive) name of the registered pickup address
 *   DELHIVERY_MODE           - 'test' | 'production'  (default: production)
 *
 * Optional env vars for return-address fields in the manifest payload:
 *   DELHIVERY_RETURN_PIN, DELHIVERY_RETURN_CITY, DELHIVERY_RETURN_STATE,
 *   DELHIVERY_RETURN_NAME, DELHIVERY_RETURN_ADD, DELHIVERY_RETURN_PHONE
 */

import axios from 'axios';

const BASE_URL = (process.env.DELHIVERY_MODE || 'production').toLowerCase() === 'test'
  ? 'https://staging-express.delhivery.com'
  : 'https://track.delhivery.com';

const authHeaders = () => ({
  Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
});

const sanitizePhone = (num) => (num || '').replace(/\D/g, '').slice(-10);

/**
 * Create a Delhivery shipment (manifest) for a confirmed order.
 *
 * @param {object} orderData
 *   orderId, shippingAddress, products, paymentDetails, totalPrice
 * @returns Delhivery response with packages[0].waybill on success
 * @throws  if Delhivery rejects the manifest
 */
export async function createShipment(orderData) {
  if (process.env.DELHIVERY_MOCK_MODE === 'true') {
    const fakeWaybill = `MOCK${Date.now()}`;
    console.log(`[Delhivery] MOCK MODE — skipping API call, fake waybill: ${fakeWaybill}`);
    return { packages: [{ waybill: fakeWaybill, status: 'Success' }] };
  }

  const addr       = orderData.shippingAddress;
  const totalUnits = orderData.products.reduce((s, p) => s + Math.max(1, Number(p.quantity) || 1), 0);
  const weightGrams = Math.round(500 * totalUnits);     // 0.5 kg per unit, in grams

  const shipmentPayload = {
    name:            addr.fullName,
    add:             [addr.flat, addr.area].filter(Boolean).join(', '),
    pin:             String(addr.pincode),
    city:            addr.city,
    state:           addr.state,
    country:         'India',
    phone:           sanitizePhone(addr.mobileNumber),
    order:           orderData.orderId,
    payment_mode:    orderData.paymentDetails.method === 'COD' ? 'COD' : 'Prepaid',
    return_pin:      process.env.DELHIVERY_RETURN_PIN   || '',
    return_city:     process.env.DELHIVERY_RETURN_CITY  || '',
    return_phone:    process.env.DELHIVERY_RETURN_PHONE || '',
    return_name:     process.env.DELHIVERY_RETURN_NAME  || 'Arora Optical',
    return_add:      process.env.DELHIVERY_RETURN_ADD   || '',
    return_state:    process.env.DELHIVERY_RETURN_STATE || '',
    return_country:  'India',
    products_desc:   orderData.products.map(p => p.productId?.modelName || 'Eyewear').join(', '),
    hsn_code:        '',
    cod_amount:      orderData.paymentDetails.method === 'COD' ? (orderData.totalPrice || 0) : 0,
    order_date:      new Date().toISOString().split('T')[0] + ' 00:00:00',
    total_amount:    orderData.totalPrice || 0,
    seller_name:     'Arora Optical',
    seller_inv:      orderData.orderId,
    quantity:        totalUnits,
    waybill:         '',
    shipment_width:  15,
    shipment_height: 8,
    weight:          weightGrams,
    seller_gst_tin:  '',
    shipping_mode:   'Surface',
    address_type:    'home',
  };

  const pickupLocationName = process.env.DELHIVERY_PICKUP_LOCATION || '';
  if (!pickupLocationName) {
    throw new Error('DELHIVERY_PICKUP_LOCATION is not set in .env');
  }

  console.log(`[Delhivery] Using pickup_location.name = "${pickupLocationName}"`);

  const payload = JSON.stringify({
    shipments:       [shipmentPayload],
    pickup_location: { name: pickupLocationName },
  });

  const response = await axios.post(
    `${BASE_URL}/api/cmu/create.json`,
    new URLSearchParams({ format: 'json', data: payload }).toString(),
    {
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  console.log('[Delhivery] Create response:', JSON.stringify(response.data, null, 2));

  const pkg = response.data?.packages?.[0];
  if (!pkg?.waybill) {
    const errMsg = pkg?.remarks || response.data?.rmk || JSON.stringify(response.data);
    throw new Error(`Delhivery rejected order: ${errMsg}`);
  }

  return response.data;
}

/**
 * Fetch all registered warehouses/pickup locations from your Delhivery account.
 * Tries multiple known Delhivery endpoint paths in sequence.
 */
export async function getPickupLocations() {
  const candidates = [
    `${BASE_URL}/api/backend/clientwarehouse/list/`,
    `${BASE_URL}/api/p/warehouse/`,
    `${BASE_URL}/api/backend/clientwarehouse/`,
  ];

  for (const url of candidates) {
    try {
      const response = await axios.get(url, { headers: authHeaders() });
      console.log(`[Delhivery] Warehouse endpoint that worked: ${url}`);
      return response.data;
    } catch (err) {
      console.warn(`[Delhivery] Warehouse endpoint ${url} → ${err.response?.status || err.message}`);
    }
  }

  throw new Error('All Delhivery warehouse endpoints returned errors — check DELHIVERY_API_TOKEN and DELHIVERY_MODE');
}

/**
 * Track a shipment by waybill (LR) number.
 */
export async function trackShipment(waybill) {
  const response = await axios.get(`${BASE_URL}/api/v1/packages/json/`, {
    headers: authHeaders(),
    params: { waybill },
  });
  return response.data;
}

/**
 * Check if a delivery pincode is serviceable.
 * Returns Delhivery's delivery_codes response.
 */
export async function checkServiceability(pincode) {
  const response = await axios.get(`${BASE_URL}/c/api/pin-codes/json/`, {
    headers: authHeaders(),
    params: { filter_codes: pincode },
  });
  return response.data;
}
