'use client';

import { useEffect, useState } from 'react';
import { increasequantity, decreasequantity, deleteItemFromCart, getcartdetails } from '../../api/apiHandler';
import Link from 'next/link';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const fetchCartDetails = async () => {
    const response = await getcartdetails();
    if (response.code == 1) {
      console.log(response.data);
      const { cartItems, grandTotal } = response.data;
      setCartItems(cartItems);
      setGrandTotal(grandTotal);
    } else {
      setCartItems([]);
      setGrandTotal(0);
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const handleIncrease = async (productId) => {
    const res = await increasequantity(productId);
    if (res.code == 1) {
      fetchCartDetails();
    }
  };

  const handleDecrease = async (productId) => {
    const res = await decreasequantity(productId);
    if (res.code == 1) {
      fetchCartDetails();
    }
  };

  const handleDelete = async (productId) => {
    const res = await deleteItemFromCart({ productId });
    if (res.code == 1) {
      fetchCartDetails();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div>
            <p className="text-gray-600 text-center">Your cart is empty. </p>
            <Link href='/userDashboard'>Add some products to your cart.</Link>
        </div>

      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product_id} className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Price: ₹{item.price}</p>
                  <p className="text-gray-600">Total: ₹{item.total_price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrease(item.product_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item.product_id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDelete(item.product_id)}
                    className="ml-4 px-3 py-1 bg-gray-700 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-xl font-semibold text-right text-indigo-800">
            Grand Total: ${grandTotal}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/user/dashboard"
              className="inline-block mt-4 text-indigo-600 border border-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-100 transition"
            >
              Back to Products
            </Link>
            <Link
              href="/user/placeorder"
              className="inline-block mt-4 text-indigo-600 border border-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-100 transition"
            >
              Place order 
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

