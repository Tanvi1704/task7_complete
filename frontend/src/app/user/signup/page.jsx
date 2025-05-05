"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useState } from "react";
import { signup } from "../../api/apiHandler";
import Link from "next/link";

const signupSchema = Yup.object({
  full_name: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain letters")
    .matches(/\d/, "Password must contain a number"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const payload = {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };
  
      const response = await signup(payload);
      console.log("response from signup page", response);
  
      const { code, message, data } = response;
      console.log("Code:", code);
      console.log("Message:", message);
      console.log("Data:", data);
  
      if (code === '1') {
        // Cookies.set("user_token", data.token, { expires: 1 });
        toast.success(message);
        console.log("Signup successful!");
        resetForm();
        router.push("/user/login");
      } else {
        toast.error(message);
        console.log("Signup failed");
      }
    } catch (error) {
      console.log("Signup Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h4 className="text-2xl font-bold text-center mb-8 text-indigo-700">
        Create Your Account
      </h4>

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6 mb-10">
        <Formik
          initialValues={{
            full_name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Field
                name="full_name"
                className="w-full mt-1 border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="full_name"
                component="div"
                className="text-red-500 mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Field
                name="email"
                type="email"
                className="w-full mt-1 border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Field
                name="phone"
                className="w-full mt-1 border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Field
                name="password"
                type="password"
                className="w-full mt-1 border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Field
                name="confirmPassword"
                type="password"
                className="w-full mt-1 border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 mt-2"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?
                <Link href="/user/login" className="text-indigo-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>

          </Form>
        </Formik>
      </div>
    </main>
  );
}
