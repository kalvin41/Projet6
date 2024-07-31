async function getPhotographers() {
    try {
        // Fetch les données du fichiers json
        const response = await fetch('./data/photographers.json'); // vérifier que le chemin est bien le bon pareil pour les appels dans les balises images src etc...
        // Check si la réponse est ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse les données Json = Convertir une chaîne de texte JSON en un objet JavaScript.
        const data = await response.json();

        // Retourne le tableau des photographes
        return data.photographers;
    } catch (error) {
        console.error("Failed to fetch photographers:", error);

        // Retourne un tableau vide en cas erreur
        return [];
    }
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
    
}

async function init() {
    // Récupère les données des photographes
    const photographers = await getPhotographers();
    displayData(photographers);
}

init();

function photographerTemplate(photographer) { // data-id pour récupérer l'id du photographe avec ? pour inclure l'id dans l'url
    return {
        getUserCardDOM() {
            const div = document.createElement('article');
            div.classList.add('photographer-card');
            div.innerHTML = `
                <a href="photographer.html?id=${photographer.id}"><img src="${photographer.portrait}" alt="${photographer.name}"></a>
                <h2>${photographer.name}</h2>
                <p>${photographer.city}, ${photographer.country}</p>
                <p>${photographer.tagline}</p>
                <p>$${photographer.price}</p>
            `;
            return div;
        }
    };
}
