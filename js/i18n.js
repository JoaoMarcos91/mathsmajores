import en from '../translations/en.js';
import pt from '../translations/pt.js';
import fr from '../translations/fr.js';

const dictionaries = { en, pt, fr };
const supportedLanguages = Object.keys(dictionaries);

let activeLanguage = 'en';

function getStoredLanguage() {
  try {
    return localStorage.getItem('maths-majores-language');
  } catch {
    return null;
  }
}

function storeLanguage(language) {
  try {
    localStorage.setItem('maths-majores-language', language);
  } catch {}
}

function detectLanguage() {
  const stored = getStoredLanguage();
  if (supportedLanguages.includes(stored)) {
    return stored;
  }

  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const match = browserLanguages
    .map((language) => language?.toLowerCase().split('-')[0])
    .find((language) => supportedLanguages.includes(language));

  return match || 'en';
}

function resolveKey(key) {
  return key.split('.').reduce((value, part) => value?.[part], dictionaries[activeLanguage]);
}

export function t(key) {
  return resolveKey(key) ?? key;
}

function applyTextTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
}

function applyAttributeTranslations() {
  document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
    element.dataset.i18nAttr.split(';').forEach((entry) => {
      const [attribute, key] = entry.split(':');
      if (attribute && key) {
        element.setAttribute(attribute, t(key));
      }
    });
  });
}

function formatPrices() {
  const pricing = dictionaries[activeLanguage].pricing;
  const formatter = new Intl.NumberFormat(pricing.locale, {
    style: 'currency',
    currency: pricing.currency,
    maximumFractionDigits: pricing.currency === 'BRL' ? 0 : 2
  });

  document.querySelectorAll('[data-price]').forEach((element) => {
    const plan = element.dataset.price;
    element.textContent = formatter.format(pricing[plan]);
  });
}

function applyLanguage(language) {
  activeLanguage = supportedLanguages.includes(language) ? language : 'en';
  document.documentElement.lang = activeLanguage === 'pt' ? 'pt-BR' : activeLanguage;
  document.title = t('meta.title');
  applyTextTranslations();
  applyAttributeTranslations();
  formatPrices();
  storeLanguage(activeLanguage);
}

export function initI18n({ select, onChange } = {}) {
  applyLanguage(detectLanguage());

  if (select) {
    select.value = activeLanguage;
    select.addEventListener('change', () => {
      applyLanguage(select.value);
      onChange?.(activeLanguage);
    });
  }
}
