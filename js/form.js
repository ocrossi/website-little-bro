document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const phone = form.querySelector('#phone').value;
        const service = form.querySelector('#service').value;
        const message = form.querySelector('#message').value;

        if (!name || !email || !service || !message) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Exemple avec Formspree (à remplacer par ton backend)
        const formData = new FormData(form);
        fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Message envoyé avec succès !');
                form.reset();
            } else {
                alert('Erreur lors de l\'envoi du message.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erreur lors de l\'envoi du message.');
        });
    });
});
