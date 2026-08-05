(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header shrink on scroll + scroll progress ---------- */
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  /* Hero 3D logo acceleration on scroll */
  const heroImg = document.querySelector('.hero-visual img');
  let baseAnimationSpeed = 5;

  const onScroll = () => {
    const y = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight || window.innerHeight;
    const scrollProgress = Math.min(y / heroHeight, 1);
    const accelerationFactor = 1 + scrollProgress * 2;
    const newSpeed = baseAnimationSpeed / accelerationFactor;

    if (heroImg && !reduceMotion) {
      heroImg.style.animationDuration = newSpeed + 's';
    }

    header.classList.toggle('is-scrolled', y > 40);
    backToTop.classList.toggle('is-visible', y > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  const closeMobileNav = () => {
    navToggle.classList.remove('is-open');
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

  /* ---------- Scroll-reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Scrollspy: highlight active nav link ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-desktop a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => spyObserver.observe(s));

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.stat-num');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach(el => {
      el.textContent = (el.getAttribute('data-count') || '0') + (el.getAttribute('data-suffix') || '');
    });
  } else {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---------- Timeline filter ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-type') === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Ripple on every button click ---------- */
  const rippleTargets = document.querySelectorAll('.btn, .filter-btn, .nav-toggle, .back-to-top, .gallery-item');

  rippleTargets.forEach(el => {
    el.addEventListener('click', (e) => {
      if (reduceMotion) return;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
      const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = x + 'px';
      span.style.top = y + 'px';
      el.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
    });
  });

  /* ---------- 3D tilt on gallery cards ---------- */
  const tiltEls = document.querySelectorAll('.tilt');

  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    tiltEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 16;
        const rotateX = (0.5 - py) * 16;
        el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.03)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Cursor spotlight on opportunity / board cards ---------- */
  const spotlightEls = document.querySelectorAll('.opp-card, .board-card');

  if (window.matchMedia('(hover: hover)').matches) {
    spotlightEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        el.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
      });
    });
  }

  /* ---------- Hero depth-zoom parallax (scroll + mouse) ----------
     Inspired by the layered "push through the scene" scroll effect
     (a la The Goonies / Webflow showcases): as the hero scrolls out,
     the mascot scales up and fades like the camera is flying past it,
     while the glow ring dilates behind it and the copy drifts slower
     for depth separation. */
  const heroVisual = document.querySelector('.hero-visual');
  const glowRing = document.querySelector('.glow-ring');
  const heroSection = document.querySelector('.hero');
  const heroCopy = document.querySelector('.hero-copy');

  if (!reduceMotion && heroVisual) {
    let heroTiltX = 0;
    let heroTiltY = 0;
    const heroHeight = () => heroSection.offsetHeight || window.innerHeight;

    const applyHeroTransform = () => {
      const y = Math.min(window.scrollY, heroHeight());
      const progress = y / heroHeight(); // 0 → 1 across the hero's own height

      const zoomScale = 1 + progress * 0.6;
      const zoomOpacity = Math.max(1 - progress * 1.3, 0);
      heroVisual.style.transform =
        `translateY(${progress * -70}px) scale(${zoomScale}) rotateY(${heroTiltY}deg) rotateX(${heroTiltX}deg)`;
      heroVisual.style.opacity = zoomOpacity;

      if (glowRing) glowRing.style.transform = `scale(${1 + progress * 1.6})`;
      if (glowRing) glowRing.style.opacity = Math.max(1 - progress * 1.1, 0);

      if (heroCopy) {
        heroCopy.style.transform = `translateY(${progress * 40}px)`;
        heroCopy.style.opacity = Math.max(1 - progress * 1.6, 0);
      }
    };

    document.addEventListener('scroll', applyHeroTransform, { passive: true });
    applyHeroTransform();

    if (window.matchMedia('(hover: hover)').matches && heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        heroTiltY = px * 10;
        heroTiltX = -py * 10;
        applyHeroTransform();
      });
      heroSection.addEventListener('mouseleave', () => {
        heroTiltX = 0; heroTiltY = 0;
        applyHeroTransform();
      });
    }
  }

  /* ---------- Cinematic pinned stats (Star Atlas-style scroll scene) ---------- */
  const pinWrap = document.getElementById('pinWrap');
  const cineStats = document.querySelectorAll('.stat-cine');

  if (!reduceMotion && pinWrap && cineStats.length) {
    const updatePin = () => {
      const rect = pinWrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

      cineStats.forEach((el, i) => {
        const phaseStart = i / cineStats.length;
        el.classList.toggle('is-active', progress >= phaseStart);
      });
    };
    document.addEventListener('scroll', updatePin, { passive: true });
    updatePin();
  } else {
    cineStats.forEach(el => el.classList.add('is-active'));
  }

  /* ---------- Lightbox gallery ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');

  if (galleryItems.length && lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    let currentIndex = 0;

    const openLightbox = (index) => {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentIndex];
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = item.getAttribute('data-caption') || img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => openLightbox(currentIndex - 1));
    document.getElementById('lightboxNext').addEventListener('click', () => openLightbox(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
      if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    });
  }

})();
