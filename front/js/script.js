const idItems = document.getElementById("items");
const url = "http://localhost:3000/api/products/";

// Création d'une fonction générique utilisable pour le catalogue et pour n'importe quel élément
let myCreateElement = (element_type, element_parent, attributes) => {
  let element = document.createElement(element_type);
  for (let attribute of attributes) {
    element.setAttribute(attribute.name, attribute.value);
  }
  element_parent.appendChild(element);
  return element;
};

let myTextNode = (text, element_parent) => {
  const textNode = document.createTextNode(text);
  element_parent.appendChild(textNode);
};

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
        // Utilisation de mes fonctions génériques myCreateElement et myTextNode

        // Création du <a href=".product.html?id= id du produit"></a> en tant qu'enfant de la <section class="items" id="items"></section> :
        let productLink = myCreateElement("a", idItems, [
          { name: "href", value: "./product.html?id=" + product._id },
        ]);

        // Création de <article></article> en tant qu'enfant du <a> </a> ci-avant :
        let productArticle = myCreateElement("article", productLink, []);

        // Création de <img src="url de l'image du produit" alt="texte alternatif, nom du canapé"> en tant qu'enfant de <article></article> :
        myCreateElement("img", productArticle, [
          { name: "src", value: product.imageUrl },
          { name: "alt", value: product.altTxt + ", " + product.name },
          { name: "title", value: product.altTxt + ", " + product.name },
        ]);

        // Ajout de <h3 class="productName">Nom du produit</h3> en tant qu'enfant de <article></article> :
        let productName = myCreateElement("h3", productArticle, [
          { name: "class", value: "productName" },
        ]);
        myTextNode(product.name, productName);

        // Ajout de <p class="productDescription">Description du produit</p> en tant qu'enfant de <article></article> :
        let productDescription = myCreateElement("p", productArticle, [
          { name: "class", value: "productDescription" },
        ]);
        myTextNode(product.description, productDescription);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Appel de la fonction getProducts qui permet de générer le catalogue dynamique :
let products = getProducts();
