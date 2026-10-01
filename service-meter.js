/* service-meter b64 boot */
(function(){
  var N=5, loaded=0;
  function go(){
    if(loaded<N) return;
    var parts=window.__SM_B64||[];
    var b=""; for(var i=0;i<N;i++){ if(typeof parts[i]!=="string") return; b+=parts[i]; }
    try {
      var bin=atob(b);
      var s=decodeURIComponent(Array.prototype.map.call(bin,function(c){return "%"+("00"+c.charCodeAt(0).toString(16)).slice(-2);}).join(""));
      (0,eval)(s);
    } catch(e) { console.error("service-meter", e); }
  }
  for(var i=0;i<N;i++){(function(i){
    var el=document.createElement("script");
    el.src="service-meter.b"+i+".js?v=1";
    el.async=false;
    el.onload=function(){ loaded++; go(); };
    (document.head||document.documentElement).appendChild(el);
  })(i);}
})();
