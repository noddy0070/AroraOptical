import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Notification from "../models/notification.model.js";

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, orderAgg, recentOrders] = await Promise.all([
      User.countDocuments({ role: { $in: ['user'] } }),
      Product.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $cond: [
                  { $eq: ['$paymentDetails.status', 'Completed'] },
                  '$finalAmount',
                  0,
                ],
              },
            },
            pendingOrders:   { $sum: { $cond: [{ $eq: ['$status', 'Pending'] },   1, 0] } },
            confirmedOrders: { $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] } },
            shippedOrders:   { $sum: { $cond: [{ $eq: ['$status', 'Shipped'] },   1, 0] } },
            deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] } },
          },
        },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('userId', 'name email')
        .select('_id status paymentDetails finalAmount createdAt userId shippingAddress'),
    ]);

    const stats = {
      totalUsers,
      totalProducts,
      totalOrders:     orderAgg[0]?.totalOrders     ?? 0,
      totalRevenue:    orderAgg[0]?.totalRevenue     ?? 0,
      pendingOrders:   orderAgg[0]?.pendingOrders    ?? 0,
      confirmedOrders: orderAgg[0]?.confirmedOrders  ?? 0,
      shippedOrders:   orderAgg[0]?.shippedOrders    ?? 0,
      deliveredOrders: orderAgg[0]?.deliveredOrders  ?? 0,
    };

    res.status(200).json({ success: true, stats, recentOrders });
  } catch (err) {
    console.error('getAdminStats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find().sort({ createdAt: -1 }).limit(15),
      Notification.countDocuments({ read: false }),
    ]);
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('markNotificationsRead error:', err);
    res.status(500).json({ success: false, message: 'Failed to mark notifications as read' });
  }
};
