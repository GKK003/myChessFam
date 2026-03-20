import { useState } from "react";
import { useLang } from "../LangContext";
import { api, AUTH_KEY } from "../constants";

export default function LoginPage({ onLogin, showToast }) {
  const { t } = useLang();
  const lg = t.login;
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const submit = async () => {
    try {
      setErr("");
      const data = await api("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username: u, password: p }),
      });
      localStorage.setItem(AUTH_KEY, data.token);
      onLogin();
      showToast(t.toast.loggedIn, "s");
    } catch {
      setErr(lg.wrongCreds);
    }
  };
  return (
    <div className="pg-center">
      <div className="login-box">
        <div style={{ fontSize: "3rem", marginBottom: ".85rem" }}>🔐</div>
        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.75rem",
            marginBottom: ".4rem",
          }}
        >
          {lg.title}
        </h2>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1.8rem",
            fontSize: ".88rem",
          }}
        >
          {lg.sub}
        </p>
        <div className="fg" style={{ textAlign: "left" }}>
          <label className="lbl">{lg.username}</label>
          <input
            className="inp"
            placeholder="admin"
            value={u}
            onChange={(e) => setU(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <div className="fg" style={{ textAlign: "left", marginTop: ".7rem" }}>
          <label className="lbl">{lg.password}</label>
          <input
            className="inp"
            type="password"
            placeholder="••••••••"
            value={p}
            onChange={(e) => setP(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <p
          style={{
            fontSize: ".75rem",
            color: "rgba(45,204,116,.65)",
            margin: ".75rem 0",
            textAlign: "left",
          }}
        >
          {lg.demo} <strong style={{ color: "var(--green2)" }}>admin</strong> /{" "}
          <strong style={{ color: "var(--green2)" }}>chess123</strong>
        </p>
        <button className="sbtn" onClick={submit}>
          {t.common.signIn}
        </button>
        {err && <div className="err-box">{err}</div>}
      </div>
    </div>
  );
}
