/* ==========================================================================
   ISHI TECHNO PROJECTS — main.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initParticles();
  initReveal();
  initCounters();
  initProjectFilter();
  initContactForm();
  initYear();
});

/* ---------------- Mobile nav ---------------- */
function initNav(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

/* ---------------- Lightweight particle field (canvas) ---------------- */
function initParticles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  function makeParticles(){
    const count = Math.min(70, Math.floor((w*h)/22000));
    particles = Array.from({length: count}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.6 + 0.6,
      vx: (Math.random()-0.5)*0.25,
      vy: (Math.random()-0.5)*0.25,
      hue: Math.random() > 0.5 ? '47,107,255' : '6,214,224'
    }));
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.hue},0.7)`;
      ctx.fill();
    });
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 120){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `rgba(47,107,255,${0.12 * (1-dist/120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    if(!prefersReduced) requestAnimationFrame(tick);
  }
  resize(); makeParticles();
  if(!prefersReduced) tick(); else tick();
  window.addEventListener('resize', () => { resize(); makeParticles(); });
}

/* ---------------- Scroll reveal ---------------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

/* ---------------- Animated counters ---------------- */
function initCounters(){
  const els = document.querySelectorAll('[data-counter]');
  if(!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      function step(now){
        const p = Math.min((now-start)/duration, 1);
        const eased = 1 - Math.pow(1-p, 3);
        el.textContent = Math.floor(eased*target) + suffix;
        if(p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ---------------- Project filter ---------------- */
function initProjectFilter(){
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-category]');
  if(!buttons.length || !cards.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}

/* ---------------- Contact form (static-site friendly) ---------------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const body = `Name: ${data.name}%0AEmail: ${data.email}%0APhone: ${data.phone || '-'}%0AService: ${data.service || '-'}%0A%0AMessage:%0A${data.message}`;
    const status = document.getElementById('form-status');

    // Primary: open mail client with prefilled message (no backend needed on GitHub Pages)
    window.location.href = `mailto:ishitharoy.mi@gmail.com?subject=${encodeURIComponent('New Project Enquiry — ' + (data.name || ''))}&body=${body}`;

    if(status){
      status.textContent = 'Opening your email app… you can also reach us directly on WhatsApp below.';
      status.style.color = 'var(--emerald)';
    }
  });
}

/* ---------------- Footer year ---------------- */
function initYear(){
  const el = document.getElementById('year');
  if(el) el.textContent = new Date().getFullYear();
}

/* =========================================================================
   RAZORPAY PAYMENT BUTTONS
   -------------------------------------------------------------------------
   GitHub Pages is static hosting only — there is no server to create
   orders, so we use Razorpay's client-side Checkout in "Payment Button"
   mode. Replace YOUR_RAZORPAY_KEY_ID below with your live/test Key ID
   from the Razorpay Dashboard → Settings → API Keys.

   For production, Razorpay's hosted "Payment Pages" or "Payment Buttons"
   (created in the Dashboard, no key needed in code) are the simplest and
   most secure option for a static site — see README-DEPLOY.md.
   ========================================================================= */
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';

function payWithRazorpay(amountINR, label, description){
  if(typeof Razorpay === 'undefined'){
    alert('Payment gateway is loading, please try again in a second.');
    return;
  }
  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(amountINR * 100), // paise
    currency: 'INR',
    name: 'Ishi Techno Projects',
    description: description || label,
    image: '../assets/images/logo-mark.png',
    handler: function(response){
      alert('Payment successful! Payment ID: ' + response.razorpay_payment_id + '\\nOur team will contact you on WhatsApp/Email to confirm your order.');
    },
    prefill: { name: '', email: '', contact: '' },
    notes: { package: label },
    theme: { color: '#2f6bff' }
  };
  const rzp = new Razorpay(options);
  rzp.on('payment.failed', function(response){
    alert('Payment failed. Please try again or contact us on WhatsApp at +91 80740 20342.');
  });
  rzp.open();
}

// Attach to any element with data-pay attributes, e.g.
// <button data-pay-amount="2999" data-pay-label="Starter Package" class="btn btn-primary">Pay Now</button>
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-pay-amount]');
  if(!btn) return;
  e.preventDefault();
  payWithRazorpay(
    parseFloat(btn.dataset.payAmount),
    btn.dataset.payLabel || 'Project Payment',
    btn.dataset.payDesc || ''
  );
});
