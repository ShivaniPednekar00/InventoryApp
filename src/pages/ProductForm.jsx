import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadProducts, saveProducts } from "../utils/storage";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: Date.now(),
    name: "",
    unit: "units",
    category: "Finished",
    expiry: "",
    materials: []
  });

  useEffect(() => {
    if (id) {
      const all = loadProducts();
      const existing = all.find((p) => p.id == id);
      if (existing) setProduct(existing);
    }
  }, [id]);

  // ➤ Add Material Row
  const addMaterial = () => {
    setProduct({
      ...product,
      materials: [
        ...product.materials,
        {
          id: Date.now(),
          name: "",
          unit: "units",
          qty: "",        
          price: "",      
          totalPrice: 0,
          tax: 0,
          amount: 0
        }
      ]
    });
  };


  const updateMaterial = (mid, field, value) => {
    const updated = product.materials.map((m) => {
      if (m.id === mid) {
        const newM = { ...m, [field]: value };

        const qty = Number(newM.qty || 0);
        const price = Number(newM.price || 0);

        newM.totalPrice = qty * price;
        newM.tax = newM.totalPrice * 0.1; 
        newM.amount = newM.totalPrice + newM.tax;

        return newM;
      }
      return m;
    });

    setProduct({ ...product, materials: updated });
  };

 
  const deleteMaterial = (mid) => {
    setProduct({
      ...product,
      materials: product.materials.filter((m) => m.id !== mid)
    });
  };


  const save = () => {
    const all = loadProducts();

    const totalCost = product.materials.reduce(
      (sum, m) => sum + Number(m.amount),
      0
    );

    const updatedProduct = { ...product, totalCost };

    let newList = [];

    if (id) {
      newList = all.map((p) => (p.id == id ? updatedProduct : p));
    } else {
      newList = [...all, updatedProduct];
    }

    saveProducts(newList);
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Edit Product" : "Add Product"}
      </h2>

    
      <div className="space-y-4">
        <div>
          <label className="font-semibold">Name</label>
          <input
            className="w-full border rounded p-2 mt-1"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>

        <div>
          <label className="font-semibold">Unit</label>
          <select
            className="w-full border rounded p-2 mt-1"
            value={product.unit}
            onChange={(e) => setProduct({ ...product, unit: e.target.value })}
          >
            <option>ml</option>
            <option>ltr</option>
            <option>gm</option>
            <option>kg</option>
            <option>mtr</option>
            <option>mm</option>
            <option>box</option>
            <option>units</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Category</label>
          <select
            className="w-full border rounded p-2 mt-1"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          >
            <option>Finished</option>
            <option>Semi finished</option>
            <option>Subsidiary</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Expiry Date</label>
          <input
            type="date"
            className="w-full border rounded p-2 mt-1"
            value={product.expiry}
            onChange={(e) =>
              setProduct({ ...product, expiry: e.target.value })
            }
          />
        </div>
      </div>


      <h3 className="text-xl font-semibold mt-6 mb-2">Materials</h3>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={addMaterial}
      >
        + Add Material
      </button>

      {product.materials.map((m) => (
        <div
          key={m.id}
          className="grid grid-cols-3 md:grid-cols-7 gap-3 p-3 border rounded mb-3"
        >
          <input
            className="border p-2 rounded"
            placeholder="Material Name"
            value={m.name}
            onChange={(e) => updateMaterial(m.id, "name", e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={m.unit}
            onChange={(e) => updateMaterial(m.id, "unit", e.target.value)}
          >
            <option>ml</option>
            <option>ltr</option>
            <option>gm</option>
            <option>kg</option>
            <option>mtr</option>
            <option>mm</option>
            <option>box</option>
            <option>units</option>
          </select>

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Qty"
            value={m.qty}
            onChange={(e) => updateMaterial(m.id, "qty", e.target.value)}
          />

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Price"
            value={m.price}
            onChange={(e) => updateMaterial(m.id, "price", e.target.value)}
          />

          <span className="text-sm font-medium pt-2">
            ₹{m.totalPrice.toFixed(2)}
          </span>

          <span className="text-sm font-medium pt-2">
            ₹{m.amount.toFixed(2)}
          </span>

          <button
            className="text-red-600 font-bold"
            onClick={() => deleteMaterial(m.id)}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        className="bg-green-600 text-white px-6 py-2 rounded mt-4"
        onClick={save}
      >
        Save Product
      </button>
    </div>
  );
}
