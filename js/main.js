// ===== Theme =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');

function applyTheme(theme) {
  if (theme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
    iconSun.classList.remove('hidden');
    iconMoon.classList.add('hidden');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    iconSun.classList.add('hidden');
    iconMoon.classList.remove('hidden');
  }
  localStorage.setItem('theme', theme);
}
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);
themeToggle.addEventListener('click', () => {
  applyTheme(root.classList.contains('light') ? 'dark' : 'light');
});

// ===== Navbar scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// ===== Mobile menu =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

// ===== Reveal on scroll =====
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => io.observe(el));

// ===== Animated counters =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target) + (target === 99 ? '' : '+');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + (target === 99 ? '' : '+');
  };
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ===== Skills tabs =====
document.querySelectorAll('.skill-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});
// ===== Testimonials carousel =====
const track = document.getElementById('testimonialTrack');
const viewport = document.getElementById('testimonialViewport');
const cards = track.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('dots');
let index = 0;
let perView = window.innerWidth >= 768 ? 2 : 1;
function totalSlides() { return Math.ceil(cards.length / perView); }
function buildDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides(); i++) {
    const d = document.createElement('span');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(d);
  }
}
function goTo(i) {
  index = (i + totalSlides()) % totalSlides();
  const cardWidth = cards[0].getBoundingClientRect().width + 16;
  track.style.transform = `translateX(-${index * perView * cardWidth}px)`;
  dotsContainer.querySelectorAll('.dot').forEach((d, idx) => d.classList.toggle('active', idx === index));
}
buildDots();
document.getElementById('nextTest').addEventListener('click', () => goTo(index + 1));
document.getElementById('prevTest').addEventListener('click', () => goTo(index - 1));
let autoSlide = setInterval(() => goTo(index + 1), 5000);
viewport.addEventListener('mouseenter', () => clearInterval(autoSlide));
viewport.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo(index + 1), 5000); });
window.addEventListener('resize', () => {
  perView = window.innerWidth >= 768 ? 2 : 1;
  buildDots();
  goTo(0);
});

// ===== Copy email =====
const copyEmail = document.getElementById('copyEmail');
copyEmail.addEventListener('click', async () => {
  const email = document.getElementById('emailText').textContent;
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard');
    copyEmail.querySelector('span').textContent = 'Copied!';
    setTimeout(() => (copyEmail.querySelector('span').textContent = 'Copy'), 1800);
  } catch {
    showToast('Could not copy');
  }
});

// ===== Toast =====
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== Contact form validation =====
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
function setError(field, msg) {
  const err = document.querySelector(`.form-error[data-for="${field}"]`);
  if (err) err.textContent = msg;
  const input = document.getElementById(field);
  if (input) input.style.borderColor = msg ? '#F87171' : '';
}
function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  let ok = true;
  if (name.length < 2) { setError('name', 'Please enter your name'); ok = false; } else setError('name', '');
  if (!validateEmail(email)) { setError('email', 'Enter a valid email'); ok = false; } else setError('email', '');
  if (subject.length < 3) { setError('subject', 'Subject too short'); ok = false; } else setError('subject', '');
  if (message.length < 10) { setError('message', 'Message too short'); ok = false; } else setError('message', '');
  if (!ok) return;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.disabled = false; btn.innerHTML = 'Send Message <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>';
    statusEl.textContent = "Thanks! Your message has been sent. I'll reply within 24 hours.";
    statusEl.classList.remove('hidden');
    statusEl.style.color = '#34D399';
    form.reset();
    showToast('Message sent');
  }, 1200);
});

// ===== Custom cursor =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }, { passive: true });
function animRing() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a, button, .project-card, .value-card').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width = '52px'; ring.style.height = '52px'; ring.style.borderColor = 'rgba(99,102,241,0.9)'; });
  el.addEventListener('mouseleave', () => { ring.style.width = '34px'; ring.style.height = '34px'; ring.style.borderColor = 'rgba(99,102,241,0.5)'; });
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

