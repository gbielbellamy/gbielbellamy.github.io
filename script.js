document.getElementById('year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px'
  }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.style.borderBottomColor = '#2a2a2a';
    nav.style.background = 'rgba(14,14,14,0.97)';
  } else {
    nav.style.borderBottomColor = 'transparent';
    nav.style.background = 'rgba(14,14,14,0.85)';
  }
});

const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav__links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen.toString());
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--accent)'
            : 'var(--text-muted)';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => sectionObserver.observe(section));