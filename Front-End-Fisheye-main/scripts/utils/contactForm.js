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