"use client";

import { useState } from "react";

export default function MobileNav({ children, label }: { children: React.ReactNode; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen(!open)}
      >
        {label} <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>
      <nav
        id="navigation"
        aria-label={label}
        className={open ? "nav nav--open" : "nav"}
        onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}
      >
        {children}
      </nav>
    </>
  );
}
