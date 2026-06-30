import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  useGetProductDetailsQuery, 
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";

// ==========================================
// 1. THE UPDATE FORM COMPONENT (State Management)
// ==========================================
const UpdateForm = ({ product, categories, isUpdating, onUpdate }) => {
  const categoryValue =
    typeof product.category === "object"
      ? product.category?._id || ""
      : product.category || "";

  const [name, setName] = useState(product.name || "");
  const [price, setPrice] = useState(product.price || "");
  const [description, setDescription] = useState(product.description || "");
  const [category, setCategory] = useState(categoryValue);
  const [countInStock, setCountInStock] = useState(
    product.countInStock ?? ""
  );
  const [brand, setBrand] = useState(product.brand || "");
  const [image, setImage] = useState(product.image || "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProductImage] = useUploadProductImageMutation();

  const uploadFileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const extension = file.name?.split(".").pop()?.toLowerCase();
    const isAllowed = allowedTypes.includes(file.type) || ["jpg", "jpeg", "png", "webp"].includes(extension);

    if (!isAllowed) {
      toast.error("Format rejected. Only JPEG, PNG, and WEBP images are allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploadingImage(true);
      const response = await uploadProductImage(formData).unwrap();
      setImage(response.image);
      toast.success("Image uploaded successfully.");
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.error ||
        (typeof err === "string" ? err : "Failed to upload image.");
      toast.error(message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      name,
      price: Number(price),
      description,
      category,
      countInStock: Number(countInStock),
      brand,
      image,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Item Identifier Designation</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:border-slate-800 transition" 
            required 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Label Signature / Brand</label>
          <input 
            type="text" 
            value={brand} 
            onChange={(e) => setBrand(e.target.value)}
            className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:border-slate-800 transition" 
            required 
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase">Product Visual Asset</label>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
              {image ? (
                <img src={image} alt={name || "Product image"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase text-slate-400">No image</div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Current image</p>
              <p className="text-xs text-slate-500">Upload a new file to replace this asset.</p>
            </div>
          </div>

          <label className="relative cursor-pointer block rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center hover:border-slate-400 hover:bg-slate-50 transition">
            <span className="text-sm font-medium text-slate-700">
              {isUploadingImage ? "Uploading image..." : image ? "Replace image" : "Upload image"}
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp"
              onChange={uploadFileHandler}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Price Point Index ($)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:border-slate-800 transition" 
            required 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Stock Inventory Quantity</label>
          <input 
            type="number" 
            value={countInStock} 
            onChange={(e) => setCountInStock(e.target.value)}
            className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:border-slate-800 transition" 
            required 
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase">Department Classification Cluster</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 outline-hidden focus:border-slate-800 transition cursor-pointer"
          required
        >
          <option value="">Select Category Allocation</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase">Technical Specifications / Description Log</label>
        <textarea 
          rows="4"
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:border-slate-800 transition resize-none" 
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={isUpdating}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition duration-150 disabled:bg-slate-400 text-xs tracking-wider uppercase mt-2"
      >
        {isUpdating ? "Processing Data Refinement..." : "Commit Update Changes"}
      </button>
    </form>
  );
};

// ==========================================
// 2. THE MAIN CONTROLLER COMPONENT (Data Fetching)
// ==========================================
const ProductUpdate = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: product, isLoading, isError, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleUpdate = async (formData) => {
    try {
      await updateProduct({ productId, formData }).unwrap();
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to update database profile catalog record:", err);
    }
  };

  if (isLoading) return <Loader text="Sourcing internal database document mappings..." />;
  if (isError) return <Message variant="danger">{error?.data?.message || "Failed to load product record."}</Message>;

  return (
    <section className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase mb-6">
          Modify Product Profile Registry
        </h1>

        {/* CRITICAL FIX: Providing a unique `key` ensures React mounts the form 
          EXACTLY when the product data is ready, initializing state instantly 
          and eliminating the cascading re-render effect entirely!
        */}
        {product && (
          <UpdateForm 
            key={product._id} 
            product={product} 
            categories={categories}
            isUpdating={isUpdating}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </section>
  );
};

export default ProductUpdate;