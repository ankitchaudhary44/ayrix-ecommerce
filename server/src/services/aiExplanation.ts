import { ENV } from '../config/env';

export interface IAIGenerationInput {
  productName: string;
  brand: string;
  category: string;
  fitType: string;
  recommendedSize: string;
  confidenceScore: number;
  returnRiskLevel: string;
  factors: string[];
  concerns: string[];
}

export class AIExplanationService {
  public static async generateExplanation(input: IAIGenerationInput): Promise<{ explanation: string, usingFallback: boolean }> {
    if (!ENV.GEMINI_API_KEY) {
      return { explanation: this.generateFallbackExplanation(input), usingFallback: true };
    }

    try {
      const prompt = `
You are the AYRIX AI Fashion Fit Engine. Convert the following calculated fit metrics into a clear, helpful, customer-facing paragraph explaining why size ${input.recommendedSize} is recommended. Keep it professional and under 60 words.

Product: ${input.productName} by ${input.brand} (${input.category}, ${input.fitType} fit)
Recommended Size: ${input.recommendedSize}
Confidence Score: ${input.confidenceScore}%
Return Risk Level: ${input.returnRiskLevel}
Key Fit Factors: ${input.factors.join('; ')}
Potential Concerns: ${input.concerns.join('; ') || 'None'}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${ENV.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        return { explanation: this.generateFallbackExplanation(input), usingFallback: true };
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text && text.trim().length > 0) {
        return { explanation: text.trim(), usingFallback: false };
      }

      return { explanation: this.generateFallbackExplanation(input), usingFallback: true };
    } catch (error) {
      return { explanation: this.generateFallbackExplanation(input), usingFallback: true };
    }
  }

  private static generateFallbackExplanation(input: IAIGenerationInput): string {
    const factorStr = input.factors.length > 0 ? input.factors[0] : 'matches standard body proportion metrics';
    let text = `AYRIX recommends size ${input.recommendedSize} with ${input.confidenceScore}% confidence because ${factorStr.toLowerCase()}`;
    
    if (input.concerns.length > 0) {
      text += `. Note: ${input.concerns[0]}`;
    } else {
      text += `. The overall predicted return risk is ${input.returnRiskLevel.toLowerCase()}.`;
    }

    return text;
  }
}
