'use client';

import React, { useEffect, useState } from 'react';
import { getCategory, addProducts, getProducts, deleteProduct } from '../../api/apiHandler';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AddCategoryForm from './AddCategoryForm';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function ProductsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategory();
      console.log("message to getCategory===============",res);
      const { code, message, data } = res;

      const categoryData = data.categories || data.data.categories;

      if (code === '1' && categoryData) {
        const catArray = categoryData.map((cat, index) => ({
          id: cat.id || cat._id || index + 1,
          name: cat.name || 'Unnamed Category',
        }));
        setCategories(catArray);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      console.log("messsage to getproducts=========",res);
      const { code, message, data } = res;

      if (code === '1' && data.products) {
        setProducts(data.products);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      toast.error('Failed to load products');
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Product description is required'),
    price: Yup.number().required('Product price is required').positive('Price must be a positive number'),
    category_id: Yup.string().required('Please select a category'),
  });

  const handleAddProduct = async (values, { resetForm, setSubmitting }) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('category_id', values.category_id);

      if (values.image) {
        formData.append('image', values.image);
      }

      const res = await addProducts(formData);
      const { status, message } = res;

      if (status == 200) {
        toast.success(message || 'Product added successfully');
        resetForm();
        fetchProducts();
      } else {
        toast.error(message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this product?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteProduct(id);
      const { code, message } = res;

      if (code === '1') {
        Swal.fire('Deleted!', message || 'Product deleted successfully', 'success');
        fetchProducts();
      } else {
        Swal.fire('Error', message || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire('Error', 'Something went wrong!', 'error');
    }
  };

  return (
    <div className="p-6">
      <hr />
      <h3 className="text-2xl font-bold mb-4">Manage Category</h3>
      <AddCategoryForm onCategoryAdded={fetchCategories} />
      <hr />
      <h3 className="text-2xl font-bold mb-4">Manage Products</h3>

      <Formik
        initialValues={{
          name: '',
          description: '',
          price: '',
          category_id: '',
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddProduct}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form className="flex flex-col gap-4 bg-gray-100 p-4 rounded shadow-md w-full max-w-xl">
            <div>
              <Field
                type="text"
                name="name"
                placeholder="Product Name"
                className="p-2 border rounded w-full"
              />
              {errors.name && touched.name && <div className="text-red-500">{errors.name}</div>}
            </div>

            <div>
              <Field
                as="textarea"
                name="description"
                placeholder="Description"
                className="p-2 border rounded w-full"
              />
              {errors.description && touched.description && <div className="text-red-500">{errors.description}</div>}
            </div>

            <div>
              <Field
                type="number"
                name="price"
                placeholder="Price"
                className="p-2 border rounded w-full"
              />
              {errors.price && touched.price && <div className="text-red-500">{errors.price}</div>}
            </div>

            <div>
              <Field
                as="select"
                name="category_id"
                className="p-2 border rounded w-full"
              >
                <option value="">Select Category</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={String(cat.id)} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </Field>
              {errors.category_id && touched.category_id && <div className="text-red-500">{errors.category_id}</div>}
            </div>

            <div>
              <input
                type="file"
                name="image"
                className="p-2 border rounded w-full"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFieldValue('image', e.target.files[0]);
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded`}
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </Form>
        )}
      </Formik>

      <h2 className="text-xl font-semibold mt-6 mb-2">All Products</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow-sm bg-white">
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-green-600 font-semibold">${product.price}</p>
              <img
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="mt-2 rounded"
              />
              <button
                onClick={() => router.push(`/admin/products/edit/${product.id || product._id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id || product._id)}
                className="bg-red-600 text-white px-4 py-2 rounded mt-2 ml-2 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}
