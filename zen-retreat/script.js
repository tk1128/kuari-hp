/* ── Strip tracking params ── */
(function(){
  const u = new URL(location.href);
  const tp = ['fbclid','utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','gclid','mc_eid','igshid'];
  let dirty = false;
  tp.forEach(p => { if(u.searchParams.has(p)){ u.searchParams.delete(p); dirty=true; } });
  [...u.searchParams.keys()].forEach(k => { if(/^(fb_|aem_)/.test(k)){ u.searchParams.delete(k); dirty=true; } });
  if(dirty) history.replaceState({}, '', u.search ? u.toString() : u.origin + u.pathname);
})();

/* ── Mobile detection (shared with HTML loader) ── */
var isMobile = window.innerWidth < 768;

/* ── Animations (runs after DOM + scripts are ready) ── */
function initAnimations() {

  if (!isMobile && typeof gsap !== 'undefined') {
    /* ── Desktop: full GSAP ── */
    gsap.registerPlugin(ScrollTrigger);

    // Hero Pin & Scale
    gsap.to('.js-scale-hero', {
      scale: 1.15, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    ScrollTrigger.create({
      trigger: '#hero', start: 'top top', end: 'bottom top',
      pin: '.js-pin-hero', pinSpacing: false
    });

    // Parallax images
    document.querySelectorAll('.js-parallax').forEach(img => {
      gsap.to(img, {
        yPercent: 15, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    document.querySelectorAll('.js-internal-parallax').forEach(img => {
      gsap.to(img, {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Fade-up
    document.querySelectorAll('.js-fade').forEach(el => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });
    document.querySelectorAll('.js-fade-hero').forEach(el => {
      gsap.from(el, { y: 20, opacity: 0, duration: 1.5, delay: 0.3, ease: 'power3.out' });
    });

  } else {
    /* ── Mobile: lightweight IntersectionObserver ── */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.js-fade').forEach(el => {
      el.style.cssText += 'opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease;';
      io.observe(el);
    });
    document.querySelectorAll('.js-fade-hero').forEach(el => {
      el.style.opacity = '1';
    });
  }
}

/* ── Modal ── */
function initModal() {
  const openBtn  = document.getElementById('open-reserve');
  const closeBtn = document.getElementById('close-reserve');
  const modal    = document.getElementById('reserve-modal');
  if (!openBtn || !modal) return;

  const open  = () => { modal.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const close = () => { modal.classList.remove('active'); document.body.style.overflow = ''; };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
}

/* ── Date picker + price ── */
function initDatePicker() {
  const dateInput   = document.getElementById('date-picker');
  const priceDisplay= document.getElementById('total-price');
  const guestSelect = document.getElementById('guest-count');
  const planSelect  = document.getElementById('plan-select');
  if (!dateInput) return;

  let selectedDates = [];

  const PLANS = {
    'normal':   { label: '¥80,000 / 泊', calc: (n) => `¥${(80000 * n).toLocaleString()}` },
    'eth':      { label: '0.1 ETH / 泊',  calc: (n) => `${(0.1 * n).toFixed(1)} ETH` },
    'free':     { label: '無料',           calc: (n) => n > 0 ? '¥0 — 無料' : '¥0' },
  };

  const updatePrice = () => {
    if (!priceDisplay) return;
    if (selectedDates.length < 2) { priceDisplay.textContent = '—'; return; }
    const nights = Math.ceil((selectedDates[1] - selectedDates[0]) / 86400000);
    const plan   = planSelect ? planSelect.value : 'normal';
    priceDisplay.textContent = PLANS[plan] ? PLANS[plan].calc(nights) : `¥${(80000 * nights).toLocaleString()}`;
  };

  if (typeof flatpickr !== 'undefined') {
    flatpickr(dateInput, {
      mode: 'range', minDate: 'today', dateFormat: 'Y/m/d', showMonths: 1,
      onChange(dates) { selectedDates = dates; updatePrice(); }
    });
  }

  if (guestSelect) guestSelect.addEventListener('change', updatePrice);
  if (planSelect)  planSelect.addEventListener('change', updatePrice);
}

/* ── Init ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initModal();
    initDatePicker();
  });
} else {
  initAnimations();
  initModal();
  initDatePicker();
}
