/* =========================
   App JS — Cyber Edition
========================= */

const PUBLIC_JSON_PATH = 'assets/data/projects.json';
const LS = { prefs: 'prefs_v1' };

/* --- Data & Config --- */
const CONTACT = {
  email: 'mailto:abdelhamedhesham93@gmail.com',
  linkedin: 'https://linkedin.com/in/hesham-cybersecurity',
  whatsapp: 'https://wa.me/201016591693'
};

const I18N = {
  en: {
    subtitle: "Network Engineer — Cybersecurity — IT Specialist",
    hero_title: "Hi, I'm Hesham",
    hero_lead: "IT student specializing in Network Engineering and Cybersecurity. NTI-accredited CCNA holder (MCIT).",
    contact_me: "Contact me",
    skills: "Skills",
    projects: "Projects",
    loading: "Initializing protocols...",
    no_projects: "No public directives found.",
    contact: "Contact",
    security: "Security",
    systems: "Systems"
  },
  ar: {
    subtitle: "مهندس شبكات — أمن المعلومات — مختص تقنية معلومات",
    hero_title: "مرحبًا، أنا هشام",
    hero_lead: "طالب تقنية معلومات متخصص في هندسة الشبكات والأمن السيبراني. حاصل على CCNA معتمدة من NTI (وزارة الاتصالات).",
    contact_me: "تواصل معي",
    skills: "المهارات",
    projects: "المشاريع",
    loading: "جاري تحميل البروتوكولات...",
    no_projects: "لا توجد مشاريع مضافة بعد.",
    contact: "التواصل",
    security: "أمن المعلومات",
    systems: "الأنظمة"
  }
};

/* --- Core Utils --- */
function loadPrefs() { try { return JSON.parse(localStorage.getItem(LS.prefs) || '{}') } catch { return {} } }
function savePrefs(p) { const c = loadPrefs(); localStorage.setItem(LS.prefs, JSON.stringify({ ...c, ...p })) }

/* --- Visual Engine: Theme --- */
function applyTheme(theme) {
  if (theme === 'light') document.body.classList.add('light');
  else document.body.classList.remove('light');
  
  document.getElementById('themeToggle').textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
  savePrefs({ theme });
  
  // Trigger particle refresh
  if(window.initParticles) window.initParticles();
}

function initTheme() {
  applyTheme(loadPrefs().theme || 'dark');
  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
  });
}

/* --- Visual Engine: Language --- */
function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Small glitch effect on text change
      el.style.opacity = 0;
      setTimeout(() => {
        el.textContent = dict[key];
        el.style.opacity = 1;
      }, 150);
    }
  });
  
  document.getElementById('langToggle').textContent = lang === 'ar' ? 'EN' : 'AR';
  savePrefs({ lang });
}

function initLang() {
  applyLang(loadPrefs().lang || 'en');
  document.getElementById('langToggle').addEventListener('click', () => {
    const cur = loadPrefs().lang || 'en';
    applyLang(cur === 'en' ? 'ar' : 'en');
    renderProjects();
  });
}

/* --- Content Engine: Projects --- */
async function getPublicData() {
  try {
    const r = await fetch(PUBLIC_JSON_PATH + `?t=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) throw 0;
    return await r.json();
  } catch {
    return { profileImage: 'assets/img/profile.png', projects: [] };
  }
}

async function renderProjects() {
  const data = await getPublicData();
  const img = document.getElementById('profileImage');
  if (img && data.profileImage) img.src = data.profileImage;

  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  const dict = I18N[loadPrefs().lang || 'en'];

  grid.innerHTML = '';
  if (!data.projects.length) {
    grid.innerHTML = `<div class="placeholder" style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--muted); border: 1px dashed var(--border); border-radius: 12px;">${dict.no_projects}</div>`;
    return;
  }

  // Staggered animation delay
  let delay = 0;

  data.projects.forEach((pj, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 100}ms`;
    
    // Tilt Effect Listener
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);

    card.innerHTML = `
      ${pj.image ? `<img src="${pj.image}" alt="Project">` : ``}
      <div style="flex:1">
        <strong>${pj.title || 'Untitled Node'}</strong>
        <div class="muted">${pj.description || ''}</div>
        ${pj.tags ? `<div class="tag-badges">${pj.tags.split(',').map(t => `<span class="tag-badge">${t.trim()}</span>`).join('')}</div>` : ``}
      </div>
      ${pj.link ? `<a class="btn primary" href="${pj.link}" target="_blank">View Protocol</a>` : ``}
    `;
    grid.appendChild(card);
  });
}

/* --- Physics Engine: 3D Tilt --- */
function handleTilt(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
  const rotateY = ((x - centerX) / centerX) * 5;

  el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

function resetTilt(e) {
  e.currentTarget.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
}

/* --- Visual Engine: Scroll Observer --- */
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-section').forEach(section => {
    observer.observe(section);
  });
}

/* --- Visual Engine: Custom Cursor --- */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');
  
  // Only init custom cursor on non-touch devices
  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      // Lag effect for glow
      setTimeout(() => {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }, 50);
    });

    // Hover interactions
    document.querySelectorAll('a, button, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        glow.style.width = '60px';
        glow.style.height = '60px';
        glow.style.backgroundColor = 'rgba(0, 243, 255, 0.1)';
      });
      el.addEventListener('mouseleave', () => {
        glow.style.width = '40px';
        glow.style.height = '40px';
        glow.style.backgroundColor = 'transparent';
      });
    });
  } else {
    dot.style.display = 'none';
    glow.style.display = 'none';
  }
}

/* --- Visual Engine: Network Particle Background --- */
function initParticles() {
  const canvas = document.getElementById('cyber-canvas');
  const ctx = canvas.getContext('2d');
  
  let w, h, particles;
  const isLight = document.body.classList.contains('light');
  
  // Config
  const particleColor = isLight ? 'rgba(0, 102, 204, 0.5)' : 'rgba(0, 243, 255, 0.5)';
  const lineColor = isLight ? 'rgba(0, 102, 204, 0.05)' : 'rgba(0, 243, 255, 0.05)';
  const particleCount = window.innerWidth < 600 ? 30 : 60;
  const connectionDistance = 150;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  
  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = particleColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDistance) {
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  init();
  animate();
  
  // Expose for theme toggle
  window.initParticles = init;
}

/* --- Boot Sequence --- */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  
  initTheme();
  initLang();
  
  // Animation Systems
  initParticles();
  initCursor();
  initScrollObserver();
  
  // Render
  renderProjects();
});
