/* No-cool sheet lock: meter the 0.0 V open before Replace. */
(function () {
  var proved = false;

  function armed() {
    var root = document.getElementById("electrical-root");
    if (!root) return false;
    return /ARMED|SATURDAY CALLBACK/.test(root.innerText || "") && !!document.getElementById("el-replace");
  }

  function maskOpens() {
    var root = document.getElementById("electrical-root");
    if (!root) return;
    var nodes = root.querySelectorAll("button, [data-node], .el-box, .el-node");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var raw = el.textContent || "";
      if (!/OPEN/i.test(raw) || !/0\.0/.test(raw)) continue;
      if (el.dataset.nocoolMasked === "1") continue;
      el.dataset.openPlain = raw;
      el.textContent = raw.replace(/OPEN\s*[·•:\-]\s*/i, "");
      el.dataset.nocoolMasked = "1";
      el.title = "Meter this box. Dark after gold is the open.";
    }
  }

  function lockReplace() {
    var b = document.getElementById("el-replace");
    if (!b) return;
    if (!armed()) return;
    if (!b.dataset.plainLabel) b.dataset.plainLabel = (b.textContent || "").trim();
    if (proved) {
      b.disabled = false;
      b.textContent = b.dataset.plainLabel;
      b.style.removeProperty("display");
      b.style.removeProperty("opacity");
      b.style.removeProperty("pointer-events");
      b.style.removeProperty("filter");
      b.removeAttribute("title");
      return;
    }
    b.disabled = true;
    b.textContent = "Meter the 0.0 V open first";
    b.title = "Walk gold then dark. Shotgun is a callback.";
    b.style.removeProperty("display");
    b.style.setProperty("opacity", "0.55", "important");
    b.style.setProperty("pointer-events", "none", "important");
    b.style.setProperty("filter", "grayscale(0.35)", "important");
  }

  function onClick(ev) {
    var box = ev.target && ev.target.closest ? ev.target.closest("button, [data-node], .el-box") : ev.target;
    if (!box || box.id === "el-replace") return;
    var txt = ((box.dataset && box.dataset.openPlain) || box.textContent || "").replace(/\s+/g, " ");
    if ((/OPEN/i.test(txt) && /0\.0/.test(txt)) || (box.dataset && box.dataset.nocoolMasked === "1")) {
      proved = true;
      if (box.dataset && box.dataset.openPlain) box.textContent = box.dataset.openPlain;
      lockReplace();
    }
  }

  function paint() {
    if (!armed()) {
      proved = false;
      return;
    }
    maskOpens();
    lockReplace();
  }

  function boot() {
    if (document.body && document.body.dataset.nocoolLock === "1") return;
    if (document.body) document.body.dataset.nocoolLock = "1";
    document.addEventListener("click", onClick, true);
    setInterval(paint, 350);
    paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
