/* HVAC Allstars sandbox loader (chunked for Pages push) */
(function(){
  var parts=["sandbox.p0.js", "sandbox.p1.js", "sandbox.p2.js", "sandbox.p3.js", "sandbox.p4.js", "sandbox.p5.js", "sandbox.p6.js", "sandbox.p7.js", "sandbox.p8.js", "sandbox.p9.js"];
  var i=0, buf="";
  function next(){
    if(i>=parts.length){
      try{ (0,eval)(buf); }catch(e){ console.error("sandbox load failed", e); }
      return;
    }
    fetch(parts[i]+"?v=127c")
      .then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); })
      .then(function(t){ buf+=t; i++; next(); })
      .catch(function(e){ console.error("sandbox chunk fail", parts[i], e); });
  }
  next();
})();
