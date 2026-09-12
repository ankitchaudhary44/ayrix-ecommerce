import { IUser } from '../models/User';
import { IProduct, ISizeMeasurement } from '../models/Product';
import { IFitFeedback } from '../models/FitFeedback';

export interface ISizeFitResult {
  size: string;
  score: number;
  measurementDelta: Record<string, number>;
  easeCm: number;
}

export interface IFitRecommendation {
  recommendedSize: string;
  confidenceScore: number;
  factors: string[];
  concerns: string[];
  sizeScores: Record<string, number>;
  detailedResults: Record<string, ISizeFitResult>;
}

export class FitEngine {
  public static calculateRecommendation(
    user: IUser,
    product: IProduct,
    feedbacks: IFitFeedback[] = []
  ): IFitRecommendation {
    const profile = user.profile || {};
    const sizeChart = product.sizeChart || {};
    const availableSizes = product.sizes || Object.keys(sizeChart || {});

    const sizeScores: Record<string, number> = {};
    const detailedResults: Record<string, ISizeFitResult> = {};
    const factors: string[] = [];
    const concerns: string[] = [];

    const feedbackAdjustments = this.computeFeedbackAdjustments(user, product, feedbacks);

    for (const size of availableSizes) {
      const specs: ISizeMeasurement | undefined = sizeChart instanceof Map ? sizeChart.get(size) : (sizeChart as any)[size];
      if (!specs) continue;

      let score = 70;
      let totalWeight = 0;
      let weightedSum = 0;
      const measurementDelta: Record<string, number> = {};
      let primaryEase = 0;

      if (profile.chestCm && specs.chestCm) {
        const expectedEase = this.getExpectedEase(product.fitType, product.stretchLevel, 'chest');
        const actualEase = (specs.chestCm + (product.brandFitOffsetCm || 0)) - profile.chestCm;
        primaryEase = actualEase;
        measurementDelta.chest = actualEase - expectedEase;

        const diff = Math.abs(actualEase - expectedEase);
        let chestScore = Math.max(0, 100 - (diff * 12));
        weightedSum += chestScore * 0.45;
        totalWeight += 0.45;
      }

      if (profile.waistCm && specs.waistCm) {
        const expectedEase = this.getExpectedEase(product.fitType, product.stretchLevel, 'waist');
        const actualEase = specs.waistCm - profile.waistCm;
        measurementDelta.waist = actualEase - expectedEase;

        const diff = Math.abs(actualEase - expectedEase);
        let waistScore = Math.max(0, 100 - (diff * 10));
        weightedSum += waistScore * 0.30;
        totalWeight += 0.30;
      }

      if (profile.shoulderCm && specs.shoulderCm) {
        const expectedEase = 2;
        const actualEase = specs.shoulderCm - profile.shoulderCm;
        measurementDelta.shoulder = actualEase - expectedEase;

        const diff = Math.abs(actualEase - expectedEase);
        let shoulderScore = Math.max(0, 100 - (diff * 14));
        weightedSum += shoulderScore * 0.25;
        totalWeight += 0.25;
      }

      if (totalWeight > 0) {
        score = weightedSum / totalWeight;
      }

      const usualSize = profile.usualSizes instanceof Map 
        ? profile.usualSizes.get(product.category) 
        : (profile.usualSizes as any)?.[product.category];

      if (usualSize) {
        if (size.toUpperCase() === usualSize.toUpperCase()) {
          score += 15;
        } else if (this.isAdjacentSize(size, usualSize)) {
          score += 5;
        } else {
          score -= 15;
        }
      }

      if (profile.preferredFit) {
        if (profile.preferredFit === product.fitType) {
          score += 8;
        } else if (profile.preferredFit === 'tight' && product.fitType === 'oversized') {
          if (size.toUpperCase() < (usualSize || 'M').toUpperCase()) score += 5;
        }
      }

      const adjustment = feedbackAdjustments[size] || 0;
      score += adjustment;

      score = Math.min(99, Math.max(25, Math.round(score)));

      sizeScores[size] = score;
      detailedResults[size] = {
        size,
        score,
        measurementDelta,
        easeCm: primaryEase
      };
    }

    let recommendedSize = availableSizes[0] || 'M';
    let maxScore = -1;

    for (const [sz, sc] of Object.entries(sizeScores)) {
      if (sc > maxScore) {
        maxScore = sc;
        recommendedSize = sz;
      }
    }

    const confidenceScore = maxScore > 0 ? maxScore : 82;

    const usualSize = profile.usualSizes instanceof Map 
      ? profile.usualSizes.get(product.category) 
      : (profile.usualSizes as any)?.[product.category];

    if (usualSize && recommendedSize.toUpperCase() === usualSize.toUpperCase()) {
      factors.push(`Matches your recorded usual size (${usualSize}) for ${product.category}.`);
    }

    if (profile.chestCm) {
      factors.push(`Garment chest dimensions align cleanly with your profile (${profile.chestCm} cm).`);
    }

    if (product.brandFitOffsetCm !== 0) {
      const direction = product.brandFitOffsetCm < 0 ? 'slightly small' : 'slightly generous';
      factors.push(`Adjusted for ${product.brand}'s sizing baseline which runs ${direction}.`);
    }

    if (profile.preferredFit === product.fitType) {
      factors.push(`The product's ${product.fitType} fit matches your preferred fit style.`);
    }

    const sizeFeedback = feedbacks.filter(f => f.productId.toString() === product._id.toString() || f.status === 'kept');
    if (sizeFeedback.length > 0) {
      factors.push(`Incorporated previous retained order history for similar garments.`);
    }

    const recResult = detailedResults[recommendedSize];
    if (recResult && recResult.measurementDelta.shoulder && Math.abs(recResult.measurementDelta.shoulder) > 3) {
      concerns.push(`Shoulder seam may fit slightly ${recResult.measurementDelta.shoulder > 0 ? 'broader' : 'snugger'} than standard.`);
    }

    if (product.stretchLevel === 'none' && product.fitType === 'slim') {
      concerns.push(`Non-stretch fabric in slim silhouette offers zero ease flexibility.`);
    }

    if (recResult && recResult.measurementDelta.chest && recResult.measurementDelta.chest < -1) {
      concerns.push(`Chest width is on the tighter threshold for your physical measurements.`);
    }

    if (factors.length === 0) {
      factors.push(`Recommended based on general category proportions and sizing grid.`);
    }

    return {
      recommendedSize,
      confidenceScore,
      factors,
      concerns,
      sizeScores,
      detailedResults
    };
  }

  private static getExpectedEase(fitType: string, stretchLevel: string, region: 'chest' | 'waist'): number {
    let baseEase = region === 'chest' ? 6 : 4;
    if (fitType === 'slim') baseEase -= 3;
    if (fitType === 'relaxed') baseEase += 4;
    if (fitType === 'oversized') baseEase += 8;

    if (stretchLevel === 'high') baseEase -= 2;
    if (stretchLevel === 'none') baseEase += 2;

    return baseEase;
  }

  private static isAdjacentSize(size1: string, size2: string): boolean {
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const idx1 = order.indexOf(size1.toUpperCase());
    const idx2 = order.indexOf(size2.toUpperCase());
    if (idx1 === -1 || idx2 === -1) return false;
    return Math.abs(idx1 - idx2) === 1;
  }

  private static computeFeedbackAdjustments(
    user: IUser,
    product: IProduct,
    feedbacks: IFitFeedback[]
  ): Record<string, number> {
    const adjustments: Record<string, number> = {};

    for (const fb of feedbacks) {
      if (fb.status === 'returned' && fb.returnReason) {
        if (fb.returnReason === 'too_small' || fb.returnReason === 'tight_chest') {
          adjustments[fb.size] = (adjustments[fb.size] || 0) - 18;
          const larger = this.getShiftedSize(fb.size, 1);
          if (larger) adjustments[larger] = (adjustments[larger] || 0) + 12;
        } else if (fb.returnReason === 'too_large' || fb.returnReason === 'loose_shoulder' || fb.returnReason === 'too_long') {
          adjustments[fb.size] = (adjustments[fb.size] || 0) - 18;
          const smaller = this.getShiftedSize(fb.size, -1);
          if (smaller) adjustments[smaller] = (adjustments[smaller] || 0) + 12;
        }
      } else if (fb.status === 'kept') {
        adjustments[fb.size] = (adjustments[fb.size] || 0) + 10;
      }
    }

    return adjustments;
  }

  private static getShiftedSize(size: string, shift: number): string | null {
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const idx = order.indexOf(size.toUpperCase());
    if (idx === -1) return null;
    const targetIdx = idx + shift;
    if (targetIdx >= 0 && targetIdx < order.length) {
      return order[targetIdx];
    }
    return null;
  }
}
