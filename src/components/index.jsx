import { useState, useEffect, useCallback } from "react";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { useLang } from "../LangContext";
import {
  SOCIALS,
  CONTACT,
  PIECES,
  PIECE_SVGS,
  api,
  AUTH_KEY,
} from "../constants";

export function Toast({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.8rem",
        right: "1.8rem",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export function Badge({ status }) {
  const { t } = useLang();
  const cls =
    status === "open"
      ? "bdg bdg-open"
      : status === "full"
        ? "bdg bdg-full"
        : "bdg bdg-up";
  const lbl =
    status === "open"
      ? t.badge.open
      : status === "full"
        ? t.badge.full
        : t.badge.upcoming;
  return <span className={cls}>{lbl}</span>;
}

export function ChessBoard() {
  return (
    <div className="board-wrap">
      <div className="mboard">
        {Array.from({ length: 64 }, (_, i) => {
          const r = Math.floor(i / 8),
            c = i % 8;
          const piece = (PIECES[r] || [])[c];
          return (
            <div
              key={i}
              className={`sq ${(r + c) % 2 === 0 ? "sq-l" : "sq-d"}`}
              style={{
                color: r < 4 ? "#1A3A2A" : "#EEF5FF",
                textShadow: "0 1px 3px rgba(0,0,0,.5)",
              }}
            >
              {piece && (
                <img src={PIECE_SVGS[piece]} alt="" className="piece" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Footer({ onNav, onContact }) {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="f-links">
        {[
          ["home", t.footer.links.home],
          ["programs", t.footer.links.programs],
          ["camp", t.footer.links.camp],
          ["team", t.footer.links.team],
          ["gallery", t.footer.links.gallery],
          ["reviews", t.footer.links.reviews],
          ["about", t.footer.links.about],
          ["contact", t.footer.links.contact],
        ].map(([p, l]) => (
          <button key={p} className="flnk" onClick={() => onNav(p)}>
            {l}
          </button>
        ))}
      </div>
      <p>
        📍 {CONTACT.city} &nbsp;·&nbsp; ✉ {CONTACT.email}
      </p>

      <div className="social-row">
        <a
          href={SOCIALS.instagram}
          target="_blank"
          rel="noreferrer"
          className="social-icon ig"
        >
          <FaInstagram />
        </a>
        <a
          href={SOCIALS.facebook}
          target="_blank"
          rel="noreferrer"
          className="social-icon fb"
        >
          <FaFacebookF />
        </a>
        <a
          href={SOCIALS.linkedin}
          target="_blank"
          rel="noreferrer"
          className="social-icon li"
        >
          <FaLinkedinIn />
        </a>
      </div>
      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1.2rem",
          borderTop: "1px solid rgba(74,171,232,0.1)",
          fontSize: ".78rem",
          color: "rgba(180,210,240,0.35)",
          letterSpacing: ".3px",
        }}
      >
        {t.footer.builtBy}{" "}
        <span style={{ color: "rgba(180,210,240,0.55)", fontWeight: 600 }}>
          Giorgi Kostava
        </span>
      </div>
    </footer>
  );
}

export function ContactModal({ onClose, showToast }) {
  const { t } = useLang();
  const cm = t.contactModal;
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      showToast(t.toast.emailCopied, "s");
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = CONTACT.email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast(t.toast.emailCopied, "s");
      } catch {
        showToast("Could not copy email.", "e");
      }
    }
  };
  return (
    <div
      className="ovl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <button className="mcls" onClick={onClose}>
          {t.common.close}
        </button>
        <h3>{cm.title}</h3>
        <div style={{ display: "grid", gap: ".85rem" }}>
          <button
            type="button"
            className="inp"
            style={{
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onClick={copyEmail}
          >
            <span>✉️ {CONTACT.email}</span>
            <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>
              {cm.clickToCopy}
            </span>
          </button>
          <div
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              lineHeight: 1.6,
            }}
          >
            {cm.fastest}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CampRegModal({ item, onClose, showToast, onRegistered }) {
  const { t } = useLang();
  const rm = t.camp.regModal;
  const [f, setF] = useState({
    fname: "",
    lname: "",
    parent: "",
    email: "",
    phone: "",
    dob: "",
    level: "",
    emergency: "",
    medical: "",
  });
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const submit = async () => {
    if (
      !f.fname ||
      !f.lname ||
      !f.parent ||
      !f.email ||
      !f.phone ||
      !f.dob ||
      !f.level
    ) {
      showToast(rm.required, "e");
      return;
    }
    try {
      await api("/registrations/camp", {
        method: "POST",
        body: JSON.stringify({
          campId: item.id,
          campName: item.name,
          childName: `${f.fname} ${f.lname}`,
          dob: f.dob,
          level: f.level,
          parent: f.parent,
          email: f.email,
          phone: f.phone,
          emergency: f.emergency || "—",
          medical: f.medical || "None",
          price: item.price,
        }),
      });
      setDone(true);
      onRegistered?.();
      showToast(t.toast.regSubmitted, "s");
    } catch (error) {
      showToast(error.message || "Could not submit registration.", "e");
    }
  };
  return (
    <div
      className="ovl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <button className="mcls" onClick={onClose}>
          {t.common.close}
        </button>
        <h3>
          {rm.title} {item.name}
        </h3>
        {!done ? (
          <>
            <div className="fgrid">
              <div className="fg">
                <label className="lbl">{rm.firstName} *</label>
                <input
                  className="inp"
                  placeholder={rm.firstNamePh}
                  value={f.fname}
                  onChange={set("fname")}
                />
              </div>
              <div className="fg">
                <label className="lbl">{rm.lastName} *</label>
                <input
                  className="inp"
                  placeholder={rm.lastNamePh}
                  value={f.lname}
                  onChange={set("lname")}
                />
              </div>
              <div className="fg">
                <label className="lbl">{rm.dob} *</label>
                <input
                  className="inp"
                  type="date"
                  value={f.dob}
                  onChange={set("dob")}
                />
              </div>
              <div className="fg">
                <label className="lbl">{rm.level} *</label>
                <select className="inp" value={f.level} onChange={set("level")}>
                  <option value="">{rm.levelPh}</option>
                  {rm.levelOpts.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="fg full">
                <label className="lbl">{rm.parent} *</label>
                <input
                  className="inp"
                  placeholder={rm.parentPh}
                  value={f.parent}
                  onChange={set("parent")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">{rm.email} *</label>
                <input
                  className="inp"
                  type="email"
                  placeholder={rm.emailPh}
                  value={f.email}
                  onChange={set("email")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">{rm.phone} *</label>
                <input
                  className="inp"
                  type="tel"
                  placeholder={rm.phonePh}
                  value={f.phone}
                  onChange={set("phone")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">{rm.emergency}</label>
                <input
                  className="inp"
                  placeholder={rm.emergencyPh}
                  value={f.emergency}
                  onChange={set("emergency")}
                />
              </div>
              <div className="fg full">
                <label className="lbl">{rm.medical}</label>
                <textarea
                  className="inp"
                  placeholder={rm.medicalPh}
                  value={f.medical}
                  onChange={set("medical")}
                />
              </div>
            </div>
            <button className="sbtn" onClick={submit}>
              {rm.submitBtn}
            </button>
          </>
        ) : (
          <div className="ok-box">
            <div style={{ fontSize: "2rem" }}>🎉</div>
            <strong style={{ marginTop: ".5rem" }}>{rm.successTitle}</strong>
            <p
              style={{
                fontSize: ".86rem",
                color: "var(--muted)",
                marginTop: ".4rem",
              }}
            >
              {rm.successSub}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
