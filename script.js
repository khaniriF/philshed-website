// ===== Philshed Learning Center: small, dependency-free script =====

// 1. Mobile menu: show/hide the nav list when the Menu button is tapped
const btn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open); // tells screen readers the state
  });
}

// 2. Footer year updates itself every January
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// 3. Fade sections in as they scroll into view.
// IntersectionObserver is a browser feature that tells us when an element becomes visible.
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('show')); // old browsers: just show everything
}

// 4. Contact form: sends the message through Web3Forms
const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // stop the page from reloading
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending...';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      const result = await response.json();
      if (result.success) {
        status.textContent = 'Thank you! We have received your message and will reply soon.';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please try again or call us.';
      }
    } catch (error) {
      status.textContent = 'No internet connection. Please try again.';
    }
    button.disabled = false;
    button.textContent = 'Send message';
  });
}

