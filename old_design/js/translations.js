/* ═══════════════════════════════════════════════════════
   TranslationService
   Uses i18next (CDN) + fetch-based JSON loader
   API-ready: swapBackend() lets you point to any REST endpoint
═══════════════════════════════════════════════════════ */

class TranslationService {
  /**
   * @param {Object} options
   * @param {string}   options.defaultLang  - 'fr' | 'en' | 'es'
   * @param {string}   options.localePath   - base path for JSON files
   * @param {string|null} options.apiBase   - if set, fetches from API instead of local files
   */
  constructor({ defaultLang = 'fr', localePath = 'js/locales', apiBase = null } = {}) {
    this.currentLang = defaultLang;
    this.localePath  = localePath;
    this.apiBase     = apiBase;           // e.g. 'https://api.carlitlaser.com/i18n'
    this.cache       = {};                // { fr: {...}, en: {...} }
    this.observers   = [];                // callbacks fired on lang change
    this._i18nReady  = false;
  }

  /* ─── Public API ─────────────────────────────────── */

  /** Initialise i18next then apply to DOM */
  async init() {
    await this._loadLanguage(this.currentLang);
    this._initI18next();
    this._applyToDom();
    this._bindLangButtons();
    this._restoreFromStorage();
  }

  /** Change active language */
  async setLanguage(lang) {
    if (lang === this.currentLang && this._i18nReady) return;
    await this._loadLanguage(lang);
    this.currentLang = lang;
    i18next.changeLanguage(lang, () => {
      this._applyToDom();
      this._updateLangButtons();
      this._notifyObservers(lang);
      localStorage.setItem('clm_lang', lang);
      document.documentElement.lang = lang;
    });
  }

  /** Get a translated string (supports dot notation: 'nav.rdv') */
  t(key, options = {}) {
    return i18next.t(key, options);
  }

  /** Get a nested array (e.g. slides) */
  tArray(key) {
    return i18next.t(key, { returnObjects: true }) || [];
  }

  /** Register a callback fired whenever language changes */
  onChange(callback) {
    this.observers.push(callback);
  }

  /** Point to a live API instead of local JSON (backend-ready hook) */
  swapBackend(apiBase) {
    this.apiBase = apiBase;
    this.cache   = {};           // invalidate cache
  }

  /* ─── Private methods ────────────────────────────── */

  async _loadLanguage(lang) {
    if (this.cache[lang]) return;                 // already loaded

    let data;
    if (this.apiBase) {
      // ── API mode (future backend)
      const res = await fetch(`${this.apiBase}/${lang}`);
      if (!res.ok) throw new Error(`i18n API error for lang: ${lang}`);
      data = await res.json();
    } else {
      // ── Local JSON mode
      const res = await fetch(`${this.localePath}/${lang}.json`);
      if (!res.ok) throw new Error(`Could not load locale: ${lang}.json`);
      data = await res.json();
    }

    this.cache[lang] = data;
  }

  _initI18next() {
    const resources = {};
    Object.entries(this.cache).forEach(([lang, data]) => {
      resources[lang] = { translation: data };
    });

    i18next.init({
      lng:                  this.currentLang,
      fallbackLng:          'fr',
      resources,
      interpolation:        { escapeValue: false },
      returnObjects:        true,
    });

    this._i18nReady = true;
  }

  /** Walk the DOM and replace data-i18n text nodes */
  _applyToDom() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key        = el.getAttribute('data-i18n');
      const translated = i18next.t(key);

      if (typeof translated !== 'string') return;   // skip objects/arrays

      // Preserve child elements (e.g. <strong> inside a <p>)
      if (el.children.length === 0) {
        el.textContent = translated;
      } else {
        // Only replace text nodes, keep child elements intact
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            node.textContent = translated;
          }
        });
      }
    });

    // Handle placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = i18next.t(key);
    });

    // Handle aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', i18next.t(key));
    });
  }

  _bindLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setLanguage(btn.dataset.lang);
      });
    });
  }

  _updateLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
    });
  }

  async _restoreFromStorage() {
    const saved = localStorage.getItem('clm_lang');
    if (saved && saved !== this.currentLang) {
      await this.setLanguage(saved);
    } else {
      this._updateLangButtons();
    }
  }

  _notifyObservers(lang) {
    this.observers.forEach(cb => cb(lang));
  }
}

/* ── Singleton export ──────────────────────────────── */
const translationService = new TranslationService({
  defaultLang: 'fr',
  localePath:  'js/locales',
  apiBase:     null,          // set to your API URL when backend is ready
});

