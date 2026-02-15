
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
    const apiKey = process.env.API_KEY;
    
    if (!input.trim()) return;
    
    if (!apiKey) {
      setError("מפתח ה-API חסר בהגדרות המערכת. נא להוסיף API_KEY ב-Vercel Settings.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
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
              title: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tool: { type: Type.STRING }
                  },
                  required: ["title", "description", "tool"]
                }
              },
              potential: { type: Type.STRING }
            },
            required: ["title", "steps", "potential"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response");

      const data = JSON.parse(text);
      setResult(data);
    } catch (err: any) {
      console.error("AI Audit Error:", err);
      let msg = "חלה שגיאה בייצור האסטרטגיה. ";
      if (err.message?.includes('403') || err.message?.includes('API_KEY')) {
        msg += "המפתח לא תקין או חסום.";
      } else if (err.message?.includes('fetch') || err.message?.includes('XHR')) {
        msg += "שגיאת תקשורת. ייתכן שיש חסימת אינטרנט.";
      }
      setError(msg);
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

        <div className={`w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-l border-white/5 flex flex-col justify-center text-right ${result ? 'opacity-50 grayscale' : ''}`}>
          <span className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">AI BUSINESS VISION</span>
          <h2 className="text-3xl font-black mb-6 text-white leading-tight">איך נוכל לשדרג אותך?</h2>
          
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="תאר את העסק שלך ומה החלום שלך לאוטומציה..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:border-cyan-500/50 outline-none min-h-[150px] mb-6 resize-none"
          />

          <button 
            onClick={generateStrategy}
            disabled={loading || !input.trim()}
            className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-cyan-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "מעבד נתונים..." : "צור מפת דרכים ל-AI"}
          </button>
          {error && <p className="mt-4 text-red-400 text-[11px] text-center font-bold bg-red-500/10 p-3 rounded-lg">{error}</p>}
        </div>

        <div className="w-full md:w-1/2 bg-[#05070f] p-8 md:p-12 overflow-y-auto max-h-[600px] flex flex-col justify-center">
          {!result ? (
            <div className="text-center opacity-30 py-20">
              <i className="fa-solid fa-lightbulb text-6xl mb-6 text-cyan-500"></i>
              <p className="font-bold text-sm tracking-widest uppercase">כאן תופיע האסטרטגיה</p>
            </div>
          ) : (
            <div className="text-right animate-slideUp">
              <h3 className="text-2xl font-black text-cyan-400 mb-6">{result.title}</h3>
              <div className="space-y-6">
                {result.steps.map((step, i) => (
                  <div key={i} className="pr-6 border-r border-cyan-500/20">
                    <h4 className="font-black text-white text-sm mb-1">{step.title}</h4>
                    <p className="text-gray-400 text-xs mb-2">{step.description}</p>
                    <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-tighter">כלי מומלץ: {step.tool}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 p-5 glass border-cyan-500/30 rounded-2xl text-center">
                <span className="text-xl font-black text-white italic">{result.potential}</span>
              </div>
              <button onClick={() => {setResult(null); setInput('');}} className="w-full mt-6 py-4 glass text-white text-xs font-bold rounded-xl">ניתוח חדש</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAuditTool;
