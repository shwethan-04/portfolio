/* ============================================================
   SHWETHAN KUMAR ANUMALLA – PORTFOLIO SCRIPT
   ============================================================ */

'use strict';

// ── NAVBAR ──────────────────────────────────────────────────
const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── ACTIVE NAV ON SCROLL ────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');

const onScroll = () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navItems.forEach(n => n.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── TYPING EFFECT ───────────────────────────────────────────
const roles = ['Data Analyst', 'MCA Student', 'Full Stack Developer', 'ML Enthusiast', 'Power BI Developer'];
const typedEl = document.getElementById('typedText');
let roleIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// ── PARTICLE CANVAS ─────────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r  = Math.random() * 1.6 + 0.4;
    this.a  = Math.random() * 0.45 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width  ||
        this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,136,${this.a})`;
    ctx.fill();
  }
}

const PARTICLE_COUNT = Math.min(90, Math.floor(window.innerWidth / 14));
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function connectParticles() {
  const threshold = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < threshold) {
        const a = (1 - d / threshold) * 0.12;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,136,${a})`;
        ctx.lineWidth   = 0.6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── SCROLL-TRIGGERED FADE-INS ────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Skill bars
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ── CERTIFICATION FILTER ─────────────────────────────────────
const filterBtns = document.querySelectorAll('.cert-filter');
const certCards  = document.querySelectorAll('.cert-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    certCards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'certIn 0.3s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Inject keyframe for cert animation
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    @keyframes certIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `, styleSheet.cssRules.length);
} catch(e) {}

// ── SMOOTH SCROLL POLYFILL ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ── STAGGER TIMELINE ITEMS ───────────────────────────────────
const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.timeline-item');
      items.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, i * 120);
      });
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

const timeline = document.querySelector('.timeline');
if (timeline) {
  timeline.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-16px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  tlObserver.observe(timeline);
}

// ── STAGGER ACHIEVEMENT CARDS ─────────────────────────────────
const achObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.ach-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
      });
      achObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

const achGrid = document.querySelector('.achievements-grid');
if (achGrid) {
  achGrid.querySelectorAll('.ach-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.45s ease, transform 0.45s ease, border-color 0.25s ease, box-shadow 0.25s ease';
  });
  achObserver.observe(achGrid);
}

// ── PROJECT CARD STAGGER ──────────────────────────────────────
const projObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.project-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 130);
      });
      projObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

const projGrid = document.querySelector('.projects-grid');
if (projGrid) {
  projGrid.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.25s ease, box-shadow 0.25s ease';
  });
  projObserver.observe(projGrid);
}