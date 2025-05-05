"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function AdminHeader() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('user_token');
    setIsAuthenticated(Boolean(token));
  }, []);
  

  const handleLogout = () => {
    Cookies.remove("user_token");
    setIsAuthenticated(false);
    router.push("/user/login");
  };

  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <nav className="space-x-4">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/manageorders">Orders</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-white underline hover:text-gray-300">
              Logout
            </button>
          ) : (
            <Link href="user/login" className="text-white underline hover:text-gray-300">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
