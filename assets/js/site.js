/* Meadows Agri Exports, progressive enhancement only.
   The page is complete and usable with this file blocked: every panel is
   visible, every link works, nothing is hidden waiting to be revealed. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.getAttribute('data-open') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* ---- material states: selected by the reader, never by scroll -------
     Panels carry no `hidden` in the markup, so with JS off all three are on
     the page at once. Only once we know we can offer the control do we take
     the other two away. */
  var tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    var tabs = [].slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    var select = function (i, focus) {
      tabs.forEach(function (t, n) {
        t.setAttribute('aria-selected', n === i ? 'true' : 'false');
        t.setAttribute('tabindex', n === i ? '0' : '-1');
        if (panels[n]) panels[n].hidden = n !== i;
      });
      if (focus) tabs[i].focus();
    };

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });
    select(0);
  }

  /* ---- reveal on entry ------------------------------------------------ */
  var rv = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || reduced) {
    for (var i = 0; i < rv.length; i++) rv[i].classList.add('in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    for (var j = 0; j < rv.length; j++) io.observe(rv[j]);
  }

  /* ---- which section am I in: marks the nav link, changes no content -- */
  var links = [].slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = byId[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) seen.observe(el);
    });
  }
})();
