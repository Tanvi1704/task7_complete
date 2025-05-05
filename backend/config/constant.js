
const crypto = require("crypto");
const s3BaseUrl = "http://localhost:3000/";

const encryptionKey = Buffer.from(process.env.NEXT_PUBLIC_KEY, "hex");
const encryptionIV = Buffer.from(process.env.NEXT_PUBLIC_IV, "hex");


console.log("encryptionKey from constant===========",encryptionKey);
console.log("encryptionIV from constant===========",encryptionIV);

const constant = {
    encryptionKey,
    encryptionIV,
    port_base_url: "http://localhost:3001/",


    profile_image: `${s3BaseUrl}uploads/productImages/`,
    notification: `${s3BaseUrl}notification_image/`,

    encrypt(data) {
        const cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, this.encryptionIV);
        let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
        encrypted += cipher.final("base64");
        return encrypted;
    },

    decryptPlain(encryptedData) {
        const decipher = crypto.createDecipheriv("aes-256-cbc", this.encryptionKey, this.encryptionIV);
        let decrypted = decipher.update(encryptedData, "base64", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    },

};

module.exports = constant;
