let common = require("../../../../utilities/common");
let middleware = require("../../../../middlewares/validators.js");
let { t } = require("localizify");
const rules = require("../../../validation-rules.js");
let AuthModel = require("../model/user-model.js");
let responseCode = require("../../../../utilities/response-error-code.js");

class AuthController {   

    async signup(req, res) {
        try {
          console.log("Received signup request:",req.body);  
          let requestData = common.decodeBody(req.body);
          console.log("Decoded signup request:", requestData);

          let message = { required : req.language.required };
          let keyword = {};
    
          let response = middleware.checkValidationRules(requestData, rules.signup, message, keyword);
    
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.signup(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
          console.error("Signup controller error:", error);
          return common.response(req, res, responseCode.OPERATION_FAILED, { keyword: "server_error" }, {});
        }
    }
   
    async login(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            console.log("Decoded Request Data:", requestData);
    
            if (!requestData.email_phone || !requestData.password) {
                return common.response(req, res, 400, "Email/Phone and Password are required", {});
            }
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.login, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.login(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in login controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async productlisting(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.productlisting, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.productlisting(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in productlisting controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async getProductById(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.productId = req.params.id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.getProductById, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.getProductById(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in getProductById controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async getCategories(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.getCategories, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.getCategories(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in getProductById controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async increasequantity(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.increasequantity, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.increasequantity(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in increasequantity controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async decreasequantity(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.decreasequantity, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.decreasequantity(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in decreasequantity controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async addToCart(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.addToCart, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.addToCart(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in addToCart controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async getCartItem(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.getCartItem, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.getCartItem(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in getCartItem controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async deleteItemFromCart(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.deleteItemFromCart, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.deleteItemFromCart(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in deleteItemFromCart controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async getCartDetails(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.getCartDetails, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.getCartDetails(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in getCartDetails controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async confirmOrder(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.confirmOrder, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.confirmOrder(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in confirmOrder controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async orderlisting(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.orderlisting, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.orderlisting(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in orderlisting controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async userdetail(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.userdetail, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.userdetail(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in userdetail controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async edituserdetail(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.userId = req.user_id;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required,
                in: req.language.in,
                required_if: req.language.required_if
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.edituserdetail, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.edituserdetail(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in edituserdetail controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
 
}
module.exports = new AuthController;