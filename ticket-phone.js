/* Late phone override. Injected gauge CSS used to uncap the sheet and bury the hose drop. */
(function () {
  "use strict";
  var s = document.createElement("style");
  s.id = "lt-ticket-phone";
  s.textContent =
    "@media(max-width:720px){" +
    "#screen-service .svc-rail,#screen-service .svc-card{max-height:26vh!important;overflow:auto!important;position:relative!important}" +
    "#lt-dispatch,#sb-dispatch{position:relative!important;bottom:auto!important;top:auto!important;max-height:52px!important;overflow:hidden!important;width:auto!important}" +
    "#lt-quote{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70vw}" +
    "#lt-preview{position:sticky!important;top:0;z-index:5}" +
    ".lt-floor{grid-template-columns:92px minmax(0,1fr)!important}" +
    ".lt-palette{position:relative!important;left:0!important;z-index:6;pointer-events:auto}" +
    ".lt-hose,.lt-port{pointer-events:auto;position:relative;z-index:7;min-height:44px}" +
    "}";
  document.head.appendChild(s);
})();
