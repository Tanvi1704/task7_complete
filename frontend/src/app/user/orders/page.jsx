'use client'
import React, { useEffect, useState } from 'react';
import { orderlisting } from '../../api/apiHandler';
import Link from 'next/link'

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await orderlisting();
      if (res?.data?.orderList) {
        setOrders(res.data.orderList);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-700">Your Orders</h1>
      <Link href='/user/userDashboard' className=" font-bold ml-350 mb-5 text-indigo-700">Back</Link>
      {orders.length == 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded shadow">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.order_status}</p>
              <p><strong>Payment:</strong> {order.payment_method}</p>
              <p><strong>Total:</strong> ₹{order.total_price}</p>
              <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
              <p><strong>Placed On:</strong> {new Date(order.created_at).toLocaleString()}</p>

              <div className="mt-3">
                <h4 className="font-semibold">Items:</h4>
                {order.items.length === 0 ? (
                  <p>No items.</p>
                ) : (
                  <ul className="list-disc pl-5">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        Product ID: {item.product_id} — Qty: {item.quantity}, Price: ₹{item.price}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
