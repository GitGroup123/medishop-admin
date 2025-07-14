
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const galleryInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("basic");

  const [productType, setProductType] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [searchAttribute, setSearchAttribute] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [searchTag, setSearchTag] = useState("");

  const [productName, setProductName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [variations, setVariations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("http://localhost:8080/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data));

    fetch("http://localhost:8080/api/attributes")
      .then((res) => res.json())
      .then((data) => setAttributes(data));

    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProductName(data.name);
        setProductType(data.type);
        setShortDesc(data.shortDesc);
        setDetailedDesc(data.description);
        setPrice(data.price);
        setSalePrice(data.salePrice);
        setSelectedCategories(data.categories || []);
        setSelectedTags(data.tags || []);
        setVariations(data.variations || []);

        const preSelectedAttributes = [];
        const attrMap = {};
        for (const variant of data.variations || []) {
          for (const key in variant.attributes) {
            if (!attrMap[key]) attrMap[key] = new Set();
            attrMap[key].add(variant.attributes[key]);
          }
        }
        for (const name in attrMap) {
          preSelectedAttributes.push({
            id: name,
            name,
            values: Array.from(attrMap[name]),
          });
        }
        setSelectedAttributes(preSelectedAttributes);
      });
  }, [id]);

 useEffect(() => {
  const hasSelected = selectedAttributes.some(attr => attr.values && attr.values.length > 0);
  if (
    activeTab === "variants" &&
    productType === "variable" &&
    !hasSelected
  ) {
    setActiveTab("basic");
  }
}, [selectedAttributes, productType, activeTab]);


  const handleUpdateProduct = async () => {
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
    galleryImages.forEach((img) => formData.append("gallery", img));

 {productType === "variable" &&
  selectedAttributes.some(attr => attr.values && attr.values.length > 0) && (
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


    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        alert("Product updated!");
      } else {
        alert("Failed to update product");
      }
    } catch (err) {
      alert("Error updating product");
    }
  };
console.log("selectedAttributes", selectedAttributes);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-[70%] space-y-4">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex space-x-4 border-b mb-4">
            {["basic", "attributes", "variants", "description"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 px-3 border-b-2 font-medium ${
                  activeTab === tab
                    ? "border-[#bb4430] text-[#bb4430]"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "basic"
                  ? "Basic Info"
                  : tab === "attributes"
                  ? "Attributes"
                  : tab === "variants"
                  ? "Configure Variants"
                  : "Detailed Description"}
              </button>
            ))}
          </div>

          {activeTab === "basic" && (
            <div className="space-y-4">
                  <label className="block font-medium mb-1">Product Type</label>
<select
  value={productType}
  onChange={(e) => setProductType(e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="simple">Simple Product</option>
  <option value="variable">Variable Product</option>
</select>
              <label className="block font-medium mb-1">Product Name</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full border p-2 rounded" />
    

              <label className="block font-medium mb-1">Short Description</label>
              <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="w-full border p-2 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Price</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Sale Price</label>
                  <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full border p-2 rounded" />
                </div>
              </div>
            </div>
          )}

        {activeTab === "attributes" && (
        <div className="space-y-4">
        {selectedAttributes.map((attr, index) => (
         <div key={index}>
         <h4 className="font-medium">{attr.name}</h4>
        <div className="flex flex-wrap gap-2">
          {attributes.find(a => a.name === attr.name)?.values.map((value) => (
            <label key={value} className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded">
              <input
                type="checkbox"
                checked={attr.values.includes(value)}
                onChange={(e) => {
                  const newAttrs = [...selectedAttributes];
                  if (e.target.checked) {
                    newAttrs[index].values.push(value);
                  } else {
                    newAttrs[index].values = newAttrs[index].values.filter(v => v !== value);
                  }
                  setSelectedAttributes(newAttrs);
                }}
              />
              {value}
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>
)}

          {activeTab === "variants" && (
            <div className="space-y-4">
              {variations.length === 0 ? (
                <p className="text-sm text-gray-500">No variants to show.</p>
              ) : (
                <div className="space-y-4">
                  {variations.map((variant, index) => (
                    <details key={index} className="border rounded bg-white">
                      <summary className="px-4 py-2 cursor-pointer bg-gray-100 text-sm font-medium flex justify-between items-center">
                        #{index + 1} –{" "}
                        {Object.entries(variant.attributes)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                        <span className="text-xs text-gray-500">Click to expand</span>
                      </summary>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="SKU" value={variant.sku} onChange={(e) => {
                          const updated = [...variations]; updated[index].sku = e.target.value; setVariations(updated);
                        }} className="w-full border p-2 rounded" />
                        <input type="number" placeholder="Price" value={variant.price} onChange={(e) => {
                          const updated = [...variations]; updated[index].price = e.target.value; setVariations(updated);
                        }} className="w-full border p-2 rounded" />
                        <input type="number" placeholder="Sale Price" value={variant.salePrice} onChange={(e) => {
                          const updated = [...variations]; updated[index].salePrice = e.target.value; setVariations(updated);
                        }} className="w-full border p-2 rounded" />
                        <input type="number" placeholder="Stock" value={variant.stock} onChange={(e) => {
                          const updated = [...variations]; updated[index].stock = e.target.value; setVariations(updated);
                        }} className="w-full border p-2 rounded" />
                        <select value={variant.stockStatus} onChange={(e) => {
                          const updated = [...variations]; updated[index].stockStatus = e.target.value; setVariations(updated);
                        }} className="w-full border p-2 rounded">
                          <option value="in_stock">In Stock</option>
                          <option value="out_of_stock">Out of Stock</option>
                          <option value="backorder">On Backorder</option>
                        </select>
                        <input type="file" onChange={(e) => {
                          const updated = [...variations]; updated[index].image = e.target.files[0]; setVariations(updated);
                        }} className="w-full" />
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-[30%] space-y-4">
        <div className="bg-white p-6 rounded shadow">
          <label className="block font-medium mb-1">Product Image</label>
          <input type="file" onChange={(e) => setProductImage(e.target.files[0])} className="w-full border p-2 rounded" />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <label className="block font-medium mb-1">Product Gallery</label>
          <input ref={galleryInputRef} type="file" multiple onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            setGalleryImages((prev) => [...prev, ...newFiles]);
          }} className="w-full border p-2 rounded" />
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
              setSelectedCategories(
                selectedCategories.filter((id) => id !== cat._id)
              );
            }
          }}
        />
        <label htmlFor={cat._id}>{cat.name}</label>
      </div>
    ))}
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
            const res = await fetch("http://localhost:8080/api/tags", {
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

  {/* Tag suggestions */}
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
        <div className="bg-white p-6 rounded shadow text-right">
          <button onClick={handleUpdateProduct} className="bg-[#bb4430] text-white px-6 py-2 rounded shadow hover:bg-[#a63d2a]">
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}
