const database = require("../../../../config/database");
let responseCode = require("../../../../utilities/response-error-code");
let common = require("../../../../utilities/common");
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const constant = require('../../../../config/constant');

class AuthModel {

    async signup(requestData) {
    try {
      const {
        email,
        password,
        full_name,
        phone
      } = requestData;
  
      if (await common.isEmailExists(email)) {
        return [responseCode.NOT_APPROVED, { keyword: "rest_keyword_email_exits" }, {}];
      }
  
      if (await common.isPhoneExists(phone)) {
        return [responseCode.NOT_APPROVED, { keyword: "rest_keyword_phone_exits" }, {}];
      }
  
      const hashedPassword = await common.hashPassword(password);
  
      const insertQuery = `
        INSERT INTO users (email, password, full_name, phone)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await database.query(insertQuery, [email, hashedPassword, full_name, phone]);
  
      if (!result?.insertId) {
        return [responseCode.OPERATION_FAILED, { keyword: "rest_keyword_something_wrong" }, {}];
      }
  
      const user_id = result.insertId;
      const token = await common.generateJWT(user_id);
  
      const userInfo = await common.getUserInfo(user_id);
  
      return [
        responseCode.SUCCESS,
        { keyword: "rest_keyword_singup_successfully" },
        {
          token,
          user_id,
          email: userInfo.email,
          full_name: userInfo.full_name,
          phone: userInfo.phone,
        }
      ];
    } catch (error) {
      console.log("Signup Model Error:", error);
      return [responseCode.OPERATION_FAILED, { keyword: "rest_keyword_something_wrong" }, {}];
    }
    }
  
    async login(requestData) {
      try {
        const { email_phone, password } = requestData;
    
        const [result] = await database.query(
          `SELECT * FROM users WHERE (email = ? OR phone = ?) AND is_active = 1 AND is_deleted = 0`,
          [email_phone, email_phone]
        );
    
        if (result.length === 0) {
          return [responseCode.OPERATION_FAILED, { keyword: "rest_keyword_invalid_credentials" }, {}];
        }
    
        const user = result[0];
    
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("ismatch=====", isMatch);
        if (!isMatch) {
          return [responseCode.OPERATION_FAILED, { keyword: "rest_keyword_invalid_password" }, {}];
        }
    
        const user_token = await common.generateJWT(user.id);
        console.log("Generated JWT:", user_token);
    
        await database.query(
          `UPDATE users SET is_login = 1, last_login = ? WHERE id = ?`,
          [dayjs().format("YYYY-MM-DD HH:mm:ss"), user.id]
        );
    
        return [responseCode.SUCCESS, { keyword: "login_success" }, { user, user_token, role: user.role }];
        
      } catch (error) {
        console.error("Login Error:", error);
        return [responseCode.OPERATION_FAILED, { keyword: "server_error" }, {}];
      }
    }

    async getProductById(requestData) {
      try {
        const { productId } = requestData;
    
        const query = `
          SELECT 
            p.id, 
            p.name, 
            p.description, 
            CONCAT('${constant.profile_image}', p.image) AS image, 
            p.price, 
            c.name AS category 
          FROM tbl_product p
          LEFT JOIN tbl_category c ON p.category_id = c.id
          WHERE p.id = ? AND p.is_active = 1 AND p.is_deleted = 0
        `;
    
        const [product] = await database.query(query, [productId]);
    
        if (!product.length) {
          return [
            responseCode.NO_DATA_FOUND,
            { keyword: "product_not_found" },
            {}
          ];
        }
    
        return [
          responseCode.SUCCESS,
          { keyword: "product_fetch_success" },
          { product: product[0] }
        ];
      } catch (error) {
        console.error("Product Fetch Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error" },
          {}
        ];
      }
    }  

    async productlisting(requestData) {
      try {
        const { category, minPrice, maxPrice, name } = requestData;
    
        let query = `
          SELECT 
            p.id,
            p.name,
            p.description,
            p.price,
            p.category_id,
            CONCAT('${constant.profile_image}', p.image) AS image,
            p.created_at,
            p.updated_at
          FROM tbl_product p
          LEFT JOIN tbl_category c ON p.category_id = c.id
          WHERE p.is_active = 1 AND p.is_deleted = 0
        `;
        
        const params = [];
    
        if (name) {
          query += ` AND p.name LIKE ?`;
          params.push(`%${name}%`);
        }
    
        if (minPrice) {
          query += ` AND p.price >= ?`;
          params.push(minPrice);
        }
    
        if (maxPrice) {
          query += ` AND p.price <= ?`;
          params.push(maxPrice);
        }
    
        if (category && category.toLowerCase() !== 'all') {
          query += ` AND c.name = ?`;
          params.push(category);
        }
    
        const [products] = await database.query(query, params);
    
        if (!products.length) {
          return [
            responseCode.NO_DATA_FOUND,
            { keyword: "product_listing_empty" },
            {}
          ];
        }
    
        return [
          responseCode.SUCCESS,
          { keyword: "product_listing_success" },
          { products }
        ];
    
      } catch (error) {
        console.error("Product Listing Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error" },
          {}
        ];
      }
    } 

    async getCategories(requestData){
      try {
        const query = ` SELECT * FROM tbl_category where is_active = 1 AND is_deleted = 0 `;
        const [categories] = await database.query(query);
        if (!categories.length) {
          return [ responseCode.OPERATION_FAILED, { keyword: "category_fetch_empty"}, {} ];
        }
        return [ responseCode.SUCCESS, { keyword: "category_fetch_success"}, { categories } ];
      } catch (error) {
        console.error("Category Fetch Error:", error);
        return [ responseCode.OPERATION_FAILED, { keyword: "server_error"}, {} ];
      }
    }

    async increasequantity(requestData) {
      try {
        const { productId, userId } = requestData;
    
        const checkQuery = ` SELECT * FROM tbl_cart  WHERE product_id = ? AND user_id = ? AND is_active = 1 AND is_deleted = 0 `;
        const [cartRows] = await database.query(checkQuery, [productId, userId]);
    
        if (!cartRows.length) {
          const insertQuery = `
            INSERT INTO tbl_cart (product_id, user_id, quantity, is_active, is_deleted) 
            VALUES (?, ?, 1, 1, 0)
          `;
          const [insertResult] = await database.query(insertQuery, [productId, userId]);
    
          if (!insertResult.affectedRows) {
            return [
              responseCode.OPERATION_FAILED,
              { keyword: "insert_failed"},
              {}
            ];
          }
    
          return [
            responseCode.SUCCESS,
            { keyword: "cart_add_success"},
            {}
          ];
        } else {
          const updateQuery = `
            UPDATE tbl_cart 
            SET quantity = quantity + 1 
            WHERE product_id = ? AND user_id = ? AND is_active = 1 AND is_deleted = 0
          `;
          const [updateResult] = await database.query(updateQuery, [productId, userId]);
    
          if (!updateResult.affectedRows) {
            return [
              responseCode.OPERATION_FAILED,
              { keyword: "update_failed"},
              {}
            ];
          }
    
          return [
            responseCode.SUCCESS,
            { keyword: "quantity_update_success"},
            {}
          ];
        }
      } catch (error) {
        console.error("Increase Quantity Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error"},
          {}
        ];
      }
    }
    
    async decreasequantity({ userId, productId }) {
      try {
        const checkQuery = `
          SELECT quantity FROM tbl_cart
          WHERE user_id = ? AND product_id = ? AND is_active = 1 AND is_deleted = 0
        `;
        const [rows] = await database.query(checkQuery, [userId, productId]);
    
        if (!rows.length) {
          return [
            responseCode.NO_DATA_FOUND,
            { keyword: "product_not_found" },
            {}
          ];
        }
    
        const currentQty = rows[0].quantity;
    
        if (currentQty <= 1) {
          const deleteQuery = `
            DELETE FROM tbl_cart
            WHERE user_id = ? AND product_id = ? AND is_active = 1 AND is_deleted = 0
          `;
          await database.query(deleteQuery, [userId, productId]);
    
          return [
            responseCode.SUCCESS,
            { keyword: "product_removed"},
            {}
          ];
        } else {
          const updateQuery = `
            UPDATE tbl_cart
            SET quantity = quantity - 1
            WHERE user_id = ? AND product_id = ? AND is_active = 1 AND is_deleted = 0
          `;
          await database.query(updateQuery, [userId, productId]);
    
          return [
            responseCode.SUCCESS,
            { keyword: "product_quantity_success"},
            {}
          ];
        }
      } catch (error) {
        console.error("Decrease Quantity Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error"},
          {}
        ];
      }
    }
    
    async addToCart(requestData) {
      try {
        const { productId, userId } = requestData;
    
        const query = `
          INSERT INTO tbl_cart (product_id, user_id, quantity,is_active,is_deleted) 
          VALUES (?, ?, 1, 1, 0)
        `;
        const [result] = await database.query(query, [productId, userId]);
    
        if (!result.affectedRows) {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "insert_failed"},
            {}
          ];
        }
    
        return [
          responseCode.SUCCESS,
          { keyword: "cart_add_success"},
          {}
        ];
      } catch (error) {
        console.error("Add to Cart Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error"},
          {}
        ];
      }
    }

    async getCartItem(requestData){
      try{
        const { productId,userId } = requestData;
        const query = `SELECT * FROM tbl_cart WHERE user_id = ? and product_id = ? and quantity > 0 AND is_active = 1 AND is_deleted = 0`;
        const [product] = await database.query(query, [userId,productId]);
        if(!product.length){
          return [responseCode.NO_DATA_FOUND, { keyword: "rest_keyword_cart_not_found" }, {}];
        }
        return [responseCode.SUCCESS, { keyword: "rest_keyword_cart_found" }, product];
      }
      catch(err){
        console.log(err);
        return [responseCode.OPERATION_FAILED, { keyword: "server_error"}, {}];
      }
    }
 
    async deleteItemFromCart(requestData) {
      try {
        const { productId, userId } = requestData;
        const query = `
          DELETE FROM tbl_cart 
          WHERE user_id = ? AND product_id = ? AND quantity > 0 AND is_active = 1 AND is_deleted = 0
        `;
        
        const [result] = await database.query(query, [userId, productId]);
    
        if (result.affectedRows === 0) {
          return [responseCode.NO_DATA_FOUND, { keyword: "rest_keyword_cart_not_found"}, {}];
        }
    
        return [responseCode.SUCCESS, { keyword: "rest_keyword_cart_found"}, {}];
      } catch (err) {
        console.error("Delete Cart Item Error:", err);
        return [responseCode.OPERATION_FAILED, { keyword: "server_error"}, {}];
      }
    }
    
    async getCartDetails(requestData) {
      try {
        const { userId } = requestData;
    
        const query = `
          SELECT  c.product_id,  c.quantity,  p.name,  p.price, (p.price * c.quantity) AS total_price FROM tbl_cart c
          JOIN tbl_product p ON c.product_id = p.id
          WHERE  c.user_id = ? AND c.quantity > 0 AND c.is_active = 1 AND c.is_deleted = 0 AND p.is_active = 1 and p.is_deleted = 0 
        `;
    
        const [rows] = await database.query(query, [userId]);
    
        if (!rows.length) {
          return [responseCode.NO_DATA_FOUND, { keyword: "cart_empty", message: "Cart is empty." }, []];
        }
    
        const grandTotal = rows.reduce((sum, item) => sum + Number(item.total_price), 0);
        const formattedTotal = grandTotal.toFixed(2);
        console.log("Grand Total:", formattedTotal);
    
        return [responseCode.SUCCESS, { keyword: "cart_list_fetched" }, { cartItems: rows, grandTotal }];
      } catch (err) {
        console.error("Get Cart List Error:", err);
        return [responseCode.OPERATION_FAILED, { keyword: "server_error" }, {}];
      }
    }

    async confirmOrder(requestData){
      try{
        const { userId ,shipping_address,payment_method } = requestData;
        const [cartItems] = await database.query(
         `select c.product_id , p.name , p.price , c.quantity  from tbl_cart c join tbl_product p on c.product_id = p.id where c.user_id = ?` ,[userId] );
        if(cartItems.length === 0){
          return [responseCode.NO_DATA_FOUND, { keyword: "cart_empty"}, []];
        }
        const total = cartItems.reduce((sum, item) => sum + Number(item.price * item.quantity), 0);
        
        const [orderResult] = await database.query(
          `INSERT INTO tbl_order (user_id, total_price, shipping_address, payment_method, order_status) VALUES (?, ?, ?, ?, ?)`,
          [userId, total, shipping_address, payment_method, 'confirmed']
        );
        
        if(orderResult.affectedRows === 0){
          return [responseCode.OPERATION_FAILED, { keyword: "rest_keyword_something_wrong" }, {}];
        }
        const orderId = orderResult.insertId;
        for (const item of cartItems) {
          await database.query(
            `INSERT INTO tbl_order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
            [orderId, item.product_id, item.quantity, item.price]
          );
        }

        await database.query(`DELETE FROM tbl_cart WHERE user_id = ?`, [userId]);
        console.log("successfully deleetd items");

        return [responseCode.SUCCESS, { keyword: "order_placed"}, {}];

      }
      catch(err){
        console.log(err);
      }
    }

    async orderlisting(requestData) {
      try {
        const { userId } = requestData;
    
        const orderQuery = `SELECT * FROM tbl_order WHERE user_id = ? AND is_deleted = 0 AND is_active = 1 ORDER BY created_at DESC`;
        const [orders] = await database.query(orderQuery, [userId]);
    
        if (orders.length === 0) {
          return [responseCode.NO_DATA_FOUND, { keyword: "order_not_found" }, {}];
        }
    
        const orderIds = orders.map(order => order.id);
        const placeholders = orderIds.map(() => '?').join(', ');
        const itemsQuery = `SELECT * FROM tbl_order_items WHERE order_id IN (${placeholders})`;
        const [items] = await database.query(itemsQuery, orderIds);
    
        const itemsByOrder = {};
        items.forEach(item => {
          if (!itemsByOrder[item.order_id]) {
            itemsByOrder[item.order_id] = [];
          }
          itemsByOrder[item.order_id].push(item);
        });
    
        const fullOrders = orders.map(order => ({
          ...order,
          items: itemsByOrder[order.id] || [],
        }));
    
        return [
          responseCode.SUCCESS,
          { keyword: "order_list_fetched"},
          { orderList: fullOrders },
        ];
      } catch (err) {
        console.log(err);
      }
    }
    
    async userdetail(requestData){
      try{
        const {userId} = requestData ;
        const query = `select * from users where id = ?`;
        const [result] = await database.query(query,[userId]);
        console.log(result);
        if(result.length === 0){
          return [responseCode.NO_DATA_FOUND, { keyword: "user_not_found" }, {}];
        }
        return [responseCode.SUCCESS, { keyword: "user_detail_fetched"}, {userDetail: result}];
      }
      catch(err){
        console.log(err);
      }
    }
    
    async edituserdetail(requestData){
      try{
        const {userId, full_name, address} = requestData ;
        const query = `update users set full_name = ?, address = ? where id = ?`;
        const [result] = await database.query(query,[full_name,address, userId]);
        console.log(result);
        if(result.affectedRows === 0){
          return [responseCode.NO_DATA_FOUND, { keyword: "user_not_found" }, {}];
        }
        return [responseCode.SUCCESS, { keyword: "user_detail_updated"}, {}];
      }
      catch(err){
        console.log(err);
      }
    }
}

module.exports = new AuthModel();
