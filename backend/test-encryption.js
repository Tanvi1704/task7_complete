require("dotenv").config();

const common = require("./utilities/common");

const testData = {
  code: 200,
  message: "Hello",
  data: { name: "Pooja" },
};

const encrypted = common.encrypt(testData);
console.log("Encrypted:", encrypted);

const decrypted = common.decryptPlain(encrypted);
console.log("Decrypted:", decrypted);
