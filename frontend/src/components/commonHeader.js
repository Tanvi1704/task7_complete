"use client";
import Link from "next/link";

export default function commonHeader() {
  return (
    <header className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Common Header</h1>
        <nav className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/user/login">Login</Link>
          <Link href="/user/signup">Signup</Link>
        </nav>
      </div>
    </header>
  );
}
