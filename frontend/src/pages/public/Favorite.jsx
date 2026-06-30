import { useDispatch, useSelector } from "react-redux"; 
import { Link } from "react-router-dom"; 
import { toast } from "react-toastify"; 
import { removeFromFavorites, clearFavorites } from "../../redux/features/favorites/favoritesSlice";
import { showNotice } from "../../redux/features/ui/noticeSlice";
import { useUserCart } from "../../hooks/useUserCart";

const EmptyWishlistState = () => (
  <section className="min-h-screen flex items-center justify-center px-4 bg-slate-50/60">
    <div className="bg-white p-8 sm:p-12 text-center rounded-2xl border border-slate-200/50 shadow-xs max-w-md mx-auto animate-in fade-in duration-200">
      <div className="text-5xl mb-4 select-none" aria-hidden="true">♡</div>
      <h1 className="text-base font-bold text-slate-900 tracking-tight mb-1">Wishlist is empty</h1>
      <p className="text-xs font-semibold text-slate-400 max-w-xs mx-auto leading-relaxed mb-6">Bookmark unique products you adore across our storefront to find them indexed safely right here.</p>
      <Link to="/shop" className="inline-block bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs tracking-wide px-5 py-3 rounded-xl transition shadow-xs active:scale-95">Discover Storefront Catalog</Link>
    </div>
  </section>
);

const PLACEHOLDER = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600"; 

const Favorite = () => { 
  const dispatch = useDispatch();
  const { favorites = [] } = useSelector((state) => state.favorites || {});
  const { addToCart } = useUserCart();

  const addToCartHandler = async (product) => { 
    if (!product) return; 
    if (product.countInStock < 1) { 
      return toast.error("This item is currently out of stock"); 
    }

    await addToCart(product, 1);
  }; 

  if (!Array.isArray(favorites) || !favorites.length) { 
    return <EmptyWishlistState />;
  } 

  return ( 
    <section className="min-h-screen bg-slate-50/60 px-4 sm:px-6 lg:px-8 py-8 text-slate-800"> 
      <div className="max-w-6xl mx-auto"> 
        
        {/* HEADER BLOCK INTERNALS */} 
        <div className="flex justify-between items-end mb-8 pb-4 border-b border-slate-200/60"> 
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase"> 
              Saved Wishlist 
            </h1> 
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5">
              Keep tab of custom designs or route them directly into active processing carts.
            </p>
          </div>
          <button 
            onClick={() => { 
              dispatch(clearFavorites());
              dispatch(showNotice({ message: "Wishlist cleared.", type: "info" }));
              toast.info("Cleared all items from your wishlist"); 
            }} 
            className="text-xs font-bold text-rose-600 hover:text-rose-700 transition" 
          > 
            Clear All
          </button> 
        </div> 

        {/* WISH LIST CONTENT MATRIX GRID MAP */} 
        <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3"> 
          {favorites.map((product) => ( 
            <div 
              key={product._id} 
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col h-full" 
            > 
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden border-b border-slate-50">
                <img 
                  src={product.image || PLACEHOLDER} 
                  alt={product.name} 
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500 ease-out" 
                /> 
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3"> 
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1"> 
                    {product.name} 
                  </h3> 
                  <div className="flex justify-between items-baseline pt-1">
                    <p className="text-sm font-extrabold text-slate-900 tracking-tight"> 
                      ${Number(product.price).toFixed(2)} 
                    </p> 
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      product.countInStock > 0 ? "text-emerald-600" : "text-slate-400"
                    }`}>
                      {product.countInStock > 0 ? "Available" : "Sold Out"}
                    </span>
                  </div>
                </div> 

                {/* DOUBLE SUB-ACTION SPLIT CHIP TRIGGERS */} 
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50"> 
                  <button 
                    onClick={() => addToCartHandler(product)} 
                    disabled={product.countInStock < 1} 
                    className="bg-slate-900 text-white font-bold rounded-xl py-2.5 text-xs hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-all shadow-2xs active:scale-[0.97]" 
                  > 
                    Add Cart 
                  </button> 
                  <button 
                    onClick={() => { 
                      dispatch(removeFromFavorites(product._id));
                      dispatch(showNotice({ message: "Removed from wishlist.", type: "info" }));
                      toast.info("Removed individual choice entry"); 
                    }} 
                    className="border border-slate-200 text-slate-600 font-bold bg-white rounded-xl py-2.5 text-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition shadow-2xs" 
                  > 
                    Remove 
                  </button> 
                </div> 
              </div> 
            </div> 
          ))} 
        </div> 
      </div> 
    </section> 
  ); 
}; 

export default Favorite;