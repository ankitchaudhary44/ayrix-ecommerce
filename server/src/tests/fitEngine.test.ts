import { describe, it, expect } from 'vitest';
import { FitEngine } from '../services/fitEngine';
import { ReturnRiskEngine } from '../services/returnRiskEngine';
import { IUser } from '../models/User';
import { IProduct } from '../models/Product';

describe('AYRIX Fit Engine & Return Risk Engine', () => {
  const dummyUser: Partial<IUser> = {
    _id: '507f191e810c19729de860ea' as any,
    name: 'Test Customer',
    email: 'test@example.com',
    profile: {
      heightCm: 178,
      weightKg: 74,
      chestCm: 99,
      waistCm: 82,
      shoulderCm: 45,
      preferredFit: 'regular',
      usualSizes: new Map([['T-shirts', 'M']]) as any,
      preferredBrands: []
    }
  };

  const dummyProduct: Partial<IProduct> = {
    _id: '507f1f77bcf86cd799439011' as any,
    name: 'Sample Dri-FIT Tee',
    brand: 'AeroAthletics',
    category: 'T-shirts',
    price: 49.99,
    fitType: 'regular',
    fabric: 'Synthetic Stretch',
    stretchLevel: 'high',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 92, shoulderCm: 43, lengthCm: 69 },
      M: { chestCm: 100, shoulderCm: 45, lengthCm: 71 },
      L: { chestCm: 108, shoulderCm: 47, lengthCm: 73 },
      XL: { chestCm: 116, shoulderCm: 49, lengthCm: 75 }
    } as any,
    brandFitOffsetCm: 0
  };

  it('should recommend size M for chest 99cm in regular fit T-shirt', () => {
    const result = FitEngine.calculateRecommendation(
      dummyUser as IUser,
      dummyProduct as IProduct,
      []
    );

    expect(result.recommendedSize).toBe('M');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(80);
    expect(result.factors.length).toBeGreaterThan(0);
  });

  it('should compute LOW return risk for high stretch regular fit item', () => {
    const fitRec = FitEngine.calculateRecommendation(
      dummyUser as IUser,
      dummyProduct as IProduct,
      []
    );

    const riskResult = ReturnRiskEngine.calculateReturnRisk(
      dummyUser as IUser,
      dummyProduct as IProduct,
      fitRec.confidenceScore,
      fitRec.recommendedSize,
      []
    );

    expect(riskResult.riskLevel).toBe('LOW');
    expect(riskResult.returnRiskScore).toBeLessThan(35);
  });

  it('should adjust recommendation when past feedback indicates M was returned for tight_chest', () => {
    const feedbackHistory: any[] = [
      {
        userId: dummyUser._id,
        productId: dummyProduct._id,
        size: 'M',
        status: 'returned',
        returnReason: 'tight_chest'
      }
    ];

    const result = FitEngine.calculateRecommendation(
      dummyUser as IUser,
      dummyProduct as IProduct,
      feedbackHistory
    );

    expect(result.recommendedSize).toBe('L');
  });
});
