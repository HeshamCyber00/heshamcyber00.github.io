const PUBLIC_JSON_PATH='assets/data/projects.json';
const LS={prefs:'prefs_v1'};

const I18N={
  en:{
    subtitle:"Network Engineer — Cybersecurity — IT Specialist",
    hero_title:"Hi, I'm Hesham",
    hero_lead:"IT student specializing in Network Engineering and Cybersecurity. NTI-accredited CCNA holder (MCIT).",
    contact_me:"Contact me",
    skills:"Skills",
    projects:"Projects",
    loading:"Loading projects...",
    no_projects:"No projects yet.",
    contact:"Contact"
  },
  ar:{
    subtitle:"مهندس شبكات — أمن المعلومات — مختص تقنية معلومات",
    hero_title:"مرحبًا، أنا هشام",
    hero_lead:"طالب تقنية معلومات متخصص في هندسة الشبكات والأمن السيبراني.",
    contact_me:"تواصل معي",
    skills:"المهارات",
    projects:"المشاريع",
    loading:"جاري تحميل المشاريع...",
    no_projects:"لا توجد مشاريع بعد.",
    contact:"التواصل"
  }
};

function loadPrefs(){try{return JSON.parse(localStorage.getItem(LS.prefs)||'{}')}catch{return{}}}
function savePrefs(p){localStorage.setItem(LS.prefs,JSON.stringify({...loadPrefs(),...p}))}

function initTheme(){
  const btn=document.getElementById('themeToggle');
  const apply=t=>{
    document.body.classList.toggle('light',t==='light');
    btn.textContent=t==='light'?'Dark Mode':'Light Mode';
    savePrefs({theme:t});
  };
  apply(loadPrefs().theme||'dark');
  btn.onclick=()=>apply(document.body.classList.contains('light')?'dark':'light');
}

function initLang(){
  const btn=document.getElementById('langToggle');
  const apply=l=>{
    const d=I18N[l];
    document.documentElement.lang=l;
    document.documentElement.dir=l==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-i18n]').forEach(e=>{
      const k=e.dataset.i18n;
      if(d[k]) e.textContent=d[k];
    });
    btn.textContent=l==='ar'?'EN':'AR';
    savePrefs({lang:l});
  };
  apply(loadPrefs().lang||'en');
  btn.onclick=()=>apply(loadPrefs().lang==='ar'?'en':'ar');
}

async function renderProjects(){
  const grid=document.getElementById('projectsGrid');
  try{
    const r=await fetch(PUBLIC_JSON_PATH);
    const d=await r.json();
    grid.innerHTML='';
    if(!d.projects.length){
      grid.textContent=I18N[loadPrefs().lang||'en'].no_projects;
      return;
    }
    d.projects.forEach(p=>{
      const c=document.createElement('div');
      c.className='project-card';
      c.innerHTML=`<strong>${p.title}</strong><p>${p.description||''}</p>`;
      grid.appendChild(c);
    });
  }catch{
    grid.textContent='Failed to load projects';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('year').textContent=new Date().getFullYear();
  initTheme();
  initLang();
  renderProjects();
});
