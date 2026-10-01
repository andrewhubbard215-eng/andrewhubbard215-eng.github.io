/* service-meter boot — assemble parts then run */
(function(){
  var N=2, loaded=0, booted=false;
  function go(){
    if(booted||loaded<N) return;
    var P=window.__SM_PARTS; if(!P) return;
    var s=""; for(var i=0;i<N;i++){ if(typeof P[i]!=="string") return; s+=P[i]; }
    booted=true;
    try{ (0,eval)(s); }catch(e){ console.error("service-meter", e); }
  }
  for(var i=0;i<N;i++){(function(i){
    var el=document.createElement("script");
    el.src="service-meter.p"+i+".js?v=1";
    el.async=false;
    el.onload=function(){ loaded++; go(); };
    el.onerror=function(){ console.error("service-meter part", i); };
    (document.head||document.documentElement).appendChild(el);
  })(i);}
})();
