/* ==========================================================================
   Site behavior
   --------------------------------------------------------------------------
   Everything here is progressive: with JavaScript disabled the page still
   reads and navigates, it just stops animating.

   Contents:
     1. Small helpers
     2. Theme toggle
     3. Work grid rendering
     4. Scroll reveal
     5. Navigation: scrolled state, active link, mobile menu
     6. Reading progress
     7. Hero pointer parallax
     8. Footer year
     9. Image lightbox
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. SMALL HELPERS
     ======================================================================== */

  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) =>
    Array.from((scope || document).querySelectorAll(selector));

  /**
   * Create an element with attributes and children in one call.
   * Text children are appended as text nodes, never parsed as HTML.
   */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);

    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value);
    });

    (children || []).forEach((child) => {
      node.appendChild(
        typeof child === 'string' ? document.createTextNode(child) : child
      );
    });

    return node;
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* Inline icons for generated buttons. Static markup, defined here only. */
  const ICONS = {
    GitHub:
      '<svg class="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 5 18.3 5.3 18.3 5.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>',
    'Live site':
      '<svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    'Live demo':
      '<svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
  };

  /** Build an icon element from the static markup above. */
  function icon(label) {
    const markup = ICONS[label];
    if (!markup) return null;
    const holder = document.createElement('span');
    holder.innerHTML = markup;
    return holder.firstElementChild;
  }


  /* ------------------------------------------------------------------------
     Technology chips
     ------------------------------------------------------------------------
     Looks a label up in TECH_ICONS (js/tech-icons.js) and returns its glyph.
     Filled brand marks and stroked outlines are drawn differently, so the
     entry says which one it is.
     ---------------------------------------------------------------------- */

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function techGlyph(label) {
    if (typeof TECH_ICONS === 'undefined') return null;
    const key = (typeof TECH_ALIASES !== 'undefined' && TECH_ALIASES[label]) || label;
    const entry = TECH_ICONS[key];
    if (!entry) return null;

    const svg = document.createElementNS(SVG_NS, 'svg');
    /* Most marks are drawn on a 24-unit grid, but not all of them. */
    svg.setAttribute('viewBox', entry.vb || '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');

    if (entry.d) {
      svg.setAttribute('fill', 'currentColor');
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', entry.d);
      svg.appendChild(path);
    } else {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.7');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      entry.s.forEach((d) => {
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', d);
        svg.appendChild(path);
      });
    }

    return { svg, color: entry.c };
  }

  /**
   * Build a chip for one technology. Icon-only chips keep the label as their
   * accessible name and as a tooltip, so nothing is lost by hiding the text.
   */
  function techChip(label, iconOnly) {
    const li = el('li', { class: 'tag' });
    const glyph = techGlyph(label);

    if (glyph) {
      li.style.setProperty('--tech', glyph.color);
      li.appendChild(glyph.svg);
    }

    if (iconOnly && glyph) {
      li.classList.add('tag--icon-only');
      li.setAttribute('title', label);
      li.appendChild(el('span', { class: 'visually-hidden', text: label }));
    } else {
      li.appendChild(document.createTextNode(label));
    }

    return li;
  }

  /** Add glyphs to chips that are already in the markup. */
  function decorateStaticTags(scope) {
    $$('.tag', scope).forEach((li) => {
      if (li.querySelector('svg')) return;
      const glyph = techGlyph(li.textContent.trim());
      if (!glyph) return;
      li.style.setProperty('--tech', glyph.color);
      li.insertBefore(glyph.svg, li.firstChild);
    });
  }


  /* ========================================================================
     2. THEME TOGGLE
     ------------------------------------------------------------------------
     The stored choice is applied by an inline script in <head> so the page
     never flashes the wrong theme. Here we only handle the button.
     ======================================================================== */

  const THEME_KEY = 'gb-theme';

  function currentTheme() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  const themeToggle = $('.theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      themeToggle.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );

      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (error) {
        /* Private browsing can block storage; the toggle still works. */
      }
    });
  }


  /* ========================================================================
     3. WORK GRID RENDERING
     ------------------------------------------------------------------------
     Cards are built from the PROJECTS array in js/projects.js.
     ======================================================================== */

  function projectCard(project, index) {
    const media = el('div', { class: 'work-card__media' }, [
      el('img', {
        src: project.image,
        alt: project.alt,
        loading: 'lazy',
        decoding: 'async',
        width: '640',
        height: '360'
      }),
      el('span', { class: 'work-card__badge', text: project.year })
    ]);

    const tags = el(
      'ul',
      { class: 'tag-list', 'aria-label': 'Technologies used' },
      project.tags.map((tag) => techChip(tag, true))
    );

    const links = el(
      'div',
      { class: 'work-card__links' },
      project.links.map((link) => {
        const glyph = icon(link.label);
        return el(
          'a',
          {
            class: `btn btn--sm btn--${link.variant}`,
            href: link.href,
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': `${link.label}, ${project.title} (opens in a new tab)`
          },
          glyph ? [glyph, link.label] : [link.label]
        );
      })
    );

    const body = el('div', { class: 'work-card__body' }, [
      el('h3', {
        class: 'work-card__title',
        id: `${project.id}-title`,
        text: project.title
      }),
      el('p', { class: 'work-card__role', text: project.role }),
      el('p', { class: 'work-card__desc', text: project.summary }),
      tags,
      links
    ]);

    const card = el(
      'article',
      {
        class: 'work-card reveal',
        'aria-labelledby': `${project.id}-title`,
        style: `--reveal-delay: ${index * 90}ms`
      },
      [media, body]
    );

    return card;
  }

  const workGrid = $('#work-grid');

  if (workGrid && typeof PROJECTS !== 'undefined') {
    const fragment = document.createDocumentFragment();
    PROJECTS.forEach((project, index) => {
      fragment.appendChild(projectCard(project, index));
    });
    workGrid.appendChild(fragment);
  }

  $$('.stack-card, .featured').forEach(decorateStaticTags);

  /* Chip lists written as data: <ul class="tech-list" data-tech="React, Vite">.
     Keeping the labels in the markup and the glyphs in the registry means the
     page never carries icon geometry inline. */
  $$('.tech-list[data-tech]').forEach((list) => {
    list
      .getAttribute('data-tech')
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean)
      .forEach((label) => {
        const li = techChip(label, false);
        li.classList.remove('tag');
        li.classList.add('tech');
        list.appendChild(li);
      });
  });


  /* ========================================================================
     4. SCROLL REVEAL
     ------------------------------------------------------------------------
     Runs after the grid is built so the generated cards are observed too.
     ======================================================================== */

  const revealTargets = $$('.reveal');

  if (prefersReducedMotion) {
    revealTargets.forEach((node) => node.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((node) => revealObserver.observe(node));
  }


  /* ========================================================================
     5. NAVIGATION
     ======================================================================== */

  const nav = $('.nav');
  const navMenu = $('#nav-menu');
  const navBurger = $('.nav__burger');
  const navLinks = $$('.nav__link');

  /* --- Mobile menu ------------------------------------------------------ */
  if (navBurger && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('is-open');
      navBurger.setAttribute('aria-expanded', 'false');
    };

    navBurger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navBurger.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* --- Active link ------------------------------------------------------
     Watches a band across the middle of the viewport, so the highlighted
     link is the section you are actually reading.
     -------------------------------------------------------------------- */
  const sections = $$('main section[id]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === `#${id}`
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }


  /* ========================================================================
     6. SCROLLED NAV STATE AND READING PROGRESS
     ------------------------------------------------------------------------
     One scroll listener drives both, throttled with requestAnimationFrame so
     it never runs more often than the browser paints.
     ======================================================================== */

  const progressBar = $('.progress');
  let ticking = false;

  function onScrollFrame() {
    const scrolled = window.scrollY;

    if (nav) nav.classList.toggle('is-scrolled', scrolled > 12);

    if (progressBar) {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(scrolled / max, 1) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
    }

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    },
    { passive: true }
  );

  onScrollFrame();


  /* ========================================================================
     7. HERO POINTER PARALLAX
     ------------------------------------------------------------------------
     Writes the pointer position, normalised to -1..1, as CSS variables. The
     stylesheet decides what to do with them.
     ======================================================================== */

  const hero = $('.hero');

  if (hero && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--mx', (x * 2).toFixed(3));
      hero.style.setProperty('--my', (y * 2).toFixed(3));
    });

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--mx', '0');
      hero.style.setProperty('--my', '0');
    });
  }


  /* ========================================================================
     9. IMAGE LIGHTBOX
     ------------------------------------------------------------------------
     Screenshots are detailed, and at tile size the detail is lost. Clicking
     one opens it full size over the page. Built here rather than in the
     markup because it is an enhancement: without JavaScript the images are
     still there, just not expandable.
     ======================================================================== */

  const zoomable = $$('.frame__shot, .bento__tile img');

  if (zoomable.length) {
    const figure = el('img', { class: 'lightbox__image', alt: '' });
    const caption = el('p', { class: 'lightbox__caption' });
    const closeBtn = el('button', {
      class: 'lightbox__close',
      type: 'button',
      'aria-label': 'Close image'
    });
    closeBtn.textContent = '\u00d7';

    const lightbox = el(
      'div',
      {
        class: 'lightbox',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': 'Expanded screenshot',
        hidden: 'hidden'
      },
      [closeBtn, figure, caption]
    );
    document.body.appendChild(lightbox);

    let lastFocused = null;

    function openLightbox(img) {
      /* The visible copy is the one that matches the current theme. */
      figure.src = img.currentSrc || img.src;
      figure.alt = img.alt || '';
      const label = img.closest('figure')?.querySelector('figcaption strong');
      caption.textContent = label ? label.textContent : img.alt || '';
      lastFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      figure.removeAttribute('src');
      if (lastFocused) lastFocused.focus();
    }

    zoomable.forEach((img) => {
      img.classList.add('is-zoomable');
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.title = 'Click to expand';

      img.addEventListener('click', () => openLightbox(img));
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(img);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }


  /* ========================================================================
     8. FOOTER YEAR
     ======================================================================== */

  const yearSlot = $('#year');
  if (yearSlot) yearSlot.textContent = String(new Date().getFullYear());
})();
