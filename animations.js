// Scroll-triggered fade-up animations
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Apply fade-up to key elements
  const selectors = [
    'section > .container > .row',
    'section > .container > .card-dark',
    'section > .container > .day-card',
    'section > .container > .day-block',
    'section > .container > .checklist-group',
    'section > .container > .phase-card',
    'section > .container > .imperial-banner',
    'section > .container > .weights-table',
    'section > .container > .summary-table',
    'section > .container > .swap-table',
    '.agent-card',
    '.project-card',
    '.timeline-item',
    '.tm-item',
    '.stat-strip',
    '.program-banner',
    '.non-neg',
    '.goal-card'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('fade-up');
      // Stagger siblings
      el.style.transitionDelay = `${i * 0.06}s`;
      observer.observe(el);
    });
  });

  // Hero elements — fade in on load
  document.querySelectorAll('.hero .eyebrow, .hero h1, .hero p, .hero .mt-4').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
});
