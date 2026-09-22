!function(){"use strict";
function paint(){
  var title=document.getElementById("sb-ph-title");
  var sct=document.getElementById("sb-sct");
  var sst=document.getElementById("sb-sst");
  if(!title||!sct||!sst) return;
  if(/Standing/i.test(title.textContent||"") && /eq both/i.test(sct.textContent||"")){
    sct.textContent=sst.textContent;
  }
}
setInterval(paint, 200);
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", paint);
else paint();
}();
