/* Pointer drag-and-drop + HTML5 custom drag images */
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

  function makeCustomImage(opts) {
    const node = document.createElement("div");
    node.className = "lt-custom-drag-img";
    node.setAttribute("aria-hidden", "true");
    const html = (opts && opts.html) || "";
    const label = (opts && opts.label) || "";
    node.innerHTML = html + (label ? "<strong>" + label + "</strong>" : "");
    node.style.cssText =
      "position:absolute;left:-9999px;top:0;width:168px;padding:10px;border-radius:14px;" +
      "background:#efe6d6;border:3px solid #CE0034;color:#1a1612;text-align:center;" +
      "font:700 12px/1.2 system-ui,sans-serif;box-shadow:0 16px 36px rgba(0,0,0,.5);z-index:99998;";
    document.body.appendChild(node);
    return node;
  }

  /** HTML5 DnD: custom drag ghost (compressor photo, not the default grey box). */
  function setHtml5Image(e, opts) {
    if (!e || !e.dataTransfer || !e.dataTransfer.setDragImage) return;
    const node = makeCustomImage(opts || {});
    void node.offsetWidth;
    try {
      e.dataTransfer.setDragImage(node, 84, 90);
    } catch (_) {}
    setTimeout(function () {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }, 0);
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
    const dropSel = opts.dropSelector || opts.slotSelector;
    if (!dropSel) return;
    el.style.touchAction = "none";
    el.style.userSelect = "none";
    el.style.webkitUserDrag = "none";
    el.addEventListener("pointerdown", function (e) {
      if (e.button && e.button !== 0) return;
      if (!opts.allowButtons && e.target && e.target.closest && e.target.closest("button, input, select, a")) return;
      const x0 = e.clientX;
      const y0 = e.clientY;
      let dragging = false;
      const g = ensureGhost();

      function startDrag(ev) {
        if (dragging) return;
        dragging = true;
        try { ev.preventDefault(); } catch (_) {}
        g.className = "lt-drag-ghost" + (opts.ghostClass ? " " + opts.ghostClass : "");
        g.innerHTML = opts.html || el.innerHTML;
        g.classList.add("on");
        el.classList.add("dragging");
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        if (typeof opts.onDragStart === "function") opts.onDragStart(opts.id, ev);
      }

      function move(ev) {
        if (!dragging) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 10) return;
          startDrag(ev);
        }
        g.style.left = ev.clientX + "px";
        g.style.top = ev.clientY + "px";
        document.querySelectorAll(dropSel).forEach(function (s) {
          s.classList.remove("over");
        });
        const slot = slotUnder(ev.clientX, ev.clientY, dropSel);
        if (slot) slot.classList.add("over");
        if (typeof opts.onHover === "function") opts.onHover(slot, opts.id, ev);
      }

      function up(ev) {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        if (!dragging) return;
        try { el.releasePointerCapture(ev.pointerId); } catch (_) {}
        el.classList.remove("dragging");
        g.classList.remove("on");
        document.querySelectorAll(dropSel).forEach(function (s) {
          s.classList.remove("over");
        });
        if (typeof opts.onHoverEnd === "function") opts.onHoverEnd();
        const slot = slotUnder(ev.clientX, ev.clientY, dropSel);
        if (slot && typeof opts.onDrop === "function") {
          slot.classList.add("snap");
          setTimeout(function () {
            slot.classList.remove("snap");
          }, 280);
          opts.onDrop(slot.dataset.slot || slot.dataset.lug, opts.id, slot);
        }
      }

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  }

  global.LtDrag = { bindSource, slotUnder, setHtml5Image, makeCustomImage };
})(window);
