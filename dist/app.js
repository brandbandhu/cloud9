const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

const intro = qs('#intro');
const introSkip = qs('#introSkip');
if (!sessionStorage.getItem('cloud9-intro-seen') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setTimeout(() => intro.classList.add('is-hidden'), 2300);
  setTimeout(() => sessionStorage.setItem('cloud9-intro-seen', '1'), 3000);
} else intro.classList.add('is-hidden');
introSkip.addEventListener('click', () => { intro.classList.add('is-hidden'); sessionStorage.setItem('cloud9-intro-seen', '1'); });

const header = qs('#siteHeader');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });
const menuToggle = qs('#menuToggle');
const mobileNav = qs('#mobileNav');
menuToggle.addEventListener('click', () => { const open = mobileNav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', open); });
qsa('.mobile-nav a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in-view')), { threshold: .12 });
qsa('.reveal').forEach(el => observer.observe(el));

document.addEventListener('mousemove', e => { const glow = qs('.cursor-glow'); if (glow) { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; } });

const money = value => `₹ ${Math.round(value).toLocaleString('en-IN')}`;
const calc = () => {
  const amount = Number(qs('#amountRange').value); const rate = Number(qs('#rateRange').value); const years = Number(qs('#tenureRange').value);
  const monthlyRate = rate / 12 / 100; const months = years * 12;
  const emi = monthlyRate ? amount * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1) : amount / months;
  const total = emi * months; const interest = total - amount; const principalPct = Math.round(amount / total * 100);
  qs('#amountOutput').textContent = money(amount); qs('#rateOutput').textContent = `${rate.toFixed(2)}%`; qs('#tenureOutput').textContent = `${years} years`;
  qs('#emiOutput').textContent = money(emi); qs('#principalOutput').textContent = money(amount); qs('#interestOutput').textContent = money(interest); qs('#principalPct').textContent = `${principalPct}%`;
  qs('#donut').style.background = `conic-gradient(#9e111a 0 ${principalPct}%, #d4af37 ${principalPct}% 100%)`;
};
qsa('.calc-fields input').forEach(input => input.addEventListener('input', calc)); calc();

qsa('.filter').forEach(filter => filter.addEventListener('click', () => { qsa('.filter').forEach(x => x.classList.remove('active')); filter.classList.add('active'); const type = filter.dataset.filter; qsa('.property-card').forEach(card => { card.style.display = type === 'all' || card.dataset.type === type ? '' : 'none'; }); }));
qsa('.property-heart').forEach(button => button.addEventListener('click', () => { button.classList.toggle('saved'); button.textContent = button.classList.contains('saved') ? '♥' : '♡'; showToast(button.classList.contains('saved') ? 'Saved to your shortlist' : 'Removed from shortlist'); }));

const modal = qs('#consultationModal');
const openModal = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; setTimeout(() => qs('input', modal)?.focus(), 150); };
const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
qsa('[data-open-consultation]').forEach(button => button.addEventListener('click', openModal)); qsa('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
qs('#consultationForm').addEventListener('submit', e => { e.preventDefault(); qs('#modalForm').hidden = true; qs('#modalSuccess').hidden = false; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); qs('#advisor').classList.remove('open'); } });

const advisor = qs('#advisor'); qs('#advisorTrigger').addEventListener('click', () => advisor.classList.toggle('open')); qs('#advisorClose').addEventListener('click', () => advisor.classList.remove('open'));
const advisorBody = qs('#advisorBody'); const advisorInput = qs('#advisorInput');
const advisorReply = text => { const user = document.createElement('div'); user.className = 'chat-bubble user'; user.textContent = text; advisorBody.appendChild(user); const typing = document.createElement('div'); typing.className = 'chat-bubble bot'; typing.textContent = 'Thinking through that…'; advisorBody.appendChild(typing); advisorBody.scrollTop = advisorBody.scrollHeight; setTimeout(() => { typing.textContent = text.toLowerCase().includes('property') ? 'I can help you shape a property brief — location, use, budget and buy/sell intent are useful starting points. For live inventory, connect the admin-managed listings feed.' : text.toLowerCase().includes('emi') || text.toLowerCase().includes('loan') ? 'A good first step is to estimate your EMI, then discuss tenure, income context and preferred loan type with a consultant. The calculator above is illustrative only.' : 'A useful place to begin is with your goal, preferred timeline and the kind of support you need. I can point you to loans, property discovery or financial guidance.'; advisorBody.scrollTop = advisorBody.scrollHeight; }, 650); };
qs('#advisorForm').addEventListener('submit', e => { e.preventDefault(); const value = advisorInput.value.trim(); if (!value) return; advisorReply(value); advisorInput.value = ''; });
qsa('.quick-replies button').forEach(button => button.addEventListener('click', () => advisorReply(button.textContent)));

const toast = qs('#toast'); let toastTimer; const showToast = msg => { toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200); };
qsa('[data-article]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); showToast('Article detail pages can be connected to your CMS.'); }));
