const urlPage = document.location.href;
const url = new URL(urlPage);
const orderId = url.searchParams.get("orderId");

let orderTextContent = document.getElementById("orderId");
orderTextContent.textContent = orderId;
