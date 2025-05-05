let Auth = require('../controller/admin-controller');
const { productImageUpload } = require("../../../../middlewares/multerdemo");

let AuthRoute = (app) => {
    //admin
    app.post("/v1/admin/add-product", productImageUpload.fields([{ name: 'image', maxCount: 1 }]),Auth.addProducts);
    app.post('/v1/admin/add-category', Auth.addCategory);
    app.get('/v1/admin/get-category', Auth.getCategory);
    app.get('/v1/admin/get-products', Auth.getProducts);
    app.post("/v1/admin/getproductbyid/:id", Auth.productbyid);
    app.put('/v1/admin/:id',productImageUpload.fields([{ name: 'image', maxCount: 1 }]), Auth.updateProducts);
    app.post("/v1/admin/deleteproduct/:id", Auth.deleteProduct);
    app.post("/v1/admin/listallorders", Auth.listAllOrders);
    app.post("/v1/admin/changeorderstatus/:id", Auth.changeOrderStatus);
    app.post("/v1/admin/listorderstatus", Auth.listOrderStatus);
    app.post("/v1/admin/listallusers", Auth.listAllUsers);
    app.post("/v1/admin/blockuser", Auth.blockUser);
    app.post("/v1/admin/unblockuser", Auth.unblockUser);

};
module.exports = AuthRoute;
