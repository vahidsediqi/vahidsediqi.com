/* =========================================================
   VAHIDSEDIQI.COM — Main JavaScript v1.0
   ========================================================= */

'use strict';

/* ── 1. NAVBAR SCROLL ────────────────────────────────────── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 2. MOBILE MENU ──────────────────────────────────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Sub-menus
  document.querySelectorAll('.m-link.has-sub').forEach(link => {
    link.addEventListener('click', () => {
      const sub = link.nextElementSibling;
      if (!sub) return;
      link.classList.toggle('open');
      sub.classList.toggle('open');
      const icon = link.querySelector('.m-arrow');
      if (icon) icon.style.transform = sub.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });

  // Close on backdrop
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();

/* ── 3. SCROLL REVEAL ────────────────────────────────────── */
(function () {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ── 4. COUNTER ANIMATION ────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = el => {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const start    = performance.now();

    const update = now => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = target * easeOut(progress);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ── 5. SKILL BARS ───────────────────────────────────────── */
(function () {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(el => observer.observe(el));
})();

/* ── 6. CHART BARS ───────────────────────────────────────── */
(function () {
  const bars = document.querySelectorAll('.chart-bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.width = entry.target.dataset.width + '%';
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
})();

/* ── 7. TESTIMONIAL SLIDER ───────────────────────────────── */
(function () {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;

  const track   = slider.querySelector('.testimonials-track');
  const cards   = slider.querySelectorAll('.testimonial-card');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');
  const dotsEl  = slider.querySelector('.slider-dots');

  if (!track || cards.length === 0) return;

  let current  = 0;
  let perView  = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  let total    = Math.ceil(cards.length / perView);
  let autoPlay;

  const buildDots = () => {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  };

  const goTo = (idx) => {
    current = (idx + total) % total;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
    dotsEl && dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  nextBtn && nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  const startAuto = () => { autoPlay = setInterval(next, 4500); };
  const resetAuto = () => { clearInterval(autoPlay); startAuto(); };

  buildDots();
  startAuto();

  window.addEventListener('resize', () => {
    const newPer = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    if (newPer !== perView) {
      perView = newPer;
      total = Math.ceil(cards.length / perView);
      current = 0;
      buildDots();
      track.style.transform = 'translateX(0)';
    }
  });
})();

/* ── 8. FAQ ACCORDION ────────────────────────────────────── */
(function () {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Open clicked if was closed
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── 9. CONTACT FORM ─────────────────────────────────────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const msg = document.getElementById('formMessage');

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';

    const data = new FormData(form);

    try {
      const res = await fetch('contact.php', { method: 'POST', body: data });
      const json = await res.json();
      if (json.success) {
        msg.className = 'alert alert-success mt-3';
        msg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent. I\'ll reply within 24 hours.';
        form.reset();
      } else {
        throw new Error(json.message || 'Server error');
      }
    } catch (err) {
      msg.className = 'alert alert-danger mt-3';
      msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Oops! Something went wrong. Please email me directly at contact@vahidsediqi.com';
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    msg.style.display = 'flex';
  });
})();

/* ── 10. SMOOTH ANCHOR SCROLL ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 11. ACTIVE NAV LINK ─────────────────────────────────── */
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-menu > li').forEach(li => {
    const a = li.querySelector(':scope > a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (path.endsWith(href) || (href !== '#' && path.includes(href.replace('.html', '')))) {
      li.classList.add('active');
    }
  });
})();

/* ── 12. PARTICLES (hero background) ────────────────────── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };

  const rand = (min, max) => Math.random() * (max - min) + min;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = rand(0, W);
      this.y  = rand(0, H);
      this.r  = rand(0.5, 2);
      this.vx = rand(-0.2, 0.2);
      this.vy = rand(-0.3, -0.1);
      this.a  = rand(0.2, 0.6);
      this.da = rand(0.002, 0.006);
      this.fade = false;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.fade) { this.a -= this.da; }
      else           { this.a += this.da; }
      if (this.a >= 0.6) this.fade = true;
      if (this.a <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,127,255,${this.a})`;
      ctx.fill();
    }
  }

  const init = () => {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  };

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  };

  window.addEventListener('resize', resize);
  init();
  loop();
})();
