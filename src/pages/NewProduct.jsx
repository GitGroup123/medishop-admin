import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
export default function NewProduct() {
   const galleryInputRef = useRef(null); 
  const [productType, setProductType] = useState("simple");
  const [activeTab, setActiveTab] = useState("basic");
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [tags, setTags] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [searchAttribute, setSearchAttribute] = useState("");
  const [searchTag, setSearchTag] = useState("");

  // Add for attribute generation toggle
  const [generateVariants, setGenerateVariants] = useState(false);

  const [productName, setProductName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Variations state for variable products
  const [variations, setVariations] = useState([]);

  const attributeGroups = selectedAttributes.map((attr) => ({
  name: attr.name,
  values: attr.values,
}));

const generateCombinations = (groups) => {
  if (groups.length === 0) return [];
  return groups.reduce((acc, group) => {
    const temp = [];
    group.values.forEach((value) => {
      if (acc.length === 0) {
        temp.push([{ name: group.name, value }]);
      } else {
        acc.forEach((combo) => {
          temp.push([...combo, { name: group.name, value }]);
        });
      }
    });
    return temp;
  }, []);
};
const combinations = generateCombinations(attributeGroups);
useEffect(() => {
  const attributeGroups = selectedAttributes
    .filter((attr) => attr.values.length > 0)
    .map((attr) => ({
      name: attr.name,  
      values: attr.values
    }));

  const generateCombinations = (groups) => {
    if (groups.length === 0) return [];
    return groups.reduce((acc, group) => {
      const temp = [];
      group.values.forEach((value) => {
        if (acc.length === 0) {
          temp.push([{ name: group.name, value }]);
        } else {
          acc.forEach((combo) => {
            temp.push([...combo, { name: group.name, value }]);
          });
        }
      });
      return temp;
    }, []);
  };

  const combos = generateCombinations(attributeGroups);

  const newVariants = combos.map((combo) => ({
    attributes: Object.fromEntries(combo.map((c) => [c.name, c.value])),
    sku: "",
    price: "",
    salePrice: "",
    stock: "",
    stockStatus: "in_stock",
    image: null,
  }));

  setVariations(newVariants);
}, [selectedAttributes]);





  useEffect(() => {
    fetch("https://medishop-backend-rqfh.onrender.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories", err));

    fetch("https://medishop-backend-rqfh.onrender.com/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Failed to fetch tags", err));

    fetch("https://medishop-backend-rqfh.onrender.com/api/attributes")
      .then((res) => res.json())
      .then((data) => setAttributes(data))
      .catch((err) => console.error("Failed to fetch attributes", err));
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("https://medishop-backend-rqfh.onrender.com/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, slug: newCategoryName.toLowerCase().replace(/\s+/g, "-") }),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        setNewCategoryName("");
      } else {
        console.error("Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const res = await fetch("https://medishop-backend-rqfh.onrender.com/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName, slug: newTagName.toLowerCase().replace(/\s+/g, "-") }),
      });
      if (res.ok) {
        const newTag = await res.json();
        setTags([...tags, newTag]);
        setNewTagName("");
      } else {
        console.error("Failed to add tag");
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleSaveProduct = async () => {
      if (!productName.trim()) return alert("Product name is required.");
  if (!shortDesc.trim()) return alert("Short description is required.");
   if (!price || isNaN(price) || Number(price) <= 0)
    return alert("Regular price must be a valid positive number.");
  if (salePrice && Number(salePrice) > Number(price))
    return alert("Sale price must be less than or equal to the regular price.");
  if (!productImage) return alert("Product image is required.");
  if (selectedCategories.length === 0)
    return alert("Please select at least one category.");
  if (!detailedDesc.trim()) return alert("Detailed description is required.");
 
    console.log("Saving product...");
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("type", productType);
    formData.append("shortDesc", shortDesc);
    formData.append("description", detailedDesc);
    formData.append("price", price);
    formData.append("salePrice", salePrice);
    formData.append("categories", JSON.stringify(selectedCategories));
    formData.append("tags", JSON.stringify(selectedTags));
    if (productImage) formData.append("mainImage", productImage);
    galleryImages.forEach((img, i) => {
      formData.append(`gallery`, img);
    });
    // Debug: log form data before sending
    console.log("Form Data Ready:");
    console.log("Product Name:", productName);
    console.log("Type:", productType);
    console.log("Categories:", selectedCategories);
    console.log("Tags:", selectedTags);
    // If variations exist, log them
    // if (productType === "variable") {
    //   formData.append("variations", JSON.stringify(variations));
    //   console.log("Variations:", variations);
    // }
    if (productType === "variable") {
  const variationImageFiles = [];

  const cleanVariations = variations.map((variant) => {
    if (variant.image) variationImageFiles.push(variant.image);
    return { ...variant, image: null }; // remove file before sending
  });

  formData.append("variations", JSON.stringify(cleanVariations));

  // Send each image separately
  variationImageFiles.forEach((file) => formData.append("variationImages", file));
}
console.log("📦 Submitting variations:", variations);

    try {
      const res = await fetch("https://medishop-backend-rqfh.onrender.com/api/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product saved!");
      } else {
        console.error("Error saving product", data);
        alert("Failed to save product");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Column - 70% */}
      <div className="w-full md:w-[70%] space-y-4">
        <div className="bg-white p-6 rounded shadow">
          {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
  <button
    className={`pb-2 px-3 border-b-2 font-medium ${
      activeTab === "basic"
        ? "border-[#bb4430] text-[#bb4430]"
        : "border-transparent text-gray-500"
    }`}
    onClick={() => setActiveTab("basic")}
  >
    Basic Info
  </button>

  {productType === "variable" && (
    <button
      className={`pb-2 px-3 border-b-2 font-medium ${
        activeTab === "attributes"
          ? "border-[#bb4430] text-[#bb4430]"
          : "border-transparent text-gray-500"
      }`}
      onClick={() => setActiveTab("attributes")}
    >
      Attributes
    </button>
  )}

  {productType === "variable" && selectedAttributes.length > 0 && (
    <button
      className={`pb-2 px-3 border-b-2 font-medium ${
        activeTab === "variants"
          ? "border-[#bb4430] text-[#bb4430]"
          : "border-transparent text-gray-500"
      }`}
      onClick={() => setActiveTab("variants")}
    >
      Configure Variants
    </button>
  )}

  <button
    className={`pb-2 px-3 border-b-2 font-medium ${
      activeTab === "description"
        ? "border-[#bb4430] text-[#bb4430]"
        : "border-transparent text-gray-500"
    }`}
    onClick={() => setActiveTab("description")}
  >
    Detailed Description
  </button>
</div>

          {/* Tab Content */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Product Type</label>
                <select
                  className="w-full border p-2 rounded"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  <option value="simple">Simple Product</option>
                  <option value="variable">Variable Product</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Short Description</label>
                <textarea
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full border p-2 rounded"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Regular Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Sale Price</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "attributes" && (
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-1">Search and Add Attributes</label>
                <input
                  type="text"
                  placeholder="Search attributes..."
                  className="w-full border p-2 rounded"
                  value={searchAttribute}
                  onChange={(e) => setSearchAttribute(e.target.value)}
                />
                {searchAttribute.length >= 2 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {attributes
                      .filter(
                        (attr) =>
                          attr.name.toLowerCase().includes(searchAttribute.toLowerCase()) &&
                          !selectedAttributes.some((a) => a.id === attr._id)
                      )
                      .map((attr) => (
                        <button
                          key={attr._id}
                          onClick={() => {
                            setSelectedAttributes([...selectedAttributes, { id: attr._id, name: attr.name, values: [] }]);
                            setSearchAttribute("");
                          }}
                          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                        >
                          {attr.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {selectedAttributes.map((attr, index) => (
                <div key={attr.id} className="border-t pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-semibold">{attr.name}</label>
                    <button
                      onClick={() => {
                        const updated = selectedAttributes.filter((a) => a.id !== attr.id);
                        setSelectedAttributes(updated);
                      }}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mb-2">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          attr.values.length === (attributes.find(a => a._id === attr.id)?.values.length || 0)
                        }
                        onChange={(e) => {
                          const allValues = attributes.find(a => a._id === attr.id)?.values || [];
                          const updated = [...selectedAttributes];
                          updated[index].values = e.target.checked ? [...allValues] : [];
                          setSelectedAttributes(updated);
                        }}
                      />
                      Select All
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {attributes.find(a => a._id === attr.id)?.values.map((val) => (
                      <label key={val} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                        <input
                          type="checkbox"
                          checked={attr.values.includes(val)}
                          onChange={(e) => {
                            const newValues = e.target.checked
                              ? [...attr.values, val]
                              : attr.values.filter((v) => v !== val);
                            const updated = [...selectedAttributes];
                            updated[index].values = newValues;
                            setSelectedAttributes(updated);
                          }}
                        />
                        {val}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          )}

{activeTab === "variants" && (
  <div className="space-y-4">
    {selectedAttributes.length === 0 ? (
      <p className="text-sm text-gray-500">
        Add and select attribute values under the "Attributes" tab first.
      </p>
    ) : (
      <div>
        <h3 className="text-md font-semibold mb-2">Generated Variants</h3>
        {variations.length === 0 ? (
          <p className="text-sm text-gray-500">
            No variants generated. Select attribute values above.
          </p>
        ) : (
          <div className="space-y-4">
            {variations.map((variant, index) => (
              <details
                key={index}
                className="border rounded overflow-hidden bg-white"
              >
                <summary className="px-4 py-2 cursor-pointer bg-gray-100 text-sm font-medium flex justify-between items-center">
                  #{index + 1} –{" "}
                 {Object.entries(variant.attributes)
                 .map(([k, v]) => `${k}: ${v}`) 
                 .join(", ")}
                  <span className="text-xs text-gray-500">Click to expand</span>
                </summary>

                <div className="p-4 space-y-4">
                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="SKU"
                      value={variant.sku}
                      onChange={(e) => {
                        const updated = [...variations];
                        updated[index].sku = e.target.value;
                        setVariations(updated);
                      }}
                      className="w-full border p-2 rounded"
                    />
                   
                    <input
                      type="number"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) => {
                        const updated = [...variations];
                        updated[index].price = e.target.value;
                        setVariations(updated);
                      }}
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Sale Price"
                      value={variant.salePrice}
                      onChange={(e) => {
                        const updated = [...variations];
                        updated[index].salePrice = e.target.value;
                        setVariations(updated);
                      }}
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={variant.stock}
                      onChange={(e) => {
                        const updated = [...variations];
                        updated[index].stock = e.target.value;
                        setVariations(updated);
                      }}
                      className="w-full border p-2 rounded"
                    />
                    <select
                      value={variant.stockStatus}
                      onChange={(e) => {
                        const updated = [...variations];
                        updated[index].stockStatus = e.target.value;
                        setVariations(updated);
                      }}
                      className="w-full border p-2 rounded"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="backorder">On Backorder</option>
                    </select>
                    <input
                      type="file"
                      onChange={(e) => {
                        const updated = [...variations];
                        updated[index].image = e.target.files[0];
                        setVariations(updated);
                      }}
                      className="w-full"
                    />
                  </div>

                  
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
)}

 


          {activeTab === "description" && (
            <div>
              <label className="block font-medium mb-1">Detailed Description</label>
              <textarea
                value={detailedDesc}
                onChange={(e) => setDetailedDesc(e.target.value)}
                className="w-full border p-2 rounded"
                rows="6"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column - 30% */}
      <div className="w-full md:w-[30%] space-y-4">
        <div className="bg-white p-6 rounded shadow">
          <label className="block font-medium mb-1">Product Image</label>
          <input
            type="file"
            onChange={(e) => setProductImage(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>

<div className="bg-white p-6 rounded shadow">
  <label className="block font-medium mb-1">Product Gallery</label>

  <input
    ref={galleryInputRef}
    type="file"
    multiple
    onChange={(e) => {
      const newFiles = Array.from(e.target.files);
      setGalleryImages((prev) => {
        const existingNames = new Set(prev.map((f) => f.name));
        const uniqueNew = newFiles.filter((f) => !existingNames.has(f.name));
        return [...prev, ...uniqueNew];
      });
      // Clear input value to allow selecting same file again later if needed
      if (galleryInputRef.current) galleryInputRef.current.value = null;
    }}
    className={`w-full border p-2 rounded ${galleryImages.length > 0 ? 'text-transparent' : ''}`}
  />

  {galleryImages.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-2">
      {galleryImages.map((file, i) => (
        <div
          key={i}
          className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded text-sm"
        >
          <span>{file.name}</span>
          <button
            onClick={() => {
              setGalleryImages((prev) => {
                const updated = prev.filter((_, index) => index !== i);
                if (updated.length === 1 && galleryInputRef.current) {
                  galleryInputRef.current.value = null;
                }
                return updated;
              });
            }}
            className="text-red-600 hover:text-red-800 font-bold"
            title="Remove"
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  )}
</div>



        <div className="bg-white p-6 rounded shadow">
          <label className="block font-medium mb-2">Categories</label>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={cat._id}
                  value={cat._id}
                  checked={selectedCategories.includes(cat._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, cat._id]);
                    } else {
                      setSelectedCategories(selectedCategories.filter((id) => id !== cat._id));
                    }
                  }}
                />
                <label htmlFor={cat._id}>{cat.name}</label>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Add new category"
                className="flex-1 border p-2 rounded"
              />
              <button
                onClick={handleAddCategory}
                className="bg-[#bb4430] text-white px-4 rounded hover:bg-[#a63d2a]"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <label className="block font-medium mb-2">Tags</label>
          <input
            type="text"
            placeholder="Search tag"
            className="w-full border p-2 mb-2 rounded"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && searchTag.trim()) {
                const existing = tags.find((t) => t.name.toLowerCase() === searchTag.toLowerCase());
                if (!existing) {
                  try {
                    const res = await fetch("https://medishop-backend-rqfh.onrender.com/api/tags", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: searchTag,
                        slug: searchTag.toLowerCase().replace(/\s+/g, "-"),
                      }),
                    });
                    if (res.ok) {
                      const newTag = await res.json();
                      setTags((prev) => [...prev, newTag]);
                      setSelectedTags((prev) => [...prev, newTag._id]);
                    }
                  } catch (err) {
                    console.error("Failed to create tag", err);
                  }
                } else {
                  setSelectedTags((prev) => [...prev, existing._id]);
                }
                setSearchTag("");
              }
            }}
          />

          {/* Selected Tags as chips */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTags.map((id) => {
                const tag = tags.find((t) => t._id === id);
                return (
                  <span
                    key={id}
                    className="bg-[#bb4430] text-white px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {tag?.name}
                    <button
                      onClick={() =>
                        setSelectedTags(selectedTags.filter((tagId) => tagId !== id))
                      }
                      className="text-white hover:text-gray-200"
                    >
                      ❌
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Tag suggestions as clickable pills */}
          {searchTag.length >= 2 && (
            <div className="flex flex-wrap gap-2 mb-3 max-h-40 overflow-y-auto">
              {tags
                .filter(
                  (tag) =>
                    tag.name.toLowerCase().includes(searchTag.toLowerCase()) &&
                    !selectedTags.includes(tag._id)
                )
                .map((tag) => (
                  <button
                    key={tag._id}
                    onClick={() => setSelectedTags([...selectedTags, tag._id])}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            onClick={handleSaveProduct}
            className="bg-[#bb4430] text-white px-6 py-2 rounded shadow hover:bg-[#a63d2a]"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}