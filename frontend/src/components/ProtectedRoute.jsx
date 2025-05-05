"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { getUserRoleFromToken } from "@/utils/getUserRoleFromToken";

const ProtectedRoute = ({ allowedRole, children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("user_token");
    const role = getUserRoleFromToken();

    if (!token || role !== allowedRole) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You are not allowed to access this page.",
      }).then(() => {
        router.push("/login");
      });
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
