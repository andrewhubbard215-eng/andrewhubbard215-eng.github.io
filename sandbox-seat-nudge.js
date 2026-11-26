/* Pulse LEFT rail + allow phone to scroll the parts list. Ready pulse on Start when all 4 seated. */
(function(){
  if (window.__ltSeatNudge) return;
  window.__ltSeatNudge = 1;
  if (!document.getElementById("lt-pulse-style")) {
    var s = document.createElement("style");
    s.id = "lt-pulse-style";
    s.textContent = "@keyframes ltPulse{0%,100%{box-shadow:0 0 0 3px #22c55e}50%{box-shadow:0 0 0 6px #22c55e88}}";
    document.head.appendChild(s);
  }


  function isSeated(id){
    var part = document.querySelector('#sandbox-root [data-part="'+id+'"]');
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="'+id+'"]');
    return (part && (part.classList.contains("primary") || part.getAttribute("aria-pressed") === "true")) ||
      (slot && (slot.classList.contains("filled") || slot.classList.contains("has") || slot.querySelector("img, strong")));
  }

  function railScroll(){
    var root = document.getElementById("sandbox-root");
    if (!root) return;
    var pal = root.querySelector(".sb-palette, aside.sb-palette, .parts-tray, [data-parts-tray]");
    if (pal) {
      pal.style.setProperty("overflow-y", "auto", "important");
      pal.style.setProperty("overflow-x", "hidden", "important");
      pal.style.webkitOverflowScrolling = "touch";
      pal.style.maxHeight = "100%";
      pal.style.minHeight = "0";
    }
    root.querySelectorAll("[data-part]").forEach(function(el){
      el.style.setProperty("touch-action", "pan-y", "important");
    });
  }
  railScroll();
  setInterval(railScroll, 800);

  function checkReady(){
    var run = document.getElementById("sb-run");
    if (!run || /Stop compressor/i.test(run.textContent || "")) return;
    var all = ["compressor", "condenser", "metering", "evaporator"].every(isSeated);
    var st = document.getElementById("sb-status");
    if (all) {
      run.style.boxShadow = "0 0 0 3px #22c55e";
      run.style.animation = "ltPulse 1.2s ease-in-out infinite";
      if (st && !/All 4 seated/i.test(st.textContent || "")) {
        st.textContent = "All 4 seated — tap Start compressor. Wait 2 min stable THEN SH/SC. Equalized standing ≠ charge — DO NOT RECOVER.";
      }
    } else {
      run.style.boxShadow = "";
      run.style.animation = "";
    }
  }
  setInterval(checkReady, 600);

  document.addEventListener("click", function(ev){
    var run = document.getElementById("sb-run");
    if (!run || !(ev.target === run || run.contains(ev.target))) return;
    if (/Stop compressor/i.test(run.textContent || "")) return;
    var need = ["compressor", "condenser", "metering", "evaporator"].filter(function(id){ return !isSeated(id); });
    if (!need.length) return;
    need.forEach(function(id){
      var btn = document.querySelector('#sandbox-root [data-part="'+id+'"]');
      if (!btn) return;
      btn.style.outline = "2px solid #fbbf24";
      btn.style.outlineOffset = "2px";
      setTimeout(function(){ btn.style.outline = ""; btn.style.outlineOffset = ""; }, 900);
    });
    var st = document.getElementById("sb-status");
    if (st) st.textContent = "Don't jump the compressor. Tap LEFT rail: " + need.join(" · ") + ".";
  }, true);
})();
