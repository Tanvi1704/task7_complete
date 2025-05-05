'use client';

import React, { useEffect, useState } from 'react';
import { listAllUsers, blockUser, unblockUser } from '../../api/apiHandler';
import { toast } from 'react-toastify';

const AdminUsersPage = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    console.log("Calling API to fetch users...");
    setLoading(true);
    try {
      const res  = await listAllUsers(role);
      console.log("API Response:", res);
      const {code, message, data} = res;
      console.log("zxcvybuni",res);
      
      console.log(res.code)
      if (code == '1') {
        setUsers(data.users || []);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error in API call:", error);
      toast.error('Server error while fetching users');
    } finally {
      setLoading(false);
    }
  };
  

  const toggleUserStatus = async (id, isActive) => {
    console.log("Toggling user status:");
    try {
      const res = isActive
        ? await blockUser({ id  , role })
        : await unblockUser({ id , role });

      const {code, message} = res;

      if (code == '1') {
        toast.success(message);
        fetchUsers();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error while updating status');
    }
  };

  useEffect(() => {
      fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin User Management</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.full_name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.phone}</td>
                  <td className="border p-2">
                    {user.is_active ? 'Active' : 'Blocked'}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={`px-3 py-1 rounded text-white ${
                        user.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {user.is_active ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
