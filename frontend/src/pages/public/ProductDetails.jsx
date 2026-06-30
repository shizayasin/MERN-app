import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetProductDetailsQuery, useCreateProductReviewMutation } from "../../redux/api/productApiSlice";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";
import ProductReviews from "../../components/products/ProductReviews";
import PlaceholderImg from "../../assets/placeholder.svg";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading: isSubmitting }] = useCreateProductReviewMutation();
  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);

  if (isLoading) return <Loader text="Unpacking item specifics..." />;
  
  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || "Failed to retrieve the requested product file specifications."}
      </Message>
    );
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error("Please log in to leave a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    try {
      await createReview({ productId, rating, comment }).unwrap();
      toast.success("Review submitted successfully");
      setComment("");
      setRating(5);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 py-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-sm">
              <img
                src={product?.image || PlaceholderImg}
                alt={product?.name}
                className="h-[420px] w-full object-cover"
                onError={(e) => { e.currentTarget.src = PlaceholderImg; }}
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {product?.name}
              </h1>
              <p className="text-sm font-semibold text-slate-400">SKU: {productId}</p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {product?.description}
              </p>
            </div>
          </div>

          <aside className="space-y-6 rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm uppercase tracking-[0.22em] font-bold text-slate-500">Price</span>
                <span className="text-3xl font-extrabold tracking-tight text-slate-950">
                  ${Number(product?.price || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                <span>Category</span>
                <span className="font-semibold text-slate-900">{product?.category?.name || "Uncategorized"}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                <span>Brand</span>
                <span className="font-semibold text-slate-900">{product?.brand || "Unknown"}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                <span>Stock</span>
                <span className={`font-semibold ${product?.countInStock > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {product?.countInStock > 0 ? `${product.countInStock} available` : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">Ratings</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-slate-900">{product?.rating?.toFixed(1) || "0.0"}</span>
                <span className="text-sm text-slate-500">({product?.numReviews || 0} reviews)</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-[0.22em] text-slate-700">Quick actions</h2>
              <p className="text-xs text-slate-400 mt-2">Add this product to cart, view similar items, or share with friends.</p>
            </div>
          </aside>
        </div>

        <div className="mt-10 space-y-6">
          <form onSubmit={handleSubmitReview} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Leave a Review</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value} Star{value > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Comment</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" placeholder="Share your experience with this product" />
              </div>
              <button type="submit" disabled={isSubmitting} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{isSubmitting ? "Submitting..." : "Submit Review"}</button>
            </div>
          </form>

          <ProductReviews reviews={product?.reviews || []} />
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;