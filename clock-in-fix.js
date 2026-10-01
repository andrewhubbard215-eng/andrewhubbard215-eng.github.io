/* clock-in-fix gzip loader v31 */
(function(){
  var n=2, i=0, b64="";
  function next(){
    if(i>=n){
      try{
        var bin=atob(b64), bytes=new Uint8Array(bin.length);
        for(var j=0;j<bin.length;j++) bytes[j]=bin.charCodeAt(j);
        new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text()
          .then(function(t){ (0,eval)(t); }).catch(function(e){ console.error("clock-in-fix inflate", e); });
      }catch(e){ console.error(e); }
      return;
    }
    fetch("clock-in-fix.b64."+i+".txt?v=31").then(function(r){return r.text();})
      .then(function(t){ b64+=t; i++; next(); }).catch(function(e){ console.error("clock-in-fix chunk", i, e); });
  }
  next();
})();
