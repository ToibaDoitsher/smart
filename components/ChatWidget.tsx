
import React, { useState, useRef, useEffect } from 'react';
import { getRubyResponse } from '../services/geminiService';
import { Message } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const quickReplies = [
    { q: "איך אוטומציה חוסכת כסף?", a: "אוטומציה מחליפה עבודה ידנית יקרה בתהליכים שרצים 24/7 בחינם. זה חוסך שעות עבודה, מונע טעויות אנוש ומאפשר לעסק לגדול בלי להגדיל את מצבת כוח האדם." },
    { q: "אילו פרויקטים טויבי מבצע?", a: "טויבי בונה סוכני AI לניהול יומנים, מערכות אוטומציה ב-Make שמתחברות ל-CRM, בוטים לשירות לקוחות בוואטסאפ וארכיטקטורת נתונים חכמה לעסקים." },
    { q: "איך מתחילים לעבוד?", a: "הכי פשוט זה להשאיר פרטים בטופס באתר או לשלוח ווטסאפ ישירות לטויבי: 052-7179418. נתחיל בשיחת אפיון קצרה ללא עלות." }
  ];

  const handleSend = async (customInput?: string) => {
    const messageText = customInput || input;
    if (!messageText.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    if (!customInput) setInput('');
    setIsTyping(true);

    try {
      const botReplyText = await getRubyResponse(messageText, messages);
      setMessages(prev => [...prev, { role: 'model', text: botReplyText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "משהו השתבש בתקשורת. טויבי זמינה עבורך ב-052-7179418." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-[380px] h-[550px] glass rounded-[2rem] overflow-hidden flex flex-col border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.6)] animate-slideUp">
          <div className="bg-white text-black p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center shadow-inner">
                <i className="fa-solid fa-sparkles text-white text-sm"></i>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[10px] uppercase tracking-wider">Ruby Assistant</span>
                <span className="text-[8px] opacity-60 font-bold italic">פתרונות AI ואוטומציה 24/7</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><i className="fa-solid fa-xmark"></i></button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#05070f]/95 scroll-smooth">
            {messages.length === 0 && (
              <div className="text-center py-6 opacity-60">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <i className="fa-solid fa-wand-magic-sparkles text-2xl text-cyan-400"></i>
                </div>
                <p className="text-sm font-bold mb-2">שלום, אני רובי!</p>
                <p className="text-[11px] leading-relaxed mb-6">אני העוזר של טויבי. איך אוכל לעזור לך לייעל את העסק היום?</p>
                
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500">נושאים נפוצים</p>
                  {quickReplies.map((qr, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(qr.q)}
                      className="w-full p-3 glass border border-white/5 rounded-xl text-[11px] text-right hover:border-cyan-500/50 transition-all text-white/80"
                    >
                      {qr.q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end animate-fadeIn'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-sans leading-relaxed shadow-sm ${
                  msg.role === 'user' ? 'bg-white/5 border border-white/10 text-white' : 'bg-cyan-600 text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && <div className="text-[10px] font-bold text-cyan-500 animate-pulse mr-2">רובי חושב...</div>}
          </div>

          <div className="p-4 bg-black border-t border-white/5 flex gap-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="כתוב הודעה לרובי..." 
              className="flex-1 bg-white/5 p-3 rounded-xl text-xs font-sans outline-none border border-white/5 focus:border-cyan-500/50 transition-colors" 
            />
            <button onClick={() => handleSend()} className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center hover:bg-cyan-500 transition-all shadow-lg active:scale-90">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(255,255,255,0.1)] hover:scale-110 active:scale-95 transition-all z-10 border border-white/10"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} text-2xl`}></i>
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default ChatWidget;
