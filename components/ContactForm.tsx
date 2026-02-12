
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`https://formspree.io/f/maqdqavz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setStatus('success');
      else setStatus('error');
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-20 glass rounded-[3rem] border-cyan-500/50 bg-[#05070f] font-mono">
        <div className="text-cyan-500 text-6xl mb-8">> DONE</div>
        <h3 className="text-3xl font-black mb-4">המערכת קיבלה את הנתונים</h3>
        <p className="text-gray-400">טויבי יחזור אליכם בהקדם.</p>
        <button onClick={() => setStatus('idle')} className="mt-10 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-cyan-400">Back to Shell</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-slate-800/80 p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">root@toiby_systems:~/init_process</div>
        <div></div>
      </div>

      <div className="glass p-10 md:p-16 bg-[#05070f]/90 relative">
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-4 text-white">בונה מערכות?</h2>
          <p className="text-gray-500 font-mono text-sm">> השאירו פרטים להזרקת קוד לאוטומציה העסקית שלכם.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 font-mono">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-cyan-500 text-xs tracking-widest">NAME_INPUT</label>
              <input name="name" required placeholder="שם מלא" className="w-full bg-black/40 border border-white/10 p-5 rounded-xl focus:border-cyan-500 outline-none text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-cyan-500 text-xs tracking-widest">EMAIL_INPUT</label>
              <input name="email" required type="email" placeholder="דואר אלקטרוני" className="w-full bg-black/40 border border-white/10 p-5 rounded-xl focus:border-cyan-500 outline-none text-white" />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-cyan-500 text-xs tracking-widest">OBJECTIVE_STRING</label>
            <textarea name="message" required rows={4} placeholder="תיאור האוטומציה הנדרשת..." className="w-full bg-black/40 border border-white/10 p-5 rounded-xl focus:border-cyan-500 outline-none text-white resize-none" />
          </div>

          <button type="submit" disabled={status === 'sending'} className="w-full py-6 bg-cyan-600 text-white font-black text-xl rounded-xl hover:bg-cyan-500 transition-all flex items-center justify-center gap-4 group">
            <span>{status === 'sending' ? 'EXECUTING...' : 'RUN_SYSTEM_SYNC'}</span>
            <i className="fa-solid fa-terminal group-hover:translate-x-2 transition-transform"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
