/* ==========================================================================
   home.js — الصفحة الرئيسية: بناء الأقسام من data.js + العرض والمعرض
   ========================================================================== */
(() => {
  const { fields, events, lessons, works, placeholders, books } = SITE;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const render = (sel, items, tpl) => { const el = $(sel); if (el) el.innerHTML = items.map(tpl).join(''); };

  /* الأقسام النصية */
  render('#fd', fields, f => `
    <article class="cd${f.featured ? ' star' : ''}">
      <div class="g" style="font-family:'${f.font}'" aria-hidden="true">${f.letter}</div>
      <h3>${f.title}</h3><p>${f.text}</p>
    </article>`);

  render('#ev', events, e => `
    <article class="cd"><div class="ev">
      <b>${e.day}<small>${e.month}</small></b>
      <div><h3>${e.title}</h3><p>${e.text}</p></div>
    </div></article>`);

  render('#ls', lessons, l => `
    <article class="cd">
      <div class="g" aria-hidden="true">${l.letter}</div>
      <h3>${l.title}</h3><p>${l.text}</p>
      <a class="btn sm" href="join.html">سجّل الآن</a>
    </article>`);

  render('#bk', books, b => `
    <div class="cov" style="--c:${b.color}"><em aria-hidden="true">ك</em><span>${b.title}</span></div>`);

  /* عرض «من إبداعات أعضائنا» */
  const car = $('#car');
  if (car) {
    car.insertAdjacentHTML('afterbegin', works.map((w, i) => `
      <div class="sl im${i ? '' : ' on'}">
        <div class="pi"><img src="${w.src}" alt="${w.title}"><i class="sh"></i></div>
        <div class="cp">
          <div class="lb ui">أعمال مميزة</div>
          <h3>من إبداعات أعضائنا</h3>
          <a href="#works">مشاهدة المعرض ←</a>
          ${w.author ? `<p class="ui au">${w.author}</p>` : ''}
        </div>
      </div>`).join(''));

    let cur = 0;
    const go = d => {
      const s = $$('.sl', car);
      s[cur].classList.remove('on');
      cur = (cur + d + s.length) % s.length;
      s[cur].classList.add('on');
    };
    if (works.length > 1) {
      $('#nx').onclick = () => go(1);
      $('#pv').onclick = () => go(-1);
      if (!calm) setInterval(() => go(1), 5500);
    } else {
      $('#nx').style.display = $('#pv').style.display = 'none';
    }

    /* إضاءة وإزاحة تتبع المؤشر */
    car.addEventListener('mousemove', e => {
      const r = car.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      car.style.setProperty('--mx', x * 100 + '%');
      car.style.setProperty('--my', y * 100 + '%');
      $$('.sl .pi', car).forEach(p => p.style.translate = (x - .5) * -16 + 'px ' + (y - .5) * -12 + 'px');
      $$('.sl .cp', car).forEach(p => p.style.translate = (x - .5) * 10 + 'px ' + (y - .5) * 8 + 'px');
    });
    car.addEventListener('mouseleave', () => $$('.sl .pi, .sl .cp', car).forEach(p => p.style.translate = ''));

    /* غبار ذهبي */
    if (!calm) for (let i = 0; i < 16; i++) {
      const d = document.createElement('i'), s = 2 + Math.random() * 3;
      d.className = 'dst';
      d.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${7 + Math.random() * 8}s;animation-delay:${-Math.random() * 12}s`;
      d.setAttribute('aria-hidden', 'true');
      car.appendChild(d);
    }
  }

  /* معرض الأعمال: الأعمال الحقيقية أولًا ثم بطاقات مؤقتة حتى يكتمل ستة */
  const real = works.map(w => `<div class="pl"><img src="${w.src}" alt="${w.title}" loading="lazy"><span>${w.title}${w.author ? ' · ' + w.author : ''}</span></div>`);
  const filler = placeholders.slice(0, Math.max(0, 6 - works.length))
    .map(p => `<div class="pl"><div style="font-family:'${p[1]}'" aria-hidden="true">${p[0]}</div><span>مساحة لعمل قادم</span></div>`);
  const gal = $('#gl');
  if (gal) gal.innerHTML = real.concat(filler).join('');

  $$('#gl .pl').forEach((p, i) => {
    p.style.transitionDelay = i * .12 + 's';
    p.addEventListener('transitionend', () => p.style.transitionDelay = '0s', { once: true });
    p.addEventListener('mousemove', e => {
      const r = p.getBoundingClientRect();
      p.style.setProperty('--gx', e.clientX - r.left + 'px');
      p.style.setProperty('--gy', e.clientY - r.top + 'px');
    });
  });

  /* عرض اللوحة بحجمها الكامل */
  const lx = document.createElement('div');
  lx.className = 'lx';
  lx.innerHTML = '<img alt="">';
  document.body.appendChild(lx);
  const close = () => lx.classList.remove('o');
  lx.addEventListener('click', close);
  addEventListener('keydown', e => e.key === 'Escape' && close());
  document.addEventListener('click', e => {
    const box = e.target.closest('.pi, .pl'), img = box && $('img', box);
    if (img) { lx.firstChild.src = img.src; lx.firstChild.alt = img.alt; lx.classList.add('o'); }
  });
})();
