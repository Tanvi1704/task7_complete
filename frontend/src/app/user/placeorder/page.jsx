'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import { getcartdetails, confirmOrder } from '../../api/apiHandler';

const PlaceOrder = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    const fetchCartDetails = async () => {
      const response = await getcartdetails();
      if (response.code == 1) {
        const { cartItems, grandTotal } = response.data;
        setCartItems(cartItems);
        setGrandTotal(grandTotal);
      } else {
        setCartItems([]);
        setGrandTotal(0);
      }
    };

    fetchCartDetails();
  }, []);

  const handleConfirmOrder = async () => {
    if (!shippingAddress) {
      Swal.fire('Missing Address', 'Please enter a shipping address.', 'warning');
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Order?',
      text: 'Are you sure you want to place this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, place it!',
    });

    if (result.isConfirmed) {
      const payload = {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      };

      const response = await confirmOrder(payload);
      if (response.code == 1) {
        toast.success('Order placed successfully!')

        setTimeout(() => {
          router.push('/user/dashboard');
        }, 3000);
      } else {
        toast.error('Failed to place order. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Place Order</h1>

      <div className="ml-178">
        <Link
          href="/user/cart"
          className="inline-block mt-4 text-indigo-600 border border-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-100 transition"
        >
          Back to Cart
        </Link>
      </div>

      {cartItems.length == 0 ? (
        <div className="text-center">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link href="/user/dashboard" className="text-indigo-600 underline">
            Add some products to your cart
          </Link>
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
                  <span className="font-semibold">Quantity: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-xl font-semibold text-right text-indigo-800">
            Grand Total: ${grandTotal}
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Shipping Address:</label>
              <textarea
                className="w-full border rounded p-2"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Payment Method:</label>
              <select
                className="w-full border rounded p-2"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Confirm Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaceOrder;




