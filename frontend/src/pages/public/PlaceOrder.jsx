import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { STORE_NAME } from "../../constants";

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { cartItems } = useSelector((state) => state.cart);

  // Deep structural local state form tracking
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "Lahore",
    postalCode: "",
    province: "Punjab",
    nearestLandmark: "",
    paymentMethod: "COD",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Math Calculations Matrix
  const itemsPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  const shippingPrice = itemsPrice > 3000 ? 0 : 250; // Free delivery matching thresholds
  const totalPrice = itemsPrice + shippingPrice;

  const submitOrderHandler = async (e) => {
    e.preventDefault();

    if (!cartItems.length) return toast.error("Your cart index is completely empty.");
    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.address.trim()) {
      return toast.error("Please fill in all mandatory logistics information rows.");
    }
    if (!/^[0-9+\-()\s]{7,15}$/.test(formData.phoneNumber.trim())) {
      return toast.error("Please enter a valid phone number.");
    }

    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          province: formData.province,
          nearestLandmark: formData.nearestLandmark,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCart());
      const orderId = res?._id;
      if (orderId) {
        toast.success("Order sequence locked in ledger indices!");
        navigate(`/order/${orderId}`);
      } else {
        toast.success("Order received. You can review it from your order history.");
        navigate("/order-history");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to commit order structures.");
    }
  };

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 sm:px-6 lg:px-8 py-10 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER BRAND */}
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            {STORE_NAME} &bull; Checkout Interface
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Verify allocation vectors, structure target logistics paths, and confirm order execution.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          
          {/* THE LOGISTICS INPUT FORM */}
          <form onSubmit={submitOrderHandler} className="lg:col-span-2 bg-white border border-slate-200/50 rounded-2xl p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2 border-slate-100">
              Shipping & Customer Logistics Address
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Recipient Name *</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" className="w-full text-sm border border-slate-200 bg-slate-50/50 p-3 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Mobile Contact Network Number *</label>
                <input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="e.g., 03XXXXXXXXX" className="w-full text-sm border border-slate-200 bg-slate-50/50 p-3 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Street Delivery Address *</label>
              <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="House/Apartment #, Street, Sector, Block/Mohallah" className="w-full text-sm border border-slate-200 bg-slate-50/50 p-3 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white" />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">City Node *</label>
                <select name="city" value={formData.city} onChange={handleInputChange} className="w-full text-sm border border-slate-200 bg-slate-50/50 p-3 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white cursor-pointer">
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Multan">Multan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">State / Province *</label>
                <select name="province" value={formData.province} onChange={handleInputChange} className="w-full text-sm border border-slate-200 bg-slate-50/50 p-3 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white cursor-pointer">
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="ICT">Islamabad Capital Territory</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Postal Index Code</label>
                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="e.g., 54000" className="w-full text-sm border border-slate-200 bg-slate-50/50 p-3 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Nearest Area Landmark / Routing Memo</label>
              <input type="text" name="nearestLandmark" value={formData.nearestLandmark} onChange={handleInputChange} placeholder="e.g., Near Commercial Market Gate / Metro Station" className="w-full text-sm border border-slate-200 bg-slate-50/50 p-3 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white" />
            </div>

            {/* TRANSACTION PATH SELECTOR */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Settlement Channel Selector</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { id: "COD", label: "Cash On Delivery (COD)", desc: "Pay local courier cash directly upon drop-off." },
                  { id: "BANK", label: "Direct Bank / Wallet Wire", desc: "Transfer directly to company accounts via mobile clearing." }
                ].map((p) => (
                  <label key={p.id} className={`border rounded-xl p-4 flex gap-3 items-start cursor-pointer transition ${formData.paymentMethod === p.id ? "border-slate-950 bg-slate-50/80 ring-2 ring-slate-900/5" : "border-slate-200 hover:bg-slate-50/50"}`}>
                    <input type="radio" name="paymentMethod" value={p.id} checked={formData.paymentMethod === p.id} onChange={handleInputChange} className="mt-1 accent-slate-950" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{p.label}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{p.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || cartItems.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Locking Structural Records..." : "Compile & Authorize Checkout Route"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          {/* ITEM SUMMARY OVERVIEW BAR */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 space-y-4 shadow-xs">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Order Manifest Items</h2>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center py-2.5 first:pt-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border bg-slate-50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] font-semibold text-slate-400">{item.qty} &times; ${item.price}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-900">${(item.qty * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-1.5 text-xs font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Cart Elements</span>
                  <span className="text-slate-800 font-bold">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Courier Carriage</span>
                  <span className="text-slate-800 font-bold">{shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-dashed">
                  <span>Aggregate Liability</span>
                  <span className="text-emerald-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}