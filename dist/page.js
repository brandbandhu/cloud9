const q = (selector, parent = document) => parent.querySelector(selector);
const qa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const header = q('#siteHeader');
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 25), { passive: true });
const menuToggle = q('#menuToggle'); const mobileNav = q('#mobileNav');
menuToggle?.addEventListener('click', () => { const open = mobileNav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', open); });
qa('.mobile-nav a').forEach(link => link.addEventListener('click', () => mobileNav?.classList.remove('open')));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in-view')), { threshold: .12 });
qa('.reveal, .photo-reveal').forEach(item => revealObserver.observe(item));

document.documentElement.classList.add('page-enter');
qa('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', e => {
    const box = card.getBoundingClientRect(); const x = (e.clientX - box.left) / box.width - .5; const y = (e.clientY - box.top) / box.height - .5;
    card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-10px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

qa('[data-open-consultation]').forEach(button => button.addEventListener('click', () => { window.location.href = 'contact.html#consultation'; }));
qa('[data-article]').forEach(link => link.addEventListener('click', e => { e.preventDefault(); window.location.href = 'insights.html#featured'; }));

qa('[data-consultation-form]').forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  const note = q('#formNote', form);
  if (note) { note.textContent = 'Thank you — your enquiry is captured in this demo. Connect your CRM before launch.'; note.classList.add('form-success'); }
  form.querySelector('button[type="submit"]')?.setAttribute('disabled', 'disabled');
}));
