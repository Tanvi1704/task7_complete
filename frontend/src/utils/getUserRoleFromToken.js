import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

export function getUserRoleFromToken() {
  const token = Cookies.get("user_token");
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    return decoded?.role || null;
  } catch (err) {
    console.log("Token decode error:", err);
    return null;
  }
}
