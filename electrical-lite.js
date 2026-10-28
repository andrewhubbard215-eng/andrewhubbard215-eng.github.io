/* electrical-lite photo bench gzip loader v11 - landed msg survives paint() */
function landMsgFix(t){
  /* v11: tryLand() set Landed X on Y then paint() wiped it back to the tap hint. Keep the land line after paint(). No-op if the text moved. */
  var from="        paint();\n      } else {\n        if (btn) {\n          btn.classList.add(\"landed-bad\");";
  var to="        var ltLandMsg = (root.querySelector(\"#el-lite-msg\") || {}).textContent;\n        paint();\n        if (ltLandMsg) msg(ltLandMsg);\n      } else {\n        if (btn) {\n          btn.classList.add(\"landed-bad\");";
  return t.indexOf(from)>=0 ? t.replace(from,to) : t;
}
(function(){
  var n=4, i=0, b64="";
  function next(){
    if(i>=n){
      try{
        var bin=atob(b64), bytes=new Uint8Array(bin.length);
        for(var j=0;j<bin.length;j++) bytes[j]=bin.charCodeAt(j);
        new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text()
          .then(function(t){ (0,eval)(landMsgFix(t)); }).catch(function(e){ console.error("electrical-lite inflate", e); });
      }catch(e){ console.error(e); }
      return;
    }
    fetch("electrical-lite.b64."+i+".txt?v=10").then(function(r){return r.text();})
      .then(function(t){ b64+=t; i++; next(); }).catch(function(e){ console.error("electrical-lite chunk", i, e); });
  }
  next();
})();
