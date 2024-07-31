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
            <p>$${photographer.price}</p>
            <img src="${photographer.portrait}" alt="${photographer.name}">
        `;

        const mainDiv = document.querySelector('#main');
        const mediaSection = document.createElement('section');
        mediaSection.classList.add('photographer-media');
        media.forEach(m => {
            const mediaItem = document.createElement('div');
            mediaItem.classList.add('media-item');
            mediaItem.innerHTML = `
                <img src="./assets/Sample_Photos/${photographer.name}/${m.image}" alt="${m.title}">
                <h3>${m.title}</h3>
                <p>Likes: ${m.likes}</p>
                <p>Date: ${m.date}</p>
                <p>Price: $${m.price}</p>
            `;
            mediaSection.appendChild(mediaItem);
        });
        mainDiv.appendChild(mediaSection);
    }
}

function displayModal() {
    document.getElementById('contact_modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('contact_modal').style.display = 'none';
}