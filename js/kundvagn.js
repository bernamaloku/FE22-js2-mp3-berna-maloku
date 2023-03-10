import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import {
  getDatabase,
  ref,
  remove,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";





const firebaseConfig = {
  apiKey: "AIzaSyBflweFzxWKnxh7yLFw1DvpIgkiNpHTjUI",
  authDomain: "miniprojekt3-177bf.firebaseapp.com",
  databaseURL:
    "https://miniprojekt3-177bf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "miniprojekt3-177bf",
  storageBucket: "miniprojekt3-177bf.appspot.com",
  messagingSenderId: "507171321163",
  appId: "1:507171321163:web:6dd2939779dd0af28ce4ce",
};

const app = initializeApp(firebaseConfig);

const apiUrl =
  "https://miniprojekt3-177bf-default-rtdb.europe-west1.firebasedatabase.app/cart.json";
let products = [];
let totalPrice = 0;

async function getAllDataFromFireBase() {
  const res = await fetch(apiUrl);
  const result = await res.json();
  if (result !== null) {
    Object.values(result).forEach((product) => {
      products.push(product);
    });
  }
  appendObjetcToDom(products);
}

getAllDataFromFireBase();

function appendObjetcToDom(products) {
  const productContainer = document.getElementById("cart-container");

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.id = "productDiv";

    productDiv.innerHTML = `
      <img src="${product.url}">
      <h4>${product.name}</h4>
      <p>${product.price} kr</p>
    `;

    productContainer.appendChild(productDiv);
  });
}


let emptyBtn = document.getElementById("empty");
emptyBtn.addEventListener(
  "click",
  function () {
    emptyCart();
  },
  false
);


function emptyCart() {
  const db = getDatabase(app);
  remove(ref(db, "cart/"));
  let cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";
  products = [];
  totalPrice = 0;
  localStorage.clear();
}

const buyBtn = document.getElementById("buy");
buyBtn.addEventListener(
  "click",
  function () {
    buyItems();
  },
  false
);
function buyItems() {
  products.forEach((item) => {
    totalPrice += item.price;
  });

  alert(totalPrice + " kr");
  emptyCart();
}
