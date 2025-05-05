"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useState } from "react";
import { login } from "../../api/apiHandler";
import Link from "next/link";

const loginSchema = Yup.object({
  email_phone: Yup.string()
    .required("Email or phone number is required")
    .min(10, "Please enter a valid email or phone number"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        email_phone: values.email_phone,
        password: values.password,
      };

      const response = await login(payload);
      console.log("response from login page", response);
      const { code, message, data } = response;
      console.log("Code:", code);
      console.log("Message:", message);
      console.log("Data:", data);

      if (code === '1' && data.user_token) {
        Cookies.set("user_token", data.user_token, { expires: 1 });

        if (data.role === 'admin') {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }

        toast.success(message);
        console.log("Login Successfull");
      } else {
        toast.error(message);
        console.log("Login failed");
      }
    } catch (error) {
      console.log("Login Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h4 className="text-2xl font-bold text-center mb-8 text-indigo-700">
        Log In to Your Account
      </h4>

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6 mb-10">
        <Formik
          initialValues={{
            email_phone: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email or Phone Number
              </label>
              <Field
                name="email_phone"
                className="w-full mt-1 border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="email_phone"
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

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/user/signup" className="text-indigo-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
    </main>
  );
}
