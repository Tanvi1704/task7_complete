'use client'

import React, { useEffect, useState } from "react";
import { listAllOrders, changeOrderStatus, listOrderStatus } from '../../api/apiHandler'
import { toast } from "react-toastify";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrdersAndStatuses();
  }, []);

  const fetchOrdersAndStatuses = async () => {
    setLoading(true);
    const orderRes = await listAllOrders();
    const statusRes = await listOrderStatus();
    if (orderRes.data.orders) {
      setOrders(orderRes.data.orders);
    }

    if (statusRes.data.statuses) {
      setStatuses(statusRes.data.statuses);
    }

    setLoading(false);
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    const response = await changeOrderStatus(orderId, newStatus);
    console.log("swedrtfgyhuij==================",response);
    if ( response.code === '1') {
      toast.success(response.message);
      fetchOrdersAndStatuses(); 
    } else {
      toast(response.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={`${order.order_id}-${index}`} className="hover:bg-gray-50">
                  <td className="border p-2">{order.order_id}</td>
                  <td className="border p-2">{new Date(order.order_date).toLocaleDateString()}</td>
                  <td className="border p-2">{order.user_name} <br />({order.user_email})</td>
                  <td className="border p-2">{order.product_name}</td>
                  <td className="border p-2">{order.quantity}</td>
                  <td className="border p-2">₹{order.product_price}</td>
                  <td className="border p-2">{order.order_status}</td>
                  <td className="border p-2">
                    <select
                      className="border p-1"
                      value={order.order_status}
                      onChange={(e) => handleChangeStatus(order.order_id, e.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
