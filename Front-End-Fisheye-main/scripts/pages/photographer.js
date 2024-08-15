// Variable globale pour stocker les médias du photographe
let photographerMedia = [];

// Charger les détails du photographe et ses médias lorsque la page est prête
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');

    if (photographerId) {
        fetch('./data/photographers.json')
            .then(response => response.json())
            .then(data => displayPhotographerDetailsAndMedia(photographerId, data));
    }

    // Ajouter les événements pour le tri
    initializeSortEvents();
});

// Fonction pour afficher les détails du photographe et ses médias
function displayPhotographerDetailsAndMedia(photographerId, data) {
    const photographer = data.photographers.find(p => p.id == photographerId);
    photographerMedia = data.media.filter(m => m.photographerId == photographerId); // Stocker les médias dans la variable globale

    if (photographer) {
        const headerDiv = document.querySelector('.photograph-header');
        headerDiv.innerHTML = `
            <div>
                <h1>${photographer.name}</h1>
                <p class="villes">${photographer.city}, ${photographer.country}</p>
                <p>${photographer.tagline}</p>
            </div>
            <div class="move">
                <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
                <div class="move3">
                    <img src="${photographer.portrait}" alt="${photographer.name}">
                </div>
            </div>
        `;

        // Afficher les médias
        displayPhotos(photographerMedia);
    }
}

// Fonction de tri des photos
function sortPhotos(criteria) {
    let sortedPhotos;

    switch (criteria) {
        case 'popularite':
            sortedPhotos = photographerMedia.sort((a, b) => b.likes - a.likes);
            break;
        case 'date':
            sortedPhotos = photographerMedia.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'titre':
            sortedPhotos = photographerMedia.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

    // Afficher les photos triées
    displayPhotos(sortedPhotos);
}

// Fonction d'affichage des médias
function displayPhotos(sortedPhotos) {
    const mainDiv = document.querySelector('#main');
    let mediaSection = document.querySelector('.photographer-media');

    // Si la section média existe déjà, on la vide pour la mettre à jour
    if (!mediaSection) {
        // Si la section n'existe pas, la créer
        mediaSection = document.createElement('section');
        mediaSection.classList.add('photographer-media');
        mainDiv.appendChild(mediaSection);
    }

    // Vider le contenu précédent
    mediaSection.innerHTML = '';

    // Ajouter les nouveaux médias triés
    sortedPhotos.forEach(m => {
        const mediaItem = document.createElement('div');
        mediaItem.classList.add('media-item');

        if (m.image) {
            mediaItem.innerHTML = `
                <img src="./assets/Sample_Photos/${m.photographerId}/${m.image}" alt="${m.title}">
            `;
        } else if (m.video) {
            mediaItem.innerHTML = `
                <video class="media-video" controls>
                    <source src="./assets/Sample_Photos/${m.photographerId}/${m.video}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        }

        mediaItem.innerHTML += `
            <div class="move2">
                <h3>${m.title}</h3>
                <p>${m.likes} <i class="fa-solid fa-heart"></i></p>
            </div>
        `;

        mediaSection.appendChild(mediaItem);
    });
}

function initializeSortEvents() {
    const filterTrigger = document.getElementById('filter-trigger');
    const customOptions = document.getElementById('custom-options');

    // Afficher ou cacher les options de tri lorsque l'utilisateur clique sur le trigger
    filterTrigger.addEventListener('click', function(event) {
        event.preventDefault();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Basculer la visibilité du menu déroulant
        customOptions.hidden = isExpanded;
        this.setAttribute('aria-expanded', !isExpanded); // Mettre à jour l'attribut aria-expanded
    });

    // Gérer la sélection du tri
    document.querySelectorAll('#custom-options li').forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            const selectedValue = this.getAttribute('data-value');
            const filterTrigger = document.getElementById('filter-trigger');

            // Mettre à jour uniquement le texte du bouton pour afficher le critère sélectionné
            const triggerText = this.textContent.trim();
            filterTrigger.childNodes[0].textContent = triggerText + ' ';
            filterTrigger.setAttribute('aria-expanded', 'false'); // Réinitialiser aria-expanded
            customOptions.hidden = true; // Cacher les options après sélection

            // Trier les photos en fonction du critère sélectionné
            sortPhotos(selectedValue);
        });
    });

    //  fermer le dropdown si on clique en dehors
    document.addEventListener('click', function(event) {
        if (!filterTrigger.contains(event.target) && !customOptions.contains(event.target)) {
            filterTrigger.setAttribute('aria-expanded', 'false');
            customOptions.hidden = true;
        }
    });
}
