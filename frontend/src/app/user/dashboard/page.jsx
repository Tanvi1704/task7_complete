"use client";
import ProductList from "../../../components/ProductList";

export default function UserDashboard() {
  return (
      <main className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-indigo-700">User Dashboard</h2>
        <p className="mt-4">Welcome to your dashboard!</p>
        <ProductList />
      </main>
  );
}
