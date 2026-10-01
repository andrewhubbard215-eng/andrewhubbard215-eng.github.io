/* epa-exam-bank plain multi-part loader v4 — no gzip */
(function(){
  var n=3, i=0, code="";
  function next(){
    if(i>=n){
      try{ (0,eval)(code); }catch(e){ console.error("epa-exam-bank eval", e); }
      return;
    }
    fetch("epa-exam-bank.p"+i+".js?v=4").then(function(r){
      if(!r.ok) throw new Error("part "+i+" HTTP "+r.status);
      return r.text();
    }).then(function(t){ code+=t; i++; next(); }).catch(function(e){ console.error("epa-exam-bank part", i, e); });
  }
  next();
})();
