import { FaTrash, FaMinus, FaPlus } from "react-icons/fa"; 
import { useUserCart } from "../../hooks/useUserCart";

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useUserCart();

  const changeQty = async (qty) => {
    if (qty < 1) return;
    await updateQty(item._id, qty);
  };

  const removeItem = async () => {
    await removeFromCart(item._id);
  };

  return ( 
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200/60 transition-all duration-200 group"> 
      
      {/* Product Information Slate */} 
      <div className="flex items-center gap-4 flex-1 min-w-0"> 
        <div className="relative h-18 w-18 min-w-[72px] rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          /> 
        </div>
        <div className="space-y-1 truncate"> 
          <h3 className="font-bold text-sm text-slate-800 truncate group-hover:text-emerald-700 transition-colors"> 
            {item.name} 
          </h3> 
          <p className="text-xs font-semibold text-slate-400"> 
            ${Number(item.price).toFixed(2)} each
          </p> 
        </div> 
      </div> 

      {/* Interactive Controls Segment */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
        {/* Step Quantity Controls */} 
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 p-1 rounded-xl"> 
          <button 
            onClick={() => changeQty(item.qty - 1)} 
            disabled={item.qty <= 1}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
            aria-label="Decrease quantity"
          > 
            <FaMinus size={10} /> 
          </button> 
          <span className="w-8 text-center text-xs font-bold text-slate-700 select-none">
            {item.qty}
          </span> 
          <button 
            onClick={() => changeQty(item.qty + 1)} 
            className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 transition-all active:scale-90"
            aria-label="Increase quantity"
          > 
            <FaPlus size={10} /> 
          </button> 
        </div> 

        {/* Aggregated Total Output */} 
        <div className="text-sm font-extrabold text-slate-900 min-w-[70px] text-right tracking-tight"> 
          ${(item.price * item.qty).toFixed(2)} 
        </div> 

        {/* Destructive Item Removal Toggle */} 
        <button 
          onClick={removeItem} 
          className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all duration-200"
          title="Remove from cart"
        > 
          <FaTrash size={14} /> 
        </button> 
      </div>
    </div> 
  ); 
}