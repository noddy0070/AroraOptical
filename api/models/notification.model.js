import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type:          { type: String, default: 'new_order' },
    message:       { type: String, required: true },
    orderId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    customerName:  { type: String, default: 'Customer' },
    amount:        { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'COD' },
    read:          { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
