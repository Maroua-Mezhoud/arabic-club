/* ==========================================================================
   main.js — السلوك المشترك بين جميع الصفحات
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* قائمة الجوال */
(() => {
  const btn = $('.menu-btn'), links = $('.lk');
  if (!btn || !links) return;
  const set = open => {
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? '✕' : '☰';
  };
  btn.addEventListener('click', () => set(!links.classList.contains('open')));
  links.addEventListener('click', e => e.target.closest('a') && set(false));
})();

/* شريط تقدّم القراءة */
(() => {
  const bar = document.createElement('div');
  bar.className = 'pg';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const update = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
  };
  addEventListener('scroll', update, { passive: true });
  update();
})();

/* ظهور تدريجي للأقسام + عدّادات الأرقام */
(() => {
  const count = el => {
    if (el.done) return;
    el.done = true;
    const n = +el.dataset.n, t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 1600, 1);
      el.firstChild.nodeValue = Math.round(n * p);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('.cnt', e.target).forEach(count);
    if (e.target.classList.contains('cnt')) count(e.target);
  }), { threshold: 0.1 });
  $$('.rv').forEach(el => io.observe(el));
})();

/* تمييز رابط القسم الحالي في القائمة */
(() => {
  const secs = $$('.lk a[href^="#"]').map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  if (!secs.length) return;
  const update = () => {
    const y = scrollY + 130;
    let cur = 0;
    secs.forEach((s, i) => { if (s.offsetTop <= y) cur = i; });
    $$('.lk a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + secs[cur].id));
  };
  addEventListener('scroll', update, { passive: true });
  update();
})();
