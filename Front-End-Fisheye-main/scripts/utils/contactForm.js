let photographer; // Déclarez cette variable globalement pour stocker les détails du photographe

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');

    if (photographerId) {
        fetch('./data/photographers.json')
            .then(response => response.json())
            .then(data => {
                photographer = data.photographers.find(p => p.id == photographerId);
                displayPhotographerDetailsAndMedia(photographerId, data);
                displayPhotographerNameInModal(); // Appelez cette fonction pour afficher le nom dans la modale
            });
    }

});
function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    
}
// Gestionnaire de soumission du formulaire
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche l'envoi du formulaire

    // Récupère les valeurs des champs du formulaire
    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Affiche les valeurs dans la console
    console.log("Prénom:", firstName);
    console.log("Nom:", lastName);
    console.log("Email:", email);
    console.log("Message:", message);
    // Réinitialise le formulaire
    event.target.reset();
    // Ferme la modale
    closeModal();
  });
  function displayPhotographerNameInModal() {
    if (photographer && photographer.name) {
        const contactez = document.getElementById("contactez");
        contactez.innerHTML = `Contactez-moi ${photographer.name}`;
    } else {
        console.error("Le nom du photographe n'a pas pu être récupéré.");
    }
}