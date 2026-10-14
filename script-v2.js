// Enables scroll-reveal animations (CSS only hides .reveal when this class exists)
document.documentElement.classList.add('js');

// ---------- Mobile hamburger toggle ----------
const header = document.getElementById('top');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const hamburgerIcon = hamburger.querySelector('i');

function setMenu(open) {
  navMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  hamburgerIcon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}
hamburger.addEventListener('click', () => setMenu(!navMenu.classList.contains('open')));
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
window.addEventListener('resize', () => { if (window.innerWidth > 820) setMenu(false); });

// ---------- Scroll effects: header shadow, active link, back-to-top ----------
const sections = document.querySelectorAll('main section[id], footer[id]');
const navLinks = document.querySelectorAll('nav a');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 20);
  backToTop.classList.toggle('show', window.scrollY > 450);

  const pos = window.scrollY + 140;
  let current = 'home';
  sections.forEach(sec => { if (pos >= sec.offsetTop) current = sec.id; });
  // 'admission' has no nav link, so keep Academics/Notice highlight logic simple
  if (current === 'admission') current = 'academics';
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Scroll reveal animation ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + 'ms';   // gentle stagger
    observer.observe(el);
  });
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// ---------- Admission form validation ----------
const form = document.getElementById('admissionForm');
const successBox = document.getElementById('formSuccess');
const successText = document.getElementById('successText');
const phoneInput = document.getElementById('phone');

// allow digits only in the phone field
phoneInput.addEventListener('input', () => { phoneInput.value = phoneInput.value.replace(/\D/g, ''); });

function setError(input, hasError) {
  input.closest('.form-group').classList.toggle('error', hasError);
  input.setAttribute('aria-invalid', hasError);
  return !hasError;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const studentName = document.getElementById('studentName');
  const parentName = document.getElementById('parentName');
  const classApply = document.getElementById('classApply');
  const email = document.getElementById('email');

  const checks = [
    setError(studentName, studentName.value.trim().length < 3),
    setError(parentName, parentName.value.trim().length < 3),
    setError(phoneInput, !/^[6-9]\d{9}$/.test(phoneInput.value.trim())),
    setError(classApply, classApply.value === ''),
    setError(email, email.value.trim() !== '' && !/^\S+@\S+\.\S+$/.test(email.value.trim()))
  ];

  if (checks.includes(false)) {
    successBox.style.display = 'none';
    const firstError = form.querySelector('.form-group.error input, .form-group.error select');
    if (firstError) firstError.focus();
    return;
  }

  // textContent (not innerHTML) keeps user input safe from script injection
  successText.textContent =
    `Thank you, ${parentName.value.trim()}! Enquiry for ${studentName.value.trim()} (${classApply.value}) has been received. We will call you on ${phoneInput.value.trim()} soon.`;
  successBox.style.display = 'block';
  form.reset();
  successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Clear error as the user types / selects
form.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => {
    el.closest('.form-group').classList.remove('error');
    el.removeAttribute('aria-invalid');
  });
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
