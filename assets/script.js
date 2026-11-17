const DATA_URL="./project-status.json";
const labels={reported_done:"گزارش‌شده انجام‌شده",reported_audit:"ممیزی‌شده",partial:"نیمه‌کامل",in_progress:"در حال انجام",incomplete:"ناقص / نیازمند تکمیل",planned:"برنامه‌ریزی‌شده",blocked:"مسدود"};
const $=s=>document.querySelector(s);
let currentData=null,activeFilter="all";
function esc(v=""){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function status(s="planned"){return '<span class="status '+esc(s)+'">'+esc(labels[s]||s)+'</span>';}
function row(x){return '<article class="list-row"><div class="row-title">'+esc(x.title||x.name||"")+(x.state?status(x.state):"")+'</div>'+(x.detail?'<p>'+esc(x.detail)+'</p>':"")+'</article>';}
function render(d){
 currentData=d;const p=d.project||{},a=d.database_audit||{};
 $("#projectTitle").textContent=p.name_fa||"بانک اطلاعاتی فیلم افغانستان";
 $("#projectSub").textContent=(p.name_en||"AMDB")+" · "+(p.domain||"");
 $("#framework").textContent=p.framework||"Laravel";
 $("#databaseName").textContent=(p.database||"MySQL")+" · "+(p.database_name||"");
 $("#lastUpdated").textContent="آخرین بازبینی: "+(p.last_verified||"—");
 $("#tables").textContent=a.tables??"—";$("#models").textContent=a.eloquent_models??"—";$("#relations").textContent=a.model_relations??"—";$("#routes").textContent=a.routes??"—";$("#migrations").textContent=a.migrations?.ran_count??"—";
 $("#featureCount").textContent=(d.feature_map||[]).length;
 $("#auditDate").textContent="تاریخ ممیزی: "+(a.audit_date||"—");
 $("#auditNote").textContent=a.note||"";
 $("#migrationGroups").innerHTML=(a.migrations?.groups||[]).map(x=>'<div class="mini-tile"><b>'+esc(x.name)+'</b><span>'+esc(x.detail)+'</span></div>').join("");
 $("#tableList").innerHTML=(a.known_tables||[]).map(x=>'<div class="table-chip"><code>'+esc(x.name)+'</code><span>'+esc(x.area)+'</span></div>').join("");
 $("#tableNote").textContent=a.known_tables_note||a.migrations?.note||"";
 renderFeatures();
 $("#roadmapList").innerHTML=(d.roadmap||[]).map((x,i)=>'<article class="phase"><div class="phase-head"><span class="phase-num">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+esc(x.phase)+'</h3>'+status(x.state)+'</div></div><ul>'+((x.items||[]).map(t=>'<li>'+esc(t)+'</li>').join(""))+'</ul></article>').join("");
 $("#decisionList").innerHTML=(d.decisions||[]).map(x=>'<div class="decision">'+esc(x)+'</div>').join("");
 $("#developmentHistory").innerHTML=(d.development_history||[]).map(x=>'<article class="history-item"><time>'+esc(x.date)+'</time><b>'+esc(x.title)+'</b><p>'+esc(x.detail)+'</p></article>').join("");
 $("#issueList").innerHTML=(d.known_issues||[]).map(x=>row({title:x.title,detail:x.detail,state:"incomplete"})).join("");
 $("#languageList").innerHTML=(d.languages||[]).map(x=>'<div class="language"><b>'+esc(x.label)+'</b><code>'+esc(x.code)+'</code><span>'+esc(x.direction.toUpperCase())+'</span><small>'+esc(x.font_status||"")+'</small></div>').join("");
 $("#identifierList").innerHTML=(d.identifier_system?.formats||[]).map(x=>'<div class="identifier"><span>'+esc(x.entity)+'</span><code>'+esc(x.example)+'</code></div>').join("");
 $("#identifierNote").textContent=d.identifier_system?.detail||"";
 $("#changelogList").innerHTML=(d.changelog||[]).map(x=>'<article class="timeline-item"><time>'+esc(x.date)+'</time><p>'+esc(x.text)+'</p></article>').join("");
}
function renderFeatures(){
 const items=currentData?.feature_map||[],filtered=activeFilter==="all"?items:items.filter(x=>x.state===activeFilter);
 $("#featureList").innerHTML=filtered.map(x=>'<article class="feature-card"><div class="feature-top"><h3>'+esc(x.name)+'</h3>'+status(x.state)+'</div><p>'+esc(x.detail)+'</p></article>').join("");
}
$("#featureFilters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderFeatures();});
async function load(){try{const r=await fetch(DATA_URL+"?v="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);render(await r.json());$("#connection").textContent="اطلاعات با موفقیت از project-status.json دریافت شد";}catch(e){$("#connection").textContent="خطا در دریافت JSON؛ لطفاً چند لحظه بعد دوباره تازه‌سازی کنید.";}}
$("#refresh").addEventListener("click",load);load();