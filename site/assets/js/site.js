// Progressive enhancement only. Without this file every link is an ordinary
// page and "load older" is an ordinary pagination link.

const desktop = window.matchMedia("(min-width: 1100px) and (pointer: fine)");
const parser = new DOMParser();

async function fetchDoc(url) {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return parser.parseFromString(await res.text(), "text/html");
}

// ---------- windows ----------
let z = 40;
let offset = 0;
const openWins = new Map(); // url -> window element

function focusWin(win) {
  win.style.zIndex = String(++z);
}

function closeWin(win) {
  openWins.delete(win.dataset.url);
  win.remove();
  win._opener?.focus();
}

function makeDraggable(win, bar) {
  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button") || win.classList.contains("max")) return;
    const r = win.getBoundingClientRect();
    const dx = e.clientX - r.left;
    const dy = e.clientY - r.top;
    bar.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const x = Math.min(Math.max(ev.clientX - dx, 8 - r.width + 120), window.innerWidth - 120);
      const y = Math.min(Math.max(ev.clientY - dy, 8), window.innerHeight - 40);
      win.style.left = `${x}px`;
      win.style.top = `${y}px`;
    };
    const up = () => {
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", up);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  });
}

async function openWindow(link) {
  const url = new URL(link.href, location.href).pathname;
  if (openWins.has(url)) {
    focusWin(openWins.get(url));
    return;
  }
  const doc = await fetchDoc(url);
  const article = doc.querySelector("main article");
  if (!article) throw new Error("no article");
  const title = doc.querySelector("h1")?.textContent.trim() || url;

  const win = document.createElement("section");
  win.className = "win";
  win.dataset.url = url;
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-label", title);
  win._opener = link;
  win.innerHTML = `
    <div class="win-bar">
      <span class="win-title"></span>
      <a class="win-tab" href="${url}" target="_blank" rel="noopener">open in new tab ↗</a>
      <button type="button" class="win-max" aria-pressed="false">maximize</button>
      <button type="button" class="win-close" aria-label="Close window">close ×</button>
    </div>
    <div class="win-body" tabindex="-1"></div>`;
  win.querySelector(".win-title").textContent = title;
  const body = win.querySelector(".win-body");
  body.append(document.importNode(article, true));
  body.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));

  offset = (offset + 1) % 6;
  win.style.left = `${Math.round(window.innerWidth * 0.3) + offset * 28}px`;
  win.style.top = `${96 + offset * 24}px`;
  document.body.append(win);
  openWins.set(url, win);
  focusWin(win);
  body.focus();

  win.addEventListener("pointerdown", () => focusWin(win));
  win.querySelector(".win-close").addEventListener("click", () => closeWin(win));
  const max = win.querySelector(".win-max");
  max.addEventListener("click", () => {
    const on = win.classList.toggle("max");
    max.setAttribute("aria-pressed", String(on));
    max.textContent = on ? "restore" : "maximize";
  });
  makeDraggable(win, win.querySelector(".win-bar"));
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-window]");
  if (!link || !desktop.matches) return;
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  openWindow(link).catch(() => { location.href = link.href; });
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || !openWins.size) return;
  const top = [...openWins.values()].sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
  closeWin(top);
});

// ---------- load older ----------
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("a[data-older]");
  if (!btn || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  if (btn.getAttribute("aria-busy") === "true") return;
  btn.setAttribute("aria-busy", "true");
  try {
    const url = btn.href;
    const doc = await fetchDoc(url);
    const list = document.querySelector(".feed-list");
    const fresh = [...doc.querySelectorAll(".feed-list > .entry")];
    fresh.forEach((el) => list.append(document.importNode(el, true)));
    history.pushState({ older: url }, "", url);
    const next = doc.querySelector("a[data-older]");
    if (next) {
      btn.href = next.href;
      btn.removeAttribute("aria-busy");
    } else {
      btn.closest(".older-wrap").remove();
    }
    fresh[0] && list.querySelector(`[id="${fresh[0].id}"] h3 a, [id="${fresh[0].id}"] a`)?.focus();
  } catch {
    location.href = btn.href;
  }
});

// Back/forward after "load older": the URL is a real page, so just load it.
window.addEventListener("popstate", () => location.reload());
