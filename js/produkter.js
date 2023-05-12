import anime from "..//node_modules/animejs/lib/anime.es.js";
import Cookie from "../node_modules/cookiejs/dist/cookie.esm.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";

const apiUrl =
  "https://miniprojekt3-177bf-default-rtdb.europe-west1.firebasedatabase.app/products.json";
const cartUrl =
  "https://miniprojekt3-177bf-default-rtdb.europe-west1.firebasedatabase.app/cart.json";

const count = document.getElementById("count");
let boughtItemsCounter = 0;

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

getAllDataFromFireBase();

//Detta är en asynkron JavaScript-funktion som hämtar data från en API-endpoint som ligger på apiUrl, konverterar svaret till ett JSON-objekt, itererar över den resulterande arrayen av objekt och lägger till varje objekt i en ny array med namnet products. Den anropar  en annan funktion  och skickar products-arrayen som ett argument.
async function getAllDataFromFireBase() {
  const products = [];
  const res = await fetch(apiUrl);
  await res.json().then((result) => {
    result.forEach((element, index) => {
      let item = {
        name: element.name,
        price: element.price,
        stock: element.stock,
        url: element.url,
        index: index
      }
      products.push(item);
    });
  });
  appendObjetcToDom(products);
}

//Den här tar emot en array av produkter som ett argument och skapar HTML-element för varje produkt och lägger till dem i DOM.
function appendObjetcToDom(products) {
  const productContainer = document.getElementById("main-container");

  products.forEach((element) => {
    const productDiv = document.createElement("div");
    productDiv.id = "productDiv";

    const image = document.createElement("img");
    image.src = element.url;

    const productBtn = document.createElement("button");
    productBtn.innerText = "Add to cart";
    productBtn.id = "productBtn";
    productBtn.setAttribute("product", element.name);
    //setAttribute, lägger värde på productBtn
    if(element.stock === 0){
      productBtn.disabled = true;
    }
    productBtn.addEventListener(
      "click",
      function () {
        buyItem(element, this);
      },
      false
    );

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
//funktion som tar emot två argument, ett element som representerar den produkt som köpts och en button som representerar knappen som klickades på för att köpa produkten.
function buyItem(element, button) {
  boughtItemsCounter++;
  updateLocalStorage(element);
  element.stock--;
  count.innerText = boughtItemsCounter;
  addBoughtItemsToCart(element);
  if(element.stock === 0){
    button.disabled = true;
  } 
}

//funktioner som används för att lagra och uppdatera data i webbläsarens localStorage.
function setLocalStorage(element) {
  localStorage.setItem(element.name, element.stock);
}

function updateLocalStorage(element) {
  console.log(element)
  localStorage.setItem(element.name, element.stock -1);
}

//detta hämtar och visar antalet köpta produkter som finns i webbläsarens localStorage.
const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

boughtItemsCounter = cartItems.length;
count.innerText = boughtItemsCounter;

//detta är en async JavaScript-funktion som används för att lägga till en produkt i kundvagnen.
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

//animation på cart button
const cart = document.querySelector("#cart");
anime({
  targets: cart,
  scale: [
    { value: 0.1, easing: "easeOutSine", duration: 50 },
    { value: 1, easing: "easeInOutQuad", duration: 2000 },
  ],
  delay: anime.stagger(200, { grid: [14, 5], from: "center" }),
});

//detta använder en npm bibliotek för att lagra och hämta en array av värden från webbläsarens cookies.
if(!Cookie.get("savedBalanceArr")){
  Cookie.set("savedBalanceArr", JSON.stringify(cartItems), { expires: 50 });
}
const savedBalanceArr = Cookie.get("savedBalanceArr");

if (savedBalanceArr) {
  let b = JSON.parse(savedBalanceArr);
}
