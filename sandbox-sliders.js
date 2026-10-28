!function(){"use strict";
function paint(){
  var map=[
    ["sb-out","sb-out-v","OD","°F"],
    ["sb-in","sb-in-v","ID","°F"],
    ["sb-wb","sb-wb-v","Indoor WB","°F"],
    ["sb-charge","sb-chg-v","Charge","%"]
  ];
  for(var i=0;i<map.length;i++){
    var id=map[i][0], vid=map[i][1], name=map[i][2], suf=map[i][3];
    var el=document.getElementById(id); if(!el) continue;
    var lab=el.parentNode;
    if(lab && lab.tagName==="LABEL"){
      lab.classList.add("sb-cond");
      lab.style.flexDirection="column";
      lab.style.flexWrap="nowrap";
      lab.style.alignItems="flex-start";
      lab.style.minWidth="132px";
      lab.style.maxWidth="220px";
      var kids=lab.childNodes;
      for(var k=kids.length-1;k>=0;k--){
        if(kids[k].nodeType===3) kids[k].textContent="";
      }
    }
    var cap=document.getElementById(vid+"-cap");
    if(!cap){
      cap=document.createElement("span");
      cap.id=vid+"-cap";
      cap.className="sb-cond-cap";
      if(el.parentNode) el.parentNode.insertBefore(cap, el);
    }
    var loopOpen = false;
    if (id === "sb-charge") {
      var need = ["compressor", "condenser", "metering", "evaporator"];
      loopOpen = need.some(function (sid) {
        var sl = document.querySelector('#sb-slots .sb-slot[data-slot="' + sid + '"]');
        if (sl) return !(sl.classList.contains("filled") || sl.querySelector("img, strong, .rm"));
        return !!document.querySelector('[data-left="' + sid + '"], .sb-chip-left');
      });
      if (!loopOpen) {
        var yell = document.getElementById("sb-parts-yell");
        if (yell && /Compressor stays off|LOOP OPEN|Seat 4 LEFT/i.test(yell.textContent || "")) loopOpen = true;
      }
      var runBtn = document.getElementById("sb-run");
      if (runBtn && /Seat 4 LEFT|Seat parts first/i.test(runBtn.textContent || "")) loopOpen = true;
    }
    cap.textContent = (id === "sb-charge" && loopOpen) ? "No weigh-in" : name;
    var v=document.getElementById(vid);
    if(!v){
      v=document.createElement("span");
      v.id=vid;
      v.className="sb-cond-val";
    }
    v.style.cssText="display:block;margin:0 0 2px;font-variant-numeric:tabular-nums;font-weight:800;color:#5eead4;white-space:nowrap;font-size:18px;line-height:1.1;letter-spacing:.02em";
    if (id === "sb-charge" && loopOpen) {
      v.textContent = "SEAT LEFT";
      v.style.color = "#fbbf24";
      el.disabled = true;
    } else {
      v.textContent=el.value+suf;
      if (id === "sb-charge") el.disabled = false;
    }
    if(cap.nextSibling!==v){
      if(cap.parentNode) cap.parentNode.insertBefore(v, cap.nextSibling);
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
