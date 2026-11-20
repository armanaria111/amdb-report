const DATA_URL="./project-status.json";
const labels={
 implemented_unverified:"پیاده‌سازی‌شده در سورس · تست‌نشده",
 reported_done:"گزارش‌شده · نیازمند تطبیق",
 reported_audit:"ممیزی‌شده",
 partial:"نیمه‌کامل",
 in_progress:"در حال انجام",
 incomplete:"ناقص",
 needs_review:"نیازمند بازبینی",
 planned:"برنامه‌ریزی‌شده",
 blocked:"مسدود"
};
const $=s=>document.querySelector(s);
let currentData=null,activeFilter="all";
function esc(v=""){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function status(s="planned"){return '<span class="status '+esc(s)+'">'+esc(labels[s]||s)+'</span>';}
function row(x){return '<article class="list-row"><div class="row-title">'+esc(x.title||x.name||"")+(x.state?status(x.state):"")+'</div>'+(x.detail?'<p>'+esc(x.detail)+'</p>':"")+'</article>';}
function render(d){
 currentData=d;
 const p=d.project||{},a=d.database_audit||{},cur=d.current_status||{},inventory=cur.source_inventory||{};
 $("#projectTitle").textContent=p.name_fa||"بانک اطلاعاتی فیلم افغانستان";
 $("#projectSub").textContent=(p.name_en||"Afghanistan Movie Database")+" · "+(p.abbreviation||"AMDB")+" · "+(p.domain||"");
 $("#framework").textContent=p.framework||"Laravel";
 $("#databaseName").textContent=(p.database||"MySQL")+" · وضعیت اتصال زنده بررسی نشده";
 $("#lastUpdated").textContent="آخرین snapshot سورس: "+(cur.snapshot_date||p.last_verified||"—");
 const features=d.feature_map||[],summary={};
 features.forEach(x=>summary[x.state]=(summary[x.state]||0)+1);
 $("#featureCount").textContent=features.length;
 $("#implementedCount").textContent=summary.implemented_unverified||0;
 $("#partialCount").textContent=summary.partial||0;
 $("#plannedCount").textContent=(summary.planned||0)+(summary.needs_review||0);
 $("#statusDisclaimer").textContent="آخرین سورس بررسی‌شده: "+(cur.source_commit||"—")+" · اعداد بالا وضعیت پیاده‌سازی در مخزن‌اند، نه درصد پیشرفت یا تأیید عملکرد واقعی.";
 $("#auditDate").textContent="Snapshot سورس: "+(cur.snapshot_date||a.audit_date||"—");
 $("#auditNote").textContent=a.note||"";
 $("#migrationGroups").innerHTML='<div class="mini-tile"><b>وضعیت دیتابیس زنده</b><span>بررسی نشده؛ تعداد جدول‌های واقعی و Migrationهای اجراشده تأیید نشده‌اند. شمار فایل‌های Migration فقط یک‌بار در موجودی فنی سورس نمایش داده می‌شود.</span></div>';
 $("#tableList").innerHTML=(a.known_tables||[]).map(x=>'<div class="table-chip"><code>'+esc(x.name)+'</code><span>'+esc(x.area)+'</span></div>').join("");
 $("#tableNote").textContent=a.known_tables_note||"";
 $("#databaseFindings").innerHTML=(a.current_findings||[]).map(x=>row({title:x.id+" · "+x.severity,detail:x.summary+" — اقدام پیشنهادی: "+x.remediation,state:"needs_review"})).join("");
 renderFeatures();

 const panels=cur.panels||[];
 $("#panelStatus").innerHTML=panels.map(x=>'<article class="feature-card"><div class="feature-top"><h3>'+esc(x.name)+'</h3>'+status(x.status)+'</div><p>'+esc(x.detail)+'</p></article>').join("");
 const sec=cur.security||{};
 $("#securityStatus").textContent=sec.status==="review_required_runtime_pending"?"نیازمند بازبینی و تست":"—";
 $("#securityNote").textContent=(sec.note||"")+" آخرین ممیزی ایستا: "+(sec.last_static_audit||"—")+" · commit: "+(sec.audited_commit||"—");
 $("#securityItems").innerHTML=(sec.remaining_items||[]).map((x,i)=>row({title:"پیگیری امنیتی "+(i+1),detail:x,state:"needs_review"})).join("");
 const q=cur.quality||{};
 const gates=[["فایل تست PHP موجود",q.tests_in_repository??"—"],["اجرای PHPUnit",q.tests_executed?"اجرا شده":"اجرا نشده"],["نتیجه تست",q.test_result||"ثبت نشده"],["Build فرانت‌اند",q.vite_build_executed?"اجرا شده":"اجرا نشده"],["بررسی مرورگر",q.browser_verified?"تأیید شده":"تأیید نشده"],["Smoke test عملیاتی",q.production_smoke_test?"اجرا شده":"اجرا نشده"],["اجرای Migration در این ممیزی",q.migrations_executed_in_this_audit?"اجرا شده":"اجرا نشده"]];
 $("#qualityStatus").textContent="QA نهایی تأیید نشده";
 $("#qualityGates").innerHTML=gates.map(x=>'<div class="mini-tile"><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div>').join("");
 $("#qualityNotes").innerHTML=(q.notes||[]).map(x=>'<li>'+esc(x)+'</li>').join("");
 $("#roadmapList").innerHTML=(d.roadmap||[]).map((x,i)=>'<article class="phase"><div class="phase-head"><span class="phase-num">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+esc(x.phase)+'</h3>'+status(x.state)+'</div></div><ul>'+((x.items||[]).map(t=>'<li>'+esc(t)+'</li>').join(""))+'</ul></article>').join("");
 const rec=d.product_recommendations||{};
 $("#recommendationsNote").textContent=rec.note||"";
 $("#recommendationList").innerHTML=(rec.categories||[]).map(x=>'<article class="feature-card"><div class="feature-top"><h3>'+esc(x.name)+'</h3><span class="status planned">'+esc(x.priority)+'</span></div><ul>'+(x.items||[]).map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></article>').join("");
 $("#decisionList").innerHTML=(d.decisions||[]).map(x=>'<div class="decision">'+esc(x)+'</div>').join("");
 const history=[...(d.development_history||[])].sort((x,y)=>(y.date||"").localeCompare(x.date||""));
 $("#developmentHistory").innerHTML=history.slice(0,8).map(x=>'<article class="history-item"><time>'+esc(x.date)+'</time><b>'+esc(x.title)+'</b><p>'+esc(x.detail)+'</p></article>').join("");
 $("#issueList").innerHTML=(d.current_open_items||[]).map((x,i)=>row({title:"اقدام "+(i+1),detail:x,state:"needs_review"})).join("");
 $("#languageList").innerHTML=(d.languages||[]).map(x=>'<div class="language"><b>'+esc(x.label)+'</b><code>'+esc(x.code)+'</code><span>'+esc((x.direction||"").toUpperCase())+'</span><small>'+esc(x.font_status||"")+'</small></div>').join("");
 $("#identifierList").innerHTML=(d.identifier_system?.formats||[]).map(x=>'<div class="identifier"><span>'+esc(x.entity)+'</span><code>'+esc(x.example)+'</code></div>').join("");
 $("#identifierNote").textContent=d.identifier_system?.detail||"";
 const audit=d.source_code_audit||{};
 $("#sourceAuditStatus").textContent="موجودی فعلی سورس · "+(audit.audit_date||"—")+" · یافته‌های عمیق قبلی تاریخی‌اند";
 $("#sourceAuditCommit").textContent=audit.commit||"—";
 const commitLink=$("#sourceAuditCommitLink");
 if(commitLink)commitLink.href="https://github.com/armanaria111/amdb-laravel2/commit/"+encodeURIComponent(audit.commit||"");
 $("#sourceAuditScope").innerHTML=(audit.scope_completed||[]).map(x=>'<div class="mini-tile">'+esc(x)+'</div>').join("");
 const inv=cur.source_inventory||{};
 const rows=[
 ["ورودی‌های Git tree",inv.tree_entries],["فایل Migration",inv.migration_files],
 ["فایل Model",inv.eloquent_model_files],["فایل Blade",inv.blade_files],
 ["فایل ترجمه PHP",inv.translation_php_files],["فایل تست PHP",inv.test_php_files],
 ["فایل Controller",inv.controller_php_files],["فایل Service",inv.service_php_files],
 ["خطوط routes/web.php",inv.web_route_lines],["فراخوانی نام‌گذاری Route",inv.named_route_calls]
 ];
 $("#sourceAuditInventory").innerHTML=rows.map(x=>'<div class="table-chip"><span>'+esc(x[0])+'</span><code>'+esc(x[1]??"—")+'</code></div>').join("");
 $("#sourceAuditFeatures").innerHTML=(audit.confirmed_implemented_areas||[]).map(x=>'<article class="list-row"><p>'+esc(x)+'</p></article>').join("");
 const historical=audit.historical_findings||{};
 $("#sourceAuditRisks").innerHTML='<article class="list-row"><div class="row-title">یافته‌های امنیتی و ساختاری ممیزی قبلی '+status("needs_review")+'</div><p>'+esc(historical.note||"یافته‌های قدیمی تا بازبینی مجدد، تاریخی محسوب می‌شوند.")+'</p><p>Commit ممیزی قبلی: <code>'+esc((historical.original_commits||[]).join("، ")||"—")+'</code></p></article>';
 $("#sourceAuditNext").innerHTML='<article class="list-row"><div class="row-title">مرحله بعدی</div><p>بازبینی عمیق امنیت، مجوزها، workflowها و schema روی commit جاری؛ سپس تطبیق با QA نهایی.</p></article>';
 $("#sourceAuditLimits").innerHTML=(audit.limitations||[]).map(x=>'<li>'+esc(x)+'</li>').join("");
 const tech=d.technology_inventory||{};
 $("#technologyAuditDate").textContent="Lockfile snapshot · "+(tech.audit_date||"—");
 $("#technologyMethod").textContent=tech.method||"";
 const techRows=items=>(items||[]).map(x=>'<article class="tech-card"><div class="tech-title">'+esc(x.name)+'</div><code>'+esc(x.locked_version||"نسخه قفل نشده")+'</code><p>'+esc(x.purpose||"")+'</p></article>').join("");
 $("#technologyPhp").innerHTML=techRows(tech.php_dependencies);
 $("#technologyDev").innerHTML=techRows(tech.php_dev_dependencies);
 $("#technologyFrontend").innerHTML=techRows(tech.frontend_dependencies);
 const ic=tech.icon_library||{};
 $("#technologyIcons").innerHTML='<div class="tech-title">'+esc(ic.name||"Font Awesome Pro")+" "+esc(ic.version||"")+'</div><p>'+esc(ic.delivery||"")+'</p><p>CSS: '+esc(ic.css_file_count??tech.local_assets?.fontawesome_css_files??"—")+' · WOFF2: '+esc(ic.woff2_file_count??tech.local_assets?.fontawesome_woff2_files??"—")+'</p><p>'+esc(ic.license||"")+'</p>';
 $("#technologyFonts").innerHTML=(tech.typography||[]).map(x=>'<article class="tech-card"><div class="tech-title">'+esc(x.locale)+" · "+esc(x.font)+'</div><code>'+esc((x.direction||"").toUpperCase())+'</code><p>'+esc(x.source||"")+'</p><small>'+esc(x.css_selector||"")+'</small></article>').join("");
 $("#technologyNotes").innerHTML=(tech.next_actions||[]).map(x=>'<li>'+esc(x)+'</li>').join("");
 $("#changelogList").innerHTML=[...(d.changelog||[])].slice(-10).reverse().map(x=>'<article class="timeline-item"><time>'+esc(x.date)+'</time><p>'+esc(x.text)+'</p></article>').join("");
 $("#connection").textContent="گزارش از یک فایل وضعیت واحد بارگذاری شد · "+(cur.source_commit||"");
}
function renderFeatures(){
 const items=currentData?.feature_map||[],filtered=activeFilter==="all"?items:items.filter(x=>x.state===activeFilter);
 $("#featureList").innerHTML=filtered.map(x=>'<article class="feature-card"><div class="feature-top"><h3>'+esc(x.name)+'</h3>'+status(x.state)+'</div><p>'+esc(x.detail)+'</p></article>').join("");
}
$("#featureFilters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderFeatures();});
async function load(){try{const r=await fetch(DATA_URL+"?v="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);render(await r.json());}catch(e){$("#connection").textContent="خطا در دریافت project-status.json؛ بعداً دوباره تازه‌سازی کنید.";}}
$("#refresh").addEventListener("click",load);load();
