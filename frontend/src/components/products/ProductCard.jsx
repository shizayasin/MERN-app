import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import PlaceholderImg from "../../assets/placeholder.svg";
import { getAssetUrl } from "../../constants";
import { useUserCart } from "../../hooks/useUserCart";
import { useUserFavorites } from "../../hooks/useUserFavorites";

const resolveImage = (imagePath) => getAssetUrl(imagePath || PlaceholderImg);


const PLACEHOLDER = PlaceholderImg;

export default function ProductCard({ product }) { 
  const { favorites } = useSelector((state) => state.favorites);
  const { addToCart } = useUserCart();
  const { addToFavorites, removeFromFavorites } = useUserFavorites();

  if (!product) return null; 

  const isFavorite = favorites.some((item) => item._id === product._id); 
  const isOutOfStock = product.countInStock < 1;

  const addToCartHandler = async (e) => { 
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) { 
      return toast.error("This item is currently out of stock"); 
    }

    await addToCart(product, 1);
  }; 

  const favoriteHandler = async (e) => { 
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      await removeFromFavorites(product._id);
    } else {
      await addToFavorites(product);
    }
  }; 

  return ( 
    <div className="group relative w-full bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col h-full overflow-hidden"> 
      
      {/* Upper Media Compartment */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        {/* Absolute Interaction Badge Layer */} 
        <button 
          onClick={favoriteHandler} 
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-sm hover:scale-110 active:scale-95 transition text-sm duration-200"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        > 
          {isFavorite ? ( 
            <FaHeart className="text-rose-500 scale-105 transition-transform" /> 
          ) : ( 
            <FaRegHeart className="text-slate-500 group-hover:text-slate-800 transition-colors" /> 
          )} 
        </button> 

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <span className="bg-slate-950/80 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/10">
              Sold Out
            </span>
          </div>
        )}

        <Link to={`/product/${product._id}`} className="block h-full w-full"> 
          <img 
            src={resolveImage(product.image)} 
            alt={product.name} 
            loading="lazy"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
          /> 
        </Link> 
      </div>

      {/* Core Typography Meta Fields */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3"> 
        <div className="space-y-1.5">
          <Link to={`/product/${product._id}`} className="block"> 
            <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1 group-hover:text-emerald-700 transition-colors tracking-tight"> 
              {product.name} 
            </h3> 
          </Link> 

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"> 
            <FaStar className="text-amber-400 text-sm" /> 
            <span className="text-slate-800">{Number(product.rating || 0).toFixed(1)}</span> 
            <span className="text-slate-400 font-medium">({product.numReviews || 0} reviews)</span> 
          </div> 
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-50">
          <div className="flex justify-between items-baseline"> 
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight"> 
              ${Number(product.price).toFixed(2)} 
            </span> 
            <span className={`text-[11px] font-bold uppercase tracking-wider ${!isOutOfStock ? "text-emerald-600" : "text-slate-400"}`}> 
              {!isOutOfStock ? "In Stock" : "Unavailable"} 
            </span> 
          </div> 

          <button 
            onClick={addToCartHandler} 
            disabled={isOutOfStock} 
            className="w-full bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-100 text-white disabled:text-slate-400 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]" 
          > 
            <FaShoppingCart size={13} /> 
            Add to Cart 
          </button> 
        </div>
      </div> 
    </div> 
  ); 
}