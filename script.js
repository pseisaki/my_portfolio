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

  // Side nav scroll-spy (highlights the section currently in view, and on
  // mobile/tablet keeps the collapsed pill's label in sync)
  var sideNavLinks = document.querySelectorAll('.side-nav a');
  if (sideNavLinks.length && 'IntersectionObserver' in window) {
    var sectionMap = {};
    sideNavLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) sectionMap[id] = link;
    });
    var currentLabel = document.querySelector('.side-nav-current-label');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var link = sectionMap[entry.target.id];
          sideNavLinks.forEach(function (l) { l.classList.remove('active'); });
          if (link) {
            link.classList.add('active');
            if (currentLabel) currentLabel.textContent = link.textContent;
          }
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    Object.keys(sectionMap).forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  }

  // Side nav pill toggle (mobile/tablet): tap to reveal the full section
  // list, tap a link/outside/Escape to collapse back to the pill
  var sideNav = document.querySelector('.side-nav');
  var sideNavToggle = document.querySelector('.side-nav-current');
  if (sideNav && sideNavToggle) {
    var closeSideNav = function () {
      sideNav.classList.remove('open');
      sideNavToggle.setAttribute('aria-expanded', 'false');
    };
    sideNavToggle.addEventListener('click', function () {
      var isOpen = sideNav.classList.toggle('open');
      sideNavToggle.setAttribute('aria-expanded', String(isOpen));
    });
    sideNavLinks.forEach(function (link) {
      link.addEventListener('click', closeSideNav);
    });
    document.addEventListener('click', function (e) {
      if (sideNav.classList.contains('open') && !sideNav.contains(e.target)) {
        closeSideNav();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSideNav();
    });
  }

  // Decision media lightbox (click/tap to enlarge images and videos)
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var stage = lightbox.querySelector('.lightbox-stage');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var closeLightbox = function () {
      lightbox.classList.remove('open');
      stage.innerHTML = '';
    };
    document.querySelectorAll('[data-lightbox]').forEach(function (el) {
      el.addEventListener('click', function () {
        var type = el.getAttribute('data-lightbox');
        // For a phone-mockup video, clone the whole frame (island + video)
        // so the lightbox shows the same phone chrome, just scaled up.
        var source = type === 'video' ? (el.closest('.phone-mockup') || el) : el;
        var clone = source.cloneNode(true);
        stage.innerHTML = '';
        stage.appendChild(clone);
        if (type === 'video') {
          var video = clone.tagName === 'VIDEO' ? clone : clone.querySelector('video');
          if (video) { video.muted = true; video.play(); }
        }
        lightbox.classList.add('open');
      });
    });
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
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
