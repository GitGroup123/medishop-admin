import { Outlet, NavLink } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const menuItems = [
  {
    section: "Store",
    items: [
      { name: "Orders", path: "/admin/orders" },
      { name: "Customers", path: "/admin/customers" },
      { name: "Coupons", path: "/admin/coupons" },
      { name: "Settings", path: "/admin/settings" },
    ],
  },
  {
    section: "Products",
    items: [
      { name: "All Products", path: "/admin/products" },
      { name: "Add New Product", path: "/admin/products/new" },
      { name: "Categories", path: "/admin/products/categories" },
      { name: "Attributes", path: "/admin/products/attributes" },
      { name: "Tags", path: "/admin/products/tags" },
    ],
  },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#122645] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10">Fakeeri Admin</h2>
        <nav className="space-y-6">
          {menuItems.map((group) => (
            <div key={group.section}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">
                {group.section}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg transition ${
                        isActive
                          ? "bg-white text-[#122645] font-semibold"
                          : "hover:bg-[#1e365f]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div className="text-[#bb4430] text-lg font-semibold">
             Ecommerce Management
          </div>
          <div className="flex items-center gap-4 text-[#122645] text-xl">
            <a href="/admin/profile" title="Profile" className="hover:text-[#bb4430]">
              <FaUserCircle />
            </a>
            <a href="/logout" title="Logout" className="hover:text-[#bb4430]">
              <FaSignOutAlt />
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 bg-[#f8f8f8] min-h-[calc(100vh-72px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}