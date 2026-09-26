!function(){"use strict";
function paint(){
  var map=[["sb-out","sb-out-v","°F"],["sb-in","sb-in-v","°F"],["sb-wb","sb-wb-v","°F"],["sb-charge","sb-chg-v","%"]];
  for(var i=0;i<map.length;i++){
    var id=map[i][0], vid=map[i][1], suf=map[i][2];
    var el=document.getElementById(id); if(!el) continue;
    var lab=el.parentNode;
    if(lab && lab.tagName==="LABEL"){
      lab.style.flexDirection="column";
      lab.style.flexWrap="nowrap";
      lab.style.alignItems="flex-start";
      lab.style.minWidth="118px";
      lab.style.maxWidth="180px";
      var cap=lab.firstChild;
      if(cap && cap.nodeType===3){
        var raw=cap.textContent.replace(/\s*\d+\s*(°F|%)\s*/g,"").replace(/\s+/g," ").trim();
        raw=raw.replace(/\s*°F$/,"").replace(/\s*%$/,"");
        cap.textContent=raw+" "+el.value+suf+" ";
      }
    }
    var v=document.getElementById(vid);
    if(!v){
      v=document.createElement("span");
      v.id=vid;
    }
    v.style.cssText="display:block;min-width:3.2em;margin:2px 0 0;font-variant-numeric:tabular-nums;font-weight:700;color:#5eead4;white-space:nowrap;font-size:13px";
    v.textContent=el.value+(suf||"");
    if(el.nextSibling!==v){
      if(el.parentNode) el.parentNode.insertBefore(v, el.nextSibling);
    }
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
