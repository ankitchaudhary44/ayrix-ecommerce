import { Router, Response } from 'express';
import { authenticateToken, requirePM, AuthRequest } from '../middleware/auth';
import { AnalyticsService } from '../services/analyticsService';
import { ExperimentConfig } from '../models/ExperimentConfig';

const router = Router();

router.use(authenticateToken);
router.use(requirePM);

router.get('/analytics', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const summary = await AnalyticsService.getAdminSummary();
    res.json({ summary });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate admin analytics summary' });
  }
});

router.get('/brands', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const brands = await AnalyticsService.getBrandAnalytics();
    res.json({ brands });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate brand analytics' });
  }
});

router.get('/anomalies', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const anomalies = await AnalyticsService.getFitAnomalies();
    res.json({ anomalies });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch fit anomalies' });
  }
});

router.get('/experiments', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let configs = await ExperimentConfig.find();
    if (configs.length === 0) {
      configs = [
        await ExperimentConfig.create({
          key: 'exp_fit_weights_v2',
          name: 'Fit Algorithm Weights V2',
          description: 'A/B test increasing weight of customer post-purchase return history over static body measurements',
          isEnabled: true,
          variant: 'variant_b',
          weights: {
            bodyMeasurementsWeight: 0.35,
            purchaseHistoryWeight: 0.30,
            brandHistoryWeight: 0.15,
            feedbackHistoryWeight: 0.20
          }
        }),
        await ExperimentConfig.create({
          key: 'exp_alternative_products_boost',
          name: 'High Stretch Alternative Product Boost',
          description: 'Promote alternative garments with >5% elastane stretch level when fit return risk is HIGH',
          isEnabled: true,
          variant: 'control',
          weights: {
            bodyMeasurementsWeight: 0.40,
            purchaseHistoryWeight: 0.35,
            brandHistoryWeight: 0.15,
            feedbackHistoryWeight: 0.10
          }
        })
      ];
    }
    res.json({ experiments: configs });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch experiment configurations' });
  }
});

router.put('/experiments/:key', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    const { isEnabled, variant, weights } = req.body;

    const config = await ExperimentConfig.findOneAndUpdate(
      { key },
      { isEnabled, variant, weights },
      { new: true, upsert: true }
    );
    await config.save();
    res.json({ message: 'Experiment toggled', config });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to toggle experiment' });
  }
});

import { Purchase } from '../models/Purchase';

router.get('/orders', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Purchase.find()
      .populate('userId', 'name email')
      .populate('productId', 'name brand price')
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 orders
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.put('/orders/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['processing', 'shipped', 'delivered'].includes(status)) {
       res.status(400).json({ error: 'Invalid status' });
       return;
    }
    const order = await Purchase.findByIdAndUpdate(req.params.id, { shippingStatus: status }, { new: true });
    res.json({ message: 'Status updated', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
