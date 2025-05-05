'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { userdetail, edituserdetail } from '../../api/apiHandler';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    full_name: Yup.string().required('Full Name is required'),
    address: Yup.string().required('Address is required')
  });

const Profile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
 

  useEffect(() => {
    const fetchUser = async () => {
      const res = await userdetail();
      console.log(res.data)
      if (res.data.userDetail?.[0]) {
        const data = res.data.userDetail[0];
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (values) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to save the changes to your profile?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = {
          userId: user.id,
          full_name: values.full_name,
          address: values.address
        };
        const res = await edituserdetail(payload);
        if (res.code == 1) {
          toast.success('Profile updated successfully!');
          setEditMode(false);
          setUser({ ...user, ...values });
        } else {
          toast.error('Failed to update profile.');
        }
      }
    });
  };
  

  const handleCancel = () => {
    Swal.fire({
      title: 'Cancel Editing?',
      text: "Your changes won't be saved.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel' ,
      cancelButtonText: 'No, keep editing'
    }).then((result) => {
      if (result.isConfirmed) {
        setEditMode(false);
      }
    });
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      {!editMode ? (
        <div className="space-y-2">
          <p><strong>Full Name:</strong> {user.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Contact Number:</strong> {user.phone}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <Formik
          initialValues={{
            full_name: user.full_name || '',
            address: user.address || ''
          }}
          validationSchema ={validationSchema}
          onSubmit={handleSave}
        >
          <Form className="space-y-4">
            <label  htmlFor="full_name">Full Name:</label>
            <Field
              name="full_name"
              type="text"
              className="border p-2 w-full"
              placeholder="Full Name"
            />
            <ErrorMessage name="full_name" component="div" className="text-red-600" />
            <label htmlFor="address">Address:</label>
            <Field
              name="address"
              type="text"
              className="border p-2 w-full"
              placeholder="Address"
            />
            <ErrorMessage name="address" component="div" className="text-red-600" />
            <div className="space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default Profile;
