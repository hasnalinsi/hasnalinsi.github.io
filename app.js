// Scroll-triggered animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('in');
      // Animate progress bars inside
      el.target.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = bar.dataset.width || bar.style.width;
      });
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.anim-up, .anim-scale').forEach(el => observer.observe(el));

// Animate progress bars on page load (for above-fold content)
setTimeout(() => {
  document.querySelectorAll('.progress-fill').forEach(bar => {
    const target = bar.getAttribute('data-width');
    if (target) bar.style.width = target;
  });
}, 200);

// Navbar scroll effect
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 20
      ? 'rgba(8,7,5,0.9)'
      : 'rgba(8,7,5,0.72)';
  }, { passive: true });
}

// Smooth number counters (for stat strips)
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
