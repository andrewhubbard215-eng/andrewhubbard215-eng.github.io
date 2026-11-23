(function(){
  if(document.getElementById('sm-css')) return;
  var s=document.createElement('style'); s.id='sm-css';
  s.textContent = '/* Service Saturday meter */\n#screen-service{overflow:auto!important;-webkit-overflow-scrolling:touch;height:100dvh;max-height:100dvh;}\n#screen-service .svc-system-host{min-height:280px;padding:8px 10px 28px;background:#0f172a;color:#e2e8f0;}\n.sm-wrap{max-width:720px;margin:0 auto;}\n.sm-ticket{font-size:12px;opacity:.9;margin:0 0 8px;}\n.sm-next{display:block!important;width:100%!important;min-height:52px!important;font-size:18px!important;font-weight:800!important;letter-spacing:.04em!important;margin:0 0 6px!important;}\n.sm-next.sm-done{background:#15803d!important;}\n.sm-coach{font-size:13px;margin:0 0 6px;min-height:36px;}\n.sm-why{font-size:13px;min-height:22px;margin:0 0 8px;color:#e2e8f0;}\n.sm-why.sm-warn{color:#fbbf24!important;font-weight:700;}\n.sm-meter{padding:10px;border-radius:10px;background:#10161c;border:1px solid #334155;margin-bottom:8px;}\n.sm-meter-face{display:flex;flex-direction:column;gap:2px;min-height:56px;justify-content:center;}\n#sm-face{font-size:16px;font-weight:700;}\n.sm-unit{font-size:11px;opacity:.75;text-transform:uppercase;letter-spacing:.06em;}\n.sm-leads,.sm-points,.sm-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}\n.sm-lead,.sm-pt,.sm-actions .btn{min-height:44px!important;min-width:44px;flex:1 1 140px;font-size:12px;}\n.sm-pt.sm-partial{outline:2px solid #f59e0b;}\n.sm-vitals{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;margin:8px 0;opacity:.95;}\n.sm-label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;opacity:.7;margin:10px 0 4px;}\n@media(max-width:480px){\n  #screen-service .svc-card{max-height:28vh;overflow:auto;-webkit-overflow-scrolling:touch;}\n  .sm-next{position:sticky;top:0;z-index:6;}\n}\n';
  (document.head||document.documentElement).appendChild(s);
})();

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
