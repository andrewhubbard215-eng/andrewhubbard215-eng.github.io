/* clock-in-form gzip loader v32 — single complete chunk */
(function(){
  var n=1, i=0, b64="";
  function next(){
    if(i>=n){
      try{
        var bin=atob(b64), bytes=new Uint8Array(bin.length);
        for(var j=0;j<bin.length;j++) bytes[j]=bin.charCodeAt(j);
        new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text()
          .then(function(t){ (0,eval)(t); }).catch(function(e){ console.error("clock-in-form inflate", e); });
      }catch(e){ console.error(e); }
      return;
    }
    fetch("clock-in-form.b64."+i+".txt?v=32").then(function(r){
      if(!r.ok) throw new Error("chunk "+i+" HTTP "+r.status);
      return r.text();
    }).then(function(t){ b64+=t.trim(); i++; next(); }).catch(function(e){ console.error("clock-in-form chunk", i, e); });
  }
  next();
})();
