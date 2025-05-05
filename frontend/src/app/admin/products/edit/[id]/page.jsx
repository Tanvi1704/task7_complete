'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProductById, updateProduct, getCategory } from '../../../../api/apiHandler';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {
  const { id: productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchCategories();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(productId);
      const { code, message, data } = res;
      if (code == '1' && data.product) {
        setProduct({
          ...data.product,
          category: Number(data.product.category_id),
        });
      } else {
        toast.error(message || 'Could not load product');
      }
    } catch (error) {
      toast.error('Failed to fetch product');
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategory();
      const { code, message, data } = res;
      if (code == '1' && data.categories) {
        setCategories(data.categories);
      } else {
        toast.error(message || 'Could not load categories');
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Product description is required'),
    price: Yup.number().required('Product price is required').positive('Price must be a positive number'),
    category: Yup.string().required('Please select a category'),
  });

  const handleUpdateProduct = async (values) => {
    try {
      const res = await updateProduct(values, { files: [values.image] }, productId);
      const { code, message } = res ;

      if (res.status == 200 || code == '1') {
        await Swal.fire({
          title: 'Success!',
          text: message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        router.push('/admin/products');
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update product');
      console.error(error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h3 className="text-2xl font-bold mb-4">Update Product</h3>
      <Formik
        enableReinitialize
        initialValues={{
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          category: product.category || '',
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleUpdateProduct}
      >
        {({ setFieldValue }) => (
          <Form className="flex flex-col gap-4 bg-gray-100 p-4 rounded shadow-md w-full max-w-xl">
            <div>
              <Field type="text" name="name" placeholder="Product Name" className="p-2 border rounded w-full" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <Field as="textarea" name="description" placeholder="Description" className="p-2 border rounded w-full" />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <Field type="number" name="price" placeholder="Price" className="p-2 border rounded w-full" />
              <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <Field as="select" name="category" className="p-2 border rounded w-full">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <input
                type="file"
                name="image"
                className="p-2 border rounded w-full"
                onChange={(event) => setFieldValue('image', event.currentTarget.files[0])}
              />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Product
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
