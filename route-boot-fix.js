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
      /* do not Start for the tech — parts stay LEFT */
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
