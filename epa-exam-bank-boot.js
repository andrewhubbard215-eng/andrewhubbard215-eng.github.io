(function(){"use strict";
function inflate(parts){
  var b64=(parts||[]).join("");
  if(!b64) throw new Error("missing");
  var bin=atob(b64);
  var u8=new Uint8Array(bin.length);
  for(var i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i);
  return new TextDecoder("utf-8").decode(u8);
}
try{(0,eval)(inflate(window.__EPA_B64));}catch(e){console.error("epa-exam-bank boot",e);}
})();
