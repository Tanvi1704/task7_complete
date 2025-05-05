'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { addCategory, getCategory } from '../../api/apiHandler';

export default function AddCategoryForm({ onCategoryAdded }) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Category name is required'),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategory();
      console.log("API Response for Categories:", res);

      const { code, message, data } = res;
      const categoryData = data.categories || [];

      if (code === '1' && categoryData) {
        setCategories(categoryData);
      } else {
        toast.error(message || 'Failed to load categories');
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error('Failed to load categories');
    }
  };

  const handleAddCategory = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      console.log("Adding category:", values.name);
      const res = await addCategory({ name: values.name });
      console.log("Add category response:", res);

      const code = res.code || res.data?.code;
      const message = res.message || res.data?.message;

      if (code === '1') {
        toast.success(message);
        resetForm();
        fetchCategories(); // Refresh
        if (typeof onCategoryAdded === 'function') {
          onCategoryAdded();
        }
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error('Error adding category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddCategory}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-4 bg-gray-100 p-4 rounded shadow-md w-full max-w-md">
            <Field
              name="name"
              placeholder="Category Name"
              className="p-2 border rounded"
            />
            {errors.name && touched.name && (
              <div className="text-red-500 text-sm">{errors.name}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded`}
            >
              {isLoading ? 'Adding...' : 'Add Category'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Category List</h3>
        {categories.length > 0 ? (
          <ul className="list-disc pl-5">
            {categories.map((category) => (
              <li key={category.id} className="text-gray-700">
                {category.name} 
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No categories available</p>
        )}
      </div>
    </div>
  );
}
