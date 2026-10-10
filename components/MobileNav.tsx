"use client";

import { useEffect, useRef, useState } from "react";

export default function MobileNav({
  children,
  label,
  closeLabel = "Close",
}: {
  children: React.ReactNode;
  label: string;
  closeLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="navigation"
        aria-label={open ? closeLabel : label}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="menu-toggle__label">{open ? closeLabel : label}</span>
        <span className="menu-toggle__icon" aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>
      <div className={open ? "nav-layer nav-layer--open" : "nav-layer"}>
        <button className="nav-backdrop" type="button" aria-label={closeLabel} tabIndex={open ? 0 : -1} onClick={close} />
        <nav
          id="navigation"
          aria-label={label}
          className={open ? "nav nav--open" : "nav"}
          onClick={(e) => { if ((e.target as HTMLElement).closest("a")) close(); }}
        >
          {children}
        </nav>
      </div>
    </>
  );
}
