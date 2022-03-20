// Récupération d'un tableau qui contiendra tous les éléments ayant pour class html .deleteItem
let deleteButtonArray = document.getElementsByClassName("deleteItem");

// Récupération d'un tableau qui contiendra tous les éléments ayant pour class html .itemQuantity
let quantityInputArray = document.getElementsByClassName("itemQuantity");


let urlApi = "http://localhost:3000/api/products/";

// Fonction générique qui crée un élément (ex : "div") dans son parent (ex : <article></article>) en lui conférant des attributs (ex : class = "nom_de_classe")
let createElement = (element_type, element_parent, attributes) => {
  let element = document.createElement(element_type);
  for (let attribute of attributes) {
    element.setAttribute(attribute.name, attribute.value);
  }
  element_parent.appendChild(element);
  return element;
};

// Fonction générique qui crée un texte entre les balises de son élément parent (contenu d'une balise <p></p>, <h2></h2> etc) si celui-ci n'existe pas déjà,
// sinon il remplace le texte déjà présent par le nouveau texte (pour éviter d'ajouter des textes en boucle...)
let addTextNode = (text, element_parent) => {
  try {
    element_parent.childNodes[0].nodeValue = text;
  } catch (error) {
    const textNode = document.createTextNode(text);
    element_parent.appendChild(textNode);
  }
};

// Création d'une fonction générique qui, pour n'importe quel élément d'une balise article, récupère les id et couleur de chaque item présent dans l'article
const getArticleDataFromElement = (element) => {
  // Pointe la balise "article" la plus proche de l'élément indiqué (= ancètre "le plus proche" de type article de cet élément)
  let elementArticle = element.closest("article");

  // Récupération des attributs data-id et data-color de la balise "article" pointée ci-avant
  let dataId = elementArticle.getAttribute("data-id");
  let dataColor = elementArticle.getAttribute("data-color");

  // Renvoi de l'objet contenant l'articlé pointé, la data-id et la data-color hors de cette fonction
  return {
    article: elementArticle,
    id: dataId,
    color: dataColor,
  };
};

// Création d'un fonction permettant de calculer la somme des qunatités et des prix de tous les items du cart
const calculTotalQuantityAndPrice = () => {
  // Création d'une variable pour calculer la quantité totale des items présents dans le panier :
  let cartTotalQuantity = 0;

  // Création d'une variable pour calculer la somme à régler
  let cartTotalPrice = 0;

  // Pour chaque item contenu dans le panier :
  for (let quantityInput of quantityInputArray) {

    let elementArticle = quantityInput.closest('article')
    let elementClass = elementArticle.getElementsByClassName('cart__item__content__description')[0]
    console.log(elementClass)
    let price = elementClass.getElementsByTagName('p')[1].text;
    console.log(price)
    // Ajout de la quantité de l'item à la quantité totale actuelle
    cartTotalQuantity += quantityInput.valueAsNumber;

    // Ajout du prix multiplié par la quantité au prix total actuel
    cartTotalPrice += quantityInput.valueAsNumber * parseInt(price);
  }

  // Ajout du nombre total de canapés dans le panier :
  addTextNode(cartTotalQuantity, document.getElementById("totalQuantity"));

  // Ajout du prix total à payer :
  addTextNode(cartTotalPrice, document.getElementById("totalPrice"));
};

const constructArticle = (id, color, quantity) => {
  // Appel des données de l'API fournie :
  fetch(urlApi + id)
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

    .then(function (dataProduct) {
      let name = dataProduct.name;
      let price = dataProduct.price;
      let imageSrc = dataProduct.imageUrl;
      let imageAlt = dataProduct.altTxt;
      let imageTitle = dataProduct.altTxt;
    
      // Création du panier dynamique dans le fichier html, enfant de la section (variable créée ligne 34).
      // NB : les mots précédés de $ correspondent aux variables créées ci-avant.
      // <article class="cart__item" data-id="$id" data-color="$color">
      let cartArticle = createElement("article", section, [
        { name: "class", value: "cart__item" },
        { name: "data-id", value: id },
        { name: "data-color", value: color },
      ]);
    
      //<div class="cart__item__img"></div>, enfant de l'article cartArticle
      let cartDivImg = createElement("div", cartArticle, [
        { name: "class", value: "cart__item__img" },
      ]);
    
      // <img src="$imageSrc" alt="$imageAlt" title="$imageTitle"></img>, enfant de cartDivImg
      createElement("img", cartDivImg, [
        { name: "src", value: imageSrc },
        { name: "alt", value: imageAlt },
        { name: "title", value: imageTitle },
      ]);
    
      //  <div class="cart__item__content"></div>, enfant de l'article cartArticle
      let cartDivItemContent = createElement("div", cartArticle, [
        { name: "class", value: "cart__item__content" },
      ]);
    
      // <div class="cart__item__content__description"></div>, enfant de cartDivItemContent
      let cartDivItemContentDescription = createElement("div", cartDivItemContent, [
        { name: "class", value: "cart__item__content__description" },
      ]);
    
      // <h2>$name</h2>, enfant de cartDivItemContentDescription
      let cartName = createElement("h2", cartDivItemContentDescription, []);
      addTextNode(name, cartName);
    
      // <p>$color</p>, enfant de cartDivItemContentDescription
      let cartColor = createElement("p", cartDivItemContentDescription, []);
      addTextNode(color, cartColor);
    
      // <p>$price €</p>, enfant de cartDivItemContentDescription
      let cartPrice = createElement("p", cartDivItemContentDescription, []);
      addTextNode(price + " €", cartPrice);
    
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
    
      //  <p>Qté : </p>, enfant de cartDivItemContentSettingsQuantity
      let cartQuantity = createElement("p", cartDivItemContentSettingsQuantity, []);
      addTextNode("Qté :", cartQuantity);
    
      // <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="$quantity">, enfant de cartDivItemContentSettingsQuantity
      let cartItemsInput = createElement(
        "input",
        cartDivItemContentSettingsQuantity,
        [
          { name: "type", value: "number" },
          { name: "class", value: "itemQuantity" },
          { name: "name", value: "itemQuantity" },
          { name: "min", value: "1" },
          { name: "max", value: "100" },
          { name: "value", value: quantity },
        ]
      );
    
      // <div class="cart__item__content__settings__delete"></div>, enfant de cartDivItemContentSettings
      let cartDivItemContentSettingsDelete = createElement(
        "div",
        cartDivItemContentSettings,
        [{ name: "class", value: "cart__item__content__settings__delete" }]
      );
    
      // <p class="deleteItem">Supprimer</p>, enfant de cartDivItemContentSettingsDelete (= "bouton" qui servira à supprimer l'item du panier)
      let cartDelete = createElement("p", cartDivItemContentSettingsDelete, [
        { name: "class", value: "deleteItem" },
      ]);
      addTextNode("Supprimer", cartDelete);
    
    })
    .catch(function (error) {
      console.log(error);
    });
};

let section = document.getElementById("cart__items");

// Tableau du contenu du localStorage
let cart = JSON.parse(localStorage.getItem("storage"));

// Pour chaque item contenu dans le panier :
for (let itemInCart of cart) {
  // Récupération des données de l'item stockées dans le tableau "cart"
  let id = itemInCart.id;
  let color = itemInCart.color;
  let quantity = itemInCart.quantity;
  constructArticle(id, color, quantity);

}

// Rappel : "cart" = le panier virtuel, différent du panier visible à l'écran (dans balises <article>), qui correspond à la clé "storage" du localStorage

const addEventListeners = () => {

  // Boucle pour supprimer l'élément <article></article> ainsi que l'item dans le localStorage quand on clique sur "Supprimer"
  for (let deleteButton of deleteButtonArray) {
    deleteButton.addEventListener("click", () => {
      // Utilisation de ma fonction générique getArticleDataFromElement pour récupérer l'id et la color de l'item présent dans <article></article>
      let dataArticle = getArticleDataFromElement(deleteButton);

      // Pour chaque index du tableau cart,
      for (let i in cart) {
        // Si id et color de dataArticle = un item présent dans le localStorage avec ces datas
        if (cart[i].id == dataArticle.id && cart[i].color == dataArticle.color) {
          // => supprimer <article></article> et l'item du cart
          deletedItem = cart.splice(i, 1);
          dataArticle.article.remove();
        }
      }

      // Mise à jour des totaux "quantités" et "prix" après avoir supprimé un item
      calculTotalQuantityAndPrice();

      // MAJ dans le localStorage de la clé storage qui = cart
      localStorage.setItem("storage", JSON.stringify(cart));
    });
  };

  // Boucle pour modifier le contenu du localStorage si l'input "Qté" est modifié par le client
  for (let quantityInput of quantityInputArray) {
    // Fonction qui dit que pour chanque quantité, récupérer les données de l'input "Qté" présentes dans le tableau
    // et modifier la quantité d'items du localStorage pour l'item dont l'id et la couleur de l'item présent dans l'article correspondent à l'item équivalent dans le localStorage
    quantityInput.addEventListener("change", () => {
      // Utilisation de ma fonction générique getArticleDataFromElement pour récupérer l'id et la color de chaque
      let dataArticle = getArticleDataFromElement(quantityInput);
  
      // Pour chaque index du tableau cart,
      for (let i in cart) {
        // Si id et color de dataArticle = un item présent dans le cart avec ces datas
        if (cart[i].id == dataArticle.id && cart[i].color == dataArticle.color) {
          // SUPPRIMER CE IF DU FICHIER DE LA SOUTENANCE, VERIFIE QUE CA FONCTIONNE !
          if (quantityInput.valueAsNumber > parseInt(cart[i].quantity)) {
            console.log("Item ajouté.");
          } else {
            console.log("Item retiré");
          }
          // Mise à jour de la quantité du cart en fonction de ce qui se trouve dans l'input
          cart[i].quantity = quantityInput.value;
        }
      }
  
      // Mise à jour des totaux "quantités" et "prix" après avoir modifier la quantité d'un item
      calculTotalQuantityAndPrice();
  
      // MAJ dans le localStorage de la clé storage qui = cart
      localStorage.setItem("storage", JSON.stringify(cart));
    });
  };
};

setTimeout(()=>{
  addEventListeners();
  calculTotalQuantityAndPrice();
}, 1000)


