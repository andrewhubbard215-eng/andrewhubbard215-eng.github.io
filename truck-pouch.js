/* Truck Pouch loader — p0+p1. Offline after SW caches parts. */
(function(){
  "use strict";
  var U=["truck-pouch.p0.js?v=1","truck-pouch.p1.js?v=1"], B=[], i=0;
  function next(){
    if(i>=U.length){ try{(0,eval)(B.join("\n"));}catch(e){console.error("TruckPouch",e);} return; }
    var x=new XMLHttpRequest();
    x.open("GET",U[i++],true);
    x.onload=function(){ B.push(x.responseText||""); next(); };
    x.onerror=function(){ console.error("TruckPouch missing part"); };
    x.send();
  }
  next();
})();
