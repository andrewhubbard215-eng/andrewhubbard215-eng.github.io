/* v3.5.378 — rebuild #sandbox-root if a service call wiped it. */
(function () {
  "use strict";
  function ensureRoot(home) {
    var root = document.getElementById("sandbox-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "sandbox-root";
      root.dataset.ltRebuilt = "1";
      home.appendChild(root);
    } else if (root.parentNode !== home) {
      home.appendChild(root);
    }
    return root;
  }
  function kick(root) {
    if (!root || root.dataset.ltStarted === "1") return;
    if (root.dataset.ltRebuilt !== "1" && root.childElementCount) return;
    if (!window.HVACSandbox || typeof window.HVACSandbox.start !== "function") return;
    root.dataset.ltStarted = "1";
    try { window.HVACSandbox.start(root); } catch (e) {}
  }
  function restoreBayHome() {
    var home = document.getElementById("screen-sandbox");
    if (!home) return;
    var root = ensureRoot(home);
    var host = document.getElementById("svc-system-host");
    if (host && !host.contains(root)) {
      host.innerHTML =
        '<p class="lede" style="padding:12px 16px">System bay — ticket rides the slim rail. Hook gauges, read SH/SC on the manifold, system stays clickable.</p>';
    }
    try { document.documentElement.removeAttribute("data-lt-gauge-run"); } catch (e) {}
    kick(root);
  }
  window.ltRestoreSandboxBay = restoreBayHome;
  function wireHub() {
    var hubBtn = document.getElementById("btn-svc-hub");
    if (!hubBtn || hubBtn.dataset.bayRestore === "378") return;
    hubBtn.dataset.bayRestore = "378";
    hubBtn.addEventListener("click", function () { restoreBayHome(); }, true);
  }
  function wrapStart() {
    if (typeof window.ltStartSandbox !== "function" || window.ltStartSandbox._ltBayRestore) return;
    var s = window.ltStartSandbox;
    window.ltStartSandbox = function () {
      restoreBayHome();
      return s.apply(this, arguments);
    };
    window.ltStartSandbox._ltBayRestore = true;
  }
  function boot() {
    wireHub();
    wrapStart();
    setInterval(function () {
      wireHub();
      wrapStart();
    }, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
