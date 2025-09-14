import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title = "", children }) {
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => firstFocusRef.current?.focus?.());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="mm-modal-root" role="dialog" aria-modal="true" aria-label={title || "Dialog"}>
      <div className="mm-modal-backdrop" onClick={onClose} />
      <div className="mm-modal-panel">
        <div className="mm-modal-head">
          <h2 className="mm-modal-title">{title}</h2>
          <button ref={firstFocusRef} onClick={onClose} className="mm-modal-close" aria-label="Close">✕</button>
        </div>
        <div className="mm-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
