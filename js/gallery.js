/* ==========================================================================
   gallery.js — صفحة معرض الأعمال (كل أعمال الأعضاء من data.js)
   ========================================================================== */
(() => {
  const gal = $('#gl'), { works } = SITE;
  gal.innerHTML = works.length
    ? works.map(w => `
      <div class="pl" tabindex="0">
        <img src="${w.src}" alt="${w.title}" loading="lazy">
        <span>${w.title}${w.author ? ' · ' + w.author : ''}</span>
      </div>`).join('')
    : '<div class="empty"><div aria-hidden="true">✦</div>لم تُنشر أعمال بعد. كن أول من يشارك إبداعه.</div>';

  $$('.pl', gal).forEach((p, i) => {
    p.style.transitionDelay = i * .12 + 's';
    p.addEventListener('transitionend', () => p.style.transitionDelay = '0s', { once: true });
    p.addEventListener('mousemove', e => {
      const r = p.getBoundingClientRect();
      p.style.setProperty('--gx', e.clientX - r.left + 'px');
      p.style.setProperty('--gy', e.clientY - r.top + 'px');
    });
    p.addEventListener('keydown', e => e.key === 'Enter' && p.click());
  });
})();
