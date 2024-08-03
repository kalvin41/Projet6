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
    const media = data.media.filter(m => m.photographerId == photographerId);

    if (photographer) {
        const headerDiv = document.querySelector('.photograph-header');
        headerDiv.innerHTML = `
            <h1>${photographer.name}</h1>
            <p>${photographer.city}, ${photographer.country}</p>
            <p>${photographer.tagline}</p>
            <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
            
            <img src="${photographer.portrait}" alt="${photographer.name}">
            
        `;

        const mainDiv = document.querySelector('#main');
        const mediaSection = document.createElement('section');
        mediaSection.classList.add('photographer-media');
        media.forEach(m => {
            const mediaItem = document.createElement('div');
            mediaItem.classList.add('media-item');

            if (m.image) {
                mediaItem.innerHTML = `
                    <img src="./assets/Sample_Photos/${photographer.name}/${m.image}" alt="${m.title}">
                `;
            } else if (m.video) { // ON vérifie si c'est une image ou une vidéo
                mediaItem.innerHTML = `
                    <video class="media-video" controls>
                        <source src="./assets/Sample_Photos/${photographer.name}/${m.video}" type="video/mp4"> 
                        Your browser does not support the video tag.
                    </video>
                `;
            }

            mediaItem.innerHTML += `
                <h3>${m.title}</h3>
                <p>Likes: ${m.likes}</p>
                
            `;
            mediaSection.appendChild(mediaItem);
        });
        mainDiv.appendChild(mediaSection);
    }
}

function filterMedia() {
    const filterValue = document.getElementById('filter').value;
    const mediaItems = document.querySelectorAll('.media-item');

    mediaItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

