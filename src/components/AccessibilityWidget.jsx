import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "a11y-options";
const DEFAULTS = { night: false, size: 100 };

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return DEFAULTS;
  }
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState(load);
  const panelRef = useRef(null);

  const set = (patch) => setOpts((o) => ({ ...o, ...patch }));

  // Guardar y aplicar modo noche + tamaño de letra
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opts));
    } catch {}
    const root = document.documentElement;
    root.classList.toggle("modo-noche", opts.night);
    document.body.style.zoom = `${opts.size}%`;
  }, [opts]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="a11y-root">
      <style>{css}</style>

      {open && (
        <div
          className="a11y-panel"
          role="dialog"
          aria-label="Opciones de accesibilidad"
          tabIndex={-1}
          ref={panelRef}
        >
          <header className="a11y-head">
            <span className="a11y-title">
              <AccessIcon size={18} />
              Opciones de accesibilidad
            </span>
            <button
              type="button"
              className="a11y-close"
              onClick={() => setOpen(false)}
              aria-label="Cerrar opciones de accesibilidad"
            >
              <svg className="a11y-ico-line" width="14" height="14" viewBox="0 0 14 14" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
          </header>

          <div className="a11y-row">
            <span className="a11y-badge"><SunIcon /></span>
            <span className="a11y-label" id="a11y-night">Modo noche</span>
            <Switch
              checked={opts.night}
              labelledBy="a11y-night"
              onChange={() => set({ night: !opts.night })}
            />
          </div>

          <div className="a11y-row">
            <span className="a11y-badge a11y-badge-text">A+</span>
            <label className="a11y-label" htmlFor="a11y-size">Tamaño de letra</label>
            <input
              id="a11y-size"
              className="a11y-range"
              type="range"
              min="100"
              max="150"
              step="10"
              value={opts.size}
              onChange={(e) => set({ size: Number(e.target.value) })}
              aria-valuetext={`${opts.size}%`}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        className="a11y-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={open}
      >
        <AccessIcon size={26} />
      </button>
    </div>
  );
}

function Switch({ checked, onChange, labelledBy }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      className="a11y-switch"
      onClick={onChange}
    >
      <span className="a11y-knob" />
    </button>
  );
}

/* ---------- Iconos ---------- */
// Icono de accesibilidad con relleno (siempre visible, sin depender de trazos)
function AccessIcon({ size = 24 }) {
  return (
    <svg
      className="a11y-ico-fill"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2a2 2 0 110 4 2 2 0 010-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg className="a11y-ico-line" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

/* ---------- Estilos ---------- */
const css = `
@import url("https://fonts.googleapis.com/css2?family=Jost:wght@400;500&display=swap");

.a11y-root {
  --green: #1f3d27;
  --cream: #fdf8f3;
  --rose: #fce8e8;
  --line: #ece4da;
  --text: #3a3a36;
  --track: #d6d1cb;
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 2147483000;
  font-family: "Jost", system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.4;
}
.a11y-root *, .a11y-root *::before, .a11y-root *::after { box-sizing: border-box; }

/* Iconos: colores explícitos para que ningún CSS global los oculte */
.a11y-root svg { display: block; flex: none; overflow: visible; }
.a11y-root .a11y-ico-fill { fill: currentColor; stroke: none; }
.a11y-root .a11y-ico-line { fill: none; stroke: currentColor; }

html.modo-noche { filter: invert(1) hue-rotate(180deg); }
html.modo-noche img, html.modo-noche video, html.modo-noche .a11y-root {
  filter: invert(1) hue-rotate(180deg);
}

.a11y-root .a11y-fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 50%;
  background: var(--green);
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(31, 61, 39, .35);
}
.a11y-root .a11y-fab svg { width: 26px; height: 26px; color: #ffffff; }

.a11y-panel {
  position: absolute;
  left: 0;
  bottom: 64px;
  width: 300px;
  background: var(--cream);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, .22);
  outline: none;
  animation: a11y-in .18s ease-out;
}
@keyframes a11y-in { from { opacity: 0; transform: translateY(8px); } }

.a11y-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  background: var(--green);
  color: #ffffff;
}
.a11y-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: .18em;
  text-transform: uppercase;
  line-height: 1.5;
}
.a11y-root .a11y-close {
  display: grid;
  place-items: center;
  padding: 6px;
  margin: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: #ffffff;
  cursor: pointer;
}

.a11y-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-top: 1px solid var(--line);
}
.a11y-row:first-of-type { border-top: 0; }
.a11y-badge {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--rose);
  color: var(--green);
}
.a11y-badge-text { font-size: 12px; font-weight: 500; }
.a11y-label { flex: 1; font-size: 15px; color: var(--text); }
.a11y-row .a11y-range { flex: 0 0 120px; }

/* Interruptor */
.a11y-root .a11y-switch {
  flex: none;
  width: 44px;
  height: 26px;
  margin: 0;
  padding: 3px;
  border: 0;
  border-radius: 13px;
  background: var(--track);
  cursor: pointer;
  transition: background .2s;
}
.a11y-root .a11y-switch[aria-checked="true"] { background: var(--green); }
.a11y-knob {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .25);
  transition: transform .2s;
}
.a11y-switch[aria-checked="true"] .a11y-knob { transform: translateX(18px); }

/* Slider */
.a11y-range {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  margin: 0;
  border-radius: 2px;
  background: var(--green);
  cursor: pointer;
}
.a11y-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--green);
  border: 2px solid var(--cream);
  box-shadow: 0 0 0 1px var(--green);
}
.a11y-range::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--green);
  border: 2px solid var(--cream);
}

.a11y-root .a11y-fab:focus-visible,
.a11y-root .a11y-close:focus-visible,
.a11y-root .a11y-switch:focus-visible,
.a11y-root .a11y-range:focus-visible {
  outline: 2px solid #8fc19b;
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
  .a11y-panel { animation: none; }
  .a11y-switch, .a11y-knob { transition: none; }
}
`;
