import { ENV } from '../config/env';

export class AIHelpdeskService {
  public static async autoReply(query: string): Promise<{ reply: string; needsHuman: boolean }> {
    if (!ENV.GEMINI_API_KEY || ENV.GEMINI_API_KEY.length < 10) {
      return { reply: "Our AI assistant is currently offline. A human agent will respond shortly.", needsHuman: true };
    }

    try {
      const prompt = `You are the AYRIX Customer Support AI. 
AYRIX is a premium e-commerce platform featuring an AI Fit Engine. 
You must answer the customer's query if it is simple (e.g. shipping times, return policies, how to use the fit engine). 
If it is complex, requires account changes, asks for a custom coupon, or you do not know the answer, you must end your response with EXACTLY the phrase "[HANDOFF]" so the system knows to assign a human.

Customer Query: "${query}"

Respond concisely and professionally in a helpful tone.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${ENV.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Gemini API Error');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const needsHuman = text.includes('[HANDOFF]');
      const cleanReply = text.replace('[HANDOFF]', '').trim();

      return {
        reply: cleanReply || "I'm not sure, let me get a human for you.",
        needsHuman: needsHuman || !cleanReply
      };
    } catch (error) {
      console.error('Gemini Helpdesk Error:', error);
      return { reply: "I'm having trouble processing that right now. I will escalate this to a human agent.", needsHuman: true };
    }
  }
}
