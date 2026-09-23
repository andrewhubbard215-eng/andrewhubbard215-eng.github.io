/*! Ohm's Law tickets — school entry (loads bench + tickets + play) */
(function(){
  "use strict";
  function load(src){
    return new Promise(function(res,rej){
      var s=document.createElement("script");
      s.src=src; s.async=false;
      s.onload=function(){res();};
      s.onerror=function(){rej(new Error("fail "+src));};
      document.head.appendChild(s);
    });
  }
  var b=(document.currentScript&&document.currentScript.src||"").replace(/[^/]+$/,"")||"./";
  Promise.all([
    load(b+"ohms-law-arcade-bench.js?v=2"),
    load(b+"ohms-law-arcade-tickets.js?v=2"),
    load(b+"ohms-law-arcade-play.js?v=5")
  ]).catch(function(e){ try{ console.warn("[ohms-tickets]", e); }catch(_){ } });
})();
