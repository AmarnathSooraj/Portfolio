"use client";

import { useState, useRef, useEffect } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const TARGET_PHONE = "8075595509";

  const handleSend = () => {
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setSending(true);
    setError("");
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Name: ${name.trim()}\nPhone: ${cleanPhone}\nEmail: ${email.trim()}\nMessage: ${message.trim()}`
    );
    const whatsapp = `https://wa.me/${TARGET_PHONE}?text=${text}`;
    const popup = window.open(whatsapp, "_blank");
    if (!popup) {
      setError("Pop-up blocked. Please allow pop-ups for this site.");
      if (mountedRef.current) setSending(false);
      return;
    }
    setTimeout(() => {
      if (mountedRef.current) setSending(false);
    }, 2000);
  };

  const inputClass =
    "w-full bg-transparent border border-[#555] rounded px-3 py-2 text-[#ff69b4] outline-none focus:border-[#ff69b4] text-sm";
  const labelClass = "text-[#66b3ff] text-sm";

  return (
    <div className="space-y-3 py-2 max-w-md" onClick={(e) => e.stopPropagation()}>
      <div>
        <label className={labelClass}>Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Your name"
        />
      </div>
      <div>
        <label className={labelClass}>Phone *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          placeholder="+1234567890"
        />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className={labelClass}>Message *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} min-h-[80px] resize-y`}
          placeholder="Your message..."
        />
      </div>
      {error && (
        <p className="text-[#ff3355] text-xs">{error}</p>
      )}
      <button
        onClick={handleSend}
        disabled={sending || !name.trim() || !phone.trim() || !message.trim()}
        className="w-full px-4 py-2 text-sm text-[#00ff41] border border-[#00ff41]/40 hover:border-[#00ff41] hover:bg-[#00ff41]/5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {sending ? "Opening WhatsApp..." : "Send via WhatsApp"}
      </button>
    </div>
  );
}
