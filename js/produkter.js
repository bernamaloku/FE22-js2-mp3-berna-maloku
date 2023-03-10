
import anime from "..//node_modules/animejs/lib/anime.es.js";
import Cookie from "../node_modules/cookiejs/dist/cookie.esm.js";

const apiUrl =
  "https://miniprojekt3-177bf-default-rtdb.europe-west1.firebasedatabase.app/products.json";
const cartUrl =
  "https://miniprojekt3-177bf-default-rtdb.europe-west1.firebasedatabase.app/cart.json";


const count = document.getElementById("count");
let boughtItemsCounter = 0;

async function getAllDataFromFireBase() {
  const products = [];
  const res = await fetch(apiUrl);
  await res.json().then((result) => {
    result.forEach((element) => {
      products.push(element);
    });
  });

  appendObjetcToDom(products);
}

getAllDataFromFireBase();

function appendObjetcToDom(products) {
  const productContainer = document.getElementById("main-container");

  products.forEach((element) => {
    const productDiv = document.createElement("div");
    productDiv.id = "productDiv";

    console.log(element);
    const image = document.createElement("img");
    image.src = element.url;

    const productBtn = document.createElement("button");
    productBtn.innerText = "Add to cart";
    productBtn.id = "productBtn";
    productBtn.setAttribute("product", element.name);
    productBtn.addEventListener(
      "click",
      function () {
        buyItem(element, this);
      },
      false
    );
    //lägger värde på productBtn

    const productTitle = document.createElement("h4");
    productTitle.innerText = element.name;

    const price = document.createElement("p");
    price.innerText = element.price + " kr";

    productDiv.append(image);
    productDiv.append(productTitle);
    productDiv.append(price);
    productDiv.append(productBtn);
    productContainer.append(productDiv);

    setLocalStorage(element);
  });
}

function buyItem(element, button) {
  if (element.stock === 1) {
    button.disabled = true;
  }
  boughtItemsCounter++;
  updateLocalStorage(element);
  element.stock--;
  count.innerText = boughtItemsCounter;
  addBoughtItemsToCart(element);
}

function setLocalStorage(element) {
  localStorage.setItem(element.name, element.stock);
}

function updateLocalStorage(element) {
  localStorage.setItem(element.name, element.stock - 1);
}

const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

boughtItemsCounter = cartItems.length;
count.innerText = boughtItemsCounter;

async function addBoughtItemsToCart(element) {
  await fetch(cartUrl, {
    method: "POST",
    body: JSON.stringify(element),
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  cartItems.push(element);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

const cart = document.querySelector("#cart");
anime({
  targets: cart,
  scale: [
    { value: 0.1, easing: "easeOutSine", duration: 50 },
    { value: 1, easing: "easeInOutQuad", duration: 2000 },
  ],
  delay: anime.stagger(200, { grid: [14, 5], from: "center" }),
});

Cookie.set("savedBalanceArr", JSON.stringify(cartItems), { expires: 50 });

const savedBalanceArr = Cookie.get("savedBalanceArr");

if (savedBalanceArr) {
  const savedBalanceArr = JSON.parse(savedBalanceArrCookie);
  console.log(savedBalanceArr);
}
