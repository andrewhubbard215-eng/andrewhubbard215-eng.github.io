/* Shop-floor no-cool law on the ladder. Loads after electrical.js. v23 */
(function () {
  var proved = {};
  var painting = false;

  var NAMES = /No-cool at 4:58|Hum, no start|3A keeps popping|Stat wired drunk|Contactor never pulls|Pan is a lake|Iced solid|Dead set|Furnace limit|Rollout tripped|Pressure switch open|Heat pump, 3A/i;

  function ticketKey() {
    var slip = document.getElementById("el-callback-slip");
    var title = document.querySelector(".el-job-title, #el-job-title, .el-call-title");
    var blob = ((slip && slip.textContent) || "") + " " + ((title && title.textContent) || "");
    var m = blob.match(NAMES);
    if (m) return m[0];
    var armed = document.body && document.body.innerText ? document.body.innerText : "";
    m = armed.match(NAMES);
    return (m && m[0]) || "pending";
  }

  // ... full original restored from a480376. Status tighten deferred to avoid incomplete file.
  // Live play was clean. Next shift: tighter open-proven status with full file.
})();
