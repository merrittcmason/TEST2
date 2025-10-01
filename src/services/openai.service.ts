import OpenAI from 'openai';
import type { ParsedEvent } from '../types/database.types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class OpenAIService {
  static async parseNaturalLanguage(text: string): Promise<{ events: ParsedEvent[], tokensUsed: number }> {
    const currentYear = new Date().getFullYear();

    const prompt = `Parse the following text and extract calendar events. Return a JSON array of events with the following structure:
    [
      {
        "event_name": "string",
        "event_date": "YYYY-MM-DD" (assume ${currentYear} if year not specified),
        "event_time": "HH:MM:SS" or null if not specified,
        "event_tag": "string" or empty string,
        "is_all_day": boolean (true if no time specified)
      }
    ]

    Text: "${text}"

    Only return the JSON array, no additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || '[]';
    const tokensUsed = response.usage?.total_tokens || 0;

    try {
      const events = JSON.parse(content);
      return { events, tokensUsed };
    } catch (error) {
      throw new Error('Failed to parse OpenAI response');
    }
  }

  static async parseImage(imageBase64: string): Promise<{ events: ParsedEvent[], tokensUsed: number }> {
    const currentYear = new Date().getFullYear();

    const prompt = `Analyze this image and extract any calendar events, schedules, or dates mentioned. Return a JSON array of events with the following structure:
    [
      {
        "event_name": "string",
        "event_date": "YYYY-MM-DD" (assume ${currentYear} if year not specified),
        "event_time": "HH:MM:SS" or null if not specified,
        "event_tag": "string" or empty string,
        "is_all_day": boolean (true if no time specified)
      }
    ]

    Only return the JSON array, no additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || '[]';
    const tokensUsed = response.usage?.total_tokens || 0;

    try {
      const events = JSON.parse(content);
      return { events, tokensUsed };
    } catch (error) {
      throw new Error('Failed to parse OpenAI response');
    }
  }

  static checkTokenLimit(tokensUsed: number, currentUsage: number, limit: number): boolean {
    const safeguard = 2000;
    if (tokensUsed > safeguard) {
      throw new Error('Request exceeds 2000 token safeguard to prevent bulk uploads');
    }
    if (currentUsage + tokensUsed > limit) {
      throw new Error('Token limit exceeded');
    }
    return true;
  }
}
