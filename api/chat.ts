
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { text, history = [] } = await req.json();
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing API Key in Vercel settings' }), { status: 500 });
    }

    const systemPrompt = `שמך הוא 'רובי', העוזר הדיגיטלי של טויבי דויטשר.
טויבי היא מומחית לפיתוח אתרים, מערכות AI ואוטומציה עסקית חכמה.
המטרה שלך היא ללוות שיחה רציפה, טבעית וזורמת עם הלקוח.
אל תחזור על ההצגה שלך בכל הודעה – רק בתחילת שיחה.
זכור את ההקשר של מה שנאמר קודם.

המטרה שלך היא לשווק את השירותים של טויבי ללקוחות פוטנציאליים:
1. מה טויבי מציעה? בניית אתרים מרהיבים, חיבור העסק לבינה מלאכותית (כמו צ'אטבוטים חכמים), ואוטומציה של תהליכים (חיסכון בזמן יקר ע"י כך שהמחשב עושה עבודה סיזיפית במקום בני אדם).
2. למה זה כדאי? זה מעלה את המכירות, חוסך כסף על כוח אדם, ומונע טעויות אנוש.
3. הנעה לפעולה: בסוף שיחה או כשלקוח מתעניין, תציע לו להשאיר פרטים בטופס הזה: https://form.fillout.com/t/hxPcTnn2CVus
4. פרטי קשר: טלפון: 052-7179418 | מייל: t025959714@gmail.com

הנחיות חשובות:
- ענה תמיד בעברית רהוטה ומקצועית.
- שמור על תשובות קצרות וענייניות.
- הצג את עצמך רק בהודעה הראשונה.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: text }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.5,
        max_tokens: 400
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'שגיאת שרת: ' + error.message }), { status: 500 });
  }
}
