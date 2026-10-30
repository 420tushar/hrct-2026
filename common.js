// Shared helpers for index.html and viewer.html
const WIN_LABEL = { lung: "Lung", soft: "Mediastinum", default: "Scout" };
const WIN_DETAIL = { lung: "W 1500 / L -600", soft: "W 400 / L 40", default: "" };

function fmtDate(s) {
  if (!s || s.length !== 8) return s || "";
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${+s.slice(6)} ${m[+s.slice(4, 6) - 1]} ${s.slice(0, 4)}`;
}
function fmtMonYear(s) { return s && s.length === 8 ? fmtDate(s).split(' ').slice(1).join(' ') : ''; }
const DEFAULT_GROUPS = [["inspiration", "Inspiration"], ["expiration", "Expiration"], ["scout", "Scout"]];
function fmtTime(s) { return s && s.length >= 4 ? `${s.slice(0, 2)}:${s.slice(2, 4)}` : ""; }
function fmtAge(a) { const n = parseInt(a, 10); return isNaN(n) ? a : `${n}Y`; }
function mb(n) { return (n / 1048576).toFixed(1) + " MB"; }

function seriesInfo(s) {
  if (s.info) return s.info;
  const d = s.desc;
  if (/Topogram/i.test(d)) return { phase: "Scout", plane: "Scout", kernel: "", title: "Scout (topogram)", group: "scout" };
  const phase = /Expiration/i.test(d) ? "Expiration" : "Inspiration";
  const plane = / ax$/i.test(d) ? "Axial" : / cor$/i.test(d) ? "Coronal" : / sag$/i.test(d) ? "Sagittal" : "";
  const kernel = /Bl60/.test(d) ? "Lung kernel (Bl60)" : /Br40/.test(d) ? "Soft-tissue kernel (Br40)" : "";
  return { phase, plane, kernel, title: `${plane} · ${/Bl60/.test(d) ? "Lung" : "Soft tissue"}`, group: phase.toLowerCase() };
}
// DICOM download links: one zip, or several parts when a series is over GitHub's 100 MB file limit
function zipLinks(s) {
  if (!s.parts) return [{ href: `dicom/${s.id}.zip`, label: `DICOM .zip (${mb(s.zip)})` }];
  return s.parts.map((p, k) => ({ href: `dicom/${p.file}`, label: `DICOM part ${k + 1}/${s.parts.length} · Im ${p.first}-${p.last} (${mb(p.size)})` }));
}
function imgUrl(s, w, i) { return `img/${s.id}/${w}/${String(i).padStart(3, "0")}.jpg`; }
