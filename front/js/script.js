const idItems = document.getElementById("items");
const url = "http://localhost:3000/api/products/";

// Création du catalogue dynamique avec la fonction getProducts :
const getProducts = () => {
  // Appel des données de l'API fournie :
  fetch(url)
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
    .then(function (products) {
      // Boucle qui génère automatiquement et dynamiquement les "boîtes" pour les 8 canapés :
      for (let product of products) {
        // Création du <a href=".product.html?id= id du produit"></a> en tant qu'enfant de la <section class="items" id="items"></section> :
        let productLink = document.createElement("a");
        productLink.setAttribute("href", "./product.html?id=" + product._id);
        idItems.appendChild(productLink);
        // Ajout de <article></article> en tant qu'enfant du <a> </a> ci-avant :
        let productArticle = document.createElement("article");
        productLink.appendChild(productArticle);
        // Ajout de <img src="url de l'image du produit" alt="texte alternatif, nom du canapé"> en tant qu'enfant de <article></article> :
        let productImg = document.createElement("img");
        productImg.setAttribute("src", product.imageUrl);
        productImg.setAttribute("alt", product.altTxt + ", " + product.name);
        productArticle.appendChild(productImg);
        // Ajout de <h3 class="productName">Nom du produit</h3> en tant qu'enfant de <article></article> :
        let productName = document.createElement("H3");
        productName.setAttribute("class", "productName");
        const textH3 = document.createTextNode(product.name);
        productName.appendChild(textH3);
        productArticle.appendChild(productName);
        // Ajout de <p class="productDescription">Description du produit</p> en tant qu'enfant de <article></article> :
        let productDescription = document.createElement("p");
        productDescription.setAttribute("class", "productDescription");
        const textP = document.createTextNode(product.description);
        productDescription.appendChild(textP);
        productArticle.appendChild(productDescription);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Appel de la fonction getProducts qui permet de générer le catalogue dynamique :
let products = getProducts();
