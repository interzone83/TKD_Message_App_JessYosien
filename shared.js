/** Shared helpers for GitHub Pages front-end. */
function getQueryParam(name, fallback = "") {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || fallback;
}
function apiUrl(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set("action", action);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") url.searchParams.set(key, params[key]);
  });
  return url.toString();
}
async function apiGet(action, params = {}) {
  const response = await fetch(apiUrl(action, params), { method: "GET", redirect: "follow" });
  if (!response.ok) throw new Error("API GET failed: " + response.status);
  return response.json();
}
async function apiPost(action, data = {}) {
  const formData = new FormData();
  formData.append("action", action);
  Object.keys(data).forEach(key => formData.append(key, data[key]));
  const response = await fetch(API_URL, { method: "POST", body: formData, redirect: "follow" });
  if (!response.ok) throw new Error("API POST failed: " + response.status);
  return response.json();
}
function escapeHtml(text) {
  if (!text) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function setCssVar(name, value) { if (value) document.documentElement.style.setProperty(name, value); }
function formatDisplayDate(dateText) {
  if (!dateText) return "";
  const cleaned = String(dateText).replace(/(\d+)(st|nd|rd|th)/i, "$1").trim();
  const date = new Date(cleaned);
  if (isNaN(date.getTime())) return dateText;
  return date.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
}
function getWallpaperCss(name, url) {
  if (name === "custom_url" && url) return `url("${url}") center / cover no-repeat`;
  if (name === "solid_black") return "#000000";
  const wallpapers = {
    gradient_blue_green: "radial-gradient(circle at 20% 20%, #3b6cd4, transparent 30%), radial-gradient(circle at 80% 30%, #1e9f8f, transparent 35%), linear-gradient(160deg, #111a3a, #123c4a 60%, #09201e)",
    gradient_purple_teal: "radial-gradient(circle at 25% 20%, #7d3fc7, transparent 32%), radial-gradient(circle at 75% 35%, #00a69c, transparent 34%), linear-gradient(160deg, #160d2f, #29316d 52%, #073a38)",
    gradient_dark_orange: "radial-gradient(circle at 25% 25%, #a64f2a, transparent 30%), radial-gradient(circle at 75% 65%, #5a1f40, transparent 38%), linear-gradient(160deg, #180c0c, #3c1e24 55%, #1c1210)",
    gradient_red_black: "radial-gradient(circle at 30% 20%, #b91c1c, transparent 30%), radial-gradient(circle at 75% 70%, #581c87, transparent 35%), linear-gradient(160deg, #050505, #2a0f14 60%, #000000)",
    gradient_ocean: "radial-gradient(circle at 25% 25%, #38bdf8, transparent 30%), radial-gradient(circle at 75% 60%, #0f766e, transparent 38%), linear-gradient(160deg, #082f49, #075985 55%, #042f2e)",
    gradient_grey_blue: "radial-gradient(circle at 25% 20%, #94a3b8, transparent 30%), radial-gradient(circle at 70% 65%, #334155, transparent 38%), linear-gradient(160deg, #111827, #1e293b 55%, #020617)"
  };
  return wallpapers[name] || wallpapers.gradient_blue_green;
}
function formatTimestampLabel(timestampText) {
  if (!timestampText) return "";
  const date = new Date(timestampText);
  if (isNaN(date.getTime())) return timestampText;
  const now = new Date();
  const messageDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((todayOnly - messageDateOnly) / (1000 * 60 * 60 * 24));
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  if (diffDays === 0) return "Today " + time;
  if (diffDays === 1) return "Yesterday " + time;
  if (diffDays > 1 && diffDays < 7) return date.toLocaleDateString([], { weekday: "long" }) + " " + time;
  return date.toLocaleDateString([], { day: "numeric", month: "short" }) + " " + time;
}
