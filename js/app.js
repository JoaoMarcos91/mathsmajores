import { initI18n, t } from './i18n.js';

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

const form = document.querySelector('#joinForm');
const emailInput = document.querySelector('#emailInput');
const formMessage = document.querySelector('#formMessage');
let formMessageKey = '';

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!emailInput.checkValidity()) {
    formMessageKey = 'join.error';
    formMessage.textContent = t(formMessageKey);
    formMessage.classList.add('error');
    emailInput.focus();
    return;
  }

  formMessageKey = 'join.success';
  formMessage.textContent = t(formMessageKey);
  formMessage.classList.remove('error');
  form.reset();
});

initI18n({
  select: document.querySelector('#languageSelect'),
  onChange: () => {
    if (formMessageKey) {
      formMessage.textContent = t(formMessageKey);
    }
  }
});
