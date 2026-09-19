!function(){"use strict";
function paint(){
  var map=[["sb-out","sb-out-v","°"],["sb-in","sb-in-v","°"],["sb-wb","sb-wb-v",""],["sb-charge","sb-chg-v","%"]];
  for(var i=0;i<map.length;i++){
    var id=map[i][0], vid=map[i][1], suf=map[i][2];
    var el=document.getElementById(id); if(!el) continue;
    var v=document.getElementById(vid);
    if(!v){
      v=document.createElement("span");
      v.id=vid;
      v.style.cssText="margin-left:6px;font-variant-numeric:tabular-nums;opacity:.95";
      el.parentNode && el.parentNode.appendChild(v);
    }
    var n=el.value;
    v.textContent=n+(suf==="%"?"%":suf==="°"?"°F":"");
    if(!el.dataset.ltReadout){
      el.dataset.ltReadout="1";
      el.addEventListener("input", paint);
    }
  }
}
setInterval(paint, 400);
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", paint);
else paint();
}();
