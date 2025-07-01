function calcOrderAmount(products) {
    let newOrderAmount = 0;
    for (let i = 0; i < products.length; i++) {
        newOrderAmount += products[i].totalAmount;
    }
    return newOrderAmount;
}

module.exports = {
    calcOrderAmount,
}