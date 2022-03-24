const urlProducts = "http://localhost:3000/api/products";
const urlOrder = `${urlProducts}/order`;
const section = document.getElementById("cart__items");
const nameRegex = /[\d²&~"#{([|`_\\\^@)\]=}$£¤%*µ!§:\/;.,?<>+]/g;
const addressRegex = /[²&~"#{([|`_\\\^@)\]=}$£¤%*µ!§:\/;.?<>+]/g;
const mailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,6}$/;

let totalQuantityElement = document.getElementById("totalQuantity");
let totalPriceElement = document.getElementById("totalPrice");
let deleteButtonArray = document.getElementsByClassName("deleteItem");
let quantityInputArray = document.getElementsByClassName("itemQuantity");
let firstNameError = document.getElementById("firstNameErrorMsg");
let lastNameError = document.getElementById("lastNameErrorMsg");
let addressError = document.getElementById("addressErrorMsg");
let cityError = document.getElementById("cityErrorMsg");
let emailError = document.getElementById("emailErrorMsg");
let orderButton = document.getElementById("order");

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
 * Fonction qui récupère l'index d'un produit dans le localStorage
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
 * Fonction permettant de trier les données du tableau par leurs id
 * @param {Array} array
 */
const sortArrayById = (array) => {
  let sortedArray = array.sort((a, b) => {
    return a.id.localeCompare(b.id);
  });
  return sortedArray;
};

/**
 *  Fonction générique qui, pour n'importe quel élément d'une balise article, récupère les id et couleur de chaque item présent dans cet élément
 * @param {Element} element
 * @return {Object}
 */
const getProductDataFromElement = (element) => {
  let elementArticle = element.closest("article");
  let dataId = elementArticle.getAttribute("data-id");
  let dataColor = elementArticle.getAttribute("data-color");
  return {
    article: elementArticle,
    id: dataId,
    color: dataColor,
  };
};

/**
 * Fonction qui permet de calculer le nombre total de produits dans le panier ainsi que le prix total du panier
 */
const calcTotalQuantityAndPrice = async () => {
  let localCart = getLocalStorage();
  let totalQuantity = 0;
  let totalPrice = 0;
  for (let product of localCart) {
    let productQuantity = product.quantity;
    let productId = product.id;
    let productDataAPI = await requestAPIProducts(productId);
    let productPrice = productDataAPI.price;
    totalQuantity = totalQuantity + parseInt(productQuantity);
    totalPrice =
      totalPrice + parseInt(productPrice) * parseInt(productQuantity);
  }
  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalPrice;
};

/**
 * Fonction générique qui modifie la quantité d'un produit dans le localStorage
 * @param {Element} quantityInput
 */
const modifyProductQuantitytInCart = (quantityInput) => {
  let localCart = getLocalStorage();
  let dataArticle = getProductDataFromElement(quantityInput);
  let productId = dataArticle.id;
  let productColor = dataArticle.color;
  let selectedIndex = getProductIndex(productId, productColor);
  localCart[selectedIndex].quantity = parseInt(quantityInput.value);
  localStorage.setItem("cart", JSON.stringify(localCart));
  calcTotalQuantityAndPrice();
};

/**
 * Fonction générique qui supprime un produit dans le localStorage et de la page
 * @param {Element} deleteButton
 */
const deleteProductInCart = (deleteButton) => {
  let localCart = getLocalStorage();
  let dataArticle = getProductDataFromElement(deleteButton);
  let productId = dataArticle.id;
  let productColor = dataArticle.color;
  let selectedIndex = getProductIndex(productId, productColor);
  if (selectedIndex != -1) {
    localCart.splice(selectedIndex, 1);
    localStorage.setItem("cart", JSON.stringify(localCart));
    dataArticle.article.remove();
  }
  calcTotalQuantityAndPrice();
};

/**
 * Fonction principale qui affiche le panier à partir des produits contenus dans le localStorage et des données de l'API, par ordre d'Id
 */
const displayCartProducts = async () => {
  let localCart = sortArrayById(getLocalStorage());
  for (let product of localCart) {
    let productId = product.id;
    let productColor = product.color;
    let productQuantity = product.quantity;
    let productDataAPI = await requestAPIProducts(productId);
    let productPrice = productDataAPI.price;
    let productName = productDataAPI.name;
    let productImgUrl = productDataAPI.imageUrl;
    let productAltText = productDataAPI.altTxt;

    // Création du panier dynamique dans le fichier html :

    // <article class="cart__item" data-id="productId" data-color="productColor">, enfant de la section ayant pour id="cart__items" (variable déclarée ligne 3)
    let cartArticle = createElement("article", section, [
      { name: "class", value: "cart__item" },
      { name: "data-id", value: productId },
      { name: "data-color", value: productColor },
    ]);

    // <div class="cart__item__img"></div>, enfant de l'article cartArticle
    let cartDivImg = createElement("div", cartArticle, [
      { name: "class", value: "cart__item__img" },
    ]);

    // <img src="productImgUrl" alt="productAltText" title="productAltText">, enfant de cartDivImg
    createElement("img", cartDivImg, [
      { name: "src", value: productImgUrl },
      { name: "alt", value: productAltText },
      { name: "title", value: productAltText },
    ]);

    //  <div class="cart__item__content"></div>, enfant de l'article cartArticle
    let cartDivItemContent = createElement("div", cartArticle, [
      { name: "class", value: "cart__item__content" },
    ]);

    // <div class="cart__item__content__description"></div>, enfant de cartDivItemContent
    let cartDivItemContentDescription = createElement(
      "div",
      cartDivItemContent,
      [{ name: "class", value: "cart__item__content__description" }]
    );

    // <h2>productName</h2>, enfant de cartDivItemContentDescription
    createElement("h2", cartDivItemContentDescription, [], productName);

    // <p>productColor</p>, enfant de cartDivItemContentDescription
    createElement("p", cartDivItemContentDescription, [], productColor);

    // <p>productPrice €</p>, enfant de cartDivItemContentDescription
    createElement("p", cartDivItemContentDescription, [], `${productPrice} €`);

    //  <div class="cart__item__content__settings"></div>, enfant de cartDivItemContent
    let cartDivItemContentSettings = createElement("div", cartDivItemContent, [
      { name: "class", value: "cart__item__content__settings" },
    ]);

    //  <div class="cart__item__content__settings__quantity"></div>, enfant de cartDivItemContentSettings
    let cartDivItemContentSettingsQuantity = createElement(
      "div",
      cartDivItemContentSettings,
      [{ name: "class", value: "cart__item__content__settings__quantity" }]
    );

    //  <p>Qté :</p>, enfant de cartDivItemContentSettingsQuantity
    createElement("p", cartDivItemContentSettingsQuantity, [], "Qté :");

    // <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="productQuantity">, enfant de cartDivItemContentSettingsQuantity
    createElement("input", cartDivItemContentSettingsQuantity, [
      { name: "type", value: "number" },
      { name: "class", value: "itemQuantity" },
      { name: "name", value: "itemQuantity" },
      { name: "min", value: "1" },
      { name: "max", value: "100" },
      { name: "value", value: productQuantity },
    ]);

    // <div class="cart__item__content__settings__delete"></div>, enfant de cartDivItemContentSettings
    let cartDivItemContentSettingsDelete = createElement(
      "div",
      cartDivItemContentSettings,
      [{ name: "class", value: "cart__item__content__settings__delete" }]
    );

    // <p class="deleteItem">Supprimer</p>, enfant de cartDivItemContentSettingsDelete (= "bouton" qui servira à supprimer l'item du panier)
    createElement(
      "p",
      cartDivItemContentSettingsDelete,
      [{ name: "class", value: "deleteItem" }],
      "Supprimer"
    );
  }
  calcTotalQuantityAndPrice();
};

/**
 * Fonction qui ajoute des event listeners sur les boutons supprimer et inputs "Qté"
 */
const addEventListeners = () => {
  for (let deleteButton of deleteButtonArray) {
    deleteButton.addEventListener("click", () => {
      deleteProductInCart(deleteButton);
    });
  }
  for (let quantityInput of quantityInputArray) {
    quantityInput.addEventListener("change", () => {
      modifyProductQuantitytInCart(quantityInput);
    });
  }
};

// Permet que la modification et la suppression d'article dans le panier soient prises en compte malgré le délai lié aux fonctions asynchrones.
setTimeout(() => {
  addEventListeners();
}, 1000);

// Ajout de placeholder sur chaque input du formulaire
firstName.setAttribute("placeholder", "Prénom");
lastName.setAttribute("placeholder", "Nom");
address.setAttribute("placeholder", "Adresse");
city.setAttribute("placeholder", "Ville");
email.setAttribute("placeholder", "Ex : votreadressemail@gmail.com");

/**
 * Fonction qui récupère les infos que l'utilisateur entre dans le formulaire
 * @returns
 */
const getUserInfos = () => {
  const urlPage = document.location.href;
  const arrayUrl = urlPage.split("?");
  if (arrayUrl.length !== 1) {
    const url = new URL(urlPage);
    const datas = {
      firstName: [url.searchParams.get("firstName"), firstNameError, "Prénom"],
      lastName: [url.searchParams.get("lastName"), lastNameError, "Nom"],
      address: [url.searchParams.get("address"), addressError, "Adresse"],
      city: [url.searchParams.get("city"), cityError, "Ville"],
      email: [url.searchParams.get("email"), emailError, "Email"],
    };
    return datas;
  } else {
    return {};
  }
};

/**
 * Fonction qui valide le format des nom et prénom entrés par l'utilisateur
 * @param {Array} dataInfo
 * @returns
 */
const validateDataInfo = (dataInfo) => {
  let isDataInfoOk;
  if (nameRegex.test(dataInfo[0]) == false) {
    isDataInfoOk = true;
  } else {
    isDataInfoOk = false;
    dataInfo[1].textContent = `${dataInfo[2]} invalide.`;
  }
  return isDataInfoOk;
};

/**
 * Fonction qui valide le format de l'adresse entrée par l'utilisateur
 * @param {Object} dataUser
 * @returns
 */
const validateAddress = (dataUser) => {
  let isAddressOk;
  if (addressRegex.test(dataUser.address[0]) == false) {
    isAddressOk = true;
  } else {
    isAddressOk = false;
    dataUser.address[1].textContent = `${dataUser.address[2]} invalide.`;
  }
  return isAddressOk;
};

/**
 * Fonction qui valide le format du mail entré par l'utilisateur
 * @param {Object} dataUser
 * @returns
 */
const validateMail = (dataUser) => {
  let isMailOk;
  if (mailRegex.test(dataUser.email[0]) == true) {
    isMailOk = true;
  } else {
    isMailOk = false;
    dataUser.email[1].textContent = `${dataUser.email[2]} invalide.`;
  }
  return isMailOk;
};

/**
 * Fonction qui valide le formulaire, si le format de chaque donnée entrée par l'utilisateur est validé.
 * @param {Object} dataUser
 * @returns
 */
const validateForm = (dataUser) => {
  let isFormOk;
  let isFirstNameOk = validateDataInfo(dataUser.firstName);
  let isLastNameOk = validateDataInfo(dataUser.lastName);
  let isAddressOk = validateAddress(dataUser);
  let isCityOk = validateDataInfo(dataUser.city);
  let isMailOk = validateMail(dataUser);
  if (isFirstNameOk && isLastNameOk && isAddressOk && isCityOk && isMailOk) {
    isFormOk = true;
  } else {
    isFormOk = false;
  }
  return isFormOk;
};

/**
 * Création d'un tableau contenant l'id des produits
 * @returns
 */
const getProductIdsArray = () => {
  let localCart = sortArrayById(getLocalStorage());
  let productIdsArray = [];
  for (let product of localCart) {
    let productId = product.id;
    productIdsArray.push(productId);
  }
  return productIdsArray;
};

/**
 * Fonction qui génère le body de la requête post
 * @param {Object} dataUser
 * @returns
 */
const getRequestBody = (dataUser) => {
  // Création Objet contact
  const contactObject = {
    firstName: dataUser.firstName[0],
    lastName: dataUser.lastName[0],
    address: dataUser.address[0],
    city: dataUser.city[0],
    email: dataUser.email[0],
  };
  const productIdsArray = getProductIdsArray();
  const body = {
    contact: contactObject,
    products: productIdsArray,
  };
  return body;
};

/**
 * Fonction qui envoie les données de commande à l'api et redirige vers la page commande
 * @param {Object} dataUser
 */
const sendOrderData = async (dataUser) => {
  let data;
  if (dataUser != {}) {
    if (validateForm(dataUser)) {
      let response = await fetch(urlOrder, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getRequestBody(dataUser)),
      });
      data = await response.json();
      document.location.href = `./confirmation.html?orderId=${data.orderId}`;
    } else {
      firstName.value = dataUser.firstName[0];
      lastName.value = dataUser.lastName[0];
      address.value = dataUser.address[0];
      city.value = dataUser.city[0];
      email.value = dataUser.email[0];
    }
  }
};

displayCartProducts();
const dataUser = getUserInfos();
sendOrderData(dataUser);
