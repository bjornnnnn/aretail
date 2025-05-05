function showDiv(divId) {
    var divs = ['products-div', 'basket-div', 'about-div', 'thank-you-div'];
    for (var i = 0; i < divs.length; i++) {
        var div = document.getElementById(divs[i]);
        if (div) {
            console.info(`div: '${div.id}' cmp '${divId}' `)
            if (div.id == divId) {
                div.style.display = 'block'
            } else {
                div.style.display = 'none'
            }
        }
    }
}

