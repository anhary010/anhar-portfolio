(function () {
  const S = {
    en: { name: 'Anhar Almalki', role: 'Curator · Exhibition & Spatial Designer', tags: ['#Curatorial', '#Spatial', '#Archival', '#Research'], save: 'Save contact', whatsapp: 'WhatsApp', email: 'Email', linkedin: 'LinkedIn', instagram: 'Instagram', youtube: 'Shawahid on YouTube', portfolio: 'Portfolio', scan: 'Scan to open this card', open: 'Open for curatorial collaborations & cultural exchange', toggle: 'ع', toggleLabel: 'Switch to Arabic', title: 'Anhar Almalki — Digital Card' },
    ar: { name: 'أنهار المالكي', role: 'قيّمة فنية · مصمّمة معارض وفراغات', tags: ['#تقييم_فني', '#فراغ', '#أرشيف', '#بحث'], save: 'حفظ جهة الاتصال', whatsapp: 'واتساب', email: 'البريد', linkedin: 'لينكدإن', instagram: 'إنستغرام', youtube: 'شواهد على يوتيوب', portfolio: 'الموقع', scan: 'امسح الرمز لفتح البطاقة', open: 'متاحة للتعاون التقييمي والتبادل الثقافي', toggle: 'EN', toggleLabel: 'التبديل إلى الإنجليزية', title: 'أنهار المالكي — بطاقة رقمية' }
  };
  const html = document.documentElement, q = new URLSearchParams(location.search);
  if (q.get('png') === '1') html.classList.add('png');
  function render(lang) {
    const s = S[lang]; html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.title = s.title;
    document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (!s[k]) return; const icon = el.querySelector('.act__icon'); el.textContent = ''; if (icon) el.appendChild(icon); el.append(document.createTextNode(s[k])); });
    [...document.querySelectorAll('#tags li')].forEach((li, i) => li.textContent = s.tags[i] || '');
    const t = document.getElementById('langToggle'); t.textContent = s.toggle; t.setAttribute('aria-label', s.toggleLabel);
    document.querySelector('.ghost').textContent = lang === 'ar' ? 'أنهار' : 'ANHAR';
    try { localStorage.setItem('anhar-lang', lang); } catch (e) {}
  }
  let lang = q.get('lang'); if (lang !== 'ar' && lang !== 'en') { try { lang = localStorage.getItem('anhar-lang') || 'en'; } catch (e) { lang = 'en'; } }
  render(lang);
  document.getElementById('langToggle').addEventListener('click', () => render(html.lang === 'ar' ? 'en' : 'ar'));
})();
