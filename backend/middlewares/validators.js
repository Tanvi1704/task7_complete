const Validator = require("Validator");
require("dotenv").config({ path: "./.env" });
const { default: localizify } = require("localizify");
let en = require("../languages/en.js")
let hn = require("../languages/hi.js");
const { t } = require("localizify");
let responseCode = require("../utilities/response-error-code.js");
let database = require("../config/database.js");
const common = require("../utilities/common.js");
let bypassMethods = [
    "signup", "login"
];
const jwt = require("jsonwebtoken");

class middleware {
    
    checkValidationRules( request, rules , message, keyword){
        const v = Validator.make(request,rules,message,keyword);
        if (v.fails()) { 
            const errors = v.getErrors();     
            let error = "";    
            for(let key in errors){
                error = errors[key][0];
                break;
            } 
            let response_data = {
                code : responseCode.OPERATION_FAILED,
                message : { keyword : error },
                data : {}
            } 
            return response_data ;
        }
        else
        {
            return false;
        }
    }

    extractHeaderLanguage(req , res , callback){
        let headerLang = (req.headers['accept-language'] != undefined && req.headers['accept-language'] != "") 
        ? req.headers['accept-language'] : 'en';

        req.lang = headerLang;

        req.language = (headerLang == 'en') ? en : hn;

        localizify
            .add('en' , en)
            .add('hn' , hn)
            .setLocale(headerLang);

        callback();
    }

    validateApiKey(req, res, callback) {
        const api_key = req.headers['api-key'] || '';
    
        if (!api_key) {
            return res.status(401).send({ code: '0', message: t("header_key_value_incorrect") });
        }
    
        try {
            const dec_apikey = common.decryptPlain(api_key);
            console.log("Decrypted API Key:", dec_apikey);
            console.log("process.env.API_KEY",process.env.API_KEY)
    
            if (dec_apikey && dec_apikey === process.env.API_KEY) {
                callback();
            } else {
                res.status(401).send({ code: '0', message: t("header_key_value_incorrect") });
            }
        } catch (error) {
            console.error("API Key validation error:", error);
            res.status(401).send({ code: '0', message: t("header_key_value_incorrect") });
        }
    }
    

    async validateHeaderToken(req, res, callback) {
        try {
            const headerToken = req.headers['token'] ? req.headers['token'].trim() : '';
            console.log("Received Token:", headerToken);
    
            const pathData = req.path.split('/');
            console.log("Path Data:", pathData);
    
            if (bypassMethods.includes(pathData[3])) {
                console.log("Bypassing token validation for:", req.path);
                return callback();
            }
    
            if (!headerToken) {
                console.log("No token provided");
                return res.status(401).send({
                    code: responseCode.OPERATION_FAILED,
                    message: req.language.invalid_user_token,
                    data: {}
                });
            }
    
            const { valid, decoded, error } = await common.verifyJWT(headerToken);
    
            if (!valid) {
                console.log("Invalid token:", error?.message);
                return res.status(401).send({
                    code: responseCode.OPERATION_FAILED,
                    message: req.language.invalid_user_token || "Invalid token",
                    data: {}
                });
            }
    
            req.user_id = decoded.user_id;
            req.role = decoded.role;
    
            console.log("Token valid. User ID:", req.user_id, "| Role:", req.role);
            return callback();
    
        } catch (error) {
            console.error("Token Validation Error:", error);
            return res.status(500).send({
                code: responseCode.INTERNAL_SERVER_ERROR,
                message: req.language.server_error,
                data: { error: error.message }
            });
        }
    }
    

};

module.exports = new middleware();