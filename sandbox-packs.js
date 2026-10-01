/* Allstars sandbox — Zone A core four fixed; Zone B packs + field extras scroll. */
(function () {
  "use strict";

  /* Line names only — no invented model numbers. Charge family where the line ships it. */
  var PACKS = [
    { id: "trane-xr", label: "Trane XR", brand: "Trane", ref: "R-410A", metering: "txv" },
    { id: "trane-xv", label: "Trane XV", brand: "Trane", ref: "R-410A", metering: "txv" },
    { id: "carrier-comfort", label: "Carrier Comfort", brand: "Carrier", ref: "R-410A", metering: "txv" },
    { id: "carrier-infinity", label: "Carrier Infinity", brand: "Carrier", ref: "R-454B", metering: "eev" },
    { id: "lennox-xc", label: "Lennox XC", brand: "Lennox", ref: "R-410A", metering: "txv" },
    { id: "lennox-el", label: "Lennox EL", brand: "Lennox", ref: "R-410A", metering: "txv" },
    { id: "goodman-gsx", label: "Goodman GSX", brand: "Goodman", ref: "R-410A", metering: "piston" },
    { id: "rheem-classic", label: "Rheem Classic", brand: "Rheem", ref: "R-410A", metering: "txv" },
    { id: "york-affinity", label: "York Affinity", brand: "York", ref: "R-410A", metering: "eev" },
    { id: "daikin-fit", label: "Daikin Fit", brand: "Daikin", ref: "R-410A", metering: "eev" },
    { id: "mitsu-indoor", label: "Mitsubishi indoor", brand: "Mitsubishi", ref: "R-410A", metering: "eev" },
    { id: "mitsu-outdoor", label: "Mitsubishi outdoor", brand: "Mitsubishi", ref: "R-410A", metering: "eev" },
    { id: "package-unit", label: "package unit", brand: "Package", ref: "R-410A", metering: "piston" }
  ];

  var FIELDS = [
    { id: "filter-drier", label: "filter-drier", src: "parts/filter.png", tip: "Liquid line — after condenser, before metering." },
    { id: "receiver", label: "receiver", src: "parts/condenser.png", tip: "Liquid receiver — store charge on the high side." },
    { id: "sight-glass", label: "sight glass", src: "parts/gauges.png", tip: "After the drier — flash / moisture tells the truth." },
    { id: "solenoid", label: "solenoid", src: "parts/relay.png", tip: "Liquid-line solenoid — pump-down / zone control." },
    { id: "accumulator", label: "accumulator", src: "parts/accumulator.png", tip: "Suction line into the compressor." },
    { id: "dual-run-cap", label: "dual-run cap", src: "parts/capacitor.png", tip: "Herm + fan — match µF on the can." },
    { id: "contactor", label: "contactor", src: "parts/contactor.png", tip: "Line voltage to the outdoor unit." },
    { id: "lineset", label: "line set", src: "", tip: "Insulate suction. Size to nameplate." },
    { id: "piston", label: "piston", src: "parts/metering.png", tip: "Fixed orifice — charge by SH.", metering: "piston" }
  ];

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function setText(id, s) {
    var el = document.getElementById(id);
    if (el) el.textContent = s;
  }
  function ensureBanner() {
    var el = document.getElementById("sb-sysbanner");
    if (el) return el;
    var main = $(".sb-main", document.getElementById("sandbox-root"));
    if (!main) return null;
    el = document.createElement("p");
    el.id = "sb-sysbanner";
    el.className = "sb-sysbanner";
    el.style.cssText = "margin:0;font-size:11px;opacity:.9;max-height:18px;overflow:hidden;white-space:nowrap";
    var tip = document.getElementById("sb-phone-tip");
    if (tip && tip.parentNode === main) main.insertBefore(el, tip.nextSibling);
    else main.insertBefore(el, main.firstChild);
    return el;
  }

  function setMetering(kind) {
    window.LtMeteringKind = kind;
    var btn = $('#sandbox-root [data-part="metering"]');
    if (btn) {
      if (kind === "piston" || kind === "orifice") btn.textContent = "PISTON";
      else if (kind === "eev") btn.textContent = "EEV";
      else btn.textContent = "TXV";
    }
    try {
      if (window.__ltSeatLayoutBound) {
        var paint = document.getElementById("sb-seats");
        if (paint) {
          var span = paint.querySelector('.sb-seat[data-seat="metering"] span');
          if (span) {
            span.textContent =
              kind === "piston" || kind === "orifice"
                ? "PISTON LEFT"
                : kind === "eev"
                  ? "EEV LEFT"
                  : "TXV LEFT";
          }
        }
      }
    } catch (e) {}
  }

  function applyPack(pack) {
    window.LtActivePack = pack;
    setMetering(pack.metering);
    var banner = ensureBanner();
    if (banner) {
      banner.textContent =
        pack.brand + " · " + pack.label + " · " + pack.ref + " · " + pack.metering.toUpperCase();
    }
    setText(
      "sb-status",
      pack.label +
        " pack — " +
        pack.ref +
        " / " +
        pack.metering.toUpperCase() +
        ". Loop seated. Start compressor · healthy ~162/442 · 10/10 at 95°F OD."
    );
    setText("sb-fault", "");
    if (typeof window.LtSeatAllFour === "function") {
      window.LtSeatAllFour();
    } else {
      ["compressor", "condenser", "metering", "evaporator"].forEach(function (id) {
        var part = $('#sandbox-root [data-part="' + id + '"]');
        if (part) {
          try {
            part.click();
          } catch (e) {}
        }
        var plate = document.querySelector('#sb-seats .sb-seat[data-seat="' + id + '"]');
        if (plate) plate.classList.add("on");
      });
    }
    document.querySelectorAll("#sb-zone-b .sb-pack").forEach(function (b) {
      b.classList.toggle("primary", b.getAttribute("data-pack") === pack.id);
    });
  }

  function toggleField(field, btn) {
    if (field.metering) {
      setMetering(field.metering);
      btn.classList.add("primary");
      setText("sb-status", "Metering = PISTON — charge by SH. " + field.tip);
      var banner = ensureBanner();
      if (banner && window.LtActivePack) {
        banner.textContent =
          window.LtActivePack.brand +
          " · " +
          window.LtActivePack.label +
          " · " +
          window.LtActivePack.ref +
          " · PISTON";
      }
      return;
    }
    var on = btn.classList.toggle("primary");
    setText("sb-status", on ? field.label + " on the truck — " + field.tip : field.label + " off.");
  }

  function chip(tag, cls, attrs, html) {
    var b = document.createElement(tag);
    b.type = "button";
    b.className = cls;
    Object.keys(attrs || {}).forEach(function (k) {
      b.setAttribute(k, attrs[k]);
    });
    b.innerHTML = html;
    return b;
  }

  function buildZoneB() {
    var zone = document.createElement("div");
    zone.id = "sb-zone-b";
    zone.className = "sb-zone-b";
    zone.setAttribute("data-lt-zone", "b");

    var packHead = document.createElement("p");
    packHead.className = "sb-zone-label";
    packHead.textContent = "Packs";
    zone.appendChild(packHead);

    PACKS.forEach(function (p) {
      var b = chip("button", "btn sb-pack", { "data-pack": p.id, title: p.ref + " · " + p.metering }, p.label);
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        applyPack(p);
      });
      zone.appendChild(b);
    });

    var fieldHead = document.createElement("p");
    fieldHead.className = "sb-zone-label";
    fieldHead.textContent = "Field";
    zone.appendChild(fieldHead);

    FIELDS.forEach(function (f) {
      var html = f.src
        ? '<img src="' + f.src + '" alt="" class="sb-field-ico" />' + f.label
        : f.label;
      var b = chip("button", "btn sb-field", { "data-field": f.id, title: f.tip }, html);
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        toggleField(f, b);
      });
      zone.appendChild(b);
    });

    return zone;
  }

  function restructurePalette(pal) {
    if (!pal || pal.getAttribute("data-lt-zones") === "1") return;
    pal.setAttribute("data-lt-zones", "1");

    var zoneA = document.createElement("div");
    zoneA.id = "sb-zone-a";
    zoneA.className = "sb-zone-a";
    zoneA.setAttribute("data-lt-zone", "a");

    var kids = Array.prototype.slice.call(pal.childNodes);
    kids.forEach(function (n) {
      zoneA.appendChild(n);
    });

    var met = zoneA.querySelector('[data-part="metering"]');
    if (met && !/TXV|PISTON|EEV/i.test(met.textContent || "")) met.textContent = "TXV";

    if (met && !met.dataset.ltMeterHook) {
      met.dataset.ltMeterHook = "1";
      met.addEventListener(
        "click",
        function () {
          setMetering("txv");
        },
        true
      );
    }

    pal.appendChild(zoneA);
    pal.appendChild(buildZoneB());
  }

  function mount() {
    var root = document.getElementById("sandbox-root");
    if (!root) return;
    var pal = root.querySelector(".sb-palette, aside.sb-palette");
    if (!pal) return;
    restructurePalette(pal);
  }

  var t = null;
  var obs = new MutationObserver(function () {
    clearTimeout(t);
    t = setTimeout(mount, 60);
  });
  if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
