import { useLang } from "../LangContext";

export default function NotFoundPage({ onNav }) {
  const { t } = useLang();

  const quickLinks = [
    ["home", `🏠 ${t.nav.home}`],
    ["programs", `♟ ${t.nav.programs}`],
    ["camp", `☀️ ${t.nav.camp}`],
    ["team", `👥 ${t.nav.team}`],
    ["gallery", `📸 ${t.nav.gallery}`],
    ["reviews", `⭐ ${t.nav.reviews}`],
    ["about", `ℹ️ ${t.nav.about}`],
  ];

  return (
    <div className="notfound-pg">
      <div className="notfound-inner">
        <div className="notfound-board">
          {Array.from({ length: 64 }, (_, i) => {
            const r = Math.floor(i / 8),
              c = i % 8;
            return (
              <div
                key={i}
                className={`notfound-sq ${(r + c) % 2 === 0 ? "notfound-sq-l" : "notfound-sq-d"}`}
              />
            );
          })}
        </div>

        <span className="notfound-piece">♟</span>
        <div className="notfound-code">{t.notFound.code}</div>
        <h1 className="notfound-title">{t.notFound.title}</h1>
        <p className="notfound-sub">{t.notFound.sub}</p>

        <div className="notfound-actions">
          <button className="btn btn-g" onClick={() => onNav("home")}>
            {t.notFound.btn1}
          </button>
          <button
            className="btn btn-g"
            style={{
              background: "rgba(31,168,94,.12)",
              color: "var(--green2)",
              border: "1.5px solid rgba(31,168,94,.35)",
            }}
            onClick={() => onNav("programs")}
          >
            {t.notFound.btn2}
          </button>
        </div>

        <div className="notfound-links">
          {quickLinks.map(([p, l]) => (
            <button key={p} className="notfound-link" onClick={() => onNav(p)}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
