// ── Theme init (runs before paint) ───────────────────────────────
(function () {
  var saved = localStorage.getItem('hasna-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
})();

// ── Scroll-triggered animations ──────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('in');
      el.target.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = bar.dataset.width || bar.style.width;
      });
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.anim-up, .anim-scale').forEach(el => observer.observe(el));

// Animate above-fold progress bars on load
setTimeout(() => {
  document.querySelectorAll('.progress-fill').forEach(bar => {
    const target = bar.getAttribute('data-width');
    if (target) bar.style.width = target;
  });
}, 200);

// ── Navbar scroll class ───────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Theme toggle ──────────────────────────────────────────────────
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('hasna-theme', next);
  });
}

// ── Smooth number counters ────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  if (!target || isNaN(target)) return;
  const duration = 1200;
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      animateCounter(el.target);
      counterObserver.unobserve(el.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── Persistent checkboxes (localStorage) ─────────────────────────
function initCheckboxes() {
  document.querySelectorAll('.check-box[data-key]').forEach(box => {
    const key = 'ceo-check-' + box.dataset.key;
    const initial = box.dataset.initial || '';

    if (localStorage.getItem(key) === 'done') {
      box.classList.remove('progress');
      box.classList.add('done');
    }

    box.style.cursor = 'pointer';
    box.title = 'Click to mark done';

    box.addEventListener('click', () => {
      const isDone = box.classList.contains('done');
      if (isDone) {
        box.classList.remove('done');
        if (initial === 'progress') box.classList.add('progress');
        localStorage.removeItem(key);
      } else {
        box.classList.remove('progress');
        box.classList.add('done');
        localStorage.setItem(key, 'done');
      }
    });
  });
}
initCheckboxes();

// ── Mobile hamburger menu ─────────────────────────────────────────
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
    }
  });
}
