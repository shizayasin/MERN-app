import { useDispatch, useSelector } from "react-redux"; 
import { Link } from "react-router-dom"; 
import { removeFromCart } from "../../redux/features/cart/cartSlice";
import { showNotice } from "../../redux/features/ui/noticeSlice";
import { useUserCart } from "../../hooks/useUserCart";

const EmptyCartState = () => (
  <div className="bg-white rounded-2xl border border-slate-200/50 p-8 sm:p-12 text-center shadow-xs max-w-md mx-auto my-6 animate-in fade-in duration-200">
    <div className="text-5xl mb-4 select-none drop-shadow-2xs" aria-hidden="true">🛒</div>
    <h2 className="text-base font-bold text-slate-900 tracking-tight">Your cart is empty</h2>
    <p className="text-xs font-semibold text-slate-400 mt-1 leading-relaxed">Looks like you haven’t added items to your selection profile yet.</p>
    <Link to="/shop" className="inline-flex mt-6 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs tracking-wide px-6 py-3 rounded-xl transition shadow-xs active:scale-95">Browse Storefront Catalog</Link>
  </div>
);

export default function Cart() { 
  const dispatch = useDispatch(); 
  const { cartItems = [] } = useSelector((state) => state.cart); 
  const { updateQty } = useUserCart();
  const normalizedCartItems = Array.isArray(cartItems)
    ? cartItems.map((item) => ({
        ...item,
        name: item?.name || item?.product?.name || "Product",
        price: Number(item?.price || item?.product?.price || 0),
        image: item?.image || item?.product?.image || "",
      }))
    : [];
  const total = normalizedCartItems.reduce((acc, item) => acc + item.price * item.qty, 0); 

  return ( 
    <section className="min-h-screen bg-slate-50/60 px-4 sm:px-6 lg:px-8 py-8 text-slate-800"> 
      <div className="max-w-5xl mx-auto"> 
        
        {/* HEADER INFORMATION SEGMENT */} 
        <div className="mb-8 pb-4 border-b border-slate-200/60">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase"> 
            Shopping Basket 
          </h1> 
          <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5"> 
            Review, modulate, or proceed to transaction channels with your curated fashion units.
          </p> 
        </div>

        {/* COMPREHENSIVE EMPTY CART PLACEHOLDER STATE */} 
        {normalizedCartItems.length === 0 ? ( 
          <EmptyCartState />
        ) : ( 
          /* TWO COLUMN CORE CHECKOUT ARCHITECTURE LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"> 
            
            {/* LEFT: CART SELECTION ITEM LIST PANEL */} 
            <div className="space-y-3 lg:col-span-2"> 
              {normalizedCartItems.map((item) => {
                const stock = Number(item?.countInStock ?? item?.product?.countInStock ?? 0);
                const isAtStockLimit = stock > 0 && Number(item.qty || 1) >= stock;

                return (
                <div 
                  key={item._id} 
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-xs hover:border-slate-200/60 transition duration-200 group" 
                > 
                  <div className="flex items-center gap-4 min-w-0 flex-1 pr-2"> 
                    <div className="h-16 w-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600"}
                        alt={item.name}
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600"; }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate space-y-0.5"> 
                      <h2 className="font-bold text-sm text-slate-800 truncate group-hover:text-emerald-700 transition-colors"> 
                        {item.name} 
                      </h2> 
                      <p className="text-xs font-semibold text-slate-400"> 
                        <span className="text-slate-700">${Number(item.price).toFixed(2)}</span> × {item.qty}
                      </p> 
                    </div> 
                  </div> 

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const nextQty = Number(item.qty || 1) - 1;
                          if (nextQty <= 0) {
                            dispatch(removeFromCart(item._id));
                            dispatch(showNotice({ message: "Product removed from cart", type: "info" }));
                          } else {
                            updateQty(item._id, nextQty);
                          }
                        }}
                        className="h-7 w-7 rounded-lg bg-white text-slate-700 hover:bg-slate-100"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-bold text-slate-800">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item._id, Number(item.qty || 1) + 1)}
                        disabled={isAtStockLimit}
                        className={`h-7 w-7 rounded-lg bg-white text-slate-700 hover:bg-slate-100 ${isAtStockLimit ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 tracking-tight min-w-[65px] text-right"> 
                      ${(item.price * item.qty).toFixed(2)} 
                    </span> 
                    <button 
                      onClick={() => {
                        dispatch(removeFromCart(item._id));
                        dispatch(showNotice({ message: "Product removed from cart", type: "info" }));
                      }} 
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition" 
                    > 
                      Remove 
                    </button> 
                  </div>
                </div> 
                );
              })} 
            </div>

            {/* RIGHT: ACCOUNTING STATS SUMMARY PANEL CARD */} 
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 lg:sticky lg:top-4"> 
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
                Order Summary Tally
              </h3>
              <div className="flex justify-between items-center"> 
                <span className="text-sm font-bold text-slate-500"> 
                  Subtotal Items Amount 
                </span> 
                <span className="text-xl font-black text-slate-900 tracking-tight"> 
                  ${total.toFixed(2)} 
                </span> 
              </div> 
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                Taxes, platform packaging metrics, and handling parameters are tabulated dynamically during validation phases.
              </p>
              <Link 
                to="/shipping" 
                className="block w-full text-center bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition shadow-xs active:scale-[0.99]" 
              > 
                Proceed to Secure Checkout → 
              </Link> 
            </div> 

          </div> 
        )} 
      </div> 
    </section> 
  ); 
}