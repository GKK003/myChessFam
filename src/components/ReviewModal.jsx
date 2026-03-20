import { useState } from "react";
import { useLang } from "../LangContext";
import { api } from "../constants";

export function ReviewModal({ onClose, showToast, reload }) {
  const { t } = useLang();
  const rm = t.reviews.modal;
  const [childName, setChildName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const submit = async () => {
    if (!text.trim() || text.trim().length < 10) {
      showToast(rm.tooShort, "e");
      return;
    }
    try {
      await api("/reviews", {
        method: "POST",
        body: JSON.stringify({
          childName: childName.trim() || "",
          rating: Number(rating) || 5,
          text: text.trim(),
        }),
      });
      setDone(true);
      showToast(t.toast.reviewSubmitted, "s");
      await reload?.();
    } catch (e) {
      showToast(e.message || "Could not submit review.", "e");
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
        <h3>{rm.title}</h3>
        {!done ? (
          <>
            <div className="fg">
              <label className="lbl">{rm.childName}</label>
              <input
                className="inp"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder={rm.childNamePh}
              />
            </div>
            <div className="fg">
              <label className="lbl">{rm.rating}</label>
              <select
                className="inp"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value={5}>★★★★★ (5)</option>
                <option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option>
                <option value={2}>★★☆☆☆ (2)</option>
                <option value={1}>★☆☆☆☆ (1)</option>
              </select>
            </div>
            <div className="fg">
              <label className="lbl">{rm.review} *</label>
              <textarea
                className="inp"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={rm.reviewPh}
              />
            </div>
            <button className="sbtn" onClick={submit}>
              {rm.submitBtn}
            </button>
          </>
        ) : (
          <div className="ok-box">
            <div style={{ fontSize: "2rem" }}>✅</div>
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
