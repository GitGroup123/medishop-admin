import { useEffect, useState, useRef } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('https://medishop-backend-rqfh.onrender.com/api/categories')
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const refreshCategories = async () => {
    const res = await fetch('https://medishop-backend-rqfh.onrender.com/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      if (image && typeof image !== 'string') {
        formData.append('image', image);
      }
      // Ensure PUT requests send existing image path if a new image isn't selected
      if (selectedId && typeof image === 'string') {
        formData.append('image', image);
      }

      const res = await fetch(
        selectedId
          ? `https://medishop-backend-rqfh.onrender.com/api/categories/${selectedId}`
          : 'https://medishop-backend-rqfh.onrender.com/api/categories',
        {
          method: selectedId ? 'PUT' : 'POST',
          body: formData,
        }
      );

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = null;
      }

      if (res.ok) {
        await refreshCategories();
        setName('');
        setSlug('');
        if (!selectedId) {
          setImage(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
        setSelectedId(null);
      } else {
        console.error('Error response:', data);
        alert(data?.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error creating category. Check console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`https://medishop-backend-rqfh.onrender.com/api/categories/${id}`, {
        method: "DELETE"
      });
      console.log('Delete response status:', res.status);
      console.log('Delete response text:', await res.text());
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = null;
      }
      if (res.ok) {
        await refreshCategories();
        if (selectedId === id) {
          setName('');
          setSlug('');
          setImage(null);
          setSelectedId(null);
        }
      } else {
        console.error('Delete failed:', data);
        alert(data?.error || "Failed to delete category");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete category.");
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setSlug(cat.slug);
    setImage(cat.image);
    setSelectedId(cat._id);
    // Optional: Track selected category id for update functionality in future
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Form Section */}
      <div className="md:col-span-2 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-[#122645]">
          {selectedId ? 'Edit Category' : 'Add New Category'}
        </h2>
        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            className="w-full border border-gray-300 p-3 rounded"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Category Slug"
            className="w-full border border-gray-300 p-3 rounded"
          />
          <div>
            <label className="block mb-2 font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-gray-300 p-3 rounded"
            />
            {image && typeof image === 'string' && (
              <img
                src={`https://medishop-backend-rqfh.onrender.com/${image.replace(/^\/+/, '')}`}
                alt="Selected"
                className="w-20 h-20 object-cover mt-2 border rounded"
              />
            )}
          </div>
          <button
            onClick={handleCreate}
            className="bg-[#bb4430] hover:bg-[#a53a2a] text-white px-6 py-3 rounded font-semibold"
          >
            {selectedId ? 'Update Category' : 'Save Category'}
          </button>
          {selectedId && (
            <button
              onClick={() => {
                setSelectedId(null);
                setName('');
                setSlug('');
                setImage(null);
              }}
              className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Category List Section */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4 text-[#122645]">Existing Categories</h3>
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat._id}
                className="border border-gray-200 rounded p-3 bg-gray-50 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  {cat.image && (
                    <img
                      src={`https://medishop-backend-rqfh.onrender.com/${cat.image.replace(/^\/+/, '')}`}
                      alt={cat.name}
                      className="w-14 h-14 object-cover rounded border border-gray-300"
                    />
                  )}
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <div className="font-semibold text-[#122645]">{cat.name}</div>
                      <div className="text-sm text-gray-500">/{cat.slug}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => handleEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline text-sm"
                        onClick={() => handleDelete(cat._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
}