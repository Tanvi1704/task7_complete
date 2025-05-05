import { axiosClient } from "./apiClient";
import Cookies from "js-cookie";
import axios from "axios";

export async function signup(userData) {
  console.log("userdata from apihandlerr===========",userData);
  try {
    const response = await axiosClient.post("/v1/user/signup", userData);
    console.log("response from apiHandler=============",response);
    return response;
  } catch (error) {
    console.log("Signup API Error:", error);
    return null;
  }
}

export async function login(userData) {
  console.log("userdata from apihandlerr===========",userData);
  try {
    const response = await axiosClient.post("/v1/user/login", userData);
    console.log("response from apiHandler=============",response);
    return response;
  } catch (error) {
    console.log("Login API Error:", error);
    return null;
  }
}

export const fetchProductList = async (filters = {}) => {
  try {
    const token = Cookies.get("user_token");

    if (!token) {
      console.log(" No token found in cookies. User is unauthorized.");
    }

    const response = await axiosClient.post("/v1/user/productlisting",filters, {
        headers: {
          token: token 
        }
      }
    );

    console.log("Product List | Response:", response);
    return response;

  } catch (err) {
    console.error("Error fetching product list:", err);
    return null;
  }
};

export const fetchProductDeatils = async (productId) => {
  try {
    const token = Cookies.get("user_token");

    if (!token) {
      console.log(" No token found in cookies. User is unauthorized.");
    }

    const response = await axiosClient.post(`/v1/user/getproductbyid/${productId}`, 
      {productId},
      {
        headers: {
          token: token 
        }
      }
    );

    console.log("Product details | Response:", response);
    return response;
    
  } catch (err) {
    console.error("Error fetching product list:", err);
    return null;
  }
};

export const fetchCategory = async () => {
  try {
    const token = Cookies.get("user_token");

    if (!token) {
      console.log(" No token found in cookies. User is unauthorized.");
    }

    const response = await axiosClient.get(`/v1/user/getcategories`, {
        headers: {
          token: token 
        }
      }
    );
    console.log("fetchCatgeory Response:", response);
    return response;
    
  } catch (err) {
    console.error("Error fetchCatgeory list:", err);
    return null;
  }
};

export const addToCart = async (productId) => {
  try {
    const token = Cookies.get("user_token");
    if (!token) {
      console.log("No token found in cookies. User is unauthorized.");
      return null;
    }
    const response = await axiosClient.post(
      `/v1/user/addToCart`,
      { productId },
      {
        headers: {
          token: token    
        }
      }
    );

    console.log("addToCart Response:", response);
    return response;

  } catch (err) {
    console.error("Error addToCart:", err);
    return null;
  }
};

export const increasequantity = async (productId) => {
  try {
    const token = Cookies.get("user_token");
    if (!token) {
      console.log("No token found in cookies. User is unauthorized.");
      return null;
    }

    const response = await axiosClient.post(
      `/v1/user/increasequantity`,
      {productId},
      {
        headers: {
          token: token 
        }
      }
    );

    console.log("increasequantity Response:", response);
    return response;

  } catch (err) {
    console.error("Error increasequantity list:", err);
    return null;
  }
};

export const decreasequantity = async (productId) => {
  try {
    const token = Cookies.get("user_token");
    if (!token) {
      console.log("No token found in cookies. User is unauthorized.");
      return null;
    }

    const response = await axiosClient.post(
      `/v1/user/decreasequantity`,
      {productId},
      {
        headers: {
          token: token 
        }
      }
    );

    console.log("decreasequantity Response:", response);
    return response;

  } catch (err) {
    console.error("Error decreasequantity list:", err);
    return null;
  }
};

export const getCartItem = async ({ productId }) => {
  try {
    const token = Cookies.get("user_token");
    if (!token) {
      console.log("No token found in cookies. User is unauthorized.");
      return null;
    }

    const response = await axiosClient.post(
      `/v1/user/getcartitem`,
      { productId },
      {
        headers: {
          token: token 
        }
      }
    );

    console.log("getcartitem Response:", response);
    return response;

  } catch (err) {
    console.error("Error getcartitem list:", err);
    return null;
  }
};

export const deleteItemFromCart = async ({ productId }) => {
  try {
    const token = Cookies.get("user_token");
    if (!token) {
      console.log("No token found in cookies. User is unauthorized.");
      return null;
    }

    const response = await axiosClient.post(
      `/v1/user/deleteitemfromcart`,
      { productId },
      {
        headers: {
          token: token 
        }
      }
    );

    console.log("deleteItemFromCart Response:", response);
    return response;

  } catch (err) {
    console.error("Error deleteItemFromCart list:", err);
    return null;
  }
};

export const getcartdetails = async () => {
  try {
    const token = Cookies.get("user_token");

    if (!token) {
      console.log(" No token found in cookies. User is unauthorized.");
    }

    const response = await axiosClient.post(`/v1/user/getcartdetails`,
      {},
      {
        headers: {
          token: token 
        }
      }
    );
    console.log("getcartdetails Response:", response);
    return response;
    
  } catch (err) {
    console.error("Error getcartdetails list:", err);
    return null;
  }
};

export const confirmOrder = async (payload) => {
  try {
    const token = Cookies.get("user_token");
    if (!token) {
      console.log("No token found in cookies. User is unauthorized.");
      return;
    }

    const response = await axiosClient.post(
      `/v1/user/confirmorder`,
      payload,
      {
        headers: {
          token: token,
        },
      }
    );
    console.log("confirmOrder Response:", response);
    return response;
  } catch (err) {
    console.error("Error confirmOrder:", err);
    return null;
  }
};

export const orderlisting = async () => {
  try {
    const token = Cookies.get("user_token");
    if (!token) {
      console.log("No token found in cookies. User is unauthorized.");
      return;
    }

    const response = await axiosClient.post(`/v1/user/orderlisting`, {},
      {
        headers: {
          token: token,
        },
      }
    );
    console.log("orderlisting Response:", response);
    return response;
  } catch (err) {
    console.error("Error orderlisting:", err);
    return null;
  }
};

export const userdetail = async () => {
  try {
    const token = Cookies.get("user_token");
    if (!token) {
      console.log("No token found in cookies. User is unauthorized.");
      return;
    }

    const response = await axiosClient.post( `/v1/user/userdetail`,{},
      {
        headers: {
          token: token,
        },
      }
    );
    console.log("userdetail Response:", response);
    return response;
  } catch (err) {
    console.error("Error userdetail:", err);
    return null;
  }
};

export const edituserdetail = async (payload) => {
  try {
    const token = Cookies.get("user_token");
    if (!token) {
      console.log("No token found in cookies. User is unauthorized.");
      return;
    }

    const response = await axiosClient.post(
      `/v1/user/edituserdetail`,
      payload,
      {
        headers: {
          token: token,
        },
      }
    );
    console.log("edituserdetail Response:", response);
    return response;
  } catch (err) {
    console.error("Error edituserdetail:", err);
    return null;
  }
};

//====================================admin================================================================

export async function getCategory() {
  console.log("userdata from apiHandler ===========");

  const token = Cookies.get('user_token');
  console.log("token for getCategory============",token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.get("/v1/admin/get-category", {
      headers: {
        token: token,
      },
    });

    console.log("response from apiHandler =============", response);
    return response;
  } catch (error) {
    console.log("getCategory API Error:", error);
    return null;
  }
}

export async function addCategory(data) {
  console.log("userdata from apihandler ===========", data);

  const token = Cookies.get('user_token');
  console.log("token for addCategory============",token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.post(
      "/v1/admin/add-category",
      data,
      {
        headers: {
          token: token,
        },
      }
    );
    
    console.log("response from apiHandler =============", response);
    return response;
  } catch (error) {
    console.log("addCategory API Error:", error);
    return null;
  }
}

export async function addProducts(formData) {
  console.log("userdata from apihandler ===========", formData);

  const token = Cookies.get('user_token');
  console.log("token for addProducts============", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/v1/admin/add-product",
      formData,
      {
        headers: {
          token: token,
          "api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    );

    console.log("response from apiHandler =============", response);
    return response;

  } catch (error) {
    console.log("addProducts API Error:", error);
    return null;
  }
}

export async function getProducts() {
  console.log("userdata from apiHandler ===========");

  const token = Cookies.get('user_token');
  console.log("token for getCategory============",token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.get("/v1/admin/get-products", {
      headers: {
        token: token,
      },
    });

    console.log("response from apiHandler =============", response);
    return response;
  } catch (error) {
    console.log("getProducts API Error:", error);
    return null;
  }
}

export async function updateProduct(data, fileInput, productId) {
  console.log("userdata from api handler ===========", data);

  const token = Cookies.get('user_token');
  console.log("token for updateProducts============", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  const formData = new FormData();
  formData.append("id", productId);
  formData.append("name", data.name || '');
  formData.append("description", data.description || '');
  formData.append("price", data.price || '');
  formData.append("category", Number(data.category) || '');


  console.log("formdata============", formData);

  if (fileInput && fileInput.files[0]) {
    formData.append("image", fileInput.files[0]);
  }

  try {
    const response = await axios.put(
      `http://localhost:3000/v1/admin/${productId}`,
      formData,
      {
        headers: {
          // "Content-Type": "multipart/form-data",
          token: token,
          "api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    );

    console.log("response from apiHandler =============", response);
    return response;

  } catch (error) {
    console.log("updateProducts API Error:", error);
    return null;
  }
}

export async function getProductById(id) {
  console.log("Fetching product by ID:", id);

  const token = Cookies.get('user_token');
  console.log("Token for getProductById:", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.post(`/v1/admin/getproductbyid/${id}`, 
      {},
      {
      headers: {
        token: token,
      },
    });

    console.log("Response from getProductById API:", response);
    return response;
  } catch (error) {
    console.error("getProductById API Error:", error);
    return null;
  }
}

export async function deleteProduct(id) {

  const token = Cookies.get('user_token');
  console.log("Token for deleteProduct:", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.post(`/v1/admin/deleteproduct/${id}`, 
      {},
      {
      headers: {
        token: token,
      },
    });

    console.log("Response from getProductById API:", response);
    return response;
  } catch (error) {
    console.error("getProductById API Error:", error);
    return null;
  }
}

export async function listAllOrders() {
  const token = Cookies.get('user_token');
  console.log("Token for listallorders:", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.post(`/v1/admin/listallorders`, 
      {},
      {
      headers: {
        token: token,
      },
    });

    console.log("Response from listallorders API:", response);
    return response;
  } catch (error) {
    console.error("listallorders API Error:", error);
    return null;
  }
}

export async function changeOrderStatus(id,newStatus) {
  const token = Cookies.get('user_token');
  console.log("Token for getProductById:", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.post(`/v1/admin/changeorderstatus/${id}`, 
      {newStatus},
      {
      headers: {
        token: token,
      },
    });

    console.log("Response from changeOrderStatus API:", response);
    return response;
  } catch (error) {
    console.error("changeOrderStatus API Error:", error);
    return null;
  }
}

export async function listOrderStatus() {
  const token = Cookies.get('user_token');
  console.log("Token for getProductById:", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.post(`/v1/admin/listorderstatus`, 
      {},
      {
      headers: {
        token: token,
      },
    });

    console.log("Response from listOrderStatus API:", response);
    return response;
  } catch (error) {
    console.error("listOrderStatus API Error:", error);
    return null;
  }
}

export async function listAllUsers(role) {
  const token = Cookies.get('user_token');
  console.log("Token for listAllUsers:", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.post(`/v1/admin/listallusers`, {role}, {
      headers: {
        token: token,
      },
    });

    console.log("Response from listAllUsers API:", response);
    return response;
  } catch (error) {
    console.error("listAllUsers API Error:", error);
    return null;
  }
}

export async function blockUser({ id }) {
  const token = Cookies.get('user_token');
  console.log("Token for blockUser:", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.post(`/v1/admin/blockuser`, { id }, {
      headers: {
        token: token,
      },
    });

    console.log("Response from blockUser API:", response);
    return response;
  } catch (error) {
    console.error("blockUser API Error:", error);
    return null;
  }
}

export async function unblockUser({ id }) {
  const token = Cookies.get('user_token');
  console.log("Token for unblockUser:", token);

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const response = await axiosClient.post(`/v1/admin/unblockuser`, { id }, {
      headers: {
        token: token,
      },
    });

    console.log("Response from unblockUser API:", response);
    return response;
  } catch (error) {
    console.error("blockUser API Error:", error);
    return null;
  }
}
