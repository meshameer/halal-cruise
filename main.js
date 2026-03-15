/* ═══════════════════════════════════════════════════════════════════════════
   BAHAMAS HALAL CRUISE — INTERACTIONS & ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ── NAVBAR ──────────────────────────────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobileMenu');
  const links  = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── SCROLL REVEAL ───────────────────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));
})();

/* ── STAT COUNTER ANIMATION ─────────────────────────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      observer.unobserve(el);

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
})();

/* ── CRUISE ROUTE MAP ANIMATION ─────────────────────────────────────────── */
(function initRouteMap() {
  const routeSection = document.getElementById('route');
  if (!routeSection) return;

  const pathGlow  = document.getElementById('routePathGlow');
  const shipIcon  = document.getElementById('shipIcon');
  const port2     = document.getElementById('port2');
  const port3     = document.getElementById('port3');
  const routePath = document.getElementById('routePath');

  if (!pathGlow || !shipIcon || !routePath) return;

  // Get total path length
  const totalLength = routePath.getTotalLength();
  pathGlow.style.strokeDasharray  = totalLength;
  pathGlow.style.strokeDashoffset = totalLength;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      animateRoute();
    }
  }, { threshold: 0.3 });

  observer.observe(routeSection);

  function animateRoute() {
    // Fade in glow path
    pathGlow.style.opacity = '0.8';

    const duration = 3000; // 3s for ship to travel
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOut(progress);

      // Draw the path
      const drawn = totalLength * eased;
      pathGlow.style.strokeDashoffset = totalLength - drawn;

      // Move ship along path
      const point = routePath.getPointAtLength(drawn);
      const pointAhead = routePath.getPointAtLength(Math.min(drawn + 5, totalLength));
      const angle = Math.atan2(pointAhead.y - point.y, pointAhead.x - point.x) * (180 / Math.PI);

      shipIcon.setAttribute('transform',
        `translate(${point.x}, ${point.y}) rotate(${angle})`
      );

      // Reveal ports at waypoints
      if (progress > 0.35 && port2) port2.style.opacity = '1', port2.style.transition = 'opacity 0.5s';
      if (progress > 0.8  && port3) port3.style.opacity = '1', port3.style.transition = 'opacity 0.5s';

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
})();

/* ── PARALLAX ────────────────────────────────────────────────────────────── */
(function initParallax() {
  const heroVideo = document.querySelector('.hero-video');

  function onScroll() {
    const scrollY = window.scrollY;
    if (heroVideo) {
      heroVideo.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── GALLERY HOVER LIFT ───────────────────────────────────────────────────── */
(function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '2';
    });
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '';
    });
  });
})();

/* ── BOOKING FORM ────────────────────────────────────────────────────────── */
(function initBookingForm() {
  const form        = document.getElementById('bookingForm');
  const successEl   = document.getElementById('formSuccess');
  const toast       = document.getElementById('toast');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    const btnSpan = btn.querySelector('span');
    btnSpan.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simulate async submission
    setTimeout(() => {
      // Show success state
      form.closest('.booking-form-card').style.display = 'none';
      successEl.classList.add('visible');

      // Show toast
      showToast('Your inquiry has been submitted. We\'ll be in touch shortly!');
    }, 1500);
  });

  // Newsletter form
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      if (input.value) {
        showToast('Thank you! You\'ve been added to our list.');
        input.value = '';
      }
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
})();

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── STORY IMAGE PARALLAX ────────────────────────────────────────────────── */
(function initStoryParallax() {
  const imgs = document.querySelectorAll('.story-img-wrap img');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        window.addEventListener('scroll', () => {
          const rect = el.closest('.story-img-wrap').getBoundingClientRect();
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const offset = (progress - 0.5) * 30;
          el.style.transform = `translateY(${offset}px) scale(1.06)`;
        }, { passive: true });
      }
    });
  }, { threshold: 0.1 });

  imgs.forEach(img => observer.observe(img));
})();

/* ── CURSOR GLOW (desktop only) ──────────────────────────────────────────── */
(function initCursorGlow() {
  if (window.innerWidth < 1024) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();

/* ── EXPERIENCE CARDS STAGGER ────────────────────────────────────────────── */
(function initExpCards() {
  const cards = document.querySelectorAll('.exp-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
})();

/* ── INIT LOG ─────────────────────────────────────────────────────────────── */
console.log('%c✦ Bahamas Halal Cruise — Luxury Experience Ready', 'color: #C9A84C; font-size: 14px; font-weight: 600;');
