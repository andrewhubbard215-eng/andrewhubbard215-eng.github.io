/* Ohm arcade — Hub: Twist V/I/R · smoke meter · Easy→Spicy tickets */
(function(){
  "use strict";
  function load(src){return new Promise(function(res,rej){var s=document.createElement("script");s.src=src;s.async=false;s.onload=function(){res();};s.onerror=function(){rej(new Error(src));};document.head.appendChild(s);});}
  function fetchText(url){return fetch(url).then(function(r){return r.text();});}
  function base(){var sc=document.currentScript;if(sc&&sc.src)return sc.src.replace(/[^\/]+$/,"");return "";}
  var b=base();
  Promise.all([
    load(b+"ohms-law-arcade-bench.js?v=2"),
    load(b+"ohms-law-arcade-tickets.js?v=2"),
    fetchText(b+"ohms-law-arcade-play.b0.txt?v=2"),
    fetchText(b+"ohms-law-arcade-play.b1.txt?v=2")
  ]).then(function(parts){
    var code=atob(parts[2]+parts[3]);
    var el=document.createElement("script");el.text=code;document.head.appendChild(el);
  }).catch(function(e){console.warn("Ohm arcade load",e);});
})();
