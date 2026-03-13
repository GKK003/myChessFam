import { useState, useRef, useEffect } from "react";
import { useLang } from "./LangContext";

const api = async (path, options = {}) => {
  const BASE = import.meta.env.VITE_API_URL || "";
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};

const CHAT_CSS = `
.cb-wrap{position:fixed;bottom:1.8rem;right:1.8rem;z-index:900;display:flex;flex-direction:column;align-items:flex-end;gap:.75rem;}.cb-box{
  width:340px;
  max-width:calc(100vw - 24px);
  border-radius:18px;
  overflow:hidden;
  border:1px solid rgba(74,171,232,0.18);
  background:#0C1C2E;
  box-shadow:0 20px 60px rgba(0,0,0,.55);
  animation:chatPop .28s ease;
  transform-origin:bottom right;
}
@keyframes chatPop{
  from{opacity:0;transform:translateY(10px) scale(.96);}
  to{opacity:1;transform:translateY(0) scale(1);}
}
.cb-head{background:linear-gradient(135deg,#09131E,#143524);padding:1rem 1.2rem;display:flex;align-items:center;justify-content:space-between;}
.cb-head-left{display:flex;align-items:center;gap:.65rem;}
.cb-head-dot{width:8px;height:8px;border-radius:50%;background:#1FA85E;box-shadow:0 0 6px rgba(31,168,94,.6);}
.cb-head-title{font-size:1rem;font-weight:700;color:#EEF5FF;}
.cb-head-sub{font-size:.72rem;color:rgba(180,210,240,.55);margin-top:1px;}
.cb-close{background:none;border:none;color:rgba(180,210,240,.5);font-size:1.3rem;cursor:pointer;line-height:1;padding:0;}
.cb-close:hover{color:#EEF5FF;}
.cb-msgs{height:340px;overflow-y:auto;padding:.9rem;display:flex;flex-direction:column;gap:.65rem;background:rgba(9,19,30,.6);}
.cb-msg{max-width:88%;padding:.7rem .9rem;border-radius:12px;font-size:.85rem;line-height:1.55;}
.cb-msg-bot{background:rgba(26,94,168,.12);border:1px solid rgba(74,171,232,.14);color:rgba(220,233,245,.92);align-self:flex-start;border-radius:4px 12px 12px 12px;}
.cb-msg-user{background:#1FA85E;color:#fff;align-self:flex-end;border-radius:12px 4px 12px 12px;}
.cb-typing{align-self:flex-start;background:rgba(26,94,168,.12);border:1px solid rgba(74,171,232,.14);border-radius:4px 12px 12px 12px;padding:.7rem .9rem;display:flex;gap:4px;align-items:center;}
.cb-typing span{width:6px;height:6px;border-radius:50%;background:rgba(74,171,232,.5);animation:cb-bounce 1.2s infinite;}
.cb-typing span:nth-child(2){animation-delay:.2s;}
.cb-typing span:nth-child(3){animation-delay:.4s;}
@keyframes cb-bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-5px);}}
.cb-footer{padding:.75rem;border-top:1px solid rgba(74,171,232,.1);display:flex;gap:.5rem;background:#09131E;}
.cb-input{flex:1;padding:.68rem .85rem;background:rgba(26,94,168,.09);border:1.5px solid rgba(74,171,232,.18);border-radius:8px;color:#DCE9F5;font-size:.84rem;outline:none;}
.cb-input:focus{border-color:#1FA85E;background:rgba(21,122,69,.09);}
.cb-send{padding:.68rem 1rem;background:#1FA85E;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:.9rem;flex-shrink:0;}
.cb-send:disabled{background:rgba(255,255,255,.08);cursor:not-allowed;}
.cb-bubble{
  width:56px;height:56px;border-radius:50%;background:#1FA85E;border:none;cursor:pointer;color:#fff;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 6px 22px rgba(21,122,69,.45);
  transition:transform .25s ease,box-shadow .25s ease,background .25s ease;
}
.cb-bubble:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 12px 30px rgba(21,122,69,.55);}
.cb-bubble-icon{display:inline-flex;align-items:center;justify-content:center;line-height:1;font-size:1.5rem;transition:transform .28s ease,opacity .2s ease;}
.cb-bubble.open .cb-bubble-icon{transform:rotate(90deg) scale(1.08);}
.cb-suggestions{display:flex;flex-wrap:wrap;gap:.4rem;padding:.6rem .9rem 0;}
.cb-sug{background:rgba(26,94,168,.09);border:1px solid rgba(74,171,232,.18);color:rgba(180,210,240,.8);font-size:.73rem;font-weight:600;padding:.3rem .7rem;border-radius:999px;cursor:pointer;}
.cb-sug:hover{border-color:#1FA85E;color:#1FA85E;}
@media (max-width: 520px){
  .cb-wrap{right:.8rem;bottom:.8rem;left:.8rem;align-items:stretch;}
  .cb-box{width:100%;}
  .cb-bubble{align-self:flex-end;}
}
`;

export default function ChatBot() {
  const { t } = useLang();
  const cb = t.chatbot;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: cb.welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);

  // Update welcome message when language changes (only if chat is at default state)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].from === "bot") {
        return [{ from: "bot", text: cb.welcome }];
      }
      return prev;
    });
    setShowSuggestions(true);
  }, [cb.welcome]);

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

  const send = async (manualText) => {
    const msg = String(manualText || input).trim();
    if (!msg || loading) return;

    const nextMessages = [...messages, { from: "user", text: msg }];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setShowSuggestions(false);

    try {
      const history = nextMessages
        .slice(-8)
        .filter((m) => m.from === "user" || m.from === "bot")
        .map((m) => ({
          role: m.from === "bot" ? "assistant" : "user",
          content: m.text,
        }));

      const data = await api("/chat", {
        method: "POST",
        body: JSON.stringify({
          message: msg,
          history: history.slice(0, -1),
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.reply || cb.fallback,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: err.message || cb.fallback,
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
                <div className="cb-head-title">{cb.title}</div>
                <div className="cb-head-sub">{cb.sub}</div>
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
              {cb.suggestions.map((s) => (
                <button key={s} className="cb-sug" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="cb-footer">
            <input
              className="cb-input"
              placeholder={cb.placeholder}
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
              {cb.send}
            </button>
          </div>
        </div>
      )}

      <button
        className={`cb-bubble${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cb-bubble-icon">{open ? "✕" : "💬"}</span>
      </button>
    </div>
  );
}
