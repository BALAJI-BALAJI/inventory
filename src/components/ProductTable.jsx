import React from "react";

export default function ProductTable({ products, onDelete, onEdit, onSell }) {
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(id);
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = product.category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(product);
    return acc;
  }, {});

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-800 text-white border-b border-gray-300">
          <th className="p-2 border-r border-gray-300">#</th>
          <th className="p-2 border-r border-gray-300">Name</th>
          <th className="p-2 border-r border-gray-300">Qty</th>
          <th className="p-2 border-r border-gray-300">Cost Price</th>
          <th className="p-2 border-r border-gray-300">Selling Price</th>
          <th className="p-2 border-r border-gray-300">Category</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(groupedProducts).map((categoryName) => {
          const productsInCategory = groupedProducts[categoryName];
          const totalQty = productsInCategory.reduce(
            (sum, p) => sum + (p.quantity || 0),
            0
          );

          return (
            <React.Fragment key={categoryName}>
              <tr className="bg-gray-200 text-gray-800 font-semibold">
                <td colSpan={7} className="p-2">
                  {categoryName} — Total Qty: {totalQty}
                </td>
              </tr>
              {productsInCategory.map((p, i) => (
                <tr key={p._id} className="border-b border-gray-300">
                  <td className="p-2 text-center border-r border-gray-300">{i + 1}</td>
                  <td className="p-2 border-r border-gray-300">{p.name}</td>
                  <td className="p-2 text-center border-r border-gray-300">{p.quantity}</td>
                  <td className="p-2 text-center border-r border-gray-300">{p.costPrice}</td>
                  <td className="p-2 text-center border-r border-gray-300">{p.sellingPrice}</td>
                  <td className="p-2 text-center border-r border-gray-300">{p.category?.name || "—"}</td>
                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(p)}
                      className="bg-yellow-500 text-white px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onSell(p)}
                      className="bg-green-500 text-white px-2 rounded"
                    >
                      Sell
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
