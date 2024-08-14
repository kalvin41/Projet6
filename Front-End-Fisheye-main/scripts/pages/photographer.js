// Variable globale pour stocker les médias du photographe
let photographerMedia = [];
//Mettre le code JavaScript lié à la page photographer.html
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');
    if (photographerId) {
        fetch('./data/photographers.json')
            .then(response => response.json())
            .then(data => displayPhotographerDetailsAndMedia(photographerId, data));
    }
});

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
// Fonction de tri
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

    // Appeler une fonction pour afficher les photos triées
    displayPhotos(sortedPhotos);
}

// Fonction d'affichage des médias
function displayPhotos(sortedPhotos) {
    const mainDiv = document.querySelector('#main');
    const mediaSection = document.querySelector('.photographer-media');

    // Si la section média existe déjà, on la vide pour la mettre à jour
    if (mediaSection) {
        mediaSection.innerHTML = '';
    } else {
        // Sinon, on la crée
        const newMediaSection = document.createElement('section');
        newMediaSection.classList.add('photographer-media');
        mainDiv.appendChild(newMediaSection);
    }

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

        document.querySelector('.photographer-media').appendChild(mediaItem);
    });
}

// Gestion de la sélection du menu déroulant
document.getElementById('custom-select').addEventListener('click', function() {
    const optionsList = document.getElementById('custom-options');
    const expanded = optionsList.getAttribute('hidden') === null;

    optionsList.toggleAttribute('hidden', expanded);
    this.setAttribute('aria-expanded', !expanded);
});

// Sélection et tri
document.querySelectorAll('#custom-options li').forEach(option => {
    option.addEventListener('click', function() {
        const sortBy = this.getAttribute('data-value');
        sortPhotos(sortBy);

        // Mettre à jour le bouton avec le texte sélectionné
        const button = document.getElementById('custom-select');
        button.innerHTML = `${this.innerText} <i class="fa-solid fa-angle-down arrow"></i>`;

        // Cacher les options après sélection
        document.getElementById('custom-options').setAttribute('hidden', true);
        button.setAttribute('aria-expanded', false);
    });
});
