let common = require("../../../../utilities/common");
let middleware = require("../../../../middlewares/validators.js");
const rules = require("../../../validation-rules.js");
let AuthModel = require("../model/admin-model.js");
let responseCode = require("../../../../utilities/response-error-code.js");

class AuthController {   

    //admin
    async addCategory(req, res) {
        try {
          console.log("Received addCategory request:",req.body);  
          let requestData = common.decodeBody(req.body);
          requestData.user_id = req.user_id;
          requestData.role = req.role;
          console.log("Decoded addCategory request:", requestData);

          let message = { required : req.language.required };
          let keyword = {};
    
          let response = middleware.checkValidationRules(requestData, rules.addCategory, message, keyword);
    
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.addCategory(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
          console.error("addCategory controller error:", error);
          return common.response(req, res, responseCode.OPERATION_FAILED, { keyword: "server_error" }, {});
        }
    }

    async getCategory(req, res) {
        try {
          console.log("Received getCategory request:",req.body);  
          let requestData = common.decodeBody(req.body);
          requestData.user_id = req.user_id;
          requestData.role = req.role;
          console.log("Decoded getCategory request:", requestData);

          let message = { required : req.language.required };
          let keyword = {};
    
          let response = middleware.checkValidationRules(requestData, rules.getCategory, message, keyword);
    
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.getCategory(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
          console.error("getCategory controller error:", error);
          return common.response(req, res, responseCode.OPERATION_FAILED, { keyword: "server_error" }, {});
        }
    }

    async getProducts(req, res) {
        try {
          console.log("Received getProducts request:",req.body);  
          let requestData = common.decodeBody(req.body);
          requestData.user_id = req.user_id;
          requestData.role = req.role;
          console.log("Decoded getProducts request:", requestData);

          let message = { required : req.language.required };
          let keyword = {};
    
          let response = middleware.checkValidationRules(requestData, rules.getProducts, message, keyword);
    
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.getProducts(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
          console.error("getProducts controller error:", error);
          return common.response(req, res, responseCode.OPERATION_FAILED, { keyword: "server_error" }, {});
        }
    }

    async addProducts(req, res) {
      try {
          console.log("Received addProducts request:", req.body);
          let requestData = common.decodeBody(req.body);
          requestData.user_id = req.user_id;
          requestData.role = req.role;
          console.log("Decoded requestData request:", requestData);
          const fileData = req.files;
  
          const fileData1 = fileData?.image?.[0];
          console.log("fileData1:", fileData1);
  
          let message = { required: req.language.required };
          let keyword = {};
          let response = middleware.checkValidationRules(requestData, rules.addProducts, message, keyword);
  
          if (response) {
              return common.response(req, res, response.code, response.message, {});
          } else {
              const [code, message, data] = await AuthModel.addProducts(requestData, fileData1);
              return common.response(req, res, code, message, data);
          }
      } catch (error) {
          console.error("addProducts controller error:", error);
          return common.response(req, res, responseCode.OPERATION_FAILED, { keyword: "server_error" }, {});
      }
    }

    async updateProducts(req, res) {
        try {
            console.log("Received updateProducts request:", req.body);
            let requestData = common.decodeBody(req.body);
            requestData.user_id = req.user_id;
            requestData.role = req.role;
            console.log("Decoded updateProducts request:", requestData);
            
            const fileData = req.files;
            const fileData1 = fileData?.image?.[0];
            console.log("fileData1:", fileData1);
    
            let message = { required: req.language.required };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.updateProducts, message, keyword);
    
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.updateProducts(requestData, fileData1);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("updateProducts controller error:", error);
            return common.response(req, res, responseCode.OPERATION_FAILED, { keyword: "server_error" }, {});
        }
    }

    async productbyid(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.productId = req.params.id;
            requestData.user_id = req.user_id;
            requestData.role = req.role;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.getProductById, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.productbyid(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in getProductById controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async deleteProduct(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.productId = req.params.id;
            requestData.role = req.role;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.deleteProduct, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.deleteProduct(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in deleteProduct controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }

    async listAllOrders(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.role = req.role;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.listAllOrders, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.listAllOrders(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in deleteProduct controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async changeOrderStatus(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.orderId = req.params.id;
            requestData.role = req.role;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.changeOrderStatus, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.changeOrderStatus(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in changeOrderStatus controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async listOrderStatus(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.role = req.role;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.listOrderStatus, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.listOrderStatus(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in listOrderStatus controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async listAllUsers(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.role = req.role;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.listAllUsers, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.listAllUsers(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in listAllUsers controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async blockUser(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.role = req.role;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.blockUser, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.blockUser(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in blockUser controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
    
    async unblockUser(req, res) {
        try {
            let requestData = common.decodeBody(req.body);
            requestData.role = req.role;
            console.log("Decoded Request Data:", requestData);
    
            let message = {
                required: req.language.required
            };
            let keyword = {};
    
            let response = middleware.checkValidationRules(requestData, rules.unblockUser, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            } else {
                const [code, message, data] = await AuthModel.unblockUser(requestData);
                return common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.error("Error in unblockUser controller:", error);
            return common.response(req, res, 500, "Internal Server Error", { error: error.message });
        }
    }
 
}
module.exports = new AuthController;