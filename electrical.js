/* Electrical phone-safe gzip+b64 load */
(function(){
  var parts=["electrical.b64.0.txt", "electrical.b64.1.txt", "electrical.b64.2.txt", "electrical.b64.3.txt"], i=0, b64="";
  function next(){
    if(i>=parts.length){
      try{
        var bin=atob(b64), bytes=new Uint8Array(bin.length);
        for(var j=0;j<bin.length;j++) bytes[j]=bin.charCodeAt(j);
        if(window.DecompressionStream){
          var ds=new DecompressionStream("gzip");
          var ab=bytes.buffer;
          new Response(new Blob([ab]).stream().pipeThrough(ds)).text().then(function(t){ (0,eval)(t); }).catch(function(e){ console.error(e); });
        } else {
          console.error("no DecompressionStream");
        }
      }catch(e){ console.error("electrical load failed", e); }
      return;
    }
    fetch(parts[i]+"?v=141land").then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); })
      .then(function(t){ b64+=t; i++; next(); })
      .catch(function(e){ console.error("electrical chunk fail", parts[i], e); });
  }
  next();
})();
