import axios from "axios";
import { encrypt, decrypt } from "./crypto";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "api-key": process.env.NEXT_PUBLIC_API_KEY,
    "accept-language": "en",
    "Content-Type": "text/plain",
  },
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
  if (config.data) {
    config.data = encrypt(config.data);
  }
  return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    const raw = response.data;
    if (raw && raw.encrypted_data) {
      return decrypt(raw.encrypted_data);
    } else {
      return decrypt(raw);
    }
  },
  (error) => {
    let errorMessage = "Something went wrong";

    if (error && error.response && error.response.status === 401) {
      window.location.reload();
    } else if (error && error.response && error.response.data) {
      const decrypted = decrypt(error.response.data);
      if (decrypted && decrypted.message) {
        errorMessage = decrypted.message;
      }
    }

    toast.error(errorMessage);
  }
);

export { axiosClient };
