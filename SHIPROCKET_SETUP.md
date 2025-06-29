# Shiprocket Integration Setup Guide

This guide will help you set up Shiprocket integration for your AroraOptical e-commerce application.

## Prerequisites

1. **Shiprocket Account**: You need a Shiprocket account. Sign up at [shiprocket.in](https://shiprocket.in)
2. **API Credentials**: Get your API credentials from Shiprocket dashboard
3. **Pickup Location**: Set up your pickup location in Shiprocket

## Environment Variables Setup

Add the following environment variables to your `.env` file:

```env
# Shiprocket Configuration
SHIPROCKET_EMAIL=your_shiprocket_email@example.com
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_PICKUP_LOCATION=Primary

# Optional: Custom pickup pincode (default: 110001)
SHIPROCKET_PICKUP_PINCODE=110001
```

## Features Implemented

### 1. Order Management
- **Order Creation**: Automatic Shiprocket shipment creation when orders are placed
- **Status Tracking**: Real-time order status updates
- **AWB Generation**: Automatic AWB generation when order is marked as shipped
- **Order Cancellation**: Cancel orders and Shiprocket shipments

### 2. Delivery Serviceability
- **Pincode Check**: Check delivery availability for any pincode
- **Courier Selection**: Automatic selection of best courier based on price and delivery time
- **Delivery Charges**: Dynamic calculation based on courier rates

### 3. Tracking System
- **Real-time Tracking**: Track shipments using Shiprocket API
- **Status Updates**: Automatic status synchronization
- **Tracking URL**: Direct links to courier tracking pages

### 4. Admin Features
- **Order Management Dashboard**: Complete order management interface
- **Status Updates**: Update order status with automatic Shiprocket sync
- **Bulk Operations**: Manage multiple orders efficiently

## API Endpoints

### Public Endpoints
- `GET /api/order/serviceability` - Check delivery serviceability
- `GET /api/order/couriers` - Get available couriers
- `GET /api/order/pickup-locations` - Get pickup locations

### Protected Endpoints
- `POST /api/order/create` - Create new order with Shiprocket integration
- `GET /api/order/user-orders` - Get user's orders
- `GET /api/order/:orderId` - Get order details
- `GET /api/order/:orderId/track` - Track order
- `POST /api/order/:orderId/cancel` - Cancel order

### Admin Endpoints
- `GET /api/order/admin/all` - Get all orders (admin)
- `PUT /api/order/admin/:orderId/status` - Update order status

## Frontend Components

### 1. Checkout Component (`/checkout`)
- Delivery address form
- Serviceability check
- Payment method selection
- Order placement with Shiprocket integration

### 2. Order Details Component (`/order/:orderId`)
- Complete order information
- Real-time tracking updates
- Shiprocket integration details
- Order status management

### 3. Admin Order Management (`/admin/order-management`)
- Order listing with filters
- Status management
- Shiprocket integration details
- Bulk operations

## Database Schema Updates

The Order model has been updated to include Shiprocket fields:

```javascript
shiprocket: {
  orderId: String,        // Shiprocket order ID
  shipmentId: String,     // Shiprocket shipment ID
  awbCode: String,        // Airway bill number
  courierName: String,    // Courier company name
  courierId: String,      // Courier ID
  trackingUrl: String,    // Tracking URL
  pickupLocation: String, // Pickup location
  deliveryDate: Date,     // Expected delivery date
  status: String,         // Shiprocket status
  statusCode: Number,     // Shiprocket status code
  lastUpdate: Date        // Last status update
}
```

## Usage Examples

### 1. Check Serviceability
```javascript
const response = await axios.get('/api/order/serviceability', {
  params: {
    pickupPincode: '110001',
    deliveryPincode: '400001',
    weight: 0.5
  }
});
```

### 2. Create Order
```javascript
const orderData = {
  products: [
    {
      productId: 'product_id',
      quantity: 1,
      price: 1000
    }
  ],
  shippingAddress: {
    name: 'John Doe',
    address: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipcode: '400001',
    phone: '9876543210',
    email: 'john@example.com'
  },
  paymentDetails: {
    method: 'COD',
    status: 'Pending'
  },
  deliveryCharges: 50
};

const response = await axios.post('/api/order/create', orderData);
```

### 3. Track Order
```javascript
const response = await axios.get(`/api/order/${orderId}/track`);
```

## Error Handling

The integration includes comprehensive error handling:

1. **Shiprocket API Failures**: Orders are created even if Shiprocket integration fails
2. **Network Issues**: Retry mechanisms for API calls
3. **Invalid Data**: Validation for all inputs
4. **Authentication**: Proper token management

## Testing

### 1. Test Serviceability
- Use different pincodes to test delivery availability
- Verify courier options and pricing

### 2. Test Order Creation
- Create test orders with different scenarios
- Verify Shiprocket integration

### 3. Test Tracking
- Track orders through different statuses
- Verify real-time updates

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify Shiprocket credentials
   - Check email and password

2. **Serviceability Check Fails**
   - Verify pickup pincode
   - Check delivery pincode format

3. **Order Creation Fails**
   - Check product availability
   - Verify shipping address format

4. **Tracking Not Working**
   - Verify shipment ID
   - Check Shiprocket API status

5. **"Please add billing/shipping address first" Error**
   - This error occurs when no pickup location is configured in Shiprocket
   - The integration now automatically creates a pickup location if none exists
   - Ensure your Shiprocket account has proper billing information
   - Run the test script to verify pickup location setup

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_SHIPROCKET=true
```

### Testing Integration

Run the test script to verify all Shiprocket functionality:

```bash
cd api
node test-shiprocket.js
```

This will test:
- Authentication
- Pickup location setup
- Serviceability checks
- Courier list retrieval

## Security Considerations

1. **API Credentials**: Store securely in environment variables
2. **Rate Limiting**: Implement rate limiting for API calls
3. **Input Validation**: Validate all inputs before API calls
4. **Error Logging**: Log errors without exposing sensitive data

## Performance Optimization

1. **Caching**: Cache serviceability results
2. **Batch Operations**: Use batch APIs where available
3. **Async Operations**: Handle API calls asynchronously
4. **Connection Pooling**: Reuse HTTP connections

## Support

For issues related to:
- **Shiprocket API**: Contact Shiprocket support
- **Integration**: Check this documentation
- **Application**: Contact development team

## Future Enhancements

1. **Webhook Integration**: Real-time status updates
2. **Bulk Shipment**: Multiple order processing
3. **Return Management**: Handle returns and exchanges
4. **Analytics**: Delivery performance metrics
5. **Multi-location**: Support multiple pickup locations 