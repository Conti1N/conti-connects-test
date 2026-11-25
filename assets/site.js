(() => {
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
// forms go to our inbox through FormSubmit; if that fails, the visitor's email app opens filled in
document.querySelectorAll('form[data-subject]').forEach((f) => f.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(f)), say = f.querySelector('[role=status]'), b = f.querySelector('button');
  if (d._honey) return;
  b.disabled = true; say.textContent = 'Sending...';
  try {
    const r = await fetch('https://formsubmit.co/ajax/ismail@conticonnects.com', { method: 'POST', signal: AbortSignal.timeout(12000), headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...d, _subject: f.dataset.subject + ' from the website', _template: 'table', _cc: 'nabeel@conticonnects.com' }) });
    const j = await r.json();
    if (!r.ok || String(j.success) !== 'true') throw 0;
    f.reset(); say.textContent = 'Sent. Thank you, we will reply by email.';
  } catch {
    delete d._honey;
    location.href = 'mailto:ismail@conticonnects.com?cc=nabeel@conticonnects.com&subject=' + encodeURIComponent(f.dataset.subject) + '&body=' + encodeURIComponent(Object.entries(d).map(([k, v]) => k + ': ' + v).join('\n'));
    say.textContent = 'We could not send the form, so your email app should open with it filled in. If it does not, write to ismail@conticonnects.com.';
  }
  b.disabled = false;
}));
if (still) return;
// moving fabric: wide screens only, after the page has loaded, never on data saver
const cloth = document.querySelector('.cloth[data-video]');
if (cloth && innerWidth > 760 && !(navigator.connection && navigator.connection.saveData)) addEventListener('load', () => setTimeout(() => {
  const v = document.createElement('video');
  Object.assign(v, { muted: true, loop: true, playsInline: true, src: cloth.dataset.video });
  v.setAttribute('aria-hidden', 'true'); v.tabIndex = -1;
  v.addEventListener('playing', () => { v.style.opacity = 1; }, { once: true });
  v.style.cssText = 'opacity:0;transition:opacity 1.2s'; cloth.append(v);
  new IntersectionObserver((x) => { if (x[0].isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); } else v.pause(); }).observe(cloth);
}, 300));
const ease = 'cubic-bezier(.16,1,.3,1)';
const looks = { big: [{ clipPath: 'inset(0 100% -10% 0)', transform: 'translateX(-24px)' }, { clipPath: 'inset(0 0 -10% 0)', transform: 'none' }], up: [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], tile: [{ transform: 'translateY(90px)' }, { transform: 'none' }] };
const io = new IntersectionObserver((es) => es.forEach((x) => {
  if (!x.isIntersecting) return; io.unobserve(x.target);
  const el = x.target, k = el.matches('.tile') ? 'tile' : el.matches('h2.big,.word') ? 'big' : 'up';
  el.animate(looks[k], { duration: 1200, delay: Math.min(4, [...el.parentElement.children].indexOf(el)) * 80, easing: ease, fill: 'backwards' });
}), { rootMargin: '0px 0px -4% 0px' });
document.querySelectorAll('h2.big,.word,.say,h2.mid,.list li,.tile,.cards a').forEach((el) => { if (el.getBoundingClientRect().top > innerHeight) io.observe(el); });
const imgs = [...document.querySelectorAll('.tile img')]; let cur = scrollY, last = 0, shown = null;
const loop = (now) => {
  const dt = Math.min(64, now - last); last = now; cur += (scrollY - cur) * (1 - Math.exp(-dt / 110)); if (Math.abs(scrollY - cur) < .1) cur = scrollY;
  if (cur !== shown) { const lag = scrollY - cur, vh = innerHeight; const ps = imgs.map((i) => { const r = i.parentElement.getBoundingClientRect(); return Math.max(-1, Math.min(1, (r.top + lag + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2))); });
    imgs.forEach((i, n) => { i.style.transform = `translate3d(0,${(-ps[n] * 5.5).toFixed(2)}%,0) scale(1.16)`; });
    const h = document.querySelector('.hero .cloth'); if (h && cur < vh * 1.2) h.style.transform = `translate3d(0,${(cur * .2).toFixed(1)}px,0)`; shown = cur; }
  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);
})();
