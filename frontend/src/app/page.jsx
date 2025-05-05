'use client'
import Link from 'next/link'
import '../app/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  

  return (
    <main className="container mx-auto px-4 py-8">
      <h4 className="text-2xl font-bold text-center mb-8 text-indigo-700">Welcome</h4>
      <ToastContainer />

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6 mb-10">
          <Link href="/user/signup"className="block text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300">For Signup As User</Link>
      </div>
    </main>
  );
}
