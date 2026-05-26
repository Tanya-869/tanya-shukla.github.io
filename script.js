/* script.js — Tanya Shukla Portfolio Interactions */

// ── Page Loader ──────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 1600);
});

// ── Custom Cursor ─────────────────────────────────
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0;
let curX   = 0, curY   = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';

  // Mouse-follow light in hero
  const light = document.getElementById('mouseLight');
  if (light) {
    light.style.left = mouseX + 'px';
    light.style.top  = mouseY + 'px';
  }
});

// Smooth cursor lag
(function animateCursor() {
  const dx = mouseX - curX, dy = mouseY - curY;
  curX += dx * 0.12; curY += dy * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
})();

// ── Particle Canvas ───────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.r     = Math.random() * 2 + .5;
    this.vx    = (Math.random() - .5) * .4;
    this.vy    = (Math.random() - .5) * .4;
    this.alpha = Math.random() * .5 + .1;
    const hues = ['#4F46E5','#7C3AED','#06B6D4','#EC4899','#67E8F9'];
    this.color = hues[Math.floor(Math.random() * hues.length)];
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + Math.floor(this.alpha * 255).toString(16).padStart(2,'0');
    ctx.fill();
  }
}

// Create and draw connections
function initParticles() {
  particles = Array.from({ length: 120 }, () => new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw connecting lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,70,229,${(1 - dist/100) * 0.15})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ── Typing Animation ──────────────────────────────
const phrases = ['AI Enthusiast', 'Web Developer', 'Cloud Learner', 'Problem Solver', 'Full-Stack Builder'];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeLoop() {
  if (!typingEl) return;
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typingEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIdx === current.length) {
    delay = 1800; isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 300;
  }
  setTimeout(typeLoop, delay);
}
typeLoop();

// ── Navbar Scroll ─────────────────────────────────
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;

  // Navbar
  navbar.classList.toggle('scrolled', scrolled > 50);

  // Progress bar
  scrollProgress.style.width = (scrolled / total * 100) + '%';

  // Back to top
  backToTop.classList.toggle('visible', scrolled > 500);

  // Active nav link
  updateActiveNavLink();
});

function updateActiveNavLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

// ── Back to Top ───────────────────────────────────
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Hamburger / Mobile Menu ───────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── Theme Toggle ──────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const savedTheme  = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.querySelector('.theme-icon').textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.querySelector('.theme-icon').textContent = next === 'dark' ? '🌙' : '☀️';
});

// ── Scroll Reveal (Intersection Observer) ─────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ── Skill Bar Animation ───────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, { threshold: 0.4 });
skillFills.forEach(fill => skillObserver.observe(fill));

// ── Card 3D Tilt Effect ───────────────────────────
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateY(-10px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Ripple Button Effect ──────────────────────────
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; width:${size}px; height:${size}px;
      border-radius:50%; background:rgba(255,255,255,0.2);
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      transform:scale(0); animation:ripple .6s ease-out forwards;
      pointer-events:none;
    `;
    if (!this.style.position || this.style.position === 'static') {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Add ripple keyframe dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }';
document.head.appendChild(rippleStyle);

// ── Counter Animation ─────────────────────────────
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step  = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Number.isInteger(target) ? Math.floor(current) + suffix : current.toFixed(2) + suffix;
  }, 20);
}

const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el   = entry.target;
      const raw  = el.textContent.replace(/[^0-9.]/g, '');
      const suf  = el.textContent.replace(/[0-9.]/g, '');
      animateCounter(el, parseFloat(raw), suf);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(n => statObserver.observe(n));

// ── Contact Form ──────────────────────────────────
document.getElementById('submitBtn').addEventListener('click', () => {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const note    = document.getElementById('formNote');

  if (!name || !email || !message) {
    note.textContent = '⚠️ Please fill in all fields.';
    note.style.color = '#EC4899';
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    note.textContent = '⚠️ Please enter a valid email.';
    note.style.color = '#EC4899';
    return;
  }
  note.textContent = '✅ Thank you! I\'ll get back to you soon.';
  note.style.color = '#67E8F9';
  document.getElementById('name').value    = '';
  document.getElementById('email').value   = '';
  document.getElementById('message').value = '';
});

// ── Smooth Scroll for all anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Star Twinkle Overlay ──────────────────────────
(function addStars() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  for (let i = 0; i < 40; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2 + 1;
    star.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:white;
      opacity:${Math.random() * 0.6 + 0.1};
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      pointer-events:none; z-index:1;
      animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 3}s;
    `;
    hero.appendChild(star);
  }
  const twinkleStyle = document.createElement('style');
  twinkleStyle.textContent = '@keyframes twinkle { 0%,100%{opacity:.1} 50%{opacity:.8} }';
  document.head.appendChild(twinkleStyle);
})();
