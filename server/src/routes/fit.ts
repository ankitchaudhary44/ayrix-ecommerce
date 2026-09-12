import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { FitFeedback } from '../models/FitFeedback';
import { FitEngine } from '../services/fitEngine';
import { ReturnRiskEngine } from '../services/returnRiskEngine';
import { AlternativeEngine } from '../services/alternativeEngine';
import { AIExplanationService } from '../services/aiExplanation';

const router = Router();

const defaultProductFallback: any = {
  _id: '66e1e8271101a1a1a1a1a1a1',
  name: 'AeroTech Performance Dri-FIT Tee',
  brand: 'AeroAthletics',
  category: 'T-shirts',
  price: 49.99,
  fitType: 'regular',
  fabric: '88% Polyester, 12% Elastane',
  stretchLevel: 'high',
  sizes: ['S', 'M', 'L', 'XL'],
  sizeChart: {
    S: { chestCm: 92, shoulderCm: 43, lengthCm: 69, sleeveCm: 20 },
    M: { chestCm: 100, shoulderCm: 45, lengthCm: 71, sleeveCm: 21 },
    L: { chestCm: 108, shoulderCm: 47, lengthCm: 73, sleeveCm: 22 },
    XL: { chestCm: 116, shoulderCm: 49, lengthCm: 75, sleeveCm: 23 }
  },
  brandFitOffsetCm: 0
};

router.post('/recommend', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, profile: overrideProfile } = req.body;

    let product: any = null;
    if (productId) {
      try {
        product = await Product.findById(productId);
      } catch (e) {}
    }

    if (!product) {
      product = defaultProductFallback;
    }

    let user: any = req.user || {
      _id: null,
      name: 'Guest Customer',
      email: 'guest@ayrix.com',
      profile: overrideProfile || { heightCm: 178, chestCm: 99, waistCm: 82, preferredFit: 'regular', usualSizes: { 'T-shirts': 'M' } }
    };

    if (overrideProfile && user.profile) {
      user.profile = { ...user.profile, ...overrideProfile };
    }

    let feedbacks: any[] = [];
    if (user._id) {
      try {
        feedbacks = await FitFeedback.find({ userId: user._id });
      } catch (e) {}
    }

    const fitResult = FitEngine.calculateRecommendation(user, product, feedbacks);
    const riskResult = ReturnRiskEngine.calculateReturnRisk(
      user,
      product,
      fitResult.confidenceScore,
      fitResult.recommendedSize,
      feedbacks
    );

    let alternatives: any[] = [];
    try {
      alternatives = await AlternativeEngine.findBetterFitAlternatives(user, product, feedbacks, 3);
    } catch (e) {}

    const aiExplanation = await AIExplanationService.generateExplanation({
      productName: product.name,
      brand: product.brand,
      category: product.category,
      fitType: product.fitType,
      recommendedSize: fitResult.recommendedSize,
      confidenceScore: fitResult.confidenceScore,
      returnRiskLevel: riskResult.riskLevel,
      factors: fitResult.factors,
      concerns: fitResult.concerns
    });

    res.json({
      productId: product._id,
      recommendedSize: fitResult.recommendedSize,
      confidenceScore: fitResult.confidenceScore,
      returnRiskScore: riskResult.returnRiskScore,
      riskLevel: riskResult.riskLevel,
      factors: fitResult.factors,
      concerns: fitResult.concerns,
      riskContributingFactors: riskResult.contributingFactors,
      aiExplanation: aiExplanation.explanation,
      aiFallback: aiExplanation.usingFallback,
      sizeScores: fitResult.sizeScores,
      alternatives
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Recommendation processing failed' });
  }
});

router.post('/compare', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, sizeA = 'M', sizeB = 'L' } = req.body;

    let product: any = null;
    if (productId) {
      try {
        product = await Product.findById(productId);
      } catch (e) {}
    }

    if (!product) {
      product = defaultProductFallback;
    }

    const chart = product.sizeChart instanceof Map ? Object.fromEntries(product.sizeChart) : product.sizeChart;
    const specsA = (chart as any)[sizeA] || { chestCm: 100, shoulderCm: 45, lengthCm: 71 };
    const specsB = (chart as any)[sizeB] || { chestCm: 108, shoulderCm: 47, lengthCm: 73 };

    let user: any = req.user || { name: 'Guest Customer', profile: { preferredFit: 'regular' } };

    const fitResult = FitEngine.calculateRecommendation(user, product, []);

    const scoreA = fitResult.sizeScores[sizeA] || 82;
    const scoreB = fitResult.sizeScores[sizeB] || 74;

    const riskA = ReturnRiskEngine.calculateReturnRisk(user, product, scoreA, sizeA, []);
    const riskB = ReturnRiskEngine.calculateReturnRisk(user, product, scoreB, sizeB, []);

    const recommendationText = scoreA >= scoreB 
      ? `${sizeA} is better aligned with your chest and shoulder comfort thresholds.`
      : `${sizeB} provides extra ease suitable for your fit preference.`;

    res.json({
      productName: product.name,
      sizeA: {
        size: sizeA,
        specs: specsA,
        fitScore: scoreA,
        riskLevel: riskA.riskLevel,
        riskScore: riskA.returnRiskScore
      },
      sizeB: {
        size: sizeB,
        specs: specsB,
        fitScore: scoreB,
        riskLevel: riskB.riskLevel,
        riskScore: riskB.returnRiskScore
      },
      betterSize: scoreA >= scoreB ? sizeA : sizeB,
      explanation: recommendationText
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Size comparison failed' });
  }
});

export default router;
