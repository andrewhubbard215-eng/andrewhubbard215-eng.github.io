/* Pulse LEFT rail + allow phone to scroll the parts list. */
(function(){
  if (window.__ltSeatNudge) return;
  window.__ltSeatNudge = 1;

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

  document.addEventListener("click", function(ev){
    var run = document.getElementById("sb-run");
    if (!run || !(ev.target === run || run.contains(ev.target))) return;
    if (/Stop compressor/i.test(run.textContent || "")) return;
    var need = ["compressor", "condenser", "metering", "evaporator"].filter(function(id){
      var part = document.querySelector('#sandbox-root [data-part="'+id+'"]');
      var slot = document.querySelector('#sb-slots .sb-slot[data-slot="'+id+'"]');
      var seated = (part && (part.classList.contains("primary") || part.getAttribute("aria-pressed") === "true")) ||
        (slot && (slot.classList.contains("filled") || slot.classList.contains("has") || slot.querySelector("img, strong")));
      return !seated;
    });
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
