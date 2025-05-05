"use client";

import { getUserRoleFromToken } from "@/utils/getUserRoleFromToken";
import AdminHeader from "./AdminHeader";
import UserHeader from "./UserHeader";
import CommonHeader from "./commonHeader";

import '../app/globals.css';

export default function Header() {
  const role = getUserRoleFromToken();

  if (role === "admin") {
    return <AdminHeader />;
  }
  
  if (role === "user") {
    return <UserHeader />;
  } 
  
  return <CommonHeader />;
  
}
