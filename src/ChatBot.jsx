import { useState, useRef, useEffect } from "react";
import { FaCommentDots } from "react-icons/fa";

const api = async (path, options = {}) => {
  const BASE = import.meta.env.VITE_API_URL || "";
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.json();
};

const CHAT_CSS = `
.cb-wrap{position:fixed;bottom:1.8rem;right:1.8rem;z-index:1500;display:flex;flex-direction:column;align-items:flex-end;gap:.75rem;}
.cb-box{width:320px;border-radius:18px;overflow:hidden;border:1px solid rgba(74,171,232,0.18);background:#0C1C2E;box-shadow:0 20px 60px rgba(0,0,0,.55);animation:fu .3s ease;}
.cb-head{background:linear-gradient(135deg,#09131E,#143524);padding:1rem 1.2rem;display:flex;align-items:center;justify-content:space-between;}
.cb-head-left{display:flex;align-items:center;gap:.65rem;}
.cb-head-dot{width:8px;height:8px;border-radius:50%;background:#1FA85E;box-shadow:0 0 6px rgba(31,168,94,.6);}
.cb-head-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:#EEF5FF;}
.cb-head-sub{font-size:.72rem;color:rgba(180,210,240,.55);margin-top:1px;}
.cb-close{background:none;border:none;color:rgba(180,210,240,.5);font-size:1.3rem;cursor:pointer;line-height:1;padding:0;transition:.18s;}
.cb-close:hover{color:#EEF5FF;}
.cb-msgs{height:260px;overflow-y:auto;padding:.9rem;display:flex;flex-direction:column;gap:.65rem;background:rgba(9,19,30,.6);}
.cb-msgs::-webkit-scrollbar{width:4px;}
.cb-msgs::-webkit-scrollbar-track{background:transparent;}
.cb-msgs::-webkit-scrollbar-thumb{background:rgba(74,171,232,.2);border-radius:2px;}
.cb-msg{max-width:86%;padding:.65rem .9rem;border-radius:12px;font-size:.84rem;line-height:1.55;font-family:'DM Sans',sans-serif;}
.cb-msg-bot{background:rgba(26,94,168,.12);border:1px solid rgba(74,171,232,.14);color:rgba(220,233,245,.9);align-self:flex-start;border-radius:4px 12px 12px 12px;}
.cb-msg-user{background:var(--green2);color:#fff;align-self:flex-end;border-radius:12px 4px 12px 12px;}
.cb-typing{align-self:flex-start;background:rgba(26,94,168,.12);border:1px solid rgba(74,171,232,.14);border-radius:4px 12px 12px 12px;padding:.65rem .9rem;display:flex;gap:4px;align-items:center;}
.cb-typing span{width:6px;height:6px;border-radius:50%;background:rgba(74,171,232,.5);animation:cb-bounce 1.2s infinite;}
.cb-typing span:nth-child(2){animation-delay:.2s;}
.cb-typing span:nth-child(3){animation-delay:.4s;}
@keyframes cb-bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-5px);}}
.cb-footer{padding:.75rem;border-top:1px solid rgba(74,171,232,.1);display:flex;gap:.5rem;background:#09131E;}
.cb-input{flex:1;padding:.62rem .85rem;background:rgba(26,94,168,.09);border:1.5px solid rgba(74,171,232,.18);border-radius:8px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:.84rem;outline:none;transition:.2s;}
.cb-input:focus{border-color:var(--green2);background:rgba(21,122,69,.09);}
.cb-input::placeholder{color:rgba(180,210,240,.22);}
.cb-send{padding:.62rem .95rem;background:var(--green2);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:.9rem;transition:.18s;flex-shrink:0;}
.cb-send:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(21,122,69,.35);}
.cb-send:disabled{background:rgba(255,255,255,.07);cursor:not-allowed;transform:none;}
.cb-bubble{width:52px;height:52px;border-radius:50%;background:var(--green2);border:none;cursor:pointer;font-size:1.6rem;color:#fff;box-shadow:0 6px 22px rgba(21,122,69,.45);transition:.22s;display:flex;align-items:center;justify-content:center;line-height:1;}.cb-bubble:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(21,122,69,.55);}
.cb-suggestions{display:flex;flex-wrap:wrap;gap:.4rem;padding:.6rem .9rem 0;}
.cb-sug{background:rgba(26,94,168,.09);border:1px solid rgba(74,171,232,.18);color:rgba(180,210,240,.8);font-family:'DM Sans',sans-serif;font-size:.73rem;font-weight:600;padding:.3rem .7rem;border-radius:999px;cursor:pointer;transition:.18s;}
.cb-sug:hover{border-color:var(--green2);color:var(--green2);}
`;

const SUGGESTIONS = [
  "What programs do you offer?",
  "How much is summer camp?",
  "Private lesson pricing?",
  "What age groups do you teach?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! 👋 I'm the MyChessFamily assistant. Ask me anything about our programs, camps, or lessons!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("mcf-chat-css")) {
      const el = document.createElement("style");
      el.id = "mcf-chat-css";
      el.textContent = CHAT_CSS;
      document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setShowSuggestions(false);
    setMessages((m) => [...m, { from: "user", text: msg }]);
    setLoading(true);
    try {
      const data = await api("/chat", {
        method: "POST",
        body: JSON.stringify({ message: msg }),
      });
      setMessages((m) => [...m, { from: "bot", text: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: "Sorry, something went wrong. Please email mychessfamily@gmail.com!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cb-wrap">
      {open && (
        <div className="cb-box">
          <div className="cb-head">
            <div className="cb-head-left">
              <div className="cb-head-dot" />
              <div>
                <div className="cb-head-title">♟ Chess Assistant</div>
                <div className="cb-head-sub">Ask me anything</div>
              </div>
            </div>
            <button className="cb-close" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="cb-msgs">
            {messages.map((m, i) => (
              <div key={i} className={`cb-msg cb-msg-${m.from}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="cb-typing">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {showSuggestions && (
            <div className="cb-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="cb-sug" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="cb-footer">
            <input
              className="cb-input"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button
              className="cb-send"
              onClick={() => send()}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
      <button className="cb-bubble" onClick={() => setOpen((v) => !v)}>
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
