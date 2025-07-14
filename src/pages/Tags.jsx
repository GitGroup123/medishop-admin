// src/pages/Tags.jsx
import { useEffect, useState } from 'react';

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");

  const fetchTags = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tags");
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tagNames = name.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const created = [];

    for (const tag of tagNames) {
      try {
        const res = await fetch("http://localhost:8080/api/tags", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: tag }),
        });

        if (res.ok) {
          created.push(tag);
        } else {
          const errMsg = await res.text();
          console.error(`Failed to create tag "${tag}": ${errMsg}`);
        }
      } catch (err) {
        console.error(`Failed to create tag "${tag}":`, err);
      }
    }

    if (created.length > 0) {
      console.log("Tags created:", created);
      setName("");
      fetchTags();
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/tags/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTags();
      }
    } catch (err) {
      console.error("Failed to delete tag:", err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#122645]">🏷️ Tags Management</h2>

      <form onSubmit={handleCreate} className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Enter tags separated by commas"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
        <button
          type="submit"
          className="bg-[#bb4430] hover:bg-[#a03a27] text-white px-4 py-2 rounded"
        >
          Add Tag
        </button>
      </form>

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-3">Existing Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag._id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm">{tag.name}</span>
              <button
                onClick={() => {
                  if (confirm(`Delete tag "${tag.name}"?`)) {
                    handleDelete(tag._id);
                  }
                }}
                className="text-red-600 hover:text-red-800 text-xs"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}