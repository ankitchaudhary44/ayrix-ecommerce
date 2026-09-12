import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Coupon } from '../models/Coupon';

const router = Router();
router.use(authenticateToken);

// Get all coupons (Admin/PM only)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'product_manager'].includes(req.user!.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    const coupons = await Coupon.find().populate('createdBy', 'name');
    res.json({ coupons });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// Create coupon (Admin/PM only)
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'product_manager'].includes(req.user!.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    const { code, discountType, discountValue, validUntil } = req.body;
    
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ error: 'Coupon code already exists' });
      return;
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      validUntil,
      createdBy: req.user!._id
    });
    await coupon.save();
    res.status(201).json({ coupon });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// Validate coupon (Customer)
router.post('/validate', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
      res.status(404).json({ error: 'Invalid coupon code' });
      return;
    }
    if (new Date() > coupon.validUntil) {
      res.status(400).json({ error: 'Coupon has expired' });
      return;
    }
    
    res.json({ 
      valid: true, 
      discountType: coupon.discountType, 
      discountValue: coupon.discountValue 
    });
  } catch (err) {
    res.status(500).json({ error: 'Validation failed' });
  }
});

export default router;
