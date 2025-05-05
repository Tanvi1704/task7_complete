'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { addToCart,increasequantity, decreasequantity, fetchProductDeatils, getCartItem} from '../../../api/apiHandler';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      const res = await fetchProductDeatils(productId);
      if (res && res.data && res.code == 1) {
        setProduct(res.data.product);
      }
    };
  
    const checkCartStatus = async () => {
      const res = await getCartItem({productId}); 
      console.log("ressssssssssssssssssssss",res.data[0].quantity);
      if (res.code == 1 && res.data[0].quantity > 0) {
        setQuantity(res.data[0].quantity);
        setInCart(true);
      }
    };
  
    if (productId) {
      getProduct();
      checkCartStatus();
    }
  }, [productId]);
  
  const handleAddToCart = async () => {
    const res = await addToCart(productId);
    console.log("Add to cart response:", res?.data);
    if (res.code == 1) {
      console.log("added")
      setInCart(true);
      setQuantity(1);
    } else {
      console.error('Failed to add to cart');
    }
  };

  const handleIncrease = async () => {
    const res = await increasequantity(productId);
    if (res.code == 1) {
      setQuantity((prev) => prev + 1);
    } else {
      console.error('Failed to increase quantity');
    }
  };

  const handleDecrease = async () => {
    if (quantity <= 1) {
      const res = await decreasequantity(productId);
      if (res.code == 1) {
        setInCart(false);
        setQuantity(0);
      } else {
        console.error('Failed to remove item');
      }
    } else {
      const res = await decreasequantity(productId);
      if (res.code == 1) {
        setQuantity((prev) => prev - 1);
      } else {
        console.error('Failed to decrease quantity');
      }
    }
  };
  

  const handleBack = () => {
    router.push('/user/dashboard');
  };

  if (!product) {
    return <div className="text-center py-20 text-lg">Loading product details...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h4 className="text-2xl font-bold text-center mb-8 text-indigo-700">Product Details</h4>

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6 mb-10 text-center">
        <img src={product.image} alt="alternative"/>
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-700 mb-2">{product.description}</p>
        <p className="text-indigo-600 font-bold mb-4">₹ {product.price}</p>
        <p className="text-indigo-600 font-bold mb-4">{product.category}</p>
        

        {!inCart ? (
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex justify-center items-center space-x-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={handleDecrease}
            >
              −
            </button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        )}

        <button
          className="mt-6 block w-full text-indigo-700 border border-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
          onClick={handleBack}
        >
          Back to All Products
        </button>
        <Link href="/user/cart" className="mt-6 block w-full text-indigo-700 border border-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition">
        Go to cart 
        </Link>
      </div>
    </main>
  );
}




