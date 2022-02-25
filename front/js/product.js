// Récupérer l'url de la page en cours :
let urlProduct = document.location.href;
// Récupérer l'id de la page en cours :
let url = new URL(urlProduct);
let id = url.searchParams.get("id");
// Créer une constante appelant l'API en la liant à l'id récupérée :
const urlApi = "http://localhost:3000/api/products/" + id;

const addToCart = document.querySelector("button");
let cartStorage = [];

// Ajouter le logo de Kanap à la <div class="item__img"></div>
let classImg = document.querySelector(".item__img");
let logo = document.createElement("img");
logo.setAttribute("src", "../images/logo.png");
logo.setAttribute("alt", "Photographie d'un canapé");
classImg.appendChild(logo);

const detailProduct = () => {
  // Appel des données de l'API fournie :
  fetch(urlApi)
    // Vérification que la requête fonctionne :
    .then(function (res) {
      if (!res.ok) {
        // Si la requête ne fonctionne pas, la console envoie l'erreur suivante :
        console.error("HTTP error " + response.status);
      }
      // Si la requête fonctionne, elle renvoie le fichier .json
      return res.json();
    })
    // Utilisation du fichier .json précédemment obtenu :
    .then(function (product) {
      // Changer le title de la page par le nom du produit sélectionné
      document.title = product.name;
      // Ajouter le nom du produit dans <h1 id="title"></h1>
      const idTitle = document.getElementById("title");
      const productName = document.createTextNode(product.name);
      idTitle.appendChild(productName);
      // Ajouter le prix dans <span id="price"></span>
      const idPrice = document.getElementById("price");
      const productPrice = document.createTextNode(product.price);
      idPrice.appendChild(productPrice);
      // Ajouter la description dans <p id="description"></p>
      const idDescription = document.getElementById("description");
      const productDescription = document.createTextNode(product.description);
      idDescription.appendChild(productDescription);
      // Ajouter les options de couleurs dans <select name="color-select" id="colors"></select>
      for (let color of product.colors) {
        const idColors = document.getElementById("colors");
        let option = document.createElement("option");
        option.setAttribute("value", color);
        const colorName = document.createTextNode(color);
        option.appendChild(colorName);
        idColors.appendChild(option);
        // Stocker les données dans le localStorage au clic :
      }
      addToCart.addEventListener("click", () => {
        // Récupérer la quantité de canapés sélectionnés :
        const selectQuantity = document.getElementById("quantity").value;
        const selectColor = document.getElementById("colors").value;
        let storageArray = [id, selectQuantity, selectColor];
        cartStorage.push(storageArray);
        console.log(storageArray);
        localStorage.setItem("storage", JSON.stringify(cartStorage));
        // Voir avec Benjy pour que ça sauvegarde d'une page product à une autre
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Appel de la fonction detailProducts qui permet de générer une fiche produit dynamique :
let products = detailProduct();
