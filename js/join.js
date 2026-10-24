/* ==========================================================================
   join.js — استمارة الانضمام
   حاليًا لا تُحفظ البيانات في أي مكان (واجهة فقط).
   عند بناء الجزء الخلفي استبدل محتوى submitApplication بطلب حقيقي
   (Firebase / Supabase / API خاص) وسيعمل بقية الكود كما هو.
   ========================================================================== */
async function submitApplication(data) {
  // TODO(backend): أرسل data إلى الخادم، وأعد { ok: true } عند النجاح أو ارمِ خطأ.
  // مثال لاحقًا:
  //   const res = await fetch('https://YOUR-API/applications', { method: 'POST',
  //     headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  //   if (!res.ok) throw new Error('failed');
  await new Promise(r => setTimeout(r, 900)); // محاكاة زمن الإرسال
  return { ok: true };
}

(() => {
  const form = $('#f'), ok = $('#ok'), err = $('#err');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('button[type=submit]', form), label = btn.textContent;
    err.hidden = true;
    btn.disabled = true;
    btn.textContent = 'جارٍ الإرسال…';
    try {
      await submitApplication(Object.fromEntries(new FormData(form)));
      form.style.display = 'none';
      ok.style.display = 'block';
      scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      err.hidden = false;
      btn.disabled = false;
      btn.textContent = label;
    }
  });
})();
