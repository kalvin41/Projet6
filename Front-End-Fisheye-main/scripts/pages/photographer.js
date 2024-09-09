// Variable globale pour stocker les médias du photographe
let photographerMedia = [];
let currentIndex = 0; // Ajoutez cette ligne pour gérer l'index de la galerie

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
    // Ajouter les événements pour la lightbox
    initializeLightboxEvents();  // Ajoutez cette ligne pour initialiser les événements de la lightbox
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
        updatePhotographerInfo(photographer);
    }
}
// Fonction pour mettre à jour les informations du photographe dans la `div`
function updatePhotographerInfo(photographer) {
    const totalLikes = photographerMedia.reduce((acc, media) => acc + media.likes, 0);
    const dailyRate = photographer.price;

    document.getElementById('total-likes').innerHTML = `${totalLikes} <i class="fa-solid fa-heart"></i>`;
    document.getElementById('daily-rate').textContent = `${dailyRate}€/jour`;
}
function updateTotalLikes() {
    const totalLikes = photographerMedia.reduce((acc, media) => acc + media.likes, 0);
    document.getElementById('total-likes').innerHTML = `${totalLikes} <i class="fa-solid fa-heart"></i>`;
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

    if (!mediaSection) {
        mediaSection = document.createElement('section');
        mediaSection.classList.add('photographer-media');
        mainDiv.appendChild(mediaSection);
    }

    mediaSection.innerHTML = '';

    sortedPhotos.forEach((m, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.classList.add('media-item');

        //  ouvrir la lightbox lors du clic sur un média
        mediaItem.addEventListener('click', () => openLightbox(index));

        if (m.image) {
            mediaItem.innerHTML = `
                <a href=""><img src="./assets/Sample_Photos/${m.photographerId}/${m.image}" alt="${m.title}"></a>
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
                <h3 class="media-title">${m.title}</h3>
                 <p>${m.likes} <i class="fa-solid fa-heart like-icon" data-index="${index}"></i></p>
            </div>
        `;
        // Empêcher le comportement par défaut des liens
        const links = mediaItem.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
            });
        });
        
        mediaSection.appendChild(mediaItem);
    });
    // Ajouter l'événement de clic sur les icônes de cœur pour ajouter des likes
    document.querySelectorAll('.like-icon').forEach(icon => {
        icon.addEventListener('click', (event) => {
            event.stopPropagation(); // Empêcher l'événement click de se propager à l'élément parent
            const index = icon.getAttribute('data-index');
            const media = photographerMedia[index];
            
            // Incrémenter le nombre de likes pour ce média
            media.likes += 1;
            
            // Mettre à jour l'affichage du nombre de likes pour ce média
            icon.previousSibling.textContent = media.likes;
            
            // Recalculer le nombre total de likes
            updateTotalLikes();
        });
    });
    
}

function initializeSortEvents() {
    const filterTrigger = document.getElementById('filter-trigger');
    const customOptions = document.getElementById('custom-options');
    let lastSelectedOption = null;

    // Afficher ou cacher les options de tri lorsque l'utilisateur clique sur le trigger
    filterTrigger.addEventListener('click', function (event) {
        event.preventDefault();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Basculer la visibilité du menu déroulant
        customOptions.hidden = isExpanded;
        this.setAttribute('aria-expanded', !isExpanded); // Mettre à jour l'attribut aria-expanded
    });

    // Gérer la sélection du tri
    document.querySelectorAll('#custom-options li').forEach(option => {
        option.addEventListener('click', function (event) {
            event.preventDefault();
            const selectedValue = this.getAttribute('data-value');
            const filterTrigger = document.getElementById('filter-trigger');

            // Mettre à jour uniquement le texte du bouton pour afficher le critère sélectionné
            const triggerText = this.textContent.trim();
            filterTrigger.childNodes[0].textContent = triggerText + ' ';
            filterTrigger.setAttribute('aria-expanded', 'false'); // Réinitialiser aria-expanded
            customOptions.hidden = true; // Cacher les options après sélection

            // Masquer l'option sélectionnée
            this.style.display = 'none';

            // Réafficher la dernière option sélectionnée
            if (lastSelectedOption) {
                lastSelectedOption.style.display = 'block';
            }

            // Mettre à jour la dernière option sélectionnée
            lastSelectedOption = this;

            // Trier les photos en fonction du critère sélectionné
            sortPhotos(selectedValue);
        });
    });

    // Fermer le dropdown si on clique en dehors
    document.addEventListener('click', function (event) {
        if (!filterTrigger.contains(event.target) && !customOptions.contains(event.target)) {
            filterTrigger.setAttribute('aria-expanded', 'false');
            customOptions.hidden = true;
        }
    });
}

document.querySelectorAll('.media-item img, .media-item video').forEach((media, index) => {
    media.addEventListener('click', () => openLightbox(index));
});

function openLightbox(index) {
    currentIndex = index;
    const lightbox = document.getElementById('lightbox');
    const imgElement = document.getElementById('lightbox-img');
    const videoElement = document.getElementById('lightbox-video');
    const titleElement = document.getElementById('lightbox-title');

    const media = photographerMedia[currentIndex];

    if (media.image) {
        imgElement.src = `./assets/Sample_Photos/${media.photographerId}/${media.image}`;
        imgElement.alt = media.title;
        imgElement.classList.remove('hidden');
        videoElement.classList.add('hidden');
    } else if (media.video) {
        videoElement.src = `./assets/Sample_Photos/${media.photographerId}/${media.video}`;
        videoElement.classList.remove('hidden');
        imgElement.classList.add('hidden');
    }

    titleElement.textContent = media.title;
    lightbox.classList.remove('hidden');  // Montre la lightbox
    lightbox.style.display = "flex"; // Ajoutez ceci pour être sûr
}


// Fonction pour fermer la lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden'); // Ajout de la classe `hidden`
    lightbox.style.display = "none"; // Masque avec `display: none`
}

// Fonction pour afficher le média suivant dans la lightbox
function showNextMedia() {
    currentIndex = (currentIndex + 1) % photographerMedia.length;
    openLightbox(currentIndex);
}

// Fonction pour afficher le média précédent dans la lightbox
function showPrevMedia() {
    currentIndex = (currentIndex - 1 + photographerMedia.length) % photographerMedia.length;
    openLightbox(currentIndex);
}

// Fonction pour initialiser les événements de la lightbox
function initializeLightboxEvents() {
    document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-next').addEventListener('click', showNextMedia);
    document.querySelector('.lightbox-prev').addEventListener('click', showPrevMedia);

    document.addEventListener('keydown', function (event) {
        if (!document.getElementById('lightbox').classList.contains('hidden')) {
            if (event.key === 'ArrowRight') {
                showNextMedia();
            } else if (event.key === 'ArrowLeft') {
                showPrevMedia();
            } else if (event.key === 'Escape') {
                closeLightbox();
            }
        }
    });
}
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    
}
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        // Fermer la lightbox si elle est ouverte
        const lightbox = document.getElementById('lightbox');
        if (!lightbox.classList.contains('hidden')) {
            closeLightbox();
            return; // Stop the execution if the lightbox was closed
        }

        // Fermer la modale de contact si elle est ouverte
        const contactModal = document.getElementById('contact_modal');
        if (!contactModal.classList.contains('hidden')) {
            closeModal();
        }
    }
});
