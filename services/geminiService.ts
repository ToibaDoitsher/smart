
import { Message } from "../types";

/**
 * Service to handle chat requests. 
 * Communicates with the Vercel Serverless Function at /api/chat
 */
export async function getRubyResponse(userMessage: string, history: Message[]) {
  try {
    const response = await fetch("/api/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: userMessage, 
        history: history.map(m => ({ 
          role: m.role === 'user' ? 'user' : 'assistant', 
          content: m.text 
        })) 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Server error');
    }

    const data = await response.json();
    return data.reply;
  } catch (error: any) {
    console.error("Chat Error:", error);
    
    // Fallback if NetFree or server is down
    if (error.message?.includes('fetch') || error.message?.includes('Network')) {
      return "נראה שיש קושי בתקשורת (אולי חסימת אינטרנט). ניתן ליצור קשר ישירות עם טויבי ב-052-7179418.";
    }
    
    return "סליחה, המוח הדיגיטלי שלי רגע בהפסקה. אפשר להשאיר הודעה לטויבי במייל או בטלפון.";
  }
}
