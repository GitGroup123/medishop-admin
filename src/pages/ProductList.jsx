import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories");
        const map = {};
        res.data.forEach((cat) => {
          map[cat._id] = cat.name;
        });
        setCategoryMap(map);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete the product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#122645]">📦 All Products</h1>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="bg-[#bb4430] text-white px-5 py-2 rounded-md hover:bg-[#a63725] transition"
          >
            ➕ Add New Product
          </button>
        </div>

        {/* Placeholder table */}
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-[#f8f8f8] text-sm text-gray-600">
            <tr>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              console.log("Product:", product.name, "Categories:", product.categories);
              return (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border font-medium text-[#122645]">
                    <div>{product.name}</div>
                    <div className="text-xs text-gray-500">₹{product.price || "—"}</div>
                  </td>
                  <td className="px-4 py-2 border text-xs text-gray-600">
                    {Array.isArray(product.categories) && product.categories.length > 0
                      ? product.categories.map((cat) => cat?.name || "Unnamed").join(", ")
                      : "No categories"}
                  </td>
                  <td className="px-4 py-2 border">₹{product.price || "—"}</td>
                  <td className="px-4 py-2 border text-green-600 font-semibold">
                    {product.type === "variable" ? `${product.variations?.length || 0} variants` : "In Stock"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}