!function(){"use strict";
function paint(){
  var map=[["sb-out","sb-out-v","°F"],["sb-in","sb-in-v","°F"],["sb-wb","sb-wb-v",""],["sb-charge","sb-chg-v","%"]];
  for(var i=0;i<map.length;i++){
    var id=map[i][0], vid=map[i][1], suf=map[i][2];
    var el=document.getElementById(id); if(!el) continue;
    var v=document.getElementById(vid);
    if(!v){
      v=document.createElement("span");
      v.id=vid;
      if(el.parentNode){
        el.parentNode.insertBefore(v, el);
      }
    }
    v.style.cssText="margin:0 4px;font-variant-numeric:tabular-nums;font-weight:700;color:#5eead4";
    v.textContent=el.value+(suf||"");
    if(!el.dataset.ltReadout){
      el.dataset.ltReadout="1";
      el.addEventListener("input", paint);
    }
  }
}
setInterval(paint, 250);
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", paint);
else paint();
}();
