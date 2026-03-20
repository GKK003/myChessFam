import { useState, useEffect, useCallback, useRef } from "react";
import { useLang } from "../LangContext";
import {
  api,
  AUTH_KEY,
  fmtDShort,
  getImageSrc,
  getGalleryImageSrc,
} from "../constants";
import { Badge, Toast } from "../components";

export default function AdminPage({
  camps,
  setCamps,
  campRegs,
  reloadRegs,
  adminReviews,
  galleryPhotos,
  reloadGallery,
  onLogout,
  showToast,
}) {
  const { t } = useLang();
  const adm = t.admin;
  const [tab, setTab] = useState("camps");
  const [editingCampId, setEditingCampId] = useState(null);
  const [statusOpenId, setStatusOpenId] = useState(null);
  const [cf, setCf] = useState({
    name: "",
    dateStart: "",
    dateEnd: "",
    loc: "",
    age: adm.ageOpts[0],
    type: adm.typeOpts[0],
    price: "",
    spots: "",
    status: "open",
    desc: "",
    image: "",
  });
  const [campFile, setCampFile] = useState(null);
  const [cDone, setCDone] = useState(false);

  useEffect(() => {
    const close = () => setStatusOpenId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const startEditCamp = (camp) => {
    setEditingCampId(camp.id);
    setCf({
      name: camp.name || "",
      dateStart: camp.dateStart || "",
      dateEnd: camp.dateEnd || "",
      loc: camp.location || "",
      age: camp.age || adm.ageOpts[0],
      type: camp.type || adm.typeOpts[0],
      price: String(camp.price ?? ""),
      spots: String(camp.spots ?? ""),
      status: camp.status || "open",
      desc: camp.desc || "",
      image: camp.image || "",
    });
    setCampFile(null);
  };

  const resetCampForm = () => {
    setEditingCampId(null);
    setCf({
      name: "",
      dateStart: "",
      dateEnd: "",
      loc: "",
      age: adm.ageOpts[0],
      type: adm.typeOpts[0],
      price: "",
      spots: "",
      status: "open",
      desc: "",
      image: "",
    });
    setCampFile(null);
  };

  const setC = (k) => (e) => setCf((p) => ({ ...p, [k]: e.target.value }));
  const revenue = campRegs.reduce((s, r) => s + (r.price || 0), 0);

  const addCamp = async () => {
    if (!cf.name || !cf.dateStart || !cf.dateEnd || !cf.loc) {
      showToast("Fill Name, Dates & Location.", "e");
      return;
    }
    try {
      let imagePath = cf.image || "/images/camp-default.jpg";
      if (campFile) {
        const fd = new FormData();
        fd.append("image", campFile);
        const BASE = import.meta.env.VITE_API_URL || "";
        const token = localStorage.getItem(AUTH_KEY);
        const uploadRes = await fetch(`${BASE}/api/admin/upload`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok)
          throw new Error(uploadData.error || "Image upload failed");
        imagePath = uploadData.image;
      }
      const payload = {
        name: cf.name,
        dateStart: cf.dateStart,
        dateEnd: cf.dateEnd,
        location: cf.loc,
        age: cf.age,
        type: cf.type,
        price: parseInt(cf.price) || 0,
        spots: parseInt(cf.spots) || 20,
        status: cf.status,
        desc: cf.desc || "Registration open!",
        image: imagePath,
      };
      const data = editingCampId
        ? await api(`/admin/camps/${editingCampId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          })
        : await api("/admin/camps", {
            method: "POST",
            body: JSON.stringify(payload),
          });
      setCamps(data.camps);
      setCDone(true);
      setTimeout(() => setCDone(false), 3000);
      resetCampForm();
      showToast(editingCampId ? adm.updated : adm.published, "s");
    } catch (error) {
      showToast(error.message || "Could not save camp session.", "e");
    }
  };

  const changeStatusC = async (id, status) => {
    try {
      const data = await api(`/admin/camps/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setCamps(data.camps);
      showToast(adm.statusUpdated, "s");
    } catch (error) {
      showToast(error.message || "Could not update status.", "e");
    }
  };

  const delC = async (id) => {
    if (!confirm(adm.deleteConfirmCamp)) return;
    try {
      const data = await api(`/admin/camps/${id}`, { method: "DELETE" });
      setCamps(data.camps);
      showToast(adm.deleted, "i");
    } catch (error) {
      showToast(error.message || "Could not delete camp session.", "e");
    }
  };

  const deleteCampReg = async (id) => {
    if (!confirm(adm.deleteConfirmSignup)) return;
    try {
      await api(`/admin/registrations/camp/${id}`, { method: "DELETE" });
      showToast(adm.signupDeleted, "i");
      await reloadRegs?.();
    } catch (error) {
      showToast(error.message || "Could not delete sign-up.", "e");
    }
  };

  return (
    <div className="pg">
      <div className="adm-wrap">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.8rem",
            paddingTop: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div className="slbl">{adm.label}</div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
              }}
            >
              {adm.welcome}
            </h2>
          </div>
          <button
            className="delbtn"
            style={{ fontSize: ".88rem", padding: ".45rem 1rem" }}
            onClick={onLogout}
          >
            {t.common.logOut}
          </button>
        </div>

        <div className="adm-stats">
          {[
            { n: camps.length, l: adm.stats.sessions },
            { n: campRegs.length, l: adm.stats.signups },
            { n: "$" + revenue.toLocaleString(), l: adm.stats.revenue },
          ].map((s) => (
            <div className="stat" key={s.l}>
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="atabs">
          {[
            ["camps", adm.tabs.camps],
            ["campregs", adm.tabs.campregs],
            ["reviews", adm.tabs.reviews],
            ["gallery", adm.tabs.gallery],
          ].map(([id, lbl]) => (
            <button
              key={id}
              className={`atab${tab === id ? " on" : ""}`}
              onClick={() => setTab(id)}
            >
              {lbl}
            </button>
          ))}
        </div>

        {tab === "camps" && (
          <>
            <div className="add-form">
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "1.25rem",
                  marginBottom: "1.3rem",
                }}
              >
                {editingCampId ? adm.editCamp : adm.addCamp}
              </h3>
              <div className="fgrid">
                <div className="fg full">
                  <label className="lbl">{adm.fields.name} *</label>
                  <input
                    className="inp"
                    placeholder={adm.fields.namePh}
                    value={cf.name}
                    onChange={setC("name")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.startDate} *</label>
                  <input
                    className="inp"
                    type="date"
                    value={cf.dateStart}
                    onChange={setC("dateStart")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.endDate} *</label>
                  <input
                    className="inp"
                    type="date"
                    value={cf.dateEnd}
                    onChange={setC("dateEnd")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.location} *</label>
                  <input
                    className="inp"
                    placeholder={adm.fields.locationPh}
                    value={cf.loc}
                    onChange={setC("loc")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.type}</label>
                  <select
                    className="inp"
                    value={cf.type}
                    onChange={setC("type")}
                  >
                    {adm.typeOpts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.age}</label>
                  <select className="inp" value={cf.age} onChange={setC("age")}>
                    {adm.ageOpts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.price}</label>
                  <input
                    className="inp"
                    type="number"
                    placeholder={adm.fields.pricePh}
                    value={cf.price}
                    onChange={setC("price")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.spots}</label>
                  <input
                    className="inp"
                    type="number"
                    placeholder={adm.fields.spotsPh}
                    value={cf.spots}
                    onChange={setC("spots")}
                  />
                </div>
                <div className="fg">
                  <label className="lbl">{adm.fields.status}</label>

                  <div className="status-drop">
                    <button
                      type="button"
                      className={`status-drop-trigger${statusOpenId === "form" ? " open" : ""}`}
                      onClick={() =>
                        setStatusOpenId((prev) =>
                          prev === "form" ? null : "form",
                        )
                      }
                    >
                      {cf.status === "open"
                        ? adm.statusOpts.open
                        : cf.status === "upcoming"
                          ? adm.statusOpts.upcoming
                          : adm.statusOpts.full}
                      <svg
                        className="status-chevron"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <div
                      className={`status-drop-menu${statusOpenId === "form" ? " open" : ""}`}
                    >
                      <div
                        className={`status-drop-item${cf.status === "open" ? " selected" : ""}`}
                        onMouseDown={() => {
                          setCf((p) => ({ ...p, status: "open" }));
                          setStatusOpenId(null);
                        }}
                      >
                        {adm.statusOpts.open}
                      </div>

                      <div
                        className={`status-drop-item${cf.status === "upcoming" ? " selected" : ""}`}
                        onMouseDown={() => {
                          setCf((p) => ({ ...p, status: "upcoming" }));
                          setStatusOpenId(null);
                        }}
                      >
                        {adm.statusOpts.upcoming}
                      </div>

                      <div
                        className={`status-drop-item${cf.status === "full" ? " selected" : ""}`}
                        onMouseDown={() => {
                          setCf((p) => ({ ...p, status: "full" }));
                          setStatusOpenId(null);
                        }}
                      >
                        {adm.statusOpts.full}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fg full">
                  <label className="lbl">{adm.fields.image}</label>

                  <div className="file-upload">
                    <label className="file-upload-box">
                      <input
                        className="file-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setCampFile(e.target.files?.[0] || null)
                        }
                      />
                      <span className="file-upload-btn">Choose file</span>
                      <span
                        className={`file-upload-name${campFile ? "" : " file-upload-empty"}`}
                      >
                        {campFile ? campFile.name : "No file chosen"}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="fg full">
                  <label className="lbl">{adm.fields.desc}</label>
                  <textarea
                    className="inp"
                    placeholder={adm.fields.descPh}
                    value={cf.desc}
                    onChange={setC("desc")}
                  />
                </div>
              </div>
              <button className="sbtn" onClick={addCamp}>
                {editingCampId ? adm.updateBtn : adm.addBtn}
              </button>
              {editingCampId && (
                <button
                  className="delbtn"
                  style={{ marginTop: ".8rem" }}
                  onClick={resetCampForm}
                  type="button"
                >
                  {t.common.cancel}
                </button>
              )}
              {cDone && (
                <div className="ok-box">
                  <div style={{ fontSize: "1.4rem" }}>✅</div>
                  <strong>{adm.published}</strong>
                </div>
              )}
            </div>

            <h3 className="adm-section-title">
              {adm.allSessions} ({camps.length})
            </h3>
            {!camps.length ? (
              <div className="empty">
                <div className="empty-i">☀️</div>
                <p>{adm.noSessions}</p>
              </div>
            ) : (
              camps.map((c) => {
                const rc = campRegs.filter((r) => r.campId === c.id).length;
                return (
                  <div className="ei" key={c.id}>
                    <div className="ei-inner">
                      <img
                        src={getImageSrc(
                          c.image,
                          import.meta.env.VITE_API_URL || "",
                        )}
                        alt={c.name}
                        className="ei-img"
                      />
                      <div className="ei-text">
                        <div className="ei-name">{c.name}</div>
                        <div className="ei-meta">
                          📅 {fmtDShort(c.dateStart)} – {fmtDShort(c.dateEnd)}
                        </div>
                        <div className="ei-meta">
                          📍 {c.location} · {c.type}
                        </div>
                        <div className="ei-meta">
                          💵 ${c.price} · 📝 {rc} sign-up{rc !== 1 ? "s" : ""}
                        </div>
                        <div
                          className="ei-meta"
                          style={{ marginTop: ".2rem", opacity: 0.7 }}
                        >
                          Image: {c.image || "none"}
                        </div>
                      </div>
                    </div>
                    <div className="ei-actions">
                      <button
                        className="sbtn"
                        style={{
                          padding: ".45rem .8rem",
                          width: "auto",
                          marginTop: 0,
                          fontSize: ".82rem",
                        }}
                        onClick={() => startEditCamp(c)}
                        type="button"
                      >
                        {t.common.edit}
                      </button>
                      <div className="status-drop">
                        <button
                          type="button"
                          className={`status-drop-trigger${statusOpenId === c.id ? " open" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatusOpenId((prev) =>
                              prev === c.id ? null : c.id,
                            );
                          }}
                        >
                          {c.status === "open"
                            ? adm.statusOpts.open
                            : c.status === "upcoming"
                              ? adm.statusOpts.upcoming
                              : adm.statusOpts.full}
                          <svg
                            className="status-chevron"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        <div
                          className={`status-drop-menu${statusOpenId === c.id ? " open" : ""}`}
                        >
                          <div
                            className={`status-drop-item${c.status === "open" ? " selected" : ""}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              changeStatusC(c.id, "open");
                              setStatusOpenId(null);
                            }}
                          >
                            {adm.statusOpts.open}
                          </div>

                          <div
                            className={`status-drop-item${c.status === "upcoming" ? " selected" : ""}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              changeStatusC(c.id, "upcoming");
                              setStatusOpenId(null);
                            }}
                          >
                            {adm.statusOpts.upcoming}
                          </div>

                          <div
                            className={`status-drop-item${c.status === "full" ? " selected" : ""}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              changeStatusC(c.id, "full");
                              setStatusOpenId(null);
                            }}
                          >
                            {adm.statusOpts.full}
                          </div>
                        </div>
                      </div>
                      <button className="delbtn" onClick={() => delC(c.id)}>
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {tab === "campregs" && (
          <>
            <h3 className="adm-section-title">
              {adm.signupsTitle} ({campRegs.length})
            </h3>
            {!campRegs.length ? (
              <div className="empty">
                <div className="empty-i">🏕</div>
                <p>{adm.noSignups}</p>
              </div>
            ) : (
              <>
                <div className="twrap">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Child</th>
                        <th>DOB</th>
                        <th>Level</th>
                        <th>Camp Session</th>
                        <th>Parent</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Emergency</th>
                        <th>Medical</th>
                        <th>Fee</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campRegs.map((r, i) => (
                        <tr key={r.id}>
                          <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                          <td
                            style={{ whiteSpace: "nowrap", fontSize: ".78rem" }}
                          >
                            {r.date}
                            <br />
                            <span style={{ color: "var(--muted)" }}>
                              {r.time}
                            </span>
                          </td>
                          <td>
                            <strong>{r.childName}</strong>
                          </td>
                          <td style={{ fontSize: ".8rem" }}>{r.dob}</td>
                          <td style={{ fontSize: ".8rem" }}>{r.level}</td>
                          <td style={{ fontSize: ".82rem", maxWidth: 160 }}>
                            {r.campName}
                          </td>
                          <td>{r.parent}</td>
                          <td style={{ fontSize: ".8rem" }}>{r.email}</td>
                          <td style={{ fontSize: ".8rem" }}>{r.phone}</td>
                          <td style={{ fontSize: ".8rem" }}>{r.emergency}</td>
                          <td
                            style={{
                              fontSize: ".8rem",
                              color:
                                r.medical === "None"
                                  ? "var(--muted)"
                                  : "#fc8181",
                            }}
                          >
                            {r.medical}
                          </td>
                          <td
                            style={{ color: "var(--green2)", fontWeight: 700 }}
                          >
                            ${r.price}
                          </td>
                          <td>
                            <button
                              className="delbtn"
                              onClick={() => deleteCampReg(r.id)}
                            >
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="reg-cards">
                  {campRegs.map((r, i) => (
                    <div className="reg-card" key={r.id}>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Child</div>
                          <div
                            className="reg-card-value"
                            style={{ fontWeight: 700, color: "#EEF5FF" }}
                          >
                            {r.childName}
                          </div>
                        </div>
                        <div
                          style={{
                            color: "var(--green2)",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          }}
                        >
                          ${r.price}
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Camp</div>
                          <div className="reg-card-value">{r.campName}</div>
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Level</div>
                          <div className="reg-card-value">{r.level}</div>
                        </div>
                        <div>
                          <div className="reg-card-label">DOB</div>
                          <div className="reg-card-value">{r.dob}</div>
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Parent</div>
                          <div className="reg-card-value">{r.parent}</div>
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Email</div>
                          <div className="reg-card-value">{r.email}</div>
                        </div>
                      </div>
                      <div className="reg-card-row">
                        <div>
                          <div className="reg-card-label">Phone</div>
                          <div className="reg-card-value">{r.phone}</div>
                        </div>
                      </div>
                      {r.emergency && r.emergency !== "—" && (
                        <div className="reg-card-row">
                          <div>
                            <div className="reg-card-label">Emergency</div>
                            <div className="reg-card-value">{r.emergency}</div>
                          </div>
                        </div>
                      )}
                      {r.medical && r.medical !== "None" && (
                        <div className="reg-card-row">
                          <div>
                            <div className="reg-card-label">Medical</div>
                            <div
                              className="reg-card-value"
                              style={{ color: "#fc8181" }}
                            >
                              {r.medical}
                            </div>
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop: ".6rem" }}>
                        <button
                          className="delbtn"
                          style={{ width: "100%", textAlign: "center" }}
                          onClick={() => deleteCampReg(r.id)}
                        >
                          🗑 Delete Sign-Up
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {tab === "reviews" && (
          <>
            <h3 className="adm-section-title">
              {adm.reviewsTitle} ({adminReviews.length})
            </h3>
            {!adminReviews.length ? (
              <div className="empty">
                <div className="empty-i">⭐</div>
                <p>{adm.noReviews}</p>
              </div>
            ) : (
              adminReviews
                .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
                .map((r) => (
                  <div className="ei" key={r.id}>
                    <div
                      className="ei-inner"
                      style={{ flexDirection: "column" }}
                    >
                      <div className="ei-name">
                        {r.childName || "Anonymous"} · {r.rating}/5
                      </div>
                      <div
                        className="ei-meta"
                        style={{ marginTop: 6, wordBreak: "break-word" }}
                      >
                        {r.text}
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: ".8rem",
                          color: "var(--muted)",
                        }}
                      >
                        Status:{" "}
                        <b
                          style={{
                            color: r.approved ? "var(--green2)" : "#fc8181",
                          }}
                        >
                          {r.approved ? "Approved" : "Pending"}
                        </b>
                      </div>
                    </div>
                    <div className="ei-actions">
                      {!r.approved && (
                        <button
                          className="sbtn"
                          style={{
                            padding: ".45rem .8rem",
                            width: "auto",
                            fontSize: ".82rem",
                          }}
                          onClick={async () => {
                            try {
                              await api(`/admin/reviews/${r.id}/approve`, {
                                method: "PATCH",
                              });
                              showToast(adm.approved, "s");
                              await reloadRegs?.();
                            } catch (e) {
                              showToast(e.message || "Could not approve.", "e");
                            }
                          }}
                        >
                          {t.common.approve}
                        </button>
                      )}
                      <button
                        className="delbtn"
                        onClick={async () => {
                          if (!confirm(adm.deleteConfirmReview)) return;
                          try {
                            await api(`/admin/reviews/${r.id}`, {
                              method: "DELETE",
                            });
                            showToast(adm.deleted, "i");
                            await reloadRegs?.();
                          } catch (e) {
                            showToast(e.message || "Could not delete.", "e");
                          }
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))
            )}
          </>
        )}

        {tab === "gallery" && (
          <GalleryAdminTab
            photos={galleryPhotos}
            reload={reloadGallery}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}

function GalleryAdminTab({ photos, reload, showToast }) {
  const { t } = useLang();
  const adm = t.admin;
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("camps");
  const [tag, setTag] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const submit = async () => {
    if (!file) {
      showToast("Please select an image.", "e");
      return;
    }
    if (!caption.trim()) {
      showToast("Please add a caption.", "e");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const BASE = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("mcf_admin_token");
      const uploadRes = await fetch(`${BASE}/api/admin/upload-gallery`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      await api("/admin/gallery", {
        method: "POST",
        body: JSON.stringify({
          imageUrl: uploadData.image,
          caption: caption.trim(),
          category,
          tag: tag.trim() || category,
        }),
      });

      showToast(t.toast.photoUploaded, "s");
      setCaption("");
      setCategory("camps");
      setTag("");
      setFile(null);
      setPreview(null);
      await reload?.();
    } catch (err) {
      showToast(err.message || "Upload failed.", "e");
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (id) => {
    if (!confirm(adm.deleteConfirmPhoto)) return;
    try {
      await api(`/admin/gallery/${id}`, { method: "DELETE" });
      showToast(adm.deleted, "i");
      await reload?.();
    } catch (err) {
      showToast(err.message || "Could not delete.", "e");
    }
  };

  return (
    <>
      <div className="add-form">
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.25rem",
            marginBottom: "1.3rem",
          }}
        >
          {adm.uploadTitle}
        </h3>
        <div className="fgrid">
          <div className="fg full">
            <label className="lbl">{adm.galleryFields.photo} *</label>

            <div className="file-upload">
              <label className="file-upload-box">
                <input
                  className="file-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
                <span className="file-upload-btn">Choose file</span>
                <span
                  className={`file-upload-name${file ? "" : " file-upload-empty"}`}
                >
                  {file ? file.name : "No file chosen"}
                </span>
              </label>
            </div>

            {preview && (
              <div style={{ marginTop: ".8rem" }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "100%",
                    maxWidth: 300,
                    borderRadius: 10,
                    objectFit: "cover",
                    border: "1px solid rgba(74,171,232,.18)",
                  }}
                />
              </div>
            )}
          </div>
          <div className="fg full">
            <label className="lbl">{adm.galleryFields.caption} *</label>
            <input
              className="inp"
              placeholder={adm.galleryFields.captionPh}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="fg">
            <label className="lbl">{adm.galleryFields.category}</label>
            <select
              className="inp"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {adm.categoryOpts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label className="lbl">{adm.galleryFields.tag}</label>
            <input
              className="inp"
              placeholder={adm.galleryFields.tagPh}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
        </div>
        <button
          className="sbtn"
          onClick={submit}
          disabled={uploading}
          style={{ opacity: uploading ? 0.6 : 1 }}
        >
          {uploading ? t.common.uploading : t.common.upload}
        </button>
      </div>

      <h3 className="adm-section-title">
        {adm.galleryTitle} ({photos.length})
      </h3>
      {!photos.length ? (
        <div className="empty">
          <div className="empty-i">📸</div>
          <p>{adm.noPhotos}</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: "1rem",
          }}
        >
          {photos.map((p) => (
            <div
              key={p.id}
              style={{
                background: "rgba(26,94,168,.07)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <img
                src={getGalleryImageSrc(
                  p.imageUrl,
                  import.meta.env.VITE_API_URL || "",
                )}
                alt={p.caption}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div style={{ padding: ".8rem" }}>
                <div
                  style={{
                    fontSize: ".82rem",
                    fontWeight: 700,
                    color: "#EEF5FF",
                    marginBottom: ".25rem",
                    wordBreak: "break-word",
                  }}
                >
                  {p.caption}
                </div>
                <div
                  style={{
                    fontSize: ".72rem",
                    color: "var(--green2)",
                    marginBottom: ".6rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {p.tag || p.category}
                </div>
                <button
                  className="delbtn"
                  style={{ width: "100%", textAlign: "center" }}
                  onClick={() => deletePhoto(p.id)}
                >
                  🗑 {t.common.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
