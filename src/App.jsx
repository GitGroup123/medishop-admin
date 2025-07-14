import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import NewProduct from "./pages/NewProduct";
import Categories from "./pages/Categories";
import Attributes from "./pages/Attributes";
import Tags from "./pages/Tags";
import EditProduct from "./pages/EditProduct";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<NewProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="products/categories" element={<Categories />} />
        <Route path="products/attributes" element={<Attributes />} />
        <Route path="products/tags" element={<Tags />} />
      </Route>
    </Routes>
  );
}