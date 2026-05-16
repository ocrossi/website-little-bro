// Scroll fluide pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observer pour les cartes de services et machines
document.querySelectorAll('.service-card, .machine-card').forEach(card => {
    card.classList.add('hidden');
    observer.observe(card);
});

// Charger les services dynamiquement
function renderServices() {
    const container = document.getElementById('services-container');
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="service-icon">${service.icon}</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <span class="service-price">${service.price}</span>
        `;
        container.appendChild(card);
    });
}

// Charger les machines dynamiquement
function renderMachines() {
    const container = document.getElementById('machines-container');
    machines.forEach(machine => {
        const card = document.createElement('div');
        card.className = 'machine-card';
        card.innerHTML = `
            <img src="${machine.image}" alt="${machine.title}">
            <h3>${machine.title}</h3>
            <p>${machine.description}</p>
            <a href="${machine.link}" target="_blank" class="btn-secondary">En savoir plus</a>
        `;
        container.appendChild(card);
    });
}

// Appeler les fonctions au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    renderServices();
    renderMachines();
});
