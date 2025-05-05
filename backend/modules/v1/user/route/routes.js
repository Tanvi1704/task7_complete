let Auth = require('../controller/user-controller');

let AuthRoute = (app) => {

    app.post("/v1/user/signup", Auth.signup);  
    app.post("/v1/user/login", Auth.login);
    app.post("/v1/user/productlisting", Auth.productlisting);
    app.post("/v1/user/getproductbyid/:id", Auth.getProductById);
    app.get("/v1/user/getcategories", Auth.getCategories);
    app.post("/v1/user/increasequantity", Auth.increasequantity);
    app.post("/v1/user/decreasequantity", Auth.decreasequantity);
    app.post("/v1/user/addtocart", Auth.addToCart);
    app.post("/v1/user/getcartitem", Auth.getCartItem);
    app.post("/v1/user/deleteItemFromCart", Auth.deleteItemFromCart);
    app.post("/v1/user/getcartdetails", Auth.getCartDetails);
    app.post("/v1/user/confirmorder", Auth.confirmOrder);
    app.post("/v1/user/orderlisting", Auth.orderlisting);
    app.post("/v1/user/userdetail", Auth.userdetail);
    app.post("/v1/user/edituserdetail", Auth.edituserdetail);
};
module.exports = AuthRoute;
