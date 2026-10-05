const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const toast = $("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

/* Mobile menu */
$("#menuBtn").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
$$(".nav-links a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));

/* Light / dark theme */
const savedTheme = localStorage.getItem("iem-theme");
if (savedTheme === "dark") document.body.classList.add("dark");
function updateThemeIcon() {
  $("#themeIcon").textContent = document.body.classList.contains("dark") ? "☀" : "☾";
}
updateThemeIcon();
$("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("iem-theme", document.body.classList.contains("dark") ? "dark" : "light");
  updateThemeIcon();
});

/* Announcement ticker */
const announcements = [
  "IEM Salt Lake • Student Events Portal • Discover. Participate. Create.",
  "Featured: Build for Tomorrow — 24-hour Innovation Hackathon.",
  "Explore technical, cultural, sports and community experiences.",
  "New: detailed feedback system is now live.",
  "Tip: switch between light and dark mode from the top navigation."
];
let announcementIndex = 0;
$("#nextAnnouncement").addEventListener("click", () => {
  announcementIndex = (announcementIndex + 1) % announcements.length;
  $("#announcementText").textContent = announcements[announcementIndex];
});

/* Event filtering + search */
const filters = $$(".filter");
const cards = $$(".event-card");
const search = $("#eventSearch");
function filterEvents() {
  const active = $(".filter.active").dataset.filter;
  const query = search.value.toLowerCase().trim();
  let visible = 0;

  cards.forEach(card => {
    const categoryMatch = active === "all" || card.dataset.category === active;
    const textMatch = card.dataset.title.toLowerCase().includes(query) ||
      card.textContent.toLowerCase().includes(query);
    const show = categoryMatch && textMatch;
    card.classList.toggle("hide", !show);
    if (show) visible++;
  });
  $("#emptyState").classList.toggle("show", visible === 0);
}
filters.forEach(btn => btn.addEventListener("click", () => {
  filters.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  filterEvents();
}));
search.addEventListener("input", filterEvents);

/* Event detail modal */
const eventData = {
  "Build for Tomorrow": ["TECHNICAL", "24-hour innovation hackathon where student teams turn real-world problems into prototypes.", "18 October 2026", "Innovation Lab", "Teams of 2–4"],
  "SYTRON": ["TECHNICAL", "A technical extravaganza featuring IoT, robotics, coding, Gen-AI, quizzes, tech talks and competitions.", "24 October 2026", "IEM Campus", "Multiple tracks"],
  "Code to Console": ["WORKSHOP", "Hands-on coding and problem-solving session designed to move from concept to implementation.", "27 October 2026", "CSE Lab", "Beginner friendly"],
  "Lenscape": ["CREATIVE TECH", "A visual storytelling and photography experience around the IEM campus.", "30 October 2026", "IEM Campus", "Open entry"],
  "Robotics Arena": ["COMPETITION", "Build and test a robot through multiple challenge rounds with your team.", "02 November 2026", "Robotics Lab", "Teams of 3–5"],
  "Campus Fest": ["CULTURAL", "An evening of music, dance, food, performances and student showcases.", "07 November 2026", "Main Ground", "Evening"],
  "Future Forum": ["DEBATE", "A structured debate covering technology, society, business and the future.", "10 November 2026", "Seminar Hall", "Individual"],
  "IEM Sports League": ["SPORTS", "A multi-sport campus league including football, cricket, table tennis, chess and indoor games.", "14 November 2026", "Sports Complex", "Team entry"],
  "Green Campus Drive": ["COMMUNITY", "A student-led sustainability and campus awareness initiative.", "18 November 2026", "IEM Campus", "Volunteer"],
  "AI Product Lab": ["WORKSHOP", "Turn an AI concept into a usable prototype using product thinking and rapid iteration.", "21 November 2026", "Innovation Lab", "Intermediate"],
  "Word Waves": ["CULTURAL", "Poetry, spoken word and original writing from the IEM student community.", "25 November 2026", "CII Auditorium", "Open mic"],
  "UI/UX Sprint": ["DESIGN", "Design a polished interface from a surprise real-world brief in a fast-paced sprint.", "29 November 2026", "Design Studio", "Solo / Duo"]
};



/* Hero next-event countdown: automatically chooses the nearest future event. */
const eventDates = {
  "Build for Tomorrow": "2026-10-18T10:00:00+05:30",
  "SYTRON": "2026-10-24T10:00:00+05:30",
  "Code to Console": "2026-10-27T14:00:00+05:30",
  "Lenscape": "2026-10-30T10:00:00+05:30",
  "Robotics Arena": "2026-11-02T10:00:00+05:30",
  "Campus Fest": "2026-11-07T18:00:00+05:30",
  "Future Forum": "2026-11-10T14:00:00+05:30",
  "IEM Sports League": "2026-11-14T09:00:00+05:30",
  "Green Campus Drive": "2026-11-18T09:00:00+05:30",
  "AI Product Lab": "2026-11-21T10:00:00+05:30",
  "Word Waves": "2026-11-25T17:00:00+05:30",
  "UI/UX Sprint": "2026-11-29T10:00:00+05:30"
};

function getNextEvent() {
  const now = Date.now();
  return Object.entries(eventDates)
    .map(([name, date]) => ({ name, date, time: new Date(date).getTime() }))
    .filter(event => event.time > now)
    .sort((a, b) => a.time - b.time)[0];
}

function updateHeroCountdown() {
  const next = getNextEvent();
  if (!next) return;

  const d = eventData[next.name];
  const remaining = Math.max(0, next.time - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const date = new Date(next.date);
  const barName = $("#countdownEventName");
  const barDate = $("#countdownEventDate");
  if (barName) barName.textContent = next.name;
  if (barDate) barDate.textContent = `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("en-IN", {month:"short"}).toUpperCase()} ${date.getFullYear()}`;
  $("#countDays").textContent = String(days).padStart(2, "0");
  $("#countHours").textContent = String(hours).padStart(2, "0");
  $("#countMinutes").textContent = String(minutes).padStart(2, "0");
  $("#countSeconds").textContent = String(seconds).padStart(2, "0");
}
updateHeroCountdown();
setInterval(updateHeroCountdown, 1000);

function openEvent(title) {
  const d = eventData[title] || ["EVENT", "Event details will be announced soon.", "TBA", "IEM Campus", "TBA"];
  $("#modalTag").textContent = d[0];
  $("#modalTitle").textContent = title;
  $("#modalDescription").textContent = d[1];
  $("#modalDate").textContent = d[2];
  $("#modalVenue").textContent = d[3];
  $("#modalFormat").textContent = d[4];
  $("#eventModal").classList.add("show");
  document.body.style.overflow = "hidden";
}
$$(".details-btn").forEach(btn => {
  btn.addEventListener("click", e => openEvent(e.currentTarget.closest(".event-card").dataset.title));
});
function closeModal() {
  $("#eventModal").classList.remove("show");
  document.body.style.overflow = "";
}
$("#modalClose").addEventListener("click", closeModal);
$(".modal-backdrop").addEventListener("click", closeModal);
$("#modalRegister").addEventListener("click", closeModal);

/* Registration + local demo pass */
let emailVerified = false;
const STORAGE_KEYS = {saved:"iem-saved-events", registrations:"iem-registrations", proposals:"iem-proposals"};
const readStore = (key, fallback=[]) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function makeTicketCode(){
  return "IEM-" + Math.random().toString(36).slice(2,8).toUpperCase() + Date.now().toString().slice(-3);
}
function openTicket(reg){
  $("#ticketCode").textContent = reg.code;
  $("#ticketName").textContent = reg.name;
  $("#ticketEvent").textContent = reg.event;
  $("#ticketRoll").textContent = reg.roll;
  $("#ticketDept").textContent = reg.department;
  $("#ticketDate").textContent = eventData[reg.event]?.[2] || "TBA";
  $("#ticketRole").textContent = reg.role;
  $("#ticketModal").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeTicket(){ $("#ticketModal").classList.remove("show"); document.body.style.overflow = ""; }
$("#verifyEmailBtn").addEventListener("click", () => {
  const email = $("#email").value.trim();
  if (!email || !email.includes("@")) {
    $("#verifyStatus").textContent = "Enter a valid email first.";
    $("#verifyStatus").classList.remove("verified");
    return;
  }
  emailVerified = true;
  $("#verifyStatus").textContent = "✓ Email verified for this demo.";
  $("#verifyStatus").classList.add("verified");
  showToast("Demo verification successful.");
});

$("#registrationForm").addEventListener("submit", e => {
  e.preventDefault();
  const mobile = $("#mobile").value.replace(/\D/g, "");
  if (mobile.length !== 10) { showToast("Please enter a valid 10-digit mobile number."); return; }
  if (!emailVerified) { showToast("Please verify your email first."); return; }

  const reg = {
    code: makeTicketCode(),
    name: $("#name").value.trim(), roll: $("#roll").value.trim(),
    department: $("#department").value, year: $("#year").value,
    email: $("#email").value.trim(), mobile, gender: $("#gender").value,
    role: $("#role").value, event: $("#event").value,
    participation: $("#participation").value,
    updates: $("#updates").checked,
    createdAt: new Date().toISOString()
  };
  const registrations = readStore(STORAGE_KEYS.registrations);
  registrations.unshift(reg);
  writeStore(STORAGE_KEYS.registrations, registrations.slice(0, 10));
  renderDashboard();
  e.target.reset();
  emailVerified = false;
  $("#verifyStatus").textContent = "Email verification is a demo interaction.";
  $("#verifyStatus").classList.remove("verified");
  openTicket(reg);
});

/* Personal event shortlist */
function getSaved(){ return readStore(STORAGE_KEYS.saved); }
function setSaved(list){ writeStore(STORAGE_KEYS.saved, list); }
function isSaved(title){ return getSaved().includes(title); }
function toggleSaved(title){
  const list = getSaved();
  const next = list.includes(title) ? list.filter(x => x !== title) : [...list, title];
  setSaved(next); updateFavoriteButtons(); renderDashboard();
  showToast(next.includes(title) ? `${title} saved to your schedule.` : `${title} removed from your schedule.`);
}
function updateFavoriteButtons(){
  const saved = getSaved();
  $$(".favorite-btn").forEach(btn => {
    const active = saved.includes(btn.dataset.title);
    btn.classList.toggle("saved", active);
    btn.textContent = active ? "★" : "☆";
    btn.setAttribute("aria-label", active ? `Remove ${btn.dataset.title} from saved events` : `Save ${btn.dataset.title}`);
  });
}
function downloadICS(title){
  const iso = eventDates[title];
  const date = new Date(iso);
  const end = new Date(date.getTime() + 2*60*60*1000);
  const fmt = d => d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//IEM Event Hall//EN\nBEGIN:VEVENT\nUID:${title.replace(/\W/g,"")}-${date.getTime()}@iem-event-hall\nDTSTAMP:${fmt(new Date())}\nDTSTART:${fmt(date)}\nDTEND:${fmt(end)}\nSUMMARY:${title}\nLOCATION:${eventData[title]?.[3] || "IEM Campus"}\nDESCRIPTION:${eventData[title]?.[1] || "IEM campus event"}\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], {type:"text/calendar"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${title.replace(/[^a-z0-9]+/gi,"-").toLowerCase()}.ics`; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
  showToast("Calendar file downloaded.");
}
function setupEventActions(){
  cards.forEach(card => {
    if(card.querySelector(".favorite-btn")) return;
    const title = card.dataset.title;
    const fav = document.createElement("button");
    fav.className = "favorite-btn"; fav.dataset.title = title; fav.type="button";
    fav.addEventListener("click", () => toggleSaved(title));
    card.appendChild(fav);
    const row = document.createElement("div"); row.className="event-action-row";
    const detail = card.querySelector(".details-btn");
    if(detail){ detail.parentNode.insertBefore(row, detail); row.appendChild(detail); }
    const cal = document.createElement("button"); cal.className="calendar-btn"; cal.type="button"; cal.textContent="＋ Add to calendar";
    cal.addEventListener("click",()=>downloadICS(title)); row.appendChild(cal);
  });
  updateFavoriteButtons();
}
setupEventActions();

function renderDashboard(){
  const saved = getSaved();
  const regs = readStore(STORAGE_KEYS.registrations);
  const registeredTitles = new Set(regs.map(r => r.event));
  const upcoming = Object.entries(eventDates)
    .map(([name, date]) => ({name, date, time:new Date(date).getTime()}))
    .filter(e => e.time > Date.now())
    .sort((a,b)=>a.time-b.time);

  $("#savedCount").textContent = saved.length;
  $("#registrationCount").textContent = regs.length;
  $("#scheduleSavedTotal").textContent = saved.length;
  $("#scheduleRegisteredTotal").textContent = regs.length;

  const next = upcoming[0];
  if(next){
    const days = Math.ceil((next.time-Date.now())/86400000);
    $("#scheduleNextDays").textContent = days === 0 ? "TODAY" : `${days}d`;
    $("#scheduleNextName").textContent = next.name;
  } else {
    $("#scheduleNextDays").textContent = "—";
    $("#scheduleNextName").textContent = "No upcoming events";
  }

  const savedBox = $("#savedEvents");
  if(!saved.length) savedBox.innerHTML = '<div class="dashboard-empty">No saved events yet.<br><span>Use ☆ on any event card to add one.</span></div>';
  else savedBox.innerHTML = saved.map(title => {
    const d = eventData[title] || [];
    const registered = registeredTitles.has(title);
    return `<div class="saved-row"><div class="saved-main"><span class="schedule-dot"></span><div><strong>${title}</strong><small>${d[2] || "TBA"} · ${d[3] || "IEM Campus"}</small></div></div><div class="saved-meta">${registered ? '<span class="tiny-status">REGISTERED</span>' : '<span class="tiny-status muted">SAVED</span>'}<div class="row-actions"><button class="mini-action" data-open-event="${title}">View</button><button class="mini-action" data-calendar="${title}">Calendar</button></div></div></div>`;
  }).join("");
  savedBox.querySelectorAll("[data-open-event]").forEach(b=>b.addEventListener("click",()=>openEvent(b.dataset.openEvent)));
  savedBox.querySelectorAll("[data-calendar]").forEach(b=>b.addEventListener("click",()=>downloadICS(b.dataset.calendar)));

  const regBox = $("#registrationList");
  if(!regs.length) regBox.innerHTML='<div class="dashboard-empty">No registrations on this device.<br><span>Complete the registration form to generate your first pass.</span></div>';
  else regBox.innerHTML = regs.map(r=>`<div class="registration-row"><div class="registration-main"><span class="pass-icon">✓</span><div><strong>${r.event}</strong><small>${r.code} · ${r.role}${r.participation ? ` · ${r.participation}` : ""}</small></div></div><button class="mini-action" data-ticket="${r.code}">View pass</button></div>`).join("");
  regBox.querySelectorAll("[data-ticket]").forEach(b=>b.addEventListener("click",()=>{ const r=regs.find(x=>x.code===b.dataset.ticket); if(r) openTicket(r); }));

  const timeline = $("#scheduleTimeline");
  if(!timeline) return;
  if(!upcoming.length){ timeline.innerHTML='<div class="dashboard-empty">The campus calendar is currently clear.</div>'; return; }
  timeline.innerHTML = upcoming.slice(0,6).map((e,i)=>{
    const d = eventData[e.name] || [];
    const date = new Date(e.date);
    const day = date.toLocaleDateString("en-IN", {day:"2-digit"});
    const month = date.toLocaleDateString("en-IN", {month:"short"}).toUpperCase();
    const time = date.toLocaleTimeString("en-IN", {hour:"numeric",minute:"2-digit"});
    const savedMark = saved.includes(e.name);
    const registeredMark = registeredTitles.has(e.name);
    return `<div class="timeline-item ${i===0?'is-next':''}"><div class="timeline-date"><strong>${day}</strong><span>${month}</span></div><div class="timeline-line"><i></i></div><div class="timeline-content"><div><span class="timeline-tag">${d[0] || "EVENT"}</span><h4>${e.name}</h4><p>${d[1] || "Campus experience"}</p></div><div class="timeline-info"><span>${time}</span><span>${d[3] || "IEM Campus"}</span><div>${savedMark ? '<b>★ Saved</b>' : ''}${registeredMark ? '<b>✓ Registered</b>' : ''}</div><button class="mini-action" data-timeline-event="${e.name}">View</button></div></div></div>`;
  }).join("");
  timeline.querySelectorAll("[data-timeline-event]").forEach(b=>b.addEventListener("click",()=>openEvent(b.dataset.timelineEvent)));
}
renderDashboard();

$("#ticketClose").addEventListener("click", closeTicket);
$("#ticketDone").addEventListener("click", closeTicket);
$("#ticketModal .modal-backdrop").addEventListener("click", closeTicket);
$("#printTicket").addEventListener("click", () => window.print());
$("#clearLocalData").addEventListener("click",()=>{
  if(confirm("Clear saved events, registrations and proposals from this browser?")){
    Object.values(STORAGE_KEYS).forEach(k=>localStorage.removeItem(k));
    renderDashboard(); updateFavoriteButtons(); showToast("Local project data cleared.");
  }
});

/* Organizer proposal desk */
$("#organizerForm").addEventListener("submit", e=>{
  e.preventDefault();
  const proposal={id:"PROP-"+Date.now().toString().slice(-6),name:$("#proposalName").value.trim(),club:$("#proposalClub").value.trim(),category:$("#proposalCategory").value,date:$("#proposalDate").value,description:$("#proposalDescription").value.trim(),seats:$("#proposalSeats").value,email:$("#proposalEmail").value.trim(),createdAt:new Date().toISOString()};
  const proposals=readStore(STORAGE_KEYS.proposals); proposals.unshift(proposal); writeStore(STORAGE_KEYS.proposals,proposals.slice(0,20));
  e.target.reset(); showToast(`Proposal ${proposal.id} saved for review.`);
});

/* Accessibility + utility controls */
document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ closeModal(); closeLightbox(); closeTicket(); } });
const progress=$("#scrollProgress"), backTop=$("#backTop");
function updateScrollUI(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?(window.scrollY/max)*100:0)+"%";
  backTop.classList.toggle("show",window.scrollY>650);
}
window.addEventListener("scroll",updateScrollUI,{passive:true}); updateScrollUI();
backTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

/* Keep filter count honest */
const allFilter = document.querySelector('.filter[data-filter="all"]');
if(allFilter) allFilter.querySelector("span").textContent=cards.length;
/* Feedback rating */
let rating = 0;
$$("#ratingRow button").forEach(btn => {
  btn.addEventListener("click", () => {
    rating = Number(btn.dataset.rating);
    $("#rating").value = rating;
    $$("#ratingRow button").forEach(b => b.classList.toggle("selected", Number(b.dataset.rating) <= rating));
    $("#ratingHint").textContent = `${rating}/5 selected`;
  });
});

/* Recommendation */
$$(".recommend-row button").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".recommend-row button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    $("#recommendation").value = btn.dataset.value;
  });
});

/* Character counter */
$("#feedbackMessage").addEventListener("input", e => {
  $("#charCount").textContent = e.target.value.length;
});

/* Detailed feedback */
$("#feedbackForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!rating) {
    showToast("Please select your overall experience rating.");
    return;
  }

  const name = $("#anonymous").checked ? "Anonymous student" : $("#feedbackName").value.trim();
  const category = $("#feedbackCategory").value;
  showToast(`Thank you, ${name}. Your ${category.toLowerCase()} feedback was submitted.`);
  e.target.reset();
  rating = 0;
  $$("#ratingRow button").forEach(b => b.classList.remove("selected"));
  $$(".recommend-row button").forEach(b => b.classList.remove("selected"));
  $("#rating").value = "";
  $("#recommendation").value = "";
  $("#ratingHint").textContent = "Select a rating from 1 to 5.";
  $("#charCount").textContent = "0";
});

/* Gallery lightbox */
$$(".gallery-item[data-image]").forEach(item => {
  item.addEventListener("click", () => {
    $("#lightboxImage").src = item.dataset.image;
    $("#lightboxImage").alt = item.dataset.title;
    $("#lightboxTitle").textContent = item.dataset.title;
    $("#lightbox").classList.add("show");
  });
});
function closeLightbox() { $("#lightbox").classList.remove("show"); }
$("#lightboxClose").addEventListener("click", closeLightbox);
$("#lightbox").addEventListener("click", e => { if (e.target === $("#lightbox")) closeLightbox(); });

/* Scroll navigation highlighting */
const sections = $$("main section[id]");
const navItems = $$(".nav-links a");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => item.classList.toggle("active", item.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, {rootMargin:"-35% 0px -55% 0px"});
sections.forEach(section => observer.observe(section));

/* ===== Extra dashboard intelligence ===== */
function updatePlannerMetrics(){
  const now = Date.now();
  const week = now + 7*86400000;
  const nextWeek = Object.entries(eventDates).map(([name,date])=>({name,time:new Date(date).getTime()})).filter(x=>x.time>now && x.time<=week);
  const technical = nextWeek.filter(x => (eventData[x.name]?.[0]||'').toLowerCase().includes('technical') || ['Build for Tomorrow','SYTRON'].includes(x.name)).length;
  const creative = nextWeek.filter(x => ['Campus Fest','Word Waves','Lenscape','Green Campus Drive'].includes(x.name)).length;
  const pd = document.getElementById('plannerDays'), pt=document.getElementById('plannerTech'), pc=document.getElementById('plannerCulture');
  if(pd) pd.textContent = Math.max(0,nextWeek.length);
  if(pt) pt.textContent = technical;
  if(pc) pc.textContent = creative;
}
updatePlannerMetrics();

/* Remember the preparation checklist on this browser. */
const checklistKey='iem-prep-checklist';
const savedChecklist=readStore(checklistKey,[]);
$$('.checklist-card input[type="checkbox"]').forEach((box,i)=>{
  box.checked=!!savedChecklist[i];
  box.addEventListener('change',()=>{
    const state=$$('.checklist-card input[type="checkbox"]').map(x=>x.checked);
    writeStore(checklistKey,state);
  });
});

/* Make proposal submissions visible inside the organizer desk. */
function renderProposalSummary(){
  const form=document.getElementById('organizerForm');
  if(!form) return;
  let box=document.getElementById('proposalHistory');
  if(!box){
    box=document.createElement('div'); box.id='proposalHistory'; box.className='proposal-history';
    form.insertAdjacentElement('afterend',box);
  }
  const proposals=readStore(STORAGE_KEYS.proposals);
  if(!proposals.length){box.innerHTML='<span class="step-label">SUBMISSION HISTORY</span><p>No proposals submitted on this browser yet.</p>';return;}
  box.innerHTML='<span class="step-label">RECENT PROPOSALS</span>'+proposals.slice(0,3).map(p=>`<div class="proposal-history-row"><div><b>${p.name}</b><small>${p.id} · ${p.category} · ${p.date}</small></div><span>REVIEW QUEUE</span></div>`).join('');
}
renderProposalSummary();
const organizerForm=document.getElementById('organizerForm');
if(organizerForm) organizerForm.addEventListener('submit',()=>setTimeout(renderProposalSummary,20));

/* Event detail metadata: make the existing modal more useful without changing the event list. */
const detailMeta={
  'Build for Tomorrow':['Prototype a real solution','Teams 2–4 • Pitch + demo','Bring a problem worth solving.'],
  'SYTRON':['Pick a technical track','Multiple tracks • 2 days','Great for builders and competitive teams.'],
  'Code to Console':['Practice by building','Beginner friendly • Lab session','Bring a laptop and your questions.'],
  'Lenscape':['Tell a story visually','Open entry • Campus walk','Bring your phone or camera.'],
  'Robotics Arena':['Build under pressure','Teams 3–5 • Challenge rounds','Bring your team and a tested prototype.'],
  'Campus Fest':['Share the campus spotlight','Evening • Main ground','Come for performances, food and community.'],
  'Future Forum':['Make an argument that matters','Individual • Seminar hall','Prepare one strong point of view.'],
  'IEM Sports League':['Play for your house/team','Team entry • Multi-sport','Check your team fixture before arrival.'],
  'Green Campus Drive':['Turn participation into impact','Volunteer • Open campus','Comfortable shoes and a reusable bottle help.'],
  'AI Product Lab':['Turn an idea into a prototype','Intermediate • 3 hours','Bring an AI idea and be ready to iterate.'],
  'Word Waves':['Put your voice on stage','Open mic • Auditorium','Original writing and confident delivery welcome.'],
  'UI/UX Sprint':['Design under a deadline','Solo / Duo • 4 hours','Bring your design tool of choice.']
};
const oldOpenEvent=openEvent;
openEvent=function(title){
  oldOpenEvent(title);
  const meta=detailMeta[title];
  let panel=document.getElementById('modalMetaExtra');
  if(!panel){
    panel=document.createElement('div'); panel.id='modalMetaExtra'; panel.className='modal-meta-extra';
    const target=document.querySelector('#eventModal .modal-details');
    target.insertAdjacentElement('afterend',panel);
  }
  panel.innerHTML=meta?`<div><span>WHY GO</span><b>${meta[0]}</b></div><div><span>GOOD TO KNOW</span><b>${meta[1]}</b></div><div><span>TIP</span><b>${meta[2]}</b></div>`:'';
};
