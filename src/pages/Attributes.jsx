import { useEffect, useState } from "react";
import axios from 'axios';

const Attributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState("");
  const [values, setValues] = useState({});
  const [editingAttr, setEditingAttr] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/attributes");
        const withValues = res.data.map(attr => ({
          ...attr,
          values: attr.values || []
        }));
        setAttributes(withValues);
      } catch (err) {
        console.error("Failed to fetch attributes:", err);
      }
    };
    fetchAttributes();
  }, []);

  const handleAddAttribute = async () => {
    if (!newAttribute.trim()) return;
    try {
      const res = await axios.post("http://localhost:8080/api/attributes", {
        name: newAttribute,
        values: []
      });
      console.log("Attribute added:", res.data);
      setAttributes(prev => [...prev, res.data]);
      setNewAttribute("");
    } catch (err) {
      console.error("Failed to add attribute:", err);
    }
  };

  const handleAddValue = async (attrId, value) => {
    if (!value.trim()) return;
    try {
      console.log("Adding value:", value, "to attribute ID:", attrId);
      const res = await axios.post(`http://localhost:8080/api/attributes/${attrId}/values`, { values: [value] });
      console.log("Value added response:", res.data);
      const updatedAttributes = attributes.map((attr) =>
        attr._id === attrId ? { ...attr, values: res.data.values } : attr
      );
      setAttributes(updatedAttributes);
      setValues({ ...values, [attrId]: "" });
    } catch (err) {
      console.error("Failed to add value:", err.response?.data || err.message);
    }
  };

  const handleDeleteAttribute = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/attributes/${id}`);
      setAttributes(attributes.filter((attr) => attr._id !== id));
    } catch (err) {
      console.error("Failed to delete attribute:", err);
    }
  };

  const handleDeleteValue = async (attrId, value) => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/attributes/${attrId}/values`, {
        data: { value }
      });
      const updatedAttributes = attributes.map((attr) =>
        attr._id === attrId ? { ...attr, values: res.data.values } : attr
      );
      setAttributes(updatedAttributes);
    } catch (err) {
      console.error("Failed to delete value:", err);
    }
  };

  const handleEditAttribute = (attrId) => {
    const attr = attributes.find(a => a._id === attrId);
    if (attr) {
      setEditingAttr(attrId);
      setEditingName(attr.name);
    }
  };

  const handleSaveAttribute = (id) => {
    setAttributes(
      attributes.map((attr) =>
        attr._id === id ? { ...attr, name: editingName } : attr
      )
    );
    setEditingAttr(null);
    setEditingName("");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#122645] mb-8">🧩 Manage Product Attributes</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <h2 className="text-xl font-semibold text-[#122645] mb-4">➕ Add New Attribute</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="New attribute name (e.g. Size, Color)"
              value={newAttribute}
              onChange={(e) => setNewAttribute(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bb4430]"
            />
            <button
              onClick={handleAddAttribute}
              className="px-6 py-2 bg-[#bb4430] text-white rounded-md hover:bg-[#a63825] transition"
            >
              Add Attribute
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {attributes.map((attr) => (
            <div key={attr._id} className="bg-white rounded-md shadow p-6">
              <div className="flex justify-between items-center mb-4">
                {editingAttr === attr._id ? (
                  <div className="flex gap-3 items-center w-full">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => handleSaveAttribute(attr._id)}
                      className="text-green-600 font-medium hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingAttr(null)}
                      className="text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-[#122645]">{attr.name}</h2>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEditAttribute(attr._id)}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAttribute(attr._id)}
                        className="text-red-600 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Add Values</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={values[attr._id] || ""}
                    placeholder={`Add value to "${attr.name}"`}
                    onChange={(e) => setValues({ ...values, [attr._id]: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    disabled={editingAttr === attr._id}
                  />
                  <button
                    onClick={async () => await handleAddValue(attr._id, values[attr._id] || "")}
                    disabled={editingAttr === attr._id}
                    className={`px-4 py-2 rounded-md text-white ${
                      editingAttr === attr._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    Add Value
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {attr.values.map((val, i) => (
                  <div
                    key={i}
                    className="bg-[#f8f8f8] px-4 py-1 rounded-full text-sm text-[#122645] border flex items-center gap-2"
                  >
                    {val}
                    <button
                      onClick={() => handleDeleteValue(attr._id, val)}
                      className="text-red-500 hover:text-red-700"
                      disabled={editingAttr === attr._id}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attributes;