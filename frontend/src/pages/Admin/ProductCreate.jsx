import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { STORE_NAME, getAssetUrl } from "../../constants";
import { useCreateProductMutation, useUploadProductImageMutation } from "../../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";

export default function ProductCreate() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: loadingCategories } = useGetCategoriesQuery();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: isUploadingImage }] = useUploadProductImageMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    brand: "",
    category: "",
    image: "",
  });
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = async (e) => {
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
      const response = await uploadProductImage(formData).unwrap();
      setForm((prev) => ({ ...prev, image: response.image }));
      setPreview(response.image);
      toast.success("Image uploaded successfully");
    } catch (err) {
      const message = err?.data?.message || err?.error || "Failed to upload image";
      toast.error(message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { name, description, price, countInStock, brand, category } = form;
    if (!name || !description || !price || !countInStock || !brand || !category) {
      return toast.error("Please fill all required fields");
    }

    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
      }).unwrap();
      toast.success("Product created successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create product");
    }
  };

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Create</p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{STORE_NAME} Product</h1>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Product Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Price</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Stock</label>
              <input name="countInStock" type="number" min="0" value={form.countInStock} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
            <select name="category" value={form.category} onChange={handleChange} disabled={loadingCategories} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white">
              <option value="">{loadingCategories ? "Loading categories..." : "Select category"}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Image</label>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp" onChange={handleImage} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" />
            {preview && <img src={getAssetUrl(preview)} alt="Preview" className="mt-3 h-40 w-full rounded-xl object-cover" />}
          </div>

          <button disabled={creating || isUploadingImage} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50">
            {creating ? "Creating product..." : isUploadingImage ? "Uploading image..." : "Create Product"}
          </button>
        </form>
      </div>
    </section>
  );
}
