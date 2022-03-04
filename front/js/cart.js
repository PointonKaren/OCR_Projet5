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

// Création d'une fonction générique utilisable pour le catalogue et pour n'importe quel élément
let addTextToId = (id_name, text) => {
  const idElement = document.getElementById(id_name);
  myTextNode(text, idElement);
};

let section = document.getElementById("cart__items");

let cart = JSON.parse(localStorage.getItem("storage"));

for (let command of cart) {
  let id = command.id;
  let color = command.color;
  let quantity = command.quantity;
  let name = command.other[0];
  let price = command.other[1];
  let imageSrc = command.other[2];
  let imageAlt = command.other[3];
  let imageTitle = command.other[3];

  let cartArticle = myCreateElement("article", section, [
    { name: "class", value: "cart__item" },
    { name: "data-id", value: id },
    { name: "data-color", value: color },
  ]);

  let cartDivImg = myCreateElement("div", cartArticle, [
    { name: "class", value: "cart__item__img" },
  ]);

  let cartImg = myCreateElement("img", cartDivImg, [
    { name: "src", value: imageSrc },
    { name: "alt", value: imageAlt },
    { name: "title", value: imageTitle },
  ]);

  let cartDivItemContent = myCreateElement("div", cartArticle, [
    { name: "class", value: "cart__item__content" },
  ]);

  let cartDivItemContentDescription = myCreateElement(
    "div",
    cartDivItemContent,
    [{ name: "class", value: "cart__item__content__description" }]
  );

  let cartName = myCreateElement("h2", cartDivItemContentDescription, []);
  myTextNode(name, cartName);

  let cartColor = myCreateElement("p", cartDivItemContentDescription, []);
  myTextNode(color, cartColor);

  let cartPrice = myCreateElement("p", cartDivItemContentDescription, []);
  myTextNode(price + " €", cartPrice);

  let cartDivItemContentSettings = myCreateElement("div", cartDivItemContent, [
    { name: "class", value: "cart__item__content__settings" },
  ]);

  let cartDivItemContentSettingsQuantity = myCreateElement(
    "div",
    cartDivItemContentSettings,
    [{ name: "class", value: "cart__item__content__settings__quantity" }]
  );

  let cartQuantity = myCreateElement(
    "p",
    cartDivItemContentSettingsQuantity,
    []
  );
  myTextNode("Qté :", cartQuantity);

  let cartItemsInput = myCreateElement(
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

  let cartDivItemContentSettingsDelete = myCreateElement(
    "div",
    cartDivItemContentSettings,
    [{ name: "class", value: "cart__item__content__settings__delete" }]
  );

  let cartDelete = myCreateElement("p", cartDivItemContentSettingsDelete, [
    { name: "class", value: "deleteItem" },
  ]);
  myTextNode("Supprimer", cartDelete);
}

// utiliser addEventListener de type change pour que le changement de Qté sur le panier soit pris en compte dans le LocalStorage

// Aussi, la méthode Element.closest() devrait permettre de cibler le produit que vous souhaitez supprimer (où dont vous souhaitez modifier la quantité) grâce à son identifiant et sa couleur

// remove ?
