let UserRoute = require("./v1/user/route/routes");
let AdminRoute = require("./v1/admin/route/routes");
class Routing {
    v1(app) {
        UserRoute(app);
        AdminRoute(app);    
    }
}

module.exports = new Routing();