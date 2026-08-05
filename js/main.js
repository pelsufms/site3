(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header + back to top ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    backToTop.classList.toggle('is-visible', y > 600);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Hero mark: single depth-parallax moment ---------- */
  const heroMark = document.getElementById('heroMark');
  const heroSection = document.querySelector('.hero');

  if (heroMark && heroSection && !reduceMotion) {
    const applyHeroParallax = () => {
      const heroHeight = heroSection.offsetHeight || window.innerHeight;
      const progress = Math.min(window.scrollY / heroHeight, 1);
      const scale = 1 + progress * 0.35;
      const opacity = Math.max(1 - progress * 1.2, 0);
      heroMark.style.transform = `translate(-50%, calc(-50% + ${progress * -40}px)) scale(${scale})`;
      heroMark.style.opacity = 0.12 * opacity;
    };
    document.addEventListener('scroll', applyHeroParallax, { passive: true });
    applyHeroParallax();
  }

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
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

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
    const duration = 1200;
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
