/* Allstars Recovery photo bench loader */
(function(){
  function go(){
    var p=window.__LT_RC; if(!p||!p.length) return;
    var s=document.createElement("script"); s.text=p.join(""); document.head.appendChild(s);
  }
  var n=0, total=4;
  function next(){
    if(n>=total){ go(); return; }
    var s=document.createElement("script");
    s.src="recovery-room.c"+n+".js?v=2";
    s.onload=function(){ n++; next(); };
    s.onerror=function(){ console.error("rc chunk fail", n); };
    document.head.appendChild(s);
  }
  next();
})();
