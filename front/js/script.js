const urlAPI = "http://localhost:3000/api";
const urlProducts = `${urlAPI}/products`;
const idItems = document.getElementById("items");

/**
 * Fonction générique qui récupère les données "produits" de l'API
 * @param {String} id
 */

const requestAPIProducts = async (id = "") => {
  let url = "";
  if (id === "") {
    url = urlProducts;
  } else {
    url = `${urlProducts}/${id}`;
  }
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fonction générique qui crée un élément et ses attributs éventuels dans son parent
 * @param {String} elementType
 * @param {Element} elementParent
 * @param {Array} attributes
 * @param {String} textContent
 */

const createElement = (
  elementType,
  elementParent,
  attributes = [],
  textContent = ""
) => {
  let element = document.createElement(elementType);
  for (let attribute of attributes) {
    element.setAttribute(attribute.name, attribute.value);
  }
  elementParent.appendChild(element);
  element.textContent = textContent;
  return element;
};

/**
 * Fonction principale qui permet de générer dynamiquement la page d'accueil depuis les données de l'API
 */

const displayProducts = async () => {
  let products = await requestAPIProducts();

  for (let product of products) {
    // Création du <a href=".product.html?id= id du produit"></a> en tant qu'enfant de la <section class="items" id="items"></section> :
    let productLink = createElement("a", idItems, [
      { name: "href", value: "./product.html?id=" + product._id },
    ]);

    // Création de <article></article> en tant qu'enfant du <a> </a> ci-avant :
    let productArticle = createElement("article", productLink, []);

    // Création de <img src="url de l'image du produit" alt="texte alternatif, nom du canapé"> en tant qu'enfant de <article></article> :
    createElement("img", productArticle, [
      { name: "src", value: product.imageUrl },
      { name: "alt", value: product.altTxt + ", " + product.name },
      { name: "title", value: product.altTxt + ", " + product.name },
    ]);

    // Ajout de <h3 class="productName">Nom du produit</h3> en tant qu'enfant de <article></article> :
    let productName = createElement(
      "h3",
      productArticle,
      [{ name: "class", value: "productName" }],
      product.name
    );

    // Ajout de <p class="productDescription">Description du produit</p> en tant qu'enfant de <article></article> :
    let productDescription = createElement(
      "p",
      productArticle,
      [{ name: "class", value: "productDescription" }],
      product.description
    );
  }
};

displayProducts();
