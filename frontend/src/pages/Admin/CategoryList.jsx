import { useState } from "react";
import { toast } from "react-toastify";
import { STORE_NAME } from "../../constants";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApiSlice";

export default function CategoryList() {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const reset = () => {
    setName("");
    setEditingId(null);
  };

  const submit = async () => {
    if (!name.trim()) return toast.error("Category name is required");

    try {
      if (editingId) {
        await updateCategory({ id: editingId, name: name.trim() }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory({ name: name.trim() }).unwrap();
        toast.success("Category created successfully");
      }
      reset();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const editHandler = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
      if (editingId === id) reset();
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-50/60 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">
          Loading categories...
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-slate-50/60 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center text-sm font-bold text-amber-700">
          Unable to load categories right now. You can still create or edit locally when the API reconnects.
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Catalog</p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{STORE_NAME} Categories</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">{editingId ? "Edit Category" : "Add Category"}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-400">Category Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
              </div>
              <div className="flex gap-2">
                <button onClick={submit} disabled={creating || updating} className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50">
                  {editingId ? "Update" : "Create"}
                </button>
                {editingId && (
                  <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            {categories.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-400">No categories available.</div>
            ) : (
              categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div>
                    <p className="font-bold text-slate-900">{cat.name}</p>
                    <p className="text-xs text-slate-500">Category</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editHandler(cat)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Edit</button>
                    <button onClick={() => deleteHandler(cat._id)} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
