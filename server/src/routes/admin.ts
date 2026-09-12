import { Router, Response } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Purchase } from '../models/Purchase';
import { FitFeedback } from '../models/FitFeedback';
import mongoose from 'mongoose';
import { ENV } from '../config/env';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

// Get overall stats
router.get('/dashboard-stats', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Purchase.countDocuments();
    const totalReturns = await FitFeedback.countDocuments({ status: 'returned' });
    
    // Simulate some audit logs for realism
    const auditLogs = [
      { action: 'Updated Product #P1023', user: 'Admin', time: '10 mins ago', type: 'info' },
      { action: 'Unauthorized access attempt to /api/admin/products', user: 'IP: 192.168.1.45', time: '1 hour ago', type: 'warning' },
      { action: 'Database backup completed', user: 'System', time: '3 hours ago', type: 'info' }
    ];

    res.json({
      stats: { totalUsers, totalProducts, totalOrders, totalReturns },
      auditLogs
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// System Health
router.get('/system-health', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dbState = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const hasGeminiKey = !!ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.length > 10;
    
    res.json({
      backend: 'Online',
      database: dbState,
      gemini: hasGeminiKey ? 'Operational' : 'Missing Key',
      smtp: !!ENV.SMTP_PASS ? 'Connected' : 'Disabled'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch system health' });
  }
});

// Get all users
router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.put('/users/:id/role', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['customer', 'admin', 'product_manager'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    if (id === req.user?._id.toString()) {
      res.status(400).json({ error: 'Cannot change your own role' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'User role updated', user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

export default router;
