
import { GoogleGenAI, Type } from "@google/genai";
import React, { useState } from 'react';

interface AuditResult {
  title: string;
  steps: {
    title: string;
    description: string;
    tool: string;
  }[];
  potential: string;
}

const AIAuditTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateStrategy = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Direct initialization as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `צור תוכנית עבודה מקצועית ומניעה לפעולה לאוטומציה עסקית ובינה מלאכותית עבור העסק הבא: "${input}". 
        התוכנית צריכה לכלול שלבים טכניים, כלים מומלצים (כמו Make.com, סוכני AI, CRM) ופוטנציאל חיסכון בזמן וכסף.
        התגובה חייבת להיות בעברית ובפורמט JSON בלבד.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { 
                type: Type.STRING,
                description: "כותרת התוכנית האסטרטגית"
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "שם השלב" },
                    description: { type: Type.STRING, description: "פירוט הפעולה האוטומטית" },
                    tool: { type: Type.STRING, description: "הכלי הטכנולוגי המרכזי" }
                  },
                  required: ["title", "description", "tool"]
                }
              },
              potential: { 
                type: Type.STRING, 
                description: "תיאור קצר של פוטנציאל ה-ROI"
              }
            },
            required: ["title", "steps", "potential"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("לא התקבלה תשובה מהשרת");

      const data = JSON.parse(text);
      setResult(data);
    } catch (err: any) {
      console.error("Gemini Error:", err);
      
      let errorMessage = "חלה שגיאה בתקשורת עם הבינה המלאכותית.";
      const errStr = String(err).toLowerCase();

      if (errStr.includes("xhr") || errStr.includes("rpc") || errStr.includes("network")) {
        errorMessage = "שגיאת תקשורת (XHR/RPC). אם את/ה משתמש/ת בנטפרי, ייתכן שצריך לבקש פתיחה של כתובות ה-API של גוגל (generativelanguage.googleapis.com).";
      } else if (errStr.includes("api_key") || errStr.includes("invalid")) {
        errorMessage = "מפתח ה-API אינו תקין או חסר.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-4xl glass border-white/10 rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row min-h-[550px]">
        <button onClick={onClose} className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors z-30">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        <div className={`w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-l border-white/5 flex flex-col justify-center text-right transition-all duration-500 ${result ? 'opacity-50 grayscale' : ''}`}>
          <span className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">AI BUSINESS VISION</span>
          <h2 className="text-3xl font-black mb-6 text-white leading-tight">איך נוכל לשדרג אותך?</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            ספר לנו קצת על העסק שלך ומה היית רוצה שיקרה באופן אוטומטי. הבינה המלאכותית של טויבי תבנה לך מפת דרכים ראשונית.
          </p>
          
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="תאר את העסק שלך ומה החלום שלך לאוטומציה..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-sans text-sm focus:border-cyan-500/50 outline-none min-h-[150px] mb-6 resize-none transition-all"
          />

          <button 
            onClick={generateStrategy}
            disabled={loading || !input.trim()}
            className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-cyan-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <><i className="fa-solid fa-sparkles animate-pulse"></i> בונה אסטרטגיה...</>
            ) : (
              <><span className="ml-2">צור מפת דרכים ל-AI</span><i className="fa-solid fa-bolt-lightning"></i></>
            )}
          </button>
          {error && <p className="mt-4 text-red-400 text-[11px] text-center leading-relaxed font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
        </div>

        <div className="w-full md:w-1/2 bg-[#05070f] p-8 md:p-12 overflow-y-auto max-h-[600px] flex flex-col justify-center">
          {!result ? (
            <div className="text-center opacity-30 py-20">
              <i className="fa-solid fa-lightbulb text-6xl mb-6 text-cyan-500"></i>
              <p className="font-bold text-sm tracking-widest uppercase">כאן תופיע האסטרטגיה המותאמת אישית</p>
            </div>
          ) : (
            <div className="animate-slideUp text-right">
              <h3 className="text-2xl font-black text-cyan-400 mb-2">{result.title}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-10">תכנית צמיחה מבוססת AI</p>

              <div className="space-y-8">
                {result.steps.map((step, i) => (
                  <div key={i} className="relative pr-8 border-r border-cyan-500/20">
                    <div className="absolute top-0 -right-[5px] w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    <h4 className="font-black text-white text-sm mb-2">{step.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3">{step.description}</p>
                    <span className="text-[9px] bg-cyan-500/10 px-3 py-1 rounded-md text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                      מערכת: {step.tool}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 glass border-cyan-500/30 rounded-2xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-2">פוטנציאל גידול</span>
                <span className="text-2xl font-black text-white italic">{result.potential}</span>
              </div>

              <div className="flex gap-4 mt-8">
                <a href="#contact" onClick={onClose} className="flex-1 py-4 bg-white text-black font-black rounded-xl text-center text-xs hover:bg-cyan-400 transition-colors">
                  בוא נגשים את זה
                </a>
                <button onClick={() => { setResult(null); setInput(''); }} className="flex-1 py-4 glass text-white font-black rounded-xl text-xs hover:bg-white/10">
                  ניתוח נוסף
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAuditTool;
