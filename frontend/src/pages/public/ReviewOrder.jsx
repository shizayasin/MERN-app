import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PlaceholderImg from "../../assets/placeholder.svg";
import { formatPrice, STORE_NAME, getAssetUrl } from "../../constants";

const steps = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review" },
];

export default function ReviewOrder() {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress] = useState(() => {
    const saved = localStorage.getItem("shippingAddress");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [paymentMethod] = useState(() => localStorage.getItem("paymentMethod") || "COD");

  const itemsPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  const shippingPrice = itemsPrice > 3000 ? 0 : 250;
  const taxPrice = Math.round(itemsPrice * 0.05); // 5% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDays = 3;
    const maxDays = 5;
    const deliveryStart = new Date(today);
    const deliveryEnd = new Date(today);
    deliveryStart.setDate(today.getDate() + minDays);
    deliveryEnd.setDate(today.getDate() + maxDays);

    const options = { month: "short", day: "numeric" };
    return `${deliveryStart.toLocaleDateString("en-US", options)} - ${deliveryEnd.toLocaleDateString("en-US", options)}`;
  };

  if (!shippingAddress) {
    setTimeout(() => navigate("/shipping"), 100);
    return null;
  }

  if (cartItems.length === 0) {
    setTimeout(() => navigate("/cart"), 100);
    return null;
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      navigate("/placeorder");
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step.id === 3 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {step.id}
              </div>
              <span
                className={`text-sm font-medium ${
                  step.id === 3 ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 ? <span className="text-slate-300">→</span> : null}
            </div>
          ))}
        </div>

        {/* Review Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">{STORE_NAME} - Order Review</h1>
          <p className="mt-1 text-slate-500">Verify your order details before placing it.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Address & Payment */}
          <div className="lg:col-span-2 space-y-4">
            {/* Shipping Address Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Delivery Address
                </h2>
                <button
                  onClick={() => navigate("/shipping")}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{shippingAddress.fullName}</p>
                <p>{shippingAddress.phoneNumber}</p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Payment Method
                </h2>
                <button
                  onClick={() => navigate("/payment")}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">
                  {paymentMethod === "COD"
                    ? "Cash on Delivery (COD)"
                    : "Direct Bank / Wallet Wire (Coming Soon)"}
                </p>
                <p className="text-xs">
                  {paymentMethod === "COD"
                    ? "Pay the delivery agent in cash when your order arrives."
                    : "This option is currently unavailable and will be enabled soon."}
                </p>
              </div>
            </div>

            {/* Estimated Delivery Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-900 mb-2">📦 Estimated Delivery</h3>
              <p className="text-2xl font-bold text-emerald-700">{getEstimatedDelivery()}</p>
              <p className="text-xs text-emerald-600 mt-1">
                Standard delivery within 3-5 business days
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-4">
            {/* Items Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Items Ordered ({cartItems.length})
              </h2>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 items-start py-2.5 first:pt-0 last:pb-0">
                    <img
                      src={getAssetUrl(item.image || PlaceholderImg)}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = PlaceholderImg;
                      }}
                      className="w-10 h-10 object-cover rounded-lg border bg-slate-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-500">
                        {item.qty} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-slate-900 flex-shrink-0">
                      {formatPrice(item.qty * item.price)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-slate-100 pt-4 mt-4 space-y-2 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-bold">{formatPrice(itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span className="text-slate-800 font-bold">{formatPrice(taxPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-slate-800 font-bold">
                    {shippingPrice === 0 ? "FREE" : formatPrice(shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-emerald-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Place Order"}
                <span aria-hidden="true">→</span>
              </button>
              <button
                onClick={() => navigate("/payment")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                ← Back to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
