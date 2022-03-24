const urlPage = document.location.href;
const url = new URL(urlPage);
const id = url.searchParams.get("id");
const urlProducts = "http://localhost:3000/api/products";
const addToCartButton = document.querySelector("button");
const itemImgDiv = document.querySelector(".item__img");
const itemContentDiv = document.querySelector(".item__content");

let totalQuantity = 0;
let h2Button;
let pButton;

/**
 * Fonction générique de type asynchrone qui récupère les données "produits" de l'API
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
 * Fonction générique qui récupère un élément grâce à son id et ajoute du texte à cet élément
 * @param {String} idName
 * @param {String} text
 */
let addTextToId = (idName, textContent) => {
  const idElement = document.getElementById(idName);
  idElement.textContent = textContent;
};

/**
 * Fonction qui affiche les informations du produit sur la page
 */
const displayProductInfo = async () => {
  let product = await requestAPIProducts(id);

  document.title = product.name;

  // Utilisation des fonctions génériques createElement et addTextToId pour créer l'image et ajouter les nom, prix et description du produit :
  // Création de <img src="url de l'image du produit" alt="texte alternatif, nom du canapé"> en tant qu'enfant de <div class="item__img"></div> :
  createElement("img", itemImgDiv, [
    { name: "src", value: product.imageUrl },
    { name: "alt", value: product.altTxt + ", " + product.name },
    { name: "title", value: product.altTxt + ", " + product.name },
  ]);

  // Ajout du nom dans <h1 id="title"></h1>, du prix dans <span id="price"></span> et de la description dans <p id="description"></p>
  addTextToId("title", product.name);
  addTextToId("price", product.price);
  addTextToId("description", product.description);

  // Ajout des options de couleur dans le sélecteur :
  const selectColors = document.getElementById("colors");
  for (let color of product.colors) {
    createElement(
      "option",
      selectColors,
      [{ name: "value", value: color }],
      color
    );
  }

  // Ajout d'un paragraphe qui servira à confirmer que le(s) produit(s) ont été ajoutés au panier après avoir cliqué sur le bouton "Ajouter au panier"
  pAdded = createElement("p", itemContentDiv);
};

/**
 * Fonction qui récupère les données depuis le localStorage
 * @return {Array}
 */
const getLocalStorage = () => {
  let array;
  if (localStorage.getItem("cart") == null) {
    array = [];
  } else {
    array = JSON.parse(localStorage.getItem("cart"));
  }
  return array;
};

/**
 * Fonction générique qui récupère l'index d'un produit dans le localStorage
 * @param {String} productId
 * @param {String} productColor
 * @return {Number}
 */
const getProductIndex = (productId, productColor) => {
  let localCart = getLocalStorage();
  for (let index in localCart) {
    if (
      localCart[index].id == productId &&
      localCart[index].color == productColor
    ) {
      return index;
    }
  }
  return -1;
};

/**
 * Fonction générique qui ajoute un produit dans le localStorage s'il n'existe pas
 * @param {String} productId
 * @param {String} productColor
 * @param {Number} productQuantity
 */
const addProductInCart = (productId, productColor, productQuantity) => {
  let localCart = getLocalStorage();
  let product = {
    id: productId,
    color: productColor,
    quantity: parseInt(productQuantity),
  };
  localCart.push(product);
  localStorage.setItem("cart", JSON.stringify(localCart));
};

/**
 * Fonction qui modifie un produit dans le localStorage s'il existe déjà
 * @param {Number} productIndex
 * @param {Number} productQuantity
 */
const modifyProductInCart = (productIndex, productQuantity) => {
  let localCart = getLocalStorage();
  localCart[productIndex].quantity =
    parseInt(localCart[productIndex].quantity) + parseInt(productQuantity);
  localStorage.setItem("cart", JSON.stringify(localCart));
};

/**
 * Fonction qui informe l'utilisateur du ou des produits ajouté(s) au panier
 * @param {String} productName
 * @param {String} productColor
 * @param {Number} productQuantity
 */
const displayInformUser = (productQuantity, productName, productColor) => {
  pAdded.textContent = `Vous avez ajouté ${productQuantity} ${productName} de couleur ${productColor} dans le panier.`;
};

displayProductInfo();

addToCartButton.addEventListener("click", () => {
  const selectedColor = document.getElementById("colors").value;
  const selectedQuantity = document.getElementById("quantity").value;
  const selectedName = document.getElementById("title").textContent;

  let selectedIndex = getProductIndex(id, selectedColor);

  if (selectedColor != "" && selectedQuantity > 0) {
    if (selectedIndex == -1) {
      addProductInCart(id, selectedColor, selectedQuantity);
    } else {
      modifyProductInCart(selectedIndex, selectedQuantity);
    }
    displayInformUser(selectedQuantity, selectedName, selectedColor);
  } else {
    console.error("Aucun produit sélectionné.");
  }
});
