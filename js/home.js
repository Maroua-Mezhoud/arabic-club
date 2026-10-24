/* ==========================================================================
   home.js — الصفحة الرئيسية: بناء الأقسام من data.js + العرض المتحرك
   ========================================================================== */
(() => {
  const { fields, events, books, poems, works, members } = SITE;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const empty = t => `<div class="empty"><div aria-hidden="true">✦</div>${t}</div>`;

  /* الإحصاءات الحقيقية */
  $('#stt').innerHTML = SITE.stats.map(s => `<div class="cnt" data-n="${s.n}">0<small>${s.label}</small></div>`).join('');
  $('#jn').textContent = 'كن العضو رقم ' + (members + 1).toLocaleString('ar-EG');

  /* أقسام النادي: رف كتب جلدية بـ CSS فقط (بلا صور: أخف، وأوضح، ويحترم اتجاه العربية) */
  const leather = ['#5e2420', '#7a4a22', '#1f2f4a', '#4a2a45', '#4a4a22', '#3b2417'];
  /* مظهر كل كتاب: واقف (up) أو مائل (lean) أو أفقي (flat) — يتكرر إن زادت الأقسام.
     w/h/d = العرض والارتفاع والعمق بالبكسل، r = زاوية الميل، x = إزاحة أفقية */
  const looks = [
    { k: 'up',   w: 64,  h: 318, d: 15 },
    { k: 'up',   w: 78,  h: 274, d: 18 },
    { k: 'up',   w: 60,  h: 300, d: 14 },
    { k: 'lean', w: 68,  h: 288, d: 16, r: 8 },
    { k: 'flat', w: 236, h: 54,  d: 20, r: -0.8 },
    { k: 'flat', w: 206, h: 48,  d: 18, r: 0.8, x: 16 }
  ];
  const book = (title, i, n) => {
    const l = looks[n % looks.length];
    return `<button class="sp ${l.k}" data-i="${i}" style="--c:${leather[n % leather.length]};--w:${l.w}px;--h:${l.h}px;--d:${l.d}px;--r:${l.r || 0}deg;--x:${l.x || 0}px;transition-delay:${n * .1}s">` +
      `<span class="bd t"></span><em></em><b>${title}</b><span class="bd u"></span></button>`;
  };
  /* الكتب الواقفة والمائلة على لوح، والأفقية مكدّسة على لوح آخر بجانبها */
  const shelfHTML = (titles, start = 0) => {
    const up = [], flat = [];
    titles.forEach((t, i) => (looks[(i + start) % looks.length].k === 'flat' ? flat : up).push(book(t, i, i + start)));
    return `<div class="row">${up.join('')}</div>` + (flat.length ? `<div class="row low"><div class="stk">${flat.join('')}</div></div>` : '');
  };
  const settle = root => $$('.sp', root).forEach(p => p.addEventListener('transitionend', () => p.style.transitionDelay = '0s', { once: true }));

  const fd = $('#fd'), info = $('#fi');
  fd.innerHTML = shelfHTML(fields.map(f => f.title));
  info.innerHTML = '<p>اضغط على أحد الكتب لتتعرّف على قسمه</p>';
  settle(fd);
  fd.addEventListener('click', e => {
    const b = e.target.closest('.sp');
    if (!b) return;
    $$('.sp', fd).forEach(x => x.classList.toggle('on', x === b));
    const f = fields[b.dataset.i];
    info.innerHTML = `<h3>${f.title}</h3><p>${f.text}</p>`;
    info.classList.remove('flip'); void info.offsetWidth; info.classList.add('flip');
  });

  /* الفعاليات والورشات */
  $('#ev').innerHTML = events.length
    ? events.map(e => `
      <article class="cd"><div class="ev">
        <b>${e.day}<small>${e.month}</small></b>
        <div><h3>${e.title}</h3><p>${e.text}</p></div>
      </div></article>`).join('')
    : empty('لم تُعلَن أي فعالية بعد. سيُنشر هنا كل ما يقرره النادي من ورشات ولقاءات ومسابقات فور الإعلان عنه.');

  /* الكتب والدواوين */
  const bk = $('#bk');
  if (!books.length && !poems.length) {
    bk.innerHTML = empty('لم تُضَف كتب أو دواوين بعد. ستجدون هنا ما يجمعه النادي وما يكتبه أعضاؤه.');
  } else {
    bk.innerHTML =
      (books.length ? `<div class="shelf" role="group" aria-label="كتب النادي">${shelfHTML(books.map(b => b.title), 2)}</div>` : '') +
      (poems.length ? `<div class="grid3" style="margin-top:46px">${poems.map(p => `
        <article class="cd"><h3>${p.title}</h3><p>${p.author || ''}</p>
        ${p.verses.map(v => `<p class="vs">${v[0]} ۞ ${v[1]}</p>`).join('')}</article>`).join('')}</div>` : '');
    settle(bk);
  }

  /* بطاقة «أعمال مميزة»: كل البطاقة رابط إلى صفحة المعرض */
  const car = $('#car'), feat = works.filter(w => w.featured);
  if (!car) return;
  if (!feat.length) { car.hidden = true; return; }
  car.insertAdjacentHTML('afterbegin', feat.map((w, i) => `
    <a class="sl im${i ? '' : ' on'}" href="gallery.html" aria-label="مشاهدة معرض الأعمال">
      <div class="pi"><img src="${w.src}" alt="${w.title}"><i class="sh"></i></div>
      <div class="cp">
        <div class="lb ui">أعمال مميزة</div>
        <h3>من إبداعات أعضائنا</h3>
        <span class="more">مشاهدة المعرض ←</span>
        ${w.author ? `<p class="ui au">${w.author}</p>` : ''}
      </div>
    </a>`).join(''));

  let cur = 0;
  const go = d => {
    const s = $$('.sl', car);
    s[cur].classList.remove('on');
    cur = (cur + d + s.length) % s.length;
    s[cur].classList.add('on');
  };
  if (feat.length > 1) {
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
    const dot = document.createElement('i'), s = 2 + Math.random() * 3;
    dot.className = 'dst';
    dot.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${7 + Math.random() * 8}s;animation-delay:${-Math.random() * 12}s`;
    dot.setAttribute('aria-hidden', 'true');
    car.appendChild(dot);
  }
})();
