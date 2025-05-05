
const CURRENCY = "SEK";

let articles = [
    { id: 1, name: "Kritpåse Basic", description: "En fin kritpåse", price: 195.10 },
    { id: 2, name: "Kritpåse Extra", description: "En exklusivare kritpåse", price: 499.00 },
    { id: 3, name: "Mössa",      description: "En mössa utan skärm",   price: 299.99 }
];

shoppingBasket = {
    items: [],
    totalPrice: 0,
    uuid: Math.floor(Math.random() * 1000000),

    clear: function() {
        this.items = [];
        this.totalPrice = 0;
        this.uuid = Math.floor(Math.random() * 1000000);
        updateBasket(this.items)
    },
    addItem: function(item) {
        this.items.push(item);
        this.totalPrice += item.price;
        updateBasket(this.items)
    } ,
    getItemCount: function() {
        return this.items.length;
    },
    getTotalPrice: function() {
        return this.totalPrice;
    },  
    delItem: function(itemId) {
        let item = this.items.find(i => i.id === itemId);
        if (!item) {
            console.error(`Item with id ${itemId} not found in basket`);
            return;
        }   
        let index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            this.totalPrice -= item.price;
        }
    },
};

function updateBasket() {
    var basketCount = document.getElementById("basket-count");
    basketCount.innerHTML = shoppingBasket.getItemCount();
    let basketList = document.getElementById("basket-list");
    basketList.innerHTML = ""; // Clear the list
    for (let item of shoppingBasket.items){
        console.debug(`item: ${item}`)
        var li = document.createElement("li");
    
        li.innerHTML = item.name + " - " + item.price.toFixed(2) + CURRENCY + "&nbsp" + `<a href="javascript:shoppingBasket.delItem(${item.id}); updateBasket();">&#9850;</a>`;
        basketList.appendChild(li);
    };
    let totalPrice = document.getElementById("total-price");
    totalPrice.innerHTML = "Totalt: " + shoppingBasket.getTotalPrice().toFixed(2) + CURRENCY;
}

function processBasket(){
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
    document.getElementById("order-total").innerHTML = shoppingBasket.totalPrice.toFixed(2) + CURRENCY;
    document.getElementById("order-status").innerHTML = "RECEIVED";
    document.getElementById("order-items").innerHTML = shoppingBasket.items.map(item => item.name).join(", ");
    document.getElementById("order-date").innerHTML = orderDateString;
    shoppingBasket.clear();
    showDiv('thank-you-div');
}


function populateProductList(){
    var productList = document.getElementById("product-list");
    articles.forEach(function(article) {
        var li = document.createElement("li");
        var addButton = document.createElement("button");
        addButton.innerHTML = "&nbsp;&#128722;";
        addButton.onclick = function() {
            shoppingBasket.addItem(article);
            updateBasket();
        };
        li.appendChild(addButton);
        li.appendChild(document.createTextNode("  " + article.name + " - " + article.price.toFixed(2) + CURRENCY));
        productList.appendChild(li);
    });
}
