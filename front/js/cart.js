const urlAPI = "http://localhost:3000/api";
const urlProducts = `${urlAPI}/products`;
const section = document.getElementById("cart__items");

let totalQuantityElement = document.getElementById("totalQuantity");
let totalPriceElement = document.getElementById("totalPrice");
let deleteButtonArray = document.getElementsByClassName("deleteItem");
let quantityInputArray = document.getElementsByClassName("itemQuantity");


/**
 * Fonction qui récupère les données depuis le localStorage
 * @return {Array}
 */

 const getLocalStorage = () => {
    let array;
    if (localStorage.getItem("cart") == null) {
        array = []
    } else {
        array = JSON.parse(localStorage.getItem("cart"));
    }
    return array
 }

/**
 * Fonction générique qui récupère les données "produits" de l'API
 * @param {String} id
 */

 const requestAPIProducts = async (id="") => {
    let url = "";
    if (id==="") { 
        url = urlProducts;
    } else {
        url = `${urlProducts}/${id}`
    }
    try {
        let response = await fetch(url)
        let data = await response.json()
        return data
    } catch (error) {
        console.log(error);
    }
}

/** 
 * Fonction générique qui crée un élément et ses attributs éventuels dans son parent
 * @param {String} elementType
 * @param {Element} elementParent
 * @param {Array} attributes
 * @param {String} textContent
 */

 const createElement = (elementType, elementParent, attributes=[], textContent="") => {
    let element = document.createElement(elementType);
    for (let attribute of attributes) {
      element.setAttribute(attribute.name, attribute.value);
    }
    elementParent.appendChild(element);
    element.textContent = textContent;
    return element;
  };

/**
 * Fonction qui récupère l'index d'un produit dans le localStorage
 * @param {String} productId
 * @param {String} productColor
 * @return {Number}
 */

 const getProductIndex = (productId, productColor) => {
    let localCart = getLocalStorage()
    for (let index in localCart) {
        if (localCart[index].id == productId && localCart[index].color == productColor) {
            return index
        }
    }
    return -1 
 }
 
/**
 * Fonction permettant de trier les données du tableau par leurs id
 * @param {Array} array 
 */

const sortArrayById = (array) => {
    let sortedArray = array.sort((a, b) => {
        return a.id.localeCompare(b.id);
    });
    return sortedArray;
}

/**
 *  Fonction générique qui, pour n'importe quel élément d'une balise article, récupère les id et couleur de chaque item présent dans l'article
 * @param {Element} element 
 * @return {Object}
 */

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
  
/**
 * Fonction générique qui modifie la quantité d'un produit dans le localStorage
 * @param {Element} quantityInput
 */

 const modifyProductQuantitytInCart = (quantityInput) => {
    let localCart = getLocalStorage()
    let dataArticle = getArticleDataFromElement(quantityInput);
    let productId = dataArticle.id
    let productColor = dataArticle.color    
    let selectedIndex = getProductIndex(productId, productColor)
    localCart[selectedIndex].quantity = parseInt(quantityInput.value)
    localStorage.setItem("cart", JSON.stringify(localCart));
    calcTotalQuantityAndPrice()
}

/**
 * Fonction générique qui supprime un produit dans le localStorage et de la page
 * @param {Element} deleteButton
 */

 const deleteProductInCart = (deleteButton) => {
    let localCart = getLocalStorage()
    let dataArticle = getArticleDataFromElement(deleteButton);
    let productId = dataArticle.id
    let productColor = dataArticle.color    
    let selectedIndex = getProductIndex(productId, productColor)
    if (selectedIndex != -1) {
        localCart.splice(selectedIndex, 1)
        localStorage.setItem("cart", JSON.stringify(localCart));
        dataArticle.article.remove();
    }
    calcTotalQuantityAndPrice()
}

/**
 * Fonction qui permet de calculer le nombre total de produits dans le panier ainsi que le prix total du panier
 */

const calcTotalQuantityAndPrice = async () => {
    let localCart = getLocalStorage()
    let totalQuantity = 0
    let totalPrice = 0
    for (let product of localCart) {
        let productQuantity = product.quantity
        let productId = product.id
        let productDataAPI = await requestAPIProducts(productId)
        let productPrice = productDataAPI.price
        totalQuantity = totalQuantity + parseInt(productQuantity)
        totalPrice = totalPrice + parseInt(productPrice) * parseInt(productQuantity)
    }
    totalQuantityElement.textContent = totalQuantity
    totalPriceElement.textContent = totalPrice
}

/**
 * Fonction principale qui affiche le panier à partir des produits contenus dans le localStorage et des données de l'API 
 */

const displayCartProducts = async () => {
    let localCart = sortArrayById(getLocalStorage())
    for (let product of localCart) {
        let productId = product.id
        let productColor = product.color
        let productQuantity = product.quantity
        let productDataAPI = await requestAPIProducts(productId)
        let productPrice = productDataAPI.price
        let productName = productDataAPI.name
        let productImgUrl = productDataAPI.imageUrl
        let productAltText = productDataAPI.altTxt
        
        // Création du panier dynamique dans le fichier html, enfant de la section.
        // NB : les mots précédés de $ correspondent aux variables créées ci-avant.
        // <article class="cart__item" data-id="$id" data-color="$color">
        let cartArticle = createElement("article", section, [
            { name: "class", value: "cart__item" },
            { name: "data-id", value: productId },
            { name: "data-color", value: productColor },
        ]);
        
        //<div class="cart__item__img"></div>, enfant de l'article cartArticle
        let cartDivImg = createElement("div", cartArticle, [
            { name: "class", value: "cart__item__img" },
        ]);
        
        // <img src="$imageSrc" alt="$imageAlt" title="$imageTitle"></img>, enfant de cartDivImg
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
        let cartDivItemContentDescription = createElement("div", cartDivItemContent, [
            { name: "class", value: "cart__item__content__description" },
        ]);
        
        // <h2>$name</h2>, enfant de cartDivItemContentDescription
        createElement("h2", cartDivItemContentDescription, [], productName);
        
        // <p>$color</p>, enfant de cartDivItemContentDescription
        createElement("p", cartDivItemContentDescription, [], productColor);
        
        // <p>$price €</p>, enfant de cartDivItemContentDescription
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
        
        //  <p>Qté : </p>, enfant de cartDivItemContentSettingsQuantity
        createElement("p", cartDivItemContentSettingsQuantity, [], "Qté :");
        
        // <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="$quantity">, enfant de cartDivItemContentSettingsQuantity
        createElement(
            "input",
            cartDivItemContentSettingsQuantity,
            [
            { name: "type", value: "number" },
            { name: "class", value: "itemQuantity" },
            { name: "name", value: "itemQuantity" },
            { name: "min", value: "1" },
            { name: "max", value: "100" },
            { name: "value", value: productQuantity},
            ]
        );
        
        // <div class="cart__item__content__settings__delete"></div>, enfant de cartDivItemContentSettings
        let cartDivItemContentSettingsDelete = createElement(
            "div",
            cartDivItemContentSettings,
            [{ name: "class", value: "cart__item__content__settings__delete" }]
        );
        
        // <p class="deleteItem">Supprimer</p>, enfant de cartDivItemContentSettingsDelete (= "bouton" qui servira à supprimer l'item du panier)
        createElement("p", cartDivItemContentSettingsDelete, [
            { name: "class", value: "deleteItem" },
        ], "Supprimer");        
        }
        calcTotalQuantityAndPrice()
    }

/**
 * Fonction qui ajoute des event listeners sur les boutons supprimer et inputs "Qté"
 */
const addEventListeners = () => {
    for (let deleteButton of  deleteButtonArray) { 
    
        deleteButton.addEventListener("click", () => {
            deleteProductInCart(deleteButton)
        })
    }
    for (let quantityInput of quantityInputArray) {
        quantityInput.addEventListener("change", () => {
            modifyProductQuantitytInCart(quantityInput)
        })
    }
}
displayCartProducts()

setTimeout(()=>{
    addEventListeners();
  }, 1000)
//   window.onload = addEventListeners()