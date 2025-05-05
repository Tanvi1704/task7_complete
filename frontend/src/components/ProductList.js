import React, { useEffect, useState } from "react";
import { fetchProductList, fetchCategory } from "../../src/app/api/apiHandler";
import Link from 'next/link';

const ProductListPage = () => {
  const [filters, setFilters] = useState({
    name: "",
    category: "All",
    minPrice: "",
    maxPrice: "",
  });

  const [categories, setCategories] = useState(["All"]);
  const [products, setProducts] = useState([]);

  const loadCategories = async () => {
    const res = await fetchCategory();
    if (res && res.code == 1 && res.data.categories.length) {
      const catList = res.data.categories.map((cat) => cat.name);
      setCategories(["All", ...catList]);
    }
  };

const getCleanFilters = () => {
  return {
    name: filters.name,
    category: filters.category !== "All" ? filters.category : "",
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  };
};

const handleSearch = async () => {
  const searchFilters = getCleanFilters();
  const response = await fetchProductList(searchFilters);
  if (response && response.code == 1) {
    setProducts(response.data.products);
    console.log("Products fetched successfully.");
  } else {
    setProducts([]);
    console.log("No products found.");
  }
};


  useEffect(() => {
    handleSearch();
  }, [filters]);

  useEffect(() => {
    loadCategories();
    handleSearch();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      category: "All",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product Listing</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />

        <select
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={clearFilters}
        className="bg-gray-300 text-black px-4 py-2 rounded mb-4"
      >
        Clear
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">Price: ₹{product.price}</p>
              <img
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="mt-2 rounded"
              />
            <Link href={`/user/product/${product.id}`}>
              <button className="mt-2 text-blue-600 underline">View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
