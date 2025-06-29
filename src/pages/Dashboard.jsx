// src/pages/Dashboard.jsx
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#bb4430] hover:scale-[1.02] transition-transform duration-200">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="text-4xl font-bold text-[#122645] mt-1">128</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#bb4430] hover:scale-[1.02] transition-transform duration-200">
          <p className="text-sm text-gray-500">Categories</p>
          <h2 className="text-4xl font-bold text-[#122645] mt-1">9</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#bb4430] hover:scale-[1.02] transition-transform duration-200">
          <p className="text-sm text-gray-500">Orders</p>
          <h2 className="text-4xl font-bold text-[#122645] mt-1">342</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#bb4430] hover:scale-[1.02] transition-transform duration-200">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-4xl font-bold text-[#122645] mt-1">$23,450</h2>
        </div>
      </div>
    </div>
  );
}