// Poppy Seisaki, portfolio interactions
// Theme toggle (persisted) + scroll-reveal + nav shrink on scroll

document.addEventListener('DOMContentLoaded', function () {
  var root = document.documentElement;

  // Theme toggle
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    var current = root.getAttribute('data-theme') || 'light';
    toggle.setAttribute('aria-pressed', current === 'dark');
    toggle.addEventListener('click', function () {
      var now = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', now);
      localStorage.setItem('theme', now);
      toggle.setAttribute('aria-pressed', now === 'dark');
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Cursor-tracked soft glow overlay on hero text (base text stays solid)
  var glowWraps = document.querySelectorAll('.hero-glow-wrap');
  glowWraps.forEach(function (wrap) {
    wrap.addEventListener('mousemove', function (e) {
      var rect = wrap.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      wrap.style.setProperty('--mx', x + '%');
      wrap.style.setProperty('--my', y + '%');
    });
    wrap.addEventListener('mouseenter', function () { wrap.classList.add('glow-active'); });
    wrap.addEventListener('mouseleave', function () { wrap.classList.remove('glow-active'); });
  });

  // Side nav scroll-spy (highlights the section currently in view)
  var sideNavLinks = document.querySelectorAll('.side-nav a');
  if (sideNavLinks.length && 'IntersectionObserver' in window) {
    var sectionMap = {};
    sideNavLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) sectionMap[id] = link;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var link = sectionMap[entry.target.id];
          sideNavLinks.forEach(function (l) { l.classList.remove('active'); });
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    Object.keys(sectionMap).forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  }

  // Nav shrink on scroll
  var nav = document.querySelector('.site-nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 12) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});
