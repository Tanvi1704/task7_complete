const db  = require("../config/database"); // Import database connection
const { createCipheriv, createDecipheriv } = require("crypto");
const constant = require("../config/constant");
let { default: localizify } = require("localizify");
let { t } = require("localizify");
let responseCode = require("../utilities/response-error-code");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

class Common {

async response(req, res, code, message, data) {
    try {
        const language = req.lang;
        const translatedMessage = await this.getMessage(language, message);

        let response = {
            code: code,
            message: translatedMessage,
            data: data,
        };

        const encryptedResponse = this.encrypt(response);
        res.send(encryptedResponse);
        // res.status(200).json(response);
    } catch (error) {
        console.error("Error in response:", error);
        res.send(this.encrypt({ code: responseCode.OPERATION_FAILED, message: "Internal Server Error", data: {} }));
    }
}
encrypt(request_data) {
    if (!request_data) {
        console.error("Empty data received for encryption.");
        return '';
    }
    
    const iv = constant.encryptionIV;
    const key = constant.encryptionKey;

    try {
        const data = typeof request_data === 'object' ? JSON.stringify(request_data) : request_data;
        const cipher = createCipheriv('aes-256-cbc', key, iv);
        const text = typeof data === 'string' ? data : JSON.stringify(data); 
        let encrypted = cipher.update(text, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('base64');
    } catch (error) {
        console.error('Encryption Error:', error);
        return '';
    }
}

decodeBody(data) {
    if (typeof data === 'string') {
        try {
            const decrypted = this.decryptPlain(data);
            console.log("Decrypted raw body:", decrypted);
            if (this.isJson(decrypted)) {
                return JSON.parse(decrypted);
            } else {
                console.log("Invalid JSON string, returning empty object.");
                return {};
            }
        } catch (err) {
            console.error("decodeBody error:", err);
            return {};
        }
    }
    return data;
}

decryptPlain(data) {
    const ivHex = process.env.NEXT_PUBLIC_IV;
    const keyHex = process.env.NEXT_PUBLIC_KEY;

    if (!ivHex || !keyHex) {
        console.error("IV or Key is undefined!");
        return null;
    }

    const iv = Buffer.from(ivHex.trim(), 'hex');
    const key = Buffer.from(keyHex.trim(), 'hex');

    if (iv.length !== 16) {
        console.error("Invalid IV length! It should be 16 bytes.");
        return null;
    }

    if (key.length !== 32) {
        console.error("Invalid Key length! It should be 32 bytes.");
        return null;
    }

    try {
        const trimmedData = data.trim();
        const decipher = createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(trimmedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;  
    } catch (error) {
        console.log("Decryption Error:", error);
        return null;
    }
}

isJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

requestValidation(v) {
    let error = "";
    if(v.fails()) {
        let Validator_errors = v.getErrors();
        for (let key in Validator_errors) {
            error = Validator_errors[key][0];
            break;
        }
        let response_data = {
            code: true,
            message: error
        }
        return response_data;
    } else {
        let response_data = {
            code : false,
            message: ""
        };
        return response_data;
    }
}

async getMessage(language, message) {
    try {
        console.log("Received keyword for translation:", message.keyword);
        if (!message || !message.keyword) {
            console.log("Invalid translation request: Missing keyword");
            return "Translation Missing";
        }
        
        let translatedMessage = await t(message.keyword);

        if (message.content) {
            for (const key of Object.keys(message.content)) {
                translatedMessage = translatedMessage.replace(`{ ${key} }`, message.content[key]);
            }
        }

        return translatedMessage;
    } catch (error) {
        console.log("Error in getMessage:", error);
        return "Translation Error";
    }
}

generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

async isEmailExists(email) {
    try {
        const query = "SELECT * FROM users WHERE email = ?";
        console.log("Executing Query:", query, email);
        
        const [rows] = await db.execute(query, [email]);

        console.log("Email Check Result:", rows);

        return rows.length > 0;
    } catch (error) {
        console.error("Error in isEmailExists function:", error);
    }
}

async isPhoneExists(phone) {
    try {
        const query = "SELECT * FROM users WHERE phone = ?";
        console.log("Executing Query:", query, phone);

        const [rows] = await db.execute(query, [phone]);

        console.log("Phone Check Result:", rows);

        return rows.length > 0;
    } catch (error) {
        console.log("Error in isPhoneExists function:", error);
    }
}

async hashPassword(password) {
    try {
        if (typeof password !== 'string' || password.trim() === '') {
            console.log('Password must be a valid string');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log("Error in hashPassword:", error);
    }
}

async getUserInfo(user_id) {
    console.log("Fetching user info for ID:", user_id);
    const sql = `
        SELECT 
            u.id,
            u.full_name, u.email, u.phone
        FROM users u
        WHERE u.id = ? AND u.is_active = 1 AND u.is_deleted = 0
    `;
    try {
        const [result] = await db.query(sql, [user_id]);
        console.log("result from common=========",result);
        return result[0];
    } catch (err) {
        console.log("Database Error in getUserInfo:", err);
        return null;
    }
}

// async generateJWT(user_id) {
//     const secretKey = process.env.JWT_SECRET || "your_fallback_secret";
//     const expiresIn = "7d"; // or "1h", "30m", etc.

//     const payload = {
//         user_id: user_id
//     };

//     const token = jwt.sign(payload, secretKey, { expiresIn });
//     return token;
// }

async  generateJWT(user_id) {
  const secretKey = process.env.JWT_SECRET || "your_fallback_secret";
  const expiresIn = "7d";

  const [rows] = await db.query("SELECT role FROM users WHERE id = ? AND is_deleted = 0", [user_id]);
  if (!rows.length) 
    {
        console.log("User not found"); 

    }

  const role = rows[0].role;

  const payload = {
    user_id,
    role,
  };
  console.log("payload from common===========",payload);

  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
}

async verifyJWT(token) {
    try {
      const secretKey = process.env.JWT_SECRET || "your_fallback_secret";
      const decoded = jwt.verify(token, secretKey);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error };
    }
}
  
}
module.exports = new Common();