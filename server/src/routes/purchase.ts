import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Purchase } from '../models/Purchase';
import { Product } from '../models/Product';

const router = Router();

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const { productId, sizePurchased, recommendedSize, confidenceScore, returnRiskLevel } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const purchase = await Purchase.create({
      userId: req.user._id,
      productId: product._id,
      sizePurchased,
      priceAtPurchase: product.price,
      status: 'pending_feedback',
      recommendedSize: recommendedSize || sizePurchased,
      confidenceScore: confidenceScore || 85,
      returnRiskLevel: returnRiskLevel || 'LOW'
    });

    res.status(201).json({ purchase });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to record purchase' });
  }
});

router.post('/checkout', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const { items } = req.body;
    
    const purchases = [];
    for (const item of items) {
      const pId = item.product._id || item.product.id;
      const product = await Product.findById(pId);
      if (product) {
        const purchase = await Purchase.create({
          userId: req.user._id,
          productId: product._id,
          sizePurchased: item.size,
          priceAtPurchase: product.price,
          status: 'pending_feedback',
          shippingStatus: 'processing',
          recommendedSize: item.size,
          confidenceScore: 90,
          returnRiskLevel: 'LOW'
        });
        purchases.push(purchase);
      }
    }

    res.status(201).json({ success: true, purchases });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to process checkout' });
  }
});

router.get('/my', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const purchases = await Purchase.find({ userId: req.user._id })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json({ purchases });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch purchase history' });
  }
});

export default router;
