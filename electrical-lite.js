/* electrical-lite photo bench gzip loader v9 */
(function(){
  var n=4, i=0, b64="";
  function next(){
    if(i>=n){
      try{
        var bin=atob(b64), bytes=new Uint8Array(bin.length);
        for(var j=0;j<bin.length;j++) bytes[j]=bin.charCodeAt(j);
        new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text()
          .then(function(t){ (0,eval)(t); })
          .catch(function(e){ console.error("electrical-lite inflate", e); });
      }catch(e){ console.error(e); }
      return;
    }
    fetch("electrical-lite.b64."+i+".txt?v=9").then(function(r){return r.text();})
      .then(function(t){ b64+=t; i++; next(); })
      .catch(function(e){ console.error("electrical-lite chunk", i, e); });
  }
  next();
})();
