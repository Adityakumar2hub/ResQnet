const incidents=[
{id:"RQ-1042",type:"Road Accident",loc:"Bailey Road",priority:"Critical",status:"Dispatched",unit:"AMB-07",people:4,desc:"Multi-vehicle collision requiring immediate medical support."},
{id:"RQ-1041",type:"Medical Emergency",loc:"Kankarbagh",priority:"Critical",status:"Assigned",unit:"AMB-03",people:1,desc:"Patient requires urgent ambulance transport."},
{id:"RQ-1040",type:"Fire",loc:"Rajendra Nagar",priority:"High",status:"En Route",unit:"FIRE-02",people:8,desc:"Residential building fire reported by local residents."},
{id:"RQ-1039",type:"Flood",loc:"Digha",priority:"High",status:"Monitoring",unit:"RES-04",people:15,desc:"Water level rising near low-lying residential area."},
{id:"RQ-1038",type:"Medical Emergency",loc:"Patliputra",priority:"Medium",status:"Assigned",unit:"AMB-11",people:2,desc:"Non-trauma medical emergency."},
{id:"RQ-1037",type:"Security",loc:"Gandhi Maidan",priority:"Medium",status:"Dispatched",unit:"POL-06",people:10,desc:"Crowd-control assistance requested."},
{id:"RQ-1036",type:"Road Accident",loc:"Danapur",priority:"High",status:"En Route",unit:"AMB-09",people:3,desc:"Two-wheeler accident with injuries."}
];

const resources=[
{name:"Ambulances",icon:"🚑",total:15,available:12,unit:"AMB"},
{name:"Fire Units",icon:"🚒",total:8,available:6,unit:"FIRE"},
{name:"Police Units",icon:"👮",total:10,available:6,unit:"POL"},
{name:"Rescue Teams",icon:"🛟",total:7,available:5,unit:"RES"},
{name:"Disaster Response",icon:"⛑️",total:6,available:4,unit:"DR"},
{name:"Rapid Medical",icon:"🩺",total:9,available:7,unit:"RM"}
];

const hospitals=[
["AIIMS Patna",72,28],["PMCH",61,39],["IGIMS",48,52],["Ruban Memorial",67,33],["Paras HMRI",55,45],["Mediversal",43,57]
];

const titles={dashboard:"Emergency Overview",report:"Report Emergency",incidents:"Active Incidents",resources:"Emergency Resources",hospitals:"Hospital Capacity",analytics:"Response Analytics"};
const $=id=>document.getElementById(id);

function openPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 $(id).classList.add("active");
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===id));
 $("title").textContent=titles[id];
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav").forEach(n=>n.addEventListener("click",()=>openPage(n.dataset.page)));

function renderPriority(){
 $("priority").innerHTML=incidents.filter(x=>x.status!=="Resolved").slice(0,4).map(x=>`
 <div class="incident" onclick="showIncident('${x.id}')">
   <strong class="${x.priority==="Critical"?"red":"orange"}">${x.priority}</strong>
   <b>${x.type}</b><small>${x.loc} · ${x.id}</small>
 </div>`).join("");
 updateCounts();
}

function renderTable(){
 let q=($("search")?.value||"").toLowerCase(), f=$("filter")?.value||"All", sf=$("statusFilter")?.value||"All Statuses";
 let list=incidents.filter(x=>(f==="All"||x.priority===f)&&(sf==="All Statuses"||x.status===sf)&&JSON.stringify(x).toLowerCase().includes(q));
 $("table").innerHTML=list.map(x=>`
 <tr>
  <td><b>${x.id}</b></td><td>${x.type}</td><td>${x.loc}</td>
  <td><span class="status ${x.priority==="Critical"?"red":x.priority==="High"?"orange":"blue"}">${x.priority}</span></td>
  <td><span class="status">${x.status}</span></td><td>${x.unit}</td>
  <td><button class="action" onclick="showIncident('${x.id}')">View</button></td>
 </tr>`).join("");
 $("emptyState").hidden=list.length>0;
 updateCounts();
}

function updateCounts(){
 const active=incidents.filter(x=>x.status!=="Resolved").length;
 $("incidentCount").textContent=active;
 $("activeStat").textContent=String(active).padStart(2,"0");
 $("mapCount").textContent=active+" active";
 $("unitStat").textContent=resources.reduce((a,r)=>a+r.available,0);
}

function showIncident(id){
 const x=incidents.find(a=>a.id===id); if(!x)return;
 $("modalContent").innerHTML=`
 <div><small>INCIDENT DETAIL</small><h2 style="margin:4px 0 0">${x.type}</h2><p style="color:#7b8696;font-size:12px">${x.id}</p></div>
 <div class="detail-grid">
  <div class="detail"><small>Location</small><b>${x.loc}</b></div>
  <div class="detail"><small>Priority</small><b class="${x.priority==="Critical"?"red":"orange"}">${x.priority}</b></div>
  <div class="detail"><small>Status</small><b>${x.status}</b></div>
  <div class="detail"><small>Assigned Unit</small><b>${x.unit}</b></div>
  <div class="detail"><small>People Affected</small><b>${x.people||1}</b></div>
  <div class="detail"><small>Report ID</small><b>${x.id}</b></div>
 </div>
 <p style="font-size:12px;color:#667284"><b>Description:</b> ${x.desc||"No additional description provided."}</p>
 <div class="modal-actions">
  <button onclick="cycleStatus('${x.id}')">Update Status</button>
  <button class="secondary" onclick="closeModal()">Close</button>
 </div>`;
 $("modal").classList.add("open"); $("modal").setAttribute("aria-hidden","false");
}

function cycleStatus(id){
 const x=incidents.find(a=>a.id===id); if(!x)return;
 const flow=["Pending","Assigned","Dispatched","En Route","Monitoring","Resolved"];
 const next=flow[(flow.indexOf(x.status)+1)%flow.length];
 x.status=next;
 closeModal(); renderTable(); renderPriority(); toast(`${x.id} → ${next}`);
}

function closeModal(){$("modal").classList.remove("open");$("modal").setAttribute("aria-hidden","true")}
document.querySelector(".modal-close").addEventListener("click",closeModal);
$("modal").addEventListener("click",e=>{if(e.target===$("modal"))closeModal()});

function renderResources(){
 $("resourceCards").innerHTML=resources.map((r,i)=>`
 <div class="resource-card">
  <h3>${r.icon} ${r.name}</h3>
  <div class="num">${r.available} <small>/ ${r.total} available</small></div>
  <progress value="${r.available}" max="${r.total}"></progress>
  <p>${Math.round(r.available/r.total*100)}% ready for dispatch</p>
  <div class="resource-actions">
   <button onclick="dispatchUnit(${i})" ${r.available===0?"disabled":""}>Dispatch 1</button>
   <button class="secondary" onclick="releaseUnit(${i})">Release 1</button>
  </div>
 </div>`).join("");
}

function dispatchUnit(i){
 if(resources[i].available<=0){toast("No units available");return}
 resources[i].available--; renderResources(); renderDashboardWidgets(); updateCounts();
 toast(`${resources[i].name}: 1 unit dispatched`);
}
function releaseUnit(i){
 if(resources[i].available>=resources[i].total){toast("All units already available");return}
 resources[i].available++; renderResources(); renderDashboardWidgets(); updateCounts();
 toast(`${resources[i].name}: 1 unit returned to base`);
}
function refreshResources(){
 resources.forEach(r=>{if(r.available<r.total&&Math.random()>.55)r.available++});
 renderResources();renderDashboardWidgets();updateCounts();toast("Fleet status refreshed");
}

function renderHospitals(){
 $("hospitalCards").innerHTML=hospitals.map((h,i)=>`
 <div class="hospital-card">
  <h3>🏥 ${h[0]}</h3><p>${h[2]}% capacity available</p>
  <progress value="${h[1]}" max="100"></progress><strong>${h[1]}% occupied</strong>
  <button onclick="routeToHospital(${i})">Route Patient →</button>
 </div>`).join("");
}
function routeToHospital(i){toast(`Route assigned to ${hospitals[i][0]}`)}
function recommendHospital(){
 const best=hospitals.reduce((a,b)=>a[1]<b[1]?a:b);
 toast(`Recommended: ${best[0]} (${100-best[1]}% capacity available)`);
}

function submitReport(){
 const type=$("type").value,loc=$("loc").value.trim(),sev=$("sev").value.split(" — ")[0],people=Math.max(1,parseInt($("people").value||"1",10)),desc=$("desc").value.trim();
 if(!loc){$("formMessage").textContent="Please enter the emergency location.";return}
 const id="RQ-"+(1043+incidents.length);
 incidents.unshift({id,type,loc,priority:sev,status:"Pending",unit:"Unassigned",people,desc:desc||"No additional description."});
 $("loc").value="";$("desc").value="";$("people").value=1;$("formMessage").textContent="";
 renderPriority();renderTable();toast("Emergency report submitted successfully");openPage("incidents");
}

function simulateIncident(){
 const types=[["Medical Emergency","Kankarbagh"],["Road Accident","Fraser Road"],["Fire","Boring Road"],["Flood","Digha"]];
 const [type,loc]=types[Math.floor(Math.random()*types.length)];
 const id="RQ-"+(1043+incidents.length);
 incidents.unshift({id,type,loc,priority:"Critical",status:"Pending",unit:"Unassigned",people:Math.ceil(Math.random()*5),desc:"Simulated emergency for demonstration."});
 renderPriority();renderTable();toast("⚡ New simulated critical incident received");
 openPage("incidents");
}

function clearFilters(){$("search").value="";$("filter").value="All";$("statusFilter").value="All Statuses";renderTable()}

function renderDashboardWidgets(){
 $("dashResources").innerHTML=resources.slice(0,3).map(r=>`
 <div class="res">${r.icon} ${r.name}<b>${r.available}/${r.total}</b><progress value="${r.available}" max="${r.total}"></progress></div>`).join("");
 $("dashHospitals").innerHTML=hospitals.slice(0,3).map(h=>`
 <div class="res">🏥 ${h[0]}<b>${h[1]}%</b><progress value="${h[1]}" max="100"></progress></div>`).join("");
 $("dashBars").innerHTML=[35,55,45,72,62,85,92].map(v=>`<i style="height:${v}%"></i>`).join("");
}

function renderAnalytics(){
 const vals=[30,45,38,70,54,84,68,92];
 $("analyticsChart").innerHTML=vals.map((v,i)=>`<i style="height:${v}%"><span>${12+i}:00</span></i>`).join("");
}

function toast(t){
 const x=$("toast");x.textContent=t;x.style.display="block";
 clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>x.style.display="none",2800);
}

function clock(){$("clock").textContent=new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}
setInterval(clock,1000);clock();

$("notifyBtn").addEventListener("click",()=>{$("notificationPanel").classList.toggle("open");$("notifyDot").style.display="none"});
document.querySelector(".close-panel").addEventListener("click",()=>$("notificationPanel").classList.remove("open"));

$("themeBtn").addEventListener("click",()=>{
 document.body.classList.toggle("dark");
 $("themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾";
 toast(document.body.classList.contains("dark")?"Dark mode enabled":"Light mode enabled");
});

document.querySelectorAll(".marker").forEach(m=>m.addEventListener("click",()=>showIncident(m.dataset.incident)));

function boot(){
 renderPriority();renderTable();renderResources();renderHospitals();renderDashboardWidgets();renderAnalytics();updateCounts();
}
boot();

setInterval(()=>{
 if(Math.random()>.65){
   const bars=document.querySelectorAll("#analyticsChart i");
   if(bars.length) bars[Math.floor(Math.random()*bars.length)].style.height=(35+Math.floor(Math.random()*60))+"%";
 }
},4000);
/* Authentication & role-based access */
let currentRole="user";
let currentUser=null;

const demoAccounts={
  user:{identity:"user@resqnet.com",password:"user123",name:"Emergency User",initials:"EU"},
  admin:{identity:"admin@resqnet.com",password:"admin123",name:"Admin Dispatcher",initials:"AD"}
};

function setRole(role){
  currentRole=role;
  document.querySelectorAll(".role-btn").forEach(b=>b.classList.toggle("active",b.dataset.role===role));
  $("authTitle").textContent=role==="admin"?"Admin Command Access":"Welcome back";
  $("authSubtitle").textContent=role==="admin"?"Authorized administrators can manage incidents, resources and system controls.":"Sign in to report emergencies and track your requests.";
  $("loginButtonText").textContent=role==="admin"?"Sign in as Admin":"Sign in as User";
  $("demoHint").textContent=role==="admin"?"Admin: admin@resqnet.com / admin123":"User: user@resqnet.com / user123";
  $("loginMessage").textContent="";
}
document.querySelectorAll(".role-btn").forEach(b=>b.addEventListener("click",()=>setRole(b.dataset.role)));

$("togglePassword").addEventListener("click",()=>{
 const input=$("loginPassword");
 input.type=input.type==="password"?"text":"password";
 $("togglePassword").textContent=input.type==="password"?"Show":"Hide";
});

$("forgotPassword").addEventListener("click",()=>{
 $("loginMessage").style.color="#c06b14";
 $("loginMessage").textContent="Demo mode: use the credentials shown below.";
});

$("loginForm").addEventListener("submit",e=>{
 e.preventDefault();
 const identity=$("loginIdentity").value.trim().toLowerCase();
 const password=$("loginPassword").value;
 const account=demoAccounts[currentRole];
 if(identity===account.identity && password===account.password){
   currentUser={...account,role:currentRole};
   $("authScreen").classList.add("hidden");
   applyRole();
   toast(`Welcome, ${account.name}`);
 }else{
   $("loginMessage").style.color="#d93636";
   $("loginMessage").textContent="Invalid credentials for the selected role.";
 }
});

function applyRole(){
 const admin=currentUser?.role==="admin";
 $("avatar").textContent=currentUser.initials;
 $("sidebarUserName").textContent=currentUser.name;
 $("sidebarRole").textContent=admin?"Administrator":"Emergency User";
 document.querySelectorAll(".admin-only").forEach(el=>el.style.display=admin?"block":"none");
 document.querySelectorAll(".admin-only-page").forEach(el=>el.style.display=admin?"":"none");
 if(!admin && $("admin")?.classList.contains("active")) openPage("dashboard");
}

$("logoutBtn").addEventListener("click",()=>{
 currentUser=null;
 $("loginPassword").value="";
 $("loginMessage").textContent="";
 $("authScreen").classList.remove("hidden");
 setRole("user");
 openPage("dashboard");
 toast("You have been logged out");
});

function openAdminAction(action){
 $("modalContent").innerHTML=`<h2>${action}</h2><p style="font-size:12px;color:#778293">This administrative module is ready for backend/API integration. The current frontend demo confirms the role-based access flow.</p><button onclick="closeModal()">Close</button>`;
 $("modal").classList.add("open");
}

/* Hide admin controls until a user is authenticated */
document.querySelectorAll(".admin-only").forEach(el=>el.style.display="none");
document.querySelectorAll(".admin-only-page").forEach(el=>el.style.display="none");

/* Registration flow */
const showRegisterBtn=$("showRegister");
const registerForm=$("registerForm");
const loginForm=$("loginForm");
const backToLogin=$("backToLogin");

function showRegister(){
  loginForm.style.display="none";
  showRegisterBtn.style.display="none";
  document.querySelector(".register-divider").style.display="none";
  registerForm.style.display="block";
  $("authTitle").textContent="Create your account";
  $("authSubtitle").textContent="Register as a ResQNet user to report and track emergencies.";
  $("registerMessage").textContent="";
  $("registerName").focus();
}
function showLogin(){
  registerForm.style.display="none";
  loginForm.style.display="block";
  showRegisterBtn.style.display="block";
  document.querySelector(".register-divider").style.display="flex";
  $("authTitle").textContent=currentRole==="admin"?"Admin Command Access":"Welcome back";
  $("authSubtitle").textContent=currentRole==="admin"?"Authorized administrators can manage incidents, resources and system controls.":"Sign in to access the emergency response platform.";
}
showRegisterBtn.addEventListener("click",showRegister);
backToLogin.addEventListener("click",showLogin);

registerForm.addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("registerName").value.trim();
  const email=$("registerEmail").value.trim().toLowerCase();
  const phone=$("registerPhone").value.trim();
  const password=$("registerPassword").value;
  const confirm=$("registerConfirm").value;

  if(name.length<2){
    $("registerMessage").textContent="Please enter a valid full name."; return;
  }
  if(!email.includes("@")){
    $("registerMessage").textContent="Please enter a valid email address."; return;
  }
  if(phone.replace(/\D/g,"").length<10){
    $("registerMessage").textContent="Please enter a valid phone number."; return;
  }
  if(password.length<6){
    $("registerMessage").textContent="Password must contain at least 6 characters."; return;
  }
  if(password!==confirm){
    $("registerMessage").textContent="Passwords do not match."; return;
  }

  $("registerMessage").style.color="#169b67";
  $("registerMessage").textContent="Account created successfully. Redirecting to login…";

  /* Frontend demo: use the new account for the current browser session. */
  demoAccounts.user={identity:email,password:password,name:name,initials:name.split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase()};
  setTimeout(()=>{
    $("loginIdentity").value=email;
    $("loginPassword").value="";
    $("registerMessage").textContent="";
    showLogin();
    $("loginMessage").style.color="#169b67";
    $("loginMessage").textContent="Registration successful. Please enter your password to sign in.";
    setRole("user");
  },700);
});
