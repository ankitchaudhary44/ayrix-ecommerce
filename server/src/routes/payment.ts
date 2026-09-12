import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { ENV } from '../config/env';

const router = Router();

router.post('/create-order', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    
    if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
      res.status(400).json({ error: 'Razorpay credentials not configured in .env' });
      return;
    }

    const instance = new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    res.json({ order, key_id: ENV.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

import { User } from '../models/User';
import crypto from 'crypto';

router.post('/verify-wallet-recharge', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
    
    // Bypass signature check if secrets are missing (for dev/demo where they don't have real keys yet)
    if (ENV.RAZORPAY_KEY_SECRET) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
         res.status(400).json({ error: 'Invalid Payment Signature' });
         return;
      }
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.walletBalance += amount;
    user.walletHistory.push({
      amount,
      type: 'credit',
      description: `Recharge via Razorpay (${razorpay_payment_id})`,
      date: new Date()
    });

    await user.save();
    res.json({ message: 'Wallet recharged successfully', balance: user.walletBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify recharge' });
  }
});

router.post('/admin/credit-wallet', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'product_manager'].includes(req.user!.role)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { userId, amount, description } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'Target user not found' });
      return;
    }

    user.walletBalance += amount;
    user.walletHistory.push({
      amount,
      type: 'credit',
      description: description || 'Bonus Credit from Admin',
      date: new Date()
    });

    await user.save();
    res.json({ message: 'Wallet credited successfully', balance: user.walletBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to credit wallet' });
  }
});

router.post('/wallet-deduct', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.walletBalance < amount) {
      res.status(400).json({ error: 'Insufficient wallet balance' });
      return;
    }

    user.walletBalance -= amount;
    user.walletHistory.push({
      amount,
      type: 'debit',
      description: `Purchase deduction`,
      date: new Date()
    });

    await user.save();
    res.json({ message: 'Wallet deducted successfully', balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deduct wallet' });
  }
});

router.post('/mock-recharge', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user!._id);
    if (!user) return;

    user.walletBalance += amount;
    user.walletHistory.push({
      amount,
      type: 'credit',
      description: `Mock Recharge (Resume Portfolio)`,
      date: new Date()
    });

    await user.save();
    res.json({ message: 'Mock recharge successful', balance: user.walletBalance });
  } catch (e) {
    res.status(500).json({ error: 'Failed mock recharge' });
  }
});

router.post("/admin/credit-wallet-by-email", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!["admin", "product_manager"].includes(req.user!.role)) { res.status(403).json({ error: "Unauthorized" }); return; }
    const { email, amount, description } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    user.walletBalance = (user.walletBalance || 0) + amount;
    user.walletHistory.push({
      type: "credit", amount, description, date: new Date()
    });
    await user.save();
    res.json({ message: "Success", balance: user.walletBalance });
  } catch(e) { res.status(500).json({ error: "Server error" }); }
});

export default router;
