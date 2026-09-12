import { IUser } from '../models/User';
import { IProduct } from '../models/Product';
import { IFitFeedback } from '../models/FitFeedback';

export interface IReturnRiskResult {
  returnRiskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  contributingFactors: string[];
}

export class ReturnRiskEngine {
  public static calculateReturnRisk(
    user: IUser,
    product: IProduct,
    confidenceScore: number,
    recommendedSize: string,
    feedbacks: IFitFeedback[] = []
  ): IReturnRiskResult {
    let riskScore = 100 - confidenceScore;
    const contributingFactors: string[] = [];

    if (product.stretchLevel === 'none') {
      riskScore += 12;
      contributingFactors.push('Garment features non-stretch fabric, offering lower fit tolerance.');
    } else if (product.stretchLevel === 'high') {
      riskScore -= 8;
    }

    if (product.fitType === 'slim') {
      riskScore += 10;
      contributingFactors.push('Slim fit cuts carry higher variance in customer body comfort.');
    }

    const profile = user.profile || {};
    if (profile.preferredFit && profile.preferredFit !== product.fitType) {
      riskScore += 10;
      contributingFactors.push(`Product is ${product.fitType} fit, whereas your preference is ${profile.preferredFit}.`);
    }

    if (feedbacks.length > 0) {
      const totalPast = feedbacks.length;
      const returnedCount = feedbacks.filter(f => f.status === 'returned').length;
      const returnRate = returnedCount / totalPast;

      if (returnRate > 0.4) {
        riskScore += 15;
        contributingFactors.push('Historical category return patterns indicate sensitivity to fit boundaries.');
      } else if (returnRate === 0 && totalPast >= 2) {
        riskScore -= 10;
      }
    }

    if (!profile.chestCm && !profile.waistCm && !profile.shoulderCm) {
      riskScore += 14;
      contributingFactors.push('Physical body measurements are not present in your profile.');
    }

    const boundedRiskScore = Math.min(95, Math.max(5, Math.round(riskScore)));

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (boundedRiskScore >= 45) {
      riskLevel = 'HIGH';
    } else if (boundedRiskScore >= 25) {
      riskLevel = 'MEDIUM';
    }

    if (contributingFactors.length === 0) {
      contributingFactors.push('High measurement alignment and compatible fabric stretch profile.');
    }

    return {
      returnRiskScore: boundedRiskScore,
      riskLevel,
      contributingFactors
    };
  }
}
