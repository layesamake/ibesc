"use client";

import { useId, useState } from "react";

type Benefit = { t: string; d: string };

export default function BenefitTabs({ items, label }: { items: Benefit[]; label: string }) {
  const [active, setActive] = useState(0);
  const id = useId().replace(/:/g, "");
  const current = items[active] ?? items[0];

  if (!current) return null;

  return (
    <div className="benefit-tabs">
      <div className="benefit-tabs__nav" role="tablist" aria-label={label}>
        {items.map((item, index) => {
          const tabId = `${id}-tab-${index}`;
          const panelId = `${id}-panel-${index}`;
          return (
            <button
              key={item.t}
              id={tabId}
              className={`benefit-tabs__tab${active === index ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls={panelId}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  setActive((index + 1) % items.length);
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive((index - 1 + items.length) % items.length);
                }
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.t}
            </button>
          );
        })}
      </div>
      <div
        className="benefit-tabs__panel"
        id={`${id}-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
      >
        <span className="benefit-tabs__marker" aria-hidden="true">✦</span>
        <div>
          <p className="benefit-tabs__label">IBESC / {String(active + 1).padStart(2, "0")}</p>
          <h3>{current.t}</h3>
          <p>{current.d}</p>
        </div>
        <span className="benefit-tabs__arrow" aria-hidden="true">↗</span>
      </div>
    </div>
  );
}
