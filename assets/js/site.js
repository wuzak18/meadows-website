/* Meadows Agri Exports — progressive enhancement only.
   Everything on the page is readable and usable with this file blocked. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- nav: solid once scrolled off the masthead ---------------------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var setNav = function () {
      nav.classList.toggle('nav--set', window.scrollY > 24);
    };
    setNav();
    window.addEventListener('scroll', setNav, { passive: true });
  }

  /* ---- mobile menu ---------------------------------------------------- */
  var burger = document.querySelector('.nav__burger');
  var panel = document.getElementById('menu');
  if (burger && panel) {
    var setMenu = function (open) {
      panel.setAttribute('data-open', open ? 'true' : 'false');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? 'Close' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';
    };
    setMenu(false);
    burger.addEventListener('click', function () {
      setMenu(panel.getAttribute('data-open') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.getAttribute('data-open') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* ---- scroll reveal -------------------------------------------------- */
  var targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduced) {
    for (var i = 0; i < targets.length; i++) targets[i].classList.add('in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
    for (var j = 0; j < targets.length; j++) io.observe(targets[j]);
  }

  /* ---- hydration test: three states driven by scroll position --------
     The frame is sticky for the length of the section; progress through the
     section picks the state. CSS handles the cross-fade. Below 860px, and
     under reduced motion, the CSS shows all three states stacked and this
     writes an attribute nothing reads. */
  var hyd = document.querySelector('.hyd');
  var frame = hyd && hyd.querySelector('.hyd__frame');
  if (hyd && frame && !reduced) {
    var states = frame.querySelectorAll('.hyd__st').length || 3;
    var last = -1;
    var track = function () {
      var box = hyd.getBoundingClientRect();
      var span = hyd.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      var p = Math.min(Math.max(-box.top / span, 0), 0.9999);
      var s = Math.floor(p * states);
      if (s !== last) {
        last = s;
        frame.setAttribute('data-active', String(s));
      }
    };
    var queued = false;
    var onScroll = function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; track(); });
    };
    frame.setAttribute('data-active', '0');
    track();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
})();
