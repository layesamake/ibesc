"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    panelRef.current?.querySelectorAll<HTMLAnchorElement>("nav > a").forEach((link) => {
      if (link.pathname === pathname) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer, .utility, .brand, .header-mobile-cta, .skip"));
    const oldInert = background.map((el) => el.inert);
    background.forEach((el) => { el.inert = true; });
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (event.key === "Tab") {
        const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]') ?? [])
          .filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0);
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !panelRef.current?.contains(document.activeElement))) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    const desktop = window.matchMedia("(min-width: 1101px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
      background.forEach((el, i) => { el.inert = oldInert[i]; });
      if (!desktop.matches) buttonRef.current?.focus();
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
      <div ref={panelRef} className={open ? "nav-layer nav-layer--open" : "nav-layer"} role={open ? "dialog" : undefined} aria-modal={open || undefined} aria-label={open ? label : undefined}>
        <button className="nav-backdrop" type="button" aria-label={closeLabel} tabIndex={-1} onClick={close} />
        <nav
          id="navigation"
          aria-label={label}
          className={open ? "nav nav--open" : "nav"}
          onClick={(e) => { if ((e.target as HTMLElement).closest("a")) close(); }}
        >
          <button ref={closeRef} className="nav-close" type="button" onClick={close}>{closeLabel} <span aria-hidden="true">×</span></button>
          {children}
        </nav>
      </div>
    </>
  );
}
