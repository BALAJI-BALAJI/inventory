export default function ProductTable({ products, onDelete, onEdit, onSell }) {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full border-collapse text-sm text-left">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border p-3">#</th>
            <th className="border p-3">Name</th>
            <th className="border p-3">Qty</th>
            <th className="border p-3">Cost Price</th>
            <th className="border p-3">Selling Price</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr
              key={p._id}
              className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
            >
              <td className="border p-3">{i + 1}</td>
              <td className="border p-3">{p.name}</td>
              <td className="border p-3">{p.quantity}</td>
              <td className="border p-3">₹{p.costPrice}</td>
              <td className="border p-3">₹{p.sellingPrice}</td>
              <td className="border p-3 flex gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onSell(p)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Sell
                </button>
                <button
                  onClick={() => onDelete(p._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
