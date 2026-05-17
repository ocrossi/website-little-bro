// Language Manager - Handles language switching and DOM translation
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'fr';
        this.init();
    }

    init() {
        // Update the active button
        this.updateActiveButton();
        // Translate the page on load
        this.translatePage();
        // Set up event listeners
        this.setupEventListeners();
    }

    setLanguage(lang) {
        if (lang && Object.keys(translations).includes(lang)) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.translatePage();
            this.updateActiveButton();
        }
    }

    updateActiveButton() {
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }

    translatePage() {
        const t = translations[this.currentLanguage];

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;

        // Navigation
        document.querySelectorAll('a[href="#prestations"]').forEach(el => {
            el.textContent = t.prestations;
        });
        document.querySelectorAll('a[href="#equipements"]').forEach(el => {
            el.textContent = t.equipements;
        });
        document.querySelectorAll('a[href="#avant-apres"]').forEach(el => {
            el.textContent = t.avantApres;
        });
        document.querySelectorAll('a[href="#tarifs"]').forEach(el => {
            el.textContent = t.tarifs;
        });
        document.querySelectorAll('a[href="#contact"]').forEach(el => {
            if (el.classList.contains('btn-primary')) {
                el.textContent = t.heroButton;
            } else if (!el.classList.contains('btn-cta')) {
                el.textContent = t.contact;
            }
        });

        // CTA Button
        document.querySelectorAll('.btn-cta').forEach(el => {
            el.textContent = t.reservez;
        });

        // Hero Section
        const h1 = document.querySelector('h1');
        if (h1) {
            h1.innerHTML = this.currentLanguage === 'fr' 
                ? `Bienvenue au <span>Centre Carlit Perpignan</span>`
                : this.currentLanguage === 'es'
                ? `Bienvenido al <span>Centro Carlit Perpiñán</span>`
                : `Welcome to <span>Carlit Center Perpignan</span>`;
        }

        document.querySelectorAll('.subtitle').forEach(el => {
            el.textContent = t.heroSubtitle;
        });

        // Prestations Section
        const prestationsTitle = document.querySelector('#prestations h2');
        if (prestationsTitle) {
            prestationsTitle.innerHTML = `${t.prestationsTitle.split(' ')[0]} <span>${t.prestationsTitle.split(' ')[1]}</span>`;
        }

        // Equipements Section
        const equipementsTitle = document.querySelector('#equipements h2');
        if (equipementsTitle) {
            equipementsTitle.innerHTML = `${t.equipementsTitle.split(' ')[0]} <span>${t.equipementsTitle.split(' ')[1]}</span>`;
        }

        // Update equipment names and descriptions
        const equipementCards = document.querySelectorAll('.equipement-card');
        const equipmentNames = [t.laserCO2, t.laserIPL, t.radiofrequence, t.hydrafacial];
        equipementCards.forEach((card, index) => {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('.equipement-text p');
            if (h3) h3.textContent = equipmentNames[index];
            if (p) p.textContent = t.equipementDesc;
        });

        // Avant/Après Section
        const avantApresTitle = document.querySelector('#avant-apres h2');
        if (avantApresTitle) {
            avantApresTitle.innerHTML = `${t.avantApresTitle.split('/')[0]}<span>/${t.avantApresTitle.split('/')[1]}</span>`;
        }

        document.querySelectorAll('#avant-apres .avant-apres-text p').forEach(el => {
            el.textContent = t.avantApresDesc;
        });

        // Tarifs Section
        const tarifsTitle = document.querySelector('#tarifs h2');
        if (tarifsTitle) {
            tarifsTitle.innerHTML = `${t.tarifsTitle.split(' ')[0]} <span>${t.tarifsTitle.split(' ')[1]}</span>`;
        }

        // Update tarif cards
        const tarifCards = document.querySelectorAll('.tarif-card');
        const tarifNames = [t.forfaitDecouverte, t.forfaitStandard, t.forfaitPremium];
        const tarifDescs = [t.forfaitDecouverteDesc, t.forfaitStandardDesc, t.forfaitPremiumDesc];

        tarifCards.forEach((card, index) => {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('.tarif-description p');
            const small = card.querySelector('small');
            const btn = card.querySelector('.btn-primary');

            if (h3) h3.textContent = tarifNames[index];
            if (p) p.textContent = tarifDescs[index];
            if (small) small.textContent = t.seance;
            if (btn) btn.textContent = t.reserver;
        });

        // Contact Section
        const contactTitle = document.querySelector('#contact h2');
        if (contactTitle) {
            contactTitle.innerHTML = `${t.contactTitle.split(' ')[0]} <span>${t.contactTitle.split(' ')[1]}</span>`;
        }

        // Form fields
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.placeholder = t.nom;

        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.placeholder = t.email;

        const phoneInput = document.getElementById('phone');
        if (phoneInput) phoneInput.placeholder = t.telephone;

        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.innerHTML = `
                <option value="" disabled selected>${t.choisirSoin}</option>
                <option value="consultation">${t.consultationBilan}</option>
                <option value="laser-co2">${t.laserCO2Fractionne}</option>
                <option value="laser-ipl">${t.laserIPLVasculaire}</option>
                <option value="tatouage">${t.deTatouageLaser}</option>
                <option value="epilation-laser">${t.laserEpilatoire}</option>
                <option value="epilation-electrique">${t.epilationElectrique}</option>
                <option value="injections">${t.injectionsAntiAge}</option>
                <option value="radiofrequence">${t.radiofrequenceMicroneedling}</option>
                <option value="led">${t.ledPhotomodulation}</option>
                <option value="hydrafacial">${t.hydrafacialService}</option>
                <option value="peelings">${t.peelings}</option>
                <option value="ablations">${t.ablations}</option>
            `;
        }

        const messageInput = document.getElementById('message');
        if (messageInput) messageInput.placeholder = t.message;

        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        if (submitBtn) submitBtn.textContent = t.envoyer;

        // Update contact info labels
        const infoGroups = document.querySelectorAll('.info-group');
        infoGroups.forEach(group => {
            const h3 = group.querySelector('h3');
            if (h3) {
                if (h3.textContent.includes('Coordonnées') || h3.textContent.includes('Información') || h3.textContent.includes('Contact')) {
                    h3.textContent = t.coordonnees;
                    const labels = group.querySelectorAll('strong');
                    if (labels.length >= 4) {
                        labels[0].textContent = t.adresse;
                        labels[1].textContent = t.telephoneLabel;
                        labels[2].textContent = t.emailLabel;
                        labels[3].textContent = t.horaires;
                    }
                    const hoursP = group.querySelectorAll('p')[4];
                    if (hoursP) hoursP.textContent = t.heures;
                } else if (h3.textContent.includes('Réseaux') || h3.textContent.includes('Redes') || h3.textContent.includes('Social')) {
                    h3.textContent = t.reseauxSociaux;
                } else if (h3.textContent.includes('Carte') || h3.textContent.includes('Mapa') || h3.textContent.includes('Map')) {
                    h3.textContent = t.carte;
                }
            }
        });

        // Footer
        const footerLinks = document.querySelectorAll('.footer-links a');
        if (footerLinks.length >= 3) {
            footerLinks[0].textContent = t.mentionsLegales;
            footerLinks[1].textContent = t.cgv;
            footerLinks[2].textContent = t.politiqueConfidentialite;
        }

        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) footerBottom.textContent = t.copyright;
    }

    setupEventListeners() {
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setLanguage(btn.dataset.lang);
            });
        });
    }
}

// Initialize language manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.languageManager = new LanguageManager();
    });
} else {
    window.languageManager = new LanguageManager();
}
