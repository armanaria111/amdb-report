const DATA_URL = "./project-status.json";
const labels = {reported_done:"گزارش‌شده به‌عنوان انجام‌شده",in_progress:"در حال انجام",planned:"برنامه‌ریزی‌شده",blocked:"مسدود"};
const $ = (s) => document.querySelector(s);
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function item(x){return '<div class="item"><div class="item-title">'+esc(x.title)+'<span class="status '+esc(x.state)+'">'+esc(labels[x.state]||x.state)+'</span></div><div class="item-detail">'+esc(x.detail||"")+'</div></div>';}
function render(d){
 const p=d.project||{}, m=d.milestones||[], done=m.filter(x=>x.state==="reported_done").length, planned=m.filter(x=>x.state==="planned").length;
 $("#projectTitle").textContent=p.name_fa||"گزارش پروژه";
 $("#projectSub").textContent=(p.name_en||"")+" · "+(p.domain||"");
 $("#progress").textContent=p.overall_progress==null?"—":p.overall_progress+"٪";
 $("#milestones").textContent=m.length;
 $("#done").textContent=done;
 $("#planned").textContent=planned;
 $("#progressNote").textContent=p.progress_note||"";
 $("#milestoneList").innerHTML=m.map(item).join("");
 $("#decisions").innerHTML=(d.decisions||[]).map(x=>'<div class="item">'+esc(x)+'</div>').join("");
 $("#issues").innerHTML=(d.known_issues||[]).map(x=>item({title:x.title,detail:x.detail,state:"in_progress"})).join("")||'<p class="muted">موردی ثبت نشده است.</p>';
 $("#languages").innerHTML=(d.languages||[]).map(x=>'<span class="chip">'+esc(x.label)+' · '+esc(x.code)+' · '+esc(x.direction.toUpperCase())+'</span>').join("");
 $("#updated").textContent=p.last_verified||"—";
 $("#changelog").innerHTML=(d.changelog||[]).map(x=>'<div class="item"><strong>'+esc(x.date)+'</strong><div class="item-detail">'+esc(x.text)+'</div></div>').join("");
}
async function load(){
 try{const r=await fetch(DATA_URL,{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);render(await r.json());$("#connection").textContent="داده‌ها از فایل JSON بارگذاری شدند";}
 catch(e){$("#connection").textContent="بارگذاری خودکار داده‌ها ناموفق بود. داشبورد را از طریق یک وب‌سرور محلی یا میزبانی سازگار باز کنید؛ فایل JSON در مخزن موجود است.";}
}
$("#refresh").addEventListener("click",load);load();