import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { FitFeedback } from '../models/FitFeedback';
import { Purchase } from '../models/Purchase';

const router = Router();

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const { purchaseId, status, returnReason, comments } = req.body;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      res.status(404).json({ error: 'Purchase record not found' });
      return;
    }

    if (purchase.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'Not authorized to update this purchase' });
      return;
    }

    const feedback = await FitFeedback.create({
      userId: req.user._id,
      productId: purchase.productId,
      purchaseId: purchase._id,
      size: purchase.sizePurchased,
      status,
      returnReason: status === 'returned' ? returnReason : undefined,
      comments
    });

    purchase.status = status === 'kept' ? 'retained' : 'returned';
    await purchase.save();

    res.status(201).json({ feedback, purchase });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to submit fit feedback' });
  }
});

router.get('/my', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const feedbacks = await FitFeedback.find({ userId: req.user._id })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json({ feedbacks });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch fit feedback history' });
  }
});

export default router;
