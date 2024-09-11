let photographer; // Déclarez cette variable globalement pour stocker les détails du photographe

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');

    if (photographerId) {
        fetch('./data/photographers.json')
            .then(response => response.json())
            .then(data => {
                photographer = data.photographers.find(p => p.id == photographerId);
                
                displayPhotographerNameInModal(); // Appelez cette fonction pour afficher le nom dans la modale
            });
    }

});

function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";

    // Mettre le focus sur le premier élément focusable de la modale
    const firstFocusableElement = modal.querySelector('input, button, textarea, select'); //  ici l'élément auquel vous voulez mettre le focus
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }
  // Gérer le cycle de tabulation à l'intérieur de la modale
  modal.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
        const focusableElements = modal.querySelectorAll('input, button, textarea, select');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Si Shift est pressé, nous sommes en train de tabuler en arrière
            if (document.activeElement === firstElement) {
                event.preventDefault(); // Empêche l'action par défaut de tabulation
                lastElement.focus(); // Déplace le focus vers le dernier élément
            }
        } else { // Tabulation normale
            if (document.activeElement === lastElement) {
                event.preventDefault(); // Empêche l'action par défaut de tabulation
                firstElement.focus(); // Déplace le focus vers le premier élément
            }
        }
    }
});
}
// Attacher la fonction à l'objet window pour la rendre accessible globalement
window.displayModal = displayModal;
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

//  mettre à jour le bouton de fermeture pour qu'il soit focusable
document.querySelector(".close-lightbox").addEventListener('click', closeModal);
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
