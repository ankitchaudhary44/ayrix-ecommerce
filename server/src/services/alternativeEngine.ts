import { Product, IProduct } from '../models/Product';
import { IUser } from '../models/User';
import { IFitFeedback } from '../models/FitFeedback';
import { FitEngine } from './fitEngine';
import { ReturnRiskEngine } from './returnRiskEngine';

export interface IAlternativeProductRecommendation {
  product: IProduct;
  recommendedSize: string;
  confidenceScore: number;
  returnRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  returnRiskScore: number;
  reasonText: string;
}

export class AlternativeEngine {
  public static async findBetterFitAlternatives(
    user: IUser,
    currentProduct: IProduct,
    feedbacks: IFitFeedback[] = [],
    limit = 3
  ): Promise<IAlternativeProductRecommendation[]> {
    const candidateProducts = await Product.find({
      _id: { $ne: currentProduct._id },
      category: currentProduct.category
    }).limit(15);

    const scoredAlternatives: IAlternativeProductRecommendation[] = [];

    for (const cand of candidateProducts) {
      const fitRec = FitEngine.calculateRecommendation(user, cand, feedbacks);
      const riskResult = ReturnRiskEngine.calculateReturnRisk(
        user,
        cand,
        fitRec.confidenceScore,
        fitRec.recommendedSize,
        feedbacks
      );

      if (fitRec.confidenceScore >= 75 && riskResult.returnRiskScore < 40) {
        let reasonText = `Features a ${cand.fitType} fit with higher stretch tolerance (${cand.stretchLevel} stretch).`;
        if (cand.fitType === 'regular' && currentProduct.fitType === 'slim') {
          reasonText = `Regular fit cut provides better ease margin for your chest measurement.`;
        }

        scoredAlternatives.push({
          product: cand,
          recommendedSize: fitRec.recommendedSize,
          confidenceScore: fitRec.confidenceScore,
          returnRiskLevel: riskResult.riskLevel,
          returnRiskScore: riskResult.returnRiskScore,
          reasonText
        });
      }
    }

    scoredAlternatives.sort((a, b) => b.confidenceScore - a.confidenceScore);
    return scoredAlternatives.slice(0, limit);
  }
}
