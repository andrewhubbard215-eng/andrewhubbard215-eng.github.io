/* Pointer drag-and-drop — mouse + touch. Works in the live preview iframe. */
(function (global) {
  "use strict";

  let ghost = null;

  function ensureGhost() {
    if (ghost && ghost.isConnected) return ghost;
    ghost = document.createElement("div");
    ghost.className = "lt-drag-ghost";
    ghost.setAttribute("aria-hidden", "true");
    document.body.appendChild(ghost);
    return ghost;
  }

  function slotUnder(x, y, selector) {
    const g = ghost;
    const prev = g && g.style.display;
    if (g) g.style.display = "none";
    let n = document.elementFromPoint(x, y);
    if (g) g.style.display = prev || "";
    while (n) {
      if (n.matches && n.matches(selector)) return n;
      n = n.parentElement;
    }
    return null;
  }

  function bindSource(el, opts) {
    if (!el || !opts || !opts.id) return;
    el.style.touchAction = "none";
    el.style.userSelect = "none";
    el.style.webkitUserDrag = "none";
    el.addEventListener("pointerdown", function (e) {
      if (e.button && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest("button, input, select, a")) return;
      e.preventDefault();
      const g = ensureGhost();
      g.innerHTML = opts.html || el.innerHTML;
      g.classList.add("on");
      el.classList.add("dragging");
      try {
        el.setPointerCapture(e.pointerId);
      } catch (_) {}

      function move(ev) {
        g.style.left = ev.clientX + "px";
        g.style.top = ev.clientY + "px";
        document.querySelectorAll(opts.slotSelector).forEach(function (s) {
          s.classList.remove("over");
        });
        const slot = slotUnder(ev.clientX, ev.clientY, opts.slotSelector);
        if (slot) slot.classList.add("over");
      }

      function up(ev) {
        try {
          el.releasePointerCapture(ev.pointerId);
        } catch (_) {}
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        el.classList.remove("dragging");
        g.classList.remove("on");
        document.querySelectorAll(opts.slotSelector).forEach(function (s) {
          s.classList.remove("over");
        });
        const slot = slotUnder(ev.clientX, ev.clientY, opts.slotSelector);
        if (slot && typeof opts.onDrop === "function") {
          slot.classList.add("snap");
          setTimeout(function () {
            slot.classList.remove("snap");
          }, 280);
          opts.onDrop(slot.dataset.slot, opts.id, slot);
        }
      }

      move(e);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  }

  global.LtDrag = { bindSource, slotUnder };
})(window);
