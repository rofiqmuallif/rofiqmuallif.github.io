/* Progressive, dependency-free enhancements for the portfolio. */
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.remove('no-js');

if (!menuButton || !navLinks) {
  throw new Error('Navigation elements not found');
}

// Avoid doing visual work on every browser scroll event.
let scrollTicking = false;
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 15);
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) requestAnimationFrame(updateHeader);
  scrollTicking = true;
}, { passive: true });
updateHeader();

// Keep the mobile navigation state and accessibility state in sync.
menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }
});

// Typing animation. Respect users who ask for reduced motion.
const roles = ['Information Technology Student', 'Software Developer', 'Graphic Designer', 'Content Creator'];
const typed = document.getElementById('typed');
let role = 0, character = 0, deleting = false;
function typeRole() {
  const word = roles[role];
  typed.textContent = deleting ? word.slice(0, --character) : word.slice(0, ++character);
  let delay = deleting ? 34 : 65;
  if (!deleting && character === word.length) { delay = 1500; deleting = true; }
  else if (deleting && character === 0) { deleting = false; role = (role + 1) % roles.length; delay = 280; }
  setTimeout(typeRole, delay);
}
if (!reduceMotion) typeRole();

// Reveal elements and skill meters only when they enter the viewport.
const revealItems = document.querySelectorAll('.reveal');
function showRevealItem(element) {
  element.classList.add('visible', 'active');
  element.querySelectorAll('[data-level]').forEach(bar => bar.style.setProperty('--level', `${bar.dataset.level}%`));
}
function observeReveals() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    showRevealItem(entry.target);
    observer.unobserve(entry.target);
  }), { threshold: 0.16, rootMargin: '0px 0px -40px' });
  revealItems.forEach(element => observer.observe(element));
}
if ('IntersectionObserver' in window && !reduceMotion) observeReveals();
else revealItems.forEach(showRevealItem);

// Animated achievement counters
function observeCounters() {
const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const element = entry.target, target = Number(element.dataset.counter), decimal = element.dataset.decimal === 'true';
  const start = performance.now(), duration = 1500;
  const update = now => {
    const progress = Math.min((now - start) / duration, 1);
    const value = target * (1 - Math.pow(1 - progress, 3));
    element.textContent = decimal ? value.toFixed(target < 10 ? 2 : 1) : Math.floor(value).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = `${decimal ? target : target.toLocaleString()}${element.dataset.suffix || ''}`;
  };
  requestAnimationFrame(update); countObserver.unobserve(element);
}), { threshold: 0.6 });
document.querySelectorAll('[data-counter]').forEach(counter => countObserver.observe(counter));
}
if ('IntersectionObserver' in window && !reduceMotion) observeCounters();
else document.querySelectorAll('[data-counter]').forEach(element => {
  const target = Number(element.dataset.counter);
  element.textContent = `${element.dataset.decimal === 'true' ? target : target.toLocaleString()}${element.dataset.suffix || ''}`;
});

// Current copyright year
document.getElementById('year').textContent = new Date().getFullYear();
