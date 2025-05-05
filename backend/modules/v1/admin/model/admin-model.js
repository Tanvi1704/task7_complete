const database = require("../../../../config/database");
let responseCode = require("../../../../utilities/response-error-code");
const constant = require('../../../../config/constant');

class AuthModel {

    //admin
    async addCategory(requestData) {
    try {
      const { user_id, name, role } = requestData;

      if (role !== "admin") {
        return [responseCode.NOT_APPROVED, { keyword: "rest_keyword_unauthorized" }, {}];
      }

      const [existing] = await database.query(
        "SELECT id FROM tbl_category WHERE name = ? AND is_active = 1 AND is_deleted = 0",
        [name]
      );

      if (existing.length > 0) {
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "rest_keyword_category_already_exists" },
          {},
        ];
      }

      const [result] = await database.query(
        "INSERT INTO tbl_category (name) VALUES (?)",
        [name]
      );

      return [
        responseCode.SUCCESS,
        { keyword: "rest_keyword_categoryAdded_successfully" },
        {
          id: result.insertId,
          user_id,
          name,
        },
      ];
    } catch (error) {
      console.error("addCategory Model Error:", error);
      return [
        responseCode.OPERATION_FAILED,
        { keyword: "rest_keyword_something_wrong" },
        {},
      ];
    }
    }

    async getCategory(requestData) {
      try {
  
        const { role } = requestData;
  
        if (role !== "admin") {
          return [responseCode.NOT_APPROVED, { keyword: "rest_keyword_unauthorized" }, {}];
        }
  
  
        const [categories] = await database.query(
          "SELECT name FROM tbl_category WHERE is_active = 1 AND is_deleted = 0"
        );
    
        if (categories.length === 0) {
          return [
            responseCode.NO_DATA_FOUND,
            { keyword: "rest_keyword_no_categories_found" },
            {},
          ];
        }
  
        return [
          responseCode.SUCCESS,
          { keyword: "rest_keyword_getCategory_successfully" },
          { categories },
        ];
      } catch (error) {
        console.error("getCategory Model Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "rest_keyword_something_wrong" },
          {},
        ];
      }
    }

    async getProducts(requestData) {
      try {
        const { role } = requestData;
   
        if (role !== "admin") {
          return [responseCode.NOT_APPROVED, { keyword: "rest_keyword_unauthorized" }, {}];
        }
   
        const [products] = await database.query(
          `SELECT
             id,
             name,
             price,
             description,
             category_id,
             CONCAT('${constant.profile_image}', image) AS image
           FROM tbl_product
           WHERE is_active = 1 AND is_deleted = 0`
        );
   
        if (products.length === 0) {
          return [
            responseCode.NO_DATA_FOUND,
            { keyword: "rest_keyword_no_products_found" },
            {},
          ];
        }
   
        return [
          responseCode.SUCCESS,
          { keyword: "rest_keyword_getproducts_successfully" },
          { products },
        ];
      } catch (error) {
        console.error("getProducts Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "rest_keyword_something_wrong" },
          {},
        ];
      }
    }

    async addProducts(requestData, fileData1) {
      try {
          const { name, description, price, category_id, role } = requestData;
          console.log("reqdata form model============", requestData);
          
          if (role !== "admin") {
            return [responseCode.NOT_APPROVED, { keyword: "rest_keyword_unauthorized" }, {}];
          }


          const image = fileData1?.filename;
          console.log("image form model===========", image);

          const [categoryExists] = await database.query(
              "SELECT id FROM tbl_category WHERE id = ? AND is_active = 1 AND is_deleted = 0",
              [category_id]
          );

          if (categoryExists.length === 0) {
              return [
                  responseCode.NO_DATA_FOUND,
                  { keyword: "rest_keyword_category_not_found" },
                  {},
              ];
          }

          const [result] = await database.query(
              "INSERT INTO tbl_product (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)",
              [name, description, price, category_id, image]
          );
          console.log("result form model",{
            id: result.insertId,
            name,
            description,
            price,
            category_id,
            image,
          })
          return [
              responseCode.SUCCESS,
              { keyword: "rest_keyword_product_added_successfully" },
              {
                  id: result.insertId,
                  name,
                  description,
                  price,
                  category_id,
                  image,
              },
          ];
      } catch (error) {
          console.error("addProducts Model Error:", error);
          return [
              responseCode.OPERATION_FAILED,
              { keyword: "rest_keyword_something_wrong" },
              {},
          ];
      }
    }

    async updateProducts(requestData, fileData1) {
      try {
        console.log("ressssss", requestData);
        const { id, name, description, price, category: category_id, role } = requestData;
    
        if (role !== "admin") {
          return [responseCode.NOT_APPROVED, { keyword: "rest_keyword_unauthorized" }, {}];
        }
    
        const [productRows] = await database.query(
          "SELECT name, description, price, category_id, image FROM tbl_product WHERE id = ? AND is_deleted = 0", [id]
        );
    
        if (!productRows.length) {
          return [responseCode.NO_DATA_FOUND, { keyword: "rest_keyword_product_not_found" }, {}];
        }
    
        const currentProduct = productRows[0];
        const updatedName = name || currentProduct.name;
        const updatedDescription = description || currentProduct.description;
        const updatedPrice = price || currentProduct.price;
        const updatedCategoryId = category_id || currentProduct.category_id;
        let updatedImage = currentProduct.image;
    
        if (fileData1) {
          updatedImage = fileData1.filename;
        }
    
        await database.query(
          `UPDATE tbl_product 
           SET name = ?, description = ?, price = ?, category_id = ?, image = ?, updated_at = NOW() 
           WHERE id = ? AND is_deleted = 0`,
          [updatedName, updatedDescription, updatedPrice, updatedCategoryId, updatedImage, id]
        );
    
        return [
          responseCode.SUCCESS,
          { keyword: "rest_keyword_updateProducts_successfully" },
          {
            id,
            name: updatedName,
            description: updatedDescription,
            price: updatedPrice,
            category_id: updatedCategoryId,
            image: updatedImage
          }
        ];
    
      } catch (error) {
        console.error("updateProducts Model Error:", error);
        return [responseCode.OPERATION_FAILED, { keyword: "rest_keyword_something_wrong" }, {}];
      }
    }
    
    async productbyid(requestData) {
      try {
        const { productId ,role} = requestData ;
        if (role !== "admin") {
          return [responseCode.OPERATION_FAILED, { keyword: "rest_keyword_unauthorized" }, {}];
        }
        const query = ` SELECT p.id, p.name, p.description, p.image, p.price, c.name AS category 
          FROM tbl_product p
          LEFT JOIN tbl_category c ON p.category_id = c.id
          WHERE p.id = ? AND p.is_active = 1 AND p.is_deleted = 0 `;
  
        const [product] = await database.query(query, [productId]);
  
        if (!product.length) {
          return [ responseCode.OPERATION_FAILED,{ keyword: "product_not_found" }, {} ];
        }
  
        return [ responseCode.SUCCESS, { keyword: "product_fetch_success" }, { product: product[0] }];
      } catch (error) {
        console.error("Product Fetch Error:", error);
        return [ responseCode.OPERATION_FAILED, { keyword: "server_error"}, {} ];
      }
    }

    async deleteProduct(requestData) {
      try {
        const { productId , role } = requestData;
    
        if (role !== "admin") {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "rest_keyword_unauthorized", message: "Unauthorized access." },
            {},
          ];
        }
    
        const selectQuery = `
          SELECT * FROM tbl_product WHERE id = ? AND is_active = 1 AND is_deleted = 0`;
        const [product] = await database.query(selectQuery, [productId]);
    
        if (!product.length) {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "product_not_found", message: "Product not found or already deleted." },
            {},
          ];
        }
    
        const deleteQuery = ` UPDATE tbl_product SET is_active = 0, is_deleted = 1 WHERE id = ?  `;
        await database.query(deleteQuery, [productId]);
    
        return [
          responseCode.SUCCESS,
          { keyword: "deleted_product_success"},
          { product: product[0] },
        ];
      } catch (error) {
        console.error("Error deleting product:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error", message: "An error occurred while deleting the product." },
          {},
        ];
      }
    }
    
    async listAllOrders(requestData) {
      try {
        const { role } = requestData;
    
        if (role !== "admin") {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "rest_keyword_unauthorized"},
            {},
          ];
        }
    
        const query = `SELECT  o.id AS order_id, o.order_status AS order_status,o.created_at AS order_date, u.id AS user_id, u.full_name AS user_name, u.email AS user_email, p.id AS product_id, p.name AS product_name, p.price AS product_price, oi.quantity
          FROM tbl_order o
          JOIN users u ON o.user_id = u.id
          JOIN tbl_order_items oi ON o.id = oi.order_id
          JOIN tbl_product p ON oi.product_id = p.id
          WHERE o.is_deleted = 0
          ORDER BY o.created_at DESC`;
    
        const [orders] = await database.query(query);
    
        return [
          responseCode.SUCCESS,
          { keyword: "order_list_success"},
          { orders },
        ];
      } catch (error) {
        console.error("Error fetching orders:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error"},
          {},
        ];
      }
    }

    async changeOrderStatus(requestData) {
      try {
        const { role, orderId, newStatus } = requestData;
        console.log("Order ID:", orderId);

    
        if (role !== "admin") {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "rest_keyword_unauthorized"},
            {},
          ];
        }
    
        const checkQuery = `SELECT * FROM tbl_order WHERE id = ? AND is_deleted = 0`;
        const [order] = await database.query(checkQuery, [orderId]);
    
        if (!order.length) {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "order_not_found" },
            {},
          ];
        }
    
        const updateQuery = `UPDATE tbl_order SET order_status = ? WHERE id = ?`;
        await database.query(updateQuery, [newStatus, orderId]);
    
        return [
          responseCode.SUCCESS,
          { keyword: "status_update_success"},
          {},
        ];
      } catch (error) {
        console.error("Error updating order status:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error"},
          {},
        ];
      }
    }

    async listOrderStatus(requestData) {
      try {
        const { role } = requestData;
    
        if (role !== "admin") {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "rest_keyword_unauthorized"},
            {},
          ];
        }
    
        const query = `
          SELECT COLUMN_TYPE
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_NAME = 'tbl_order' AND COLUMN_NAME = 'order_status';
        `;
    
        const [rows] = await database.query(query);
        const columnType = rows[0].COLUMN_TYPE; 
    
        const statusList = columnType
          .replace("enum(", "")
          .replace(")", "")
          .replace(/'/g, "")
          .split(",");
    
        return [
          responseCode.SUCCESS,
          { message: "Fetched status list." },
          { statuses: statusList },
        ];
      } catch (error) {
        console.error("Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { message: "Server error." },
          {},
        ];
      }
    }
    
    async listAllUsers(requestData) {
      try {
        const { role } = requestData;
        if (role !== "admin") {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "rest_keyword_unauthorized"},
            {},
          ];
        }
    
        const query = `SELECT id, full_name, email, phone, is_active, is_deleted, is_login FROM users WHERE is_deleted = 0 AND role = 'user'`;
        const [users] = await database.query(query);
    
        console.log("Fetched Users:", users);
        return [
          responseCode.SUCCESS,
          { keyword: "user_list_success"},
          { users },
        ];
      } catch (error) {
        console.error("User List Fetch Error:", error); 
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error"},
          {},
        ];
      }
    }
      
    async blockUser(requestData) {
      try {
        const { role, id } = requestData;
    
        if (role !== "admin") {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "rest_keyword_unauthorized"},
            {},
          ];
        }
    
        const query = ` UPDATE users SET is_active = 0, is_deleted = 0 WHERE id = ? `;
        await database.query(query, [id]);
    
        return [
          responseCode.SUCCESS,
          { keyword: "block_success"},
          {},
        ];
      } catch (error) {
        console.error("Block User Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error"},
          {},
        ];
      }
    }

    async unblockUser(requestData) {
      try {
        const { role, id } = requestData;
    
        if (role !== "admin") {
          return [
            responseCode.OPERATION_FAILED,
            { keyword: "rest_keyword_unauthorized"},
            {},
          ];
        }
    
        const query = `UPDATE users SET is_active = 1, is_deleted = 0 WHERE id = ?`;
        await database.query(query, [id]);
    
        return [
          responseCode.SUCCESS,
          { keyword: "unblock_success"},
          {},
        ];
      } catch (error) {
        console.error("Unblock User Error:", error);
        return [
          responseCode.OPERATION_FAILED,
          { keyword: "server_error"},
          {},
        ];
      }
    }
    
    
    
    


}

module.exports = new AuthModel();
