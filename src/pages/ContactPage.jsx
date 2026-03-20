import { useState, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { useLang } from "../LangContext";
import { CONTACT, SOCIALS, api } from "../constants";
import { Footer } from "../components";

const CONTACT_CSS = `
.contact-hero{background:#F5F6F8;border-bottom:1px solid #E2E8F0;padding:5rem 0 4rem;position:relative;overflow:hidden;}
.contact-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(31,168,94,.05) 0%,transparent 55%);pointer-events:none;}
.contact-hero-inner{width:100%;max-width:1100px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1;text-align:center;}
.contact-kicker{display:inline-block;font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--green2);font-weight:700;margin-bottom:1rem;}
.contact-hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);line-height:1.08;color:#1F2B3A;margin-bottom:1rem;}
.contact-hero-sub{max-width:640px;margin:0 auto;color:#586273;line-height:1.8;font-size:1rem;}
.contact-body{background:#F5F6F8;padding:4rem 0 5rem;}
.contact-inner{width:100%;max-width:1100px;margin:0 auto;padding:0 2.5rem;}
.contact-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:2rem;align-items:start;}
.contact-info{display:flex;flex-direction:column;gap:1.2rem;}
.contact-info-card{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:1.5rem;box-shadow:0 10px 28px rgba(15,23,42,.05);display:flex;gap:1rem;align-items:flex-start;}
.contact-info-icon{width:52px;height:52px;border-radius:16px;flex-shrink:0;background:linear-gradient(135deg,#16314D,#215E46);display:flex;align-items:center;justify-content:center;font-size:1.35rem;}
.contact-info-label{font-size:.72rem;letter-spacing:1.5px;text-transform:uppercase;color:#5C6B7C;font-weight:700;margin-bottom:.3rem;}
.contact-info-value{font-size:1rem;font-weight:700;color:#1F2B3A;margin-bottom:.2rem;word-break:break-word;}
.contact-info-note{font-size:.83rem;color:#5C6B7C;line-height:1.5;}
.contact-social-card{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:1.5rem;box-shadow:0 10px 28px rgba(15,23,42,.05);}
.contact-social-title{font-size:.72rem;letter-spacing:1.5px;text-transform:uppercase;color:#5C6B7C;font-weight:700;margin-bottom:1rem;}
.contact-social-row{display:flex;gap:.75rem;flex-wrap:wrap;}
.contact-social-btn{display:flex;align-items:center;gap:.55rem;padding:.65rem 1.1rem;border-radius:12px;border:1.5px solid #E2E8F0;background:#F8FAFC;color:#1F2B3A;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:700;cursor:pointer;text-decoration:none;transition:.2s;}
.contact-social-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(15,23,42,.1);}
.contact-social-btn.ig:hover{background:#E1306C;border-color:#E1306C;color:#fff;}
.contact-social-btn.fb:hover{background:#1877F2;border-color:#1877F2;color:#fff;}
.contact-social-btn.li:hover{background:#0A66C2;border-color:#0A66C2;color:#fff;}
.contact-form-card{background:#fff;border:1px solid #E2E8F0;border-radius:24px;padding:2rem;box-shadow:0 14px 40px rgba(15,23,42,.06);}
.contact-form-title{font-family:'Playfair Display',serif;font-size:1.7rem;color:#1F2B3A;margin-bottom:.4rem;}
.contact-form-sub{color:#5C6B7C;font-size:.92rem;margin-bottom:1.6rem;line-height:1.6;}
.inp-light{width:100%;padding:.78rem 1rem;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:10px;color:#1F2B3A;font-family:'DM Sans',sans-serif;font-size:.92rem;transition:.2s;outline:none;}
.inp-light:focus{border-color:#2E7D5B;background:#fff;box-shadow:0 0 0 3px rgba(46,125,91,.1);}
.inp-light::placeholder{color:#A0AEC0;}
select.inp-light option{background:#fff;color:#1F2B3A;}
textarea.inp-light{min-height:110px;resize:vertical;}
.fg-light{margin-bottom:1rem;}
.lbl-light{display:block;font-size:.8rem;font-weight:700;color:#3A4A5B;margin-bottom:.35rem;letter-spacing:.3px;}
.fgrid-light{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
@media(max-width:600px){.fgrid-light{grid-template-columns:1fr;}}
.contact-submit-btn{width:100%;padding:.82rem 1.75rem;margin-top:.3rem;background:var(--green2);color:#fff;font-weight:700;font-family:'DM Sans',sans-serif;font-size:.93rem;border:none;border-radius:9px;cursor:pointer;transition:transform .22s ease,box-shadow .28s ease;position:relative;overflow:hidden;}
.contact-submit-btn:hover{background:var(--green2);transform:translateY(-3px);box-shadow:0 12px 30px rgba(21,122,69,.38),0 0 14px rgba(31,168,94,.28);}
.contact-submit-btn:disabled{background:#CBD5E1;color:#64748B;cursor:not-allowed;transform:none;box-shadow:none;}
.contact-ok{display:flex;flex-direction:column;align-items:center;background:#ECFDF5;border:1px solid #6EE7B7;border-radius:14px;padding:2rem;text-align:center;animation:fu .4s ease;}
.contact-ok-icon{font-size:2.8rem;margin-bottom:.7rem;}
.contact-ok-title{font-family:'Playfair Display',serif;font-size:1.5rem;color:#065F46;margin-bottom:.5rem;}
.contact-ok-sub{color:#047857;font-size:.92rem;line-height:1.6;}
.contact-cta{margin-top:2.5rem;background:linear-gradient(135deg,#12253B,#143524);border-radius:26px;padding:2.2rem;text-align:center;color:#EEF5FF;}
.contact-cta h3{font-family:'Playfair Display',serif;font-size:1.9rem;margin-bottom:.6rem;}
.contact-cta p{color:rgba(220,233,245,.78);line-height:1.8;max-width:650px;margin:0 auto;font-size:.95rem;}
.contact-cta-actions{margin-top:1.3rem;display:flex;justify-content:center;gap:.8rem;flex-wrap:wrap;}
@media(max-width:900px){.contact-grid{grid-template-columns:1fr;}}
@media(max-width:850px){.contact-hero-inner,.contact-inner{padding-left:1.2rem;padding-right:1.2rem;}}
`;

const injectContactStyles = () => {
  if (document.getElementById("mcf-contact-css")) return;
  const el = document.createElement("style");
  el.id = "mcf-contact-css";
  el.textContent = CONTACT_CSS;
  document.head.appendChild(el);
};

export default function ContactPage({ onNav, showToast }) {
  const { t } = useLang();
  useEffect(() => {
    injectContactStyles();
  }, []);

  const [f, setF] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    subject: "",
    program: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    setErr("");
    if (!f.fname || !f.lname || !f.email || !f.message) {
      setErr(t.contact.errRequired);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(f.email)) {
      setErr(t.contact.errEmail);
      return;
    }
    setSending(true);
    try {
      await api("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: `${f.fname} ${f.lname}`,
          email: f.email,
          phone: f.phone,
          subject: f.subject,
          program: f.program,
          message: f.message,
        }),
      });
      setDone(true);
      showToast(t.toast.messageSent, "s");
    } catch {
      setDone(true);
      showToast(t.toast.messageSent, "s");
    } finally {
      setSending(false);
    }
  };

  const infoCards = t.contact.info.map((c, i) => ({
    ...c,
    icon: ["📍", "✉️", "⏰", "📅"][i],
    ...(i === 1
      ? {
          action: () => {
            navigator.clipboard
              ?.writeText("mychessfamily@gmail.com")
              .catch(() => {});
            showToast(t.toast.emailCopied, "s");
          },
        }
      : {}),
  }));

  return (
    <div className="pg" style={{ background: "#F5F6F8" }}>
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-kicker">{t.contact.kicker}</div>
          <h1 className="contact-hero-title">{t.contact.heroTitle}</h1>
          <p className="contact-hero-sub">{t.contact.heroSub}</p>
        </div>
      </section>

      <section className="contact-body">
        <div className="contact-inner">
          <div className="contact-grid">
            <div className="contact-info">
              {infoCards.map((c) => (
                <div
                  key={c.label}
                  className="contact-info-card"
                  style={c.action ? { cursor: "pointer" } : {}}
                  onClick={c.action}
                  title={c.action ? c.actionLabel : undefined}
                >
                  <div className="contact-info-icon">{c.icon}</div>
                  <div>
                    <div className="contact-info-label">{c.label}</div>
                    <div className="contact-info-value">{c.value}</div>
                    <div className="contact-info-note">
                      {c.actionLabel ? (
                        <span style={{ color: "#2E7D5B", fontWeight: 600 }}>
                          {c.actionLabel}
                        </span>
                      ) : (
                        c.note
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="contact-social-card">
                <div className="contact-social-title">
                  {t.contact.socialTitle}
                </div>
                <div className="contact-social-row">
                  <a
                    href="https://www.instagram.com/mychessfamily/"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-btn ig"
                  >
                    <FaInstagram /> Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/Mychessfamily"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-btn fb"
                  >
                    <FaFacebookF /> Facebook
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dmitri-shevelev-145ba7/"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-btn li"
                  >
                    <FaLinkedinIn /> LinkedIn
                  </a>
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 20,
                  padding: "1.5rem",
                  boxShadow: "0 10px 28px rgba(15,23,42,.05)",
                }}
              >
                <div className="contact-social-title">
                  {t.contact.quickLinksTitle}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".55rem",
                  }}
                >
                  {t.contact.quickLinks.map(([p, l]) => (
                    <button
                      key={p}
                      onClick={() => onNav(p)}
                      style={{
                        background: "#F8FAFC",
                        border: "1.5px solid #E2E8F0",
                        borderRadius: 10,
                        padding: ".65rem 1rem",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: ".88rem",
                        fontWeight: 700,
                        color: "#1F2B3A",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: ".18s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#2E7D5B";
                        e.currentTarget.style.color = "#2E7D5B";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.color = "#1F2B3A";
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              {!done ? (
                <>
                  <h2 className="contact-form-title">{t.contact.formTitle}</h2>
                  <p className="contact-form-sub">{t.contact.formSub}</p>

                  <div className="fgrid-light">
                    <div className="fg-light">
                      <label className="lbl-light">
                        {t.contact.firstName} *
                      </label>
                      <input
                        className="inp-light"
                        placeholder={t.contact.firstNamePh}
                        value={f.fname}
                        onChange={set("fname")}
                      />
                    </div>
                    <div className="fg-light">
                      <label className="lbl-light">
                        {t.contact.lastName} *
                      </label>
                      <input
                        className="inp-light"
                        placeholder={t.contact.lastNamePh}
                        value={f.lname}
                        onChange={set("lname")}
                      />
                    </div>
                  </div>

                  <div className="fgrid-light">
                    <div className="fg-light">
                      <label className="lbl-light">{t.contact.email} *</label>
                      <input
                        className="inp-light"
                        type="email"
                        placeholder={t.contact.emailPh}
                        value={f.email}
                        onChange={set("email")}
                      />
                    </div>
                    <div className="fg-light">
                      <label className="lbl-light">{t.contact.phone}</label>
                      <input
                        className="inp-light"
                        type="tel"
                        placeholder={t.contact.phonePh}
                        value={f.phone}
                        onChange={set("phone")}
                      />
                    </div>
                  </div>

                  <div className="fg-light">
                    <label className="lbl-light">
                      {t.contact.interestedIn}
                    </label>
                    <select
                      className="inp-light"
                      value={f.program}
                      onChange={set("program")}
                    >
                      <option value="">{t.contact.interestedPh}</option>
                      {t.contact.interestedOpts.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className="fg-light">
                    <label className="lbl-light">{t.contact.subject}</label>
                    <input
                      className="inp-light"
                      placeholder={t.contact.subjectPh}
                      value={f.subject}
                      onChange={set("subject")}
                    />
                  </div>

                  <div className="fg-light">
                    <label className="lbl-light">{t.contact.message} *</label>
                    <textarea
                      className="inp-light"
                      placeholder={t.contact.messagePh}
                      value={f.message}
                      onChange={set("message")}
                      style={{ minHeight: 130 }}
                    />
                  </div>

                  {err && (
                    <div
                      style={{
                        background: "#FEE2E2",
                        border: "1px solid #FECACA",
                        borderRadius: 10,
                        padding: ".7rem 1rem",
                        color: "#B91C1C",
                        fontSize: ".87rem",
                        marginBottom: ".8rem",
                      }}
                    >
                      {err}
                    </div>
                  )}

                  <button
                    className="contact-submit-btn"
                    onClick={submit}
                    disabled={sending}
                  >
                    {sending ? t.common.sending : t.common.sendMessage}
                  </button>

                  <p
                    style={{
                      marginTop: ".9rem",
                      fontSize: ".78rem",
                      color: "#94A3B8",
                      textAlign: "center",
                      lineHeight: 1.6,
                    }}
                  >
                    {t.contact.privacy}
                  </p>
                </>
              ) : (
                <div className="contact-ok">
                  <div className="contact-ok-icon">🎉</div>
                  <div className="contact-ok-title">
                    {t.contact.successTitle}
                  </div>
                  <p className="contact-ok-sub">
                    {t.contact.successSub1} <strong>{f.email}</strong>.
                    <br />
                    <br />
                    {t.contact.successSub2}
                  </p>
                  <div
                    style={{
                      marginTop: "1.3rem",
                      display: "flex",
                      gap: ".7rem",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="contact-submit-btn"
                      style={{ width: "auto", padding: ".7rem 1.4rem" }}
                      onClick={() => onNav("programs")}
                    >
                      {t.common.viewPrograms}
                    </button>
                    <button
                      style={{
                        background: "#D1FAE5",
                        border: "1px solid #6EE7B7",
                        color: "#065F46",
                        borderRadius: 12,
                        padding: ".7rem 1.4rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                      onClick={() => {
                        setDone(false);
                        setF({
                          fname: "",
                          lname: "",
                          email: "",
                          phone: "",
                          subject: "",
                          program: "",
                          message: "",
                        });
                      }}
                    >
                      {t.contact.sendAnother}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="contact-cta">
            <h3>{t.contact.ctaTitle}</h3>
            <p>{t.contact.ctaText}</p>
            <div className="contact-cta-actions">
              <button className="btn btn-g" onClick={() => onNav("programs")}>
                {t.common.explorePrograms}
              </button>
              <button
                className="btn btn-g"
                style={{
                  background: "rgba(31,168,94,.12)",
                  color: "var(--green2)",
                  border: "1.5px solid rgba(31,168,94,.35)",
                }}
                onClick={() => onNav("camp")}
              >
                {t.common.summerCamp}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNav={onNav} onContact={() => onNav("contact")} />
    </div>
  );
}
