// localStorage.clear();

// Récupérer l'url de la page en cours :

let urlProduct = document.location.href;
// Récupérer l'id de la page en cours :
let url = new URL(urlProduct);
let id = url.searchParams.get("id");

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

// Fonction générique qui supprime les sauts de ligne, espaces et retours à la ligne dans un string
let clearString = (string, to_replace) => {
  return string.replace(to_replace, "");
};

// Créer une constante appelant l'API en la liant à l'id récupérée :
const urlApi = "http://localhost:3000/api/products/" + id;

const addToCart = document.querySelector("button");

let classImg = document.querySelector(".item__img");

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

      // Utilisation des fonctions génériques addTextToId et myCreateElement

      // Ajouter l'image du produit à la <div class="item__img"></div>

      myCreateElement("img", classImg, [
        { name: "src", value: product.imageUrl },
        { name: "alt", value: product.altTxt + ", " + product.name },
        { name: "title", value: product.altTxt + ", " + product.name },
      ]);

      // Ajouter le nom du produit dans <h1 id="title"></h1>
      addTextToId("title", product.name);

      // Ajouter le prix dans <span id="price"></span>
      addTextToId("price", product.price);

      // Ajouter la description dans <p id="description"></p>
      addTextToId("description", product.description);

      // Ajouter les options de couleurs dans <select name="color-select" id="colors"></select>
      const idColors = document.getElementById("colors");
      for (let color of product.colors) {
        let option = myCreateElement(
          "option",
          idColors,
          (attributes = [{ name: "value", value: color }])
        );
        myTextNode(color, option);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Appel de la fonction detailProducts qui permet de générer une fiche produit dynamique :
detailProduct();

// Interroge à chaque chargement de page si j'ai quelque chose dans mon stockage de session (= localStorage)
// Si localStorage.length > 0 alors j'ai quelque chose dans mon localStorage, alors je l'ajoute dans ma variable "cartStorage"
let cartStorage = [];
if (localStorage.length > 0) {
  let storageValue = JSON.parse(localStorage.getItem("storage"));
  for (let command of storageValue) {
    cartStorage.push(command);
  }
}

let item__content = document.querySelector(".item__content");
// Stocker les données dans le localStorage au clic :
addToCart.addEventListener("click", () => {
  // Récupérer les informations des canapés à stocker dans le localStorage :
  const selectedColor = document.getElementById("colors").value;
  const selectedQuantity = document.getElementById("quantity").value;
  const name = clearString(
    document.getElementById("title").textContent,
    /\n|\r/g
  ).trim();
  const price = clearString(
    document.getElementById("price").textContent,
    /\n| |\r/g // \n = retour en début de ligne | | <- espace entre ||= espace et \r = retour à la ligne
  );
  const image = classImg.getElementsByTagName("img")[0];

  // itemToCart est le kanap sur la page produit qu'on va ajouter au panier.
  let itemToCart = {
    id: id,
    color: selectedColor,
    quantity: selectedQuantity,
    other: [name, price, image.src, image.alt],
  };

  let isAlreadyInCart = false;
  for (let cartItem of cartStorage) {
    // Si id et couleur identique à élément déjà présent
    if (cartItem.id == itemToCart.id && cartItem.color == itemToCart.color) {
      // alors récupère l'ancienne quantité de l'élément qu'on converti en entier (était en texte, donc en string)
      let oldQuantity = parseInt(cartItem.quantity);
      // la nouvelle quantité = l'ancienne quantité + la quantité anciennement présente dans le panier (toujours converti en entier)
      let newQuantity = oldQuantity + parseInt(itemToCart.quantity);
      // la quantité anciennement présente dans le panier adopte la nouvelle quantité obtenue au dessus qu'on convertit en texte avec toString
      cartItem.quantity = newQuantity.toString();
      // Et du coup l'élément devient "déjà présent dans le cart"
      isAlreadyInCart = true;
    }
  }

  // Si isAlreadyInCart n'est pas en false, alors l'élément est ajouté directement dans le panier sans être impacté par la boucle (même s'il la passe quand même)
  if (!isAlreadyInCart) {
    cartStorage.push(itemToCart);
  }

  localStorage.setItem("storage", JSON.stringify(cartStorage));

  // Ajout d'un paragraphe qui confirme que le(s) produit(s) ont été ajoutés au panier après avoir cliqué sur le bouton "Ajouter au panier"
  let addTextToButton = myCreateElement("p", item__content, [
    { name: "class", value: "addedToCart" },
  ]);
  myTextNode("Produit(s) ajouté(s) au panier.", addTextToButton);
  addTextToButton.style.fontSize = "1.8em";
  addTextToButton.style.textAlign = "center";
});
