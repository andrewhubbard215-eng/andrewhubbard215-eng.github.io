/* Shop pass: after Hook gauges, start compressor so SH/SC is live. */
(function () {
  "use strict";
  function kick() {
    try {
      var id = window._ltTicketId;
      if (id) {
        var chip = document.querySelector('#sb-faults [data-fault="' + id + '"]');
        if (chip) chip.click();
      }
      var run = document.getElementById("sb-run");
      if (run && String(run.textContent).indexOf("Stop") < 0) run.click();
    } catch (e) {}
  }
  setInterval(function () {
    if (window._ltTicketId && document.getElementById("sb-run") && !window._ltBootKick) {
      window._ltBootKick = window._ltTicketId;
      kick();
    }
    if (window._ltTicketId && window._ltBootKick && window._ltBootKick !== window._ltTicketId) {
      window._ltBootKick = window._ltTicketId;
      kick();
    }
  }, 250);
})();
