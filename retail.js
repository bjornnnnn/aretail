
const CURRENCY = "SEK";

// Articles are treated as constants
const articles = [
    { id: 1, name: "Kritpåse Basic", description: "En fin kritpåse"        , price: 195.10, itemsAvailable: 15, image: "img1.jpg"},
    { id: 2, name: "Kritpåse Extra", description: "En exklusivare kritpåse", price: 499.00, itemsAvailable:  7, image: "img1.jpg"},
    { id: 3, name: "Mössa"         , description: "En mössa utan skärm"    , price: 299.99, itemsAvailable:  5, image: "img1.jpg"}
];


// The Shopping basket is shared between pages products.html and checkout.html
// It is stored in session storage if the site is not implemented as a SPA, and can be cleared by the user
let shoppingBasket = {
    items: [],
    itemDict: {},
    totalPrice: 0,
    uuid: Math.floor(Math.random() * 1000000),
}

let shoppingBasketFn = {

    clear: function(shoppingBasketObj) {
        shoppingBasketObj.items = [];
        shoppingBasketObj.totalPrice = 0;
        shoppingBasketObj.uuid = Math.floor(Math.random() * 1000000);
        updateBasketCounter(shoppingBasketObj)
        this.toSessionStorage(shoppingBasketObj);
    },
    addItem: function(shoppingBasketObj, item) {
        shoppingBasketObj.items.push(item);
        shoppingBasketObj.totalPrice += item.price;
        //updateBasketCounter(this.items)
        this.toSessionStorage(shoppingBasketObj);
    } ,
    getItemCount: function(shoppingBasketObj) {
        return shoppingBasketObj.items.length;
    },
    getTotalPrice: function(shoppingBasketObj) {
        return shoppingBasketObj.totalPrice;
    },  
    delItem: function(shoppingBasketObj,itemId) {
        let item = shoppingBasketObj.items.find(i => i.id === itemId);
        if (!item) {
            console.error(`Item with id ${itemId} not found in basket`);
            return;
        }   
        let index = shoppingBasketObj.items.indexOf(item);
        if (index > -1) {
            shoppingBasketObj.items.splice(index, 1);
            shoppingBasketObj.totalPrice -= item.price;
        }
        this.toSessionStorage(shoppingBasketObj);
        updateBasketCounter(shoppingBasketObj)
    },
    toSessionStorage: function(shoppingBasketObj) {    
        sessionStorage.setItem("shoppingBasket", JSON.stringify(shoppingBasketObj));
    },


};

function getShoppingBasketFromSessionStorage() {
    let basketData = sessionStorage.getItem("shoppingBasket");
    if (basketData) {
        let shoppingBasket = JSON.parse(basketData);
        shoppingBasket.items = shoppingBasket.items.map(item => {
            let article = articles.find(a => a.id === item.id);
            return article ? { ...article, ...item } : item;
        });
        shoppingBasket.totalPrice = shoppingBasket.items.reduce((total, item) => total + item.price, 0);
        return shoppingBasket;
    }
    else {
        console.error("No shopping basket found in session storage");
        return null;
    }
}

function updateBasketList(shoppingBasket) {
    let basketList = document.getElementById("basket-list");
    basketList.innerHTML = ""; // Clear the list
    for (let item of shoppingBasket.items){
        console.debug(`item: ${item}`)
        var li = document.createElement("li");
    
        li.innerHTML = item.name + " - " + item.price.toFixed(2) + "&nbsp;" + CURRENCY + "&nbsp;" + `<a href="javascript:shoppingBasketFn.delItem(shoppingBasket,${item.id}); updateBasketList(shoppingBasket);updateBasketCounter(shoppingBasket);">&#9850;</a>`;
        basketList.appendChild(li);
    };
    let totalPrice = document.getElementById("total-price");
    totalPrice.innerHTML = "Totalt: " + shoppingBasketFn.getTotalPrice(shoppingBasket).toFixed(2) + "&nbsp;" + CURRENCY;

}

function updateBasketCounter(shoppingBasket) {
    var basketCount = document.getElementById("basket-count");
    basketCount.innerHTML = shoppingBasketFn.getItemCount(shoppingBasket);  
   }

function processBasket(shoppingBasket) {
    let orderDate = new Date();
    let orderDateString = orderDate.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById("order-id").innerHTML = shoppingBasket.uuid;
    document.getElementById("order-total").innerHTML = shoppingBasket.totalPrice.toFixed(2) + "&nbsp;" + CURRENCY;
    document.getElementById("order-status").innerHTML = "RECEIVED";
    document.getElementById("order-items").innerHTML = shoppingBasket.items.map(item => item.name).join(", ");
    document.getElementById("order-date").innerHTML = orderDateString;
    shoppingBasketFn.clear(shoppingBasket);
    showDiv('thank-you-div');
}


function populateProductList(shoppingBasket) {
    var productList = document.getElementById("product-list");
    articles.forEach(function(article) {
        var li = document.createElement("li");
        var addButton = document.createElement("button");
        addButton.innerHTML = "&nbsp;&#128722;";
        addButton.onclick = function() {
            shoppingBasketFn.addItem(shoppingBasket, article);
            updateBasketCounter(shoppingBasket);
        };
        li.appendChild(addButton);
        li.appendChild(document.createTextNode("  " + article.name + " - " + article.price.toFixed(2) + " " + CURRENCY));
        productList.appendChild(li);
    });
}
