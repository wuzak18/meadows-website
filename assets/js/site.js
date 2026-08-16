/* Meadows Agri Exports. Progressive enhancement only.
   With this file blocked the page is still complete: every panel is on the
   page, every link works, nothing waits to be revealed. */
(function () {
  'use strict';

  /* ---- nav is solid by default; it goes transparent only while the hero
        is still behind it. See the note in the stylesheet: inverted so a
        blocked script leaves a readable bar rather than an invisible one. */
  var nav = document.querySelector('.nav');
  var hero = document.querySelector('.hero');
  if (nav) {
    var setNav = function () {
      var trigger = hero ? hero.offsetHeight - 120 : 80;
      nav.classList.toggle('nav--top', window.scrollY <= trigger);
    };
    setNav();
    window.addEventListener('scroll', setNav, { passive: true });
    window.addEventListener('resize', setNav);
  }

  /* ---- mobile menu ---------------------------------------------------- */
  var burger = document.querySelector('.nav__burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    var setMenu = function (open) {
      menu.setAttribute('data-open', open ? 'true' : 'false');
      // inert, not the CSS transition, is what keeps a closed panel out of the
      // tab order and the accessibility tree. visibility is delayed so the
      // slide-out is not cut short, and a delayed transition is not something
      // focus management should depend on.
      if ('inert' in menu) menu.inert = !open; else menu.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? 'Close' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';
    };
    setMenu(false);
    burger.addEventListener('click', function () {
      setMenu(menu.getAttribute('data-open') !== 'true');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* ---- every tablist on the page: the range and the material states ---
     Panels carry no `hidden` in the markup, so without JS they are all
     present. Only once the control exists do we take the others away.
     Selection is made by the reader. Scrolling never touches it. */
  [].slice.call(document.querySelectorAll('[role="tablist"]')).forEach(function (list) {
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    if (!tabs.length) return;

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
  });

  /* ---- which section am I in. Marks a nav link, changes no content ---- */
  var links = [].slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var a = byId[en.target.id];
        if (a && en.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }
})();
