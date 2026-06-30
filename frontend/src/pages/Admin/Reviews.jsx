import { useState } from "react";
import { toast } from "react-toastify";
import { STORE_NAME } from "../../constants";
import { useDeleteProductReviewMutation, useGetProductsQuery } from "../../redux/api/productApiSlice";

export default function Reviews() {
  const PAGE_SIZE = 100;
  const { data, isLoading, isError, error } = useGetProductsQuery({ pageNumber: 1, pageSize: PAGE_SIZE });
  const [deleteReview] = useDeleteProductReviewMutation();
  const [search, setSearch] = useState("");

  const products = Array.isArray(data?.products) ? data.products : [];
  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    const text = `${product.name || ""} ${product.brand || ""} ${product.reviews?.map((review) => review.comment || "").join(" ") || ""}`.toLowerCase();
    return text.includes(query);
  });

  const removeReviewHandler = async (productId, reviewId) => {
    if (!window.confirm("Remove this review?")) return;

    try {
      await deleteReview({ productId, reviewId }).unwrap();
      toast.success("Review removed successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove review");
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-50/60 px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">
          Loading reviews...
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-slate-50/60 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center text-sm font-bold text-amber-700">
          {error?.data?.message || "Failed to load reviews. No review data is available right now."}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Moderation</p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{STORE_NAME} Reviews</h1>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by product, brand, or keyword"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-400">
              No reviews found
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>
                    <p className="text-sm text-slate-500">{product.brand || "Unbranded"} • {product.reviews?.length || 0} review(s)</p>
                  </div>
                  <div className="text-sm font-semibold text-slate-500">
                    Rating: {product.rating || 0}/5
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {(product.reviews || []).length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      No reviews yet for this product.
                    </div>
                  ) : (
                    product.reviews.map((review) => (
                      <div key={review._id} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{review.name || "Customer"}</p>
                            <p className="mt-1 text-sm text-slate-600">{review.comment || "No comment provided"}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                              {review.rating}/5
                            </span>
                            <button
                              onClick={() => removeReviewHandler(product._id, review._id)}
                              className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
