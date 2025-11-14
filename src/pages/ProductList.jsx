import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadProducts } from "../utils/storage";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Product Inventory</h1>

      <Link
        to="/add"
        className="bg-blue-600 text-white px-4 py-2 rounded inline-block mb-4"
      >
        + Add Product
      </Link>

      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Total Cost</th>
            <th className="border p-2">Raw Materials</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border hover:bg-gray-50">
              <td className="p-2 text-blue-600 underline">
                <Link to={`/edit/${p.id}`}>{p.name}</Link>
              </td>
              <td className="p-2">{p.category}</td>
              <td className="p-2 font-semibold">₹{p.totalCost}</td>
              <td className="p-2">{p.materials.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
