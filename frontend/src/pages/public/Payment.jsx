import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { STORE_NAME } from "../../constants";

const steps = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review" },
];

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState(() => localStorage.getItem("paymentMethod") || "COD");
  const [shippingAddress] = useState(() => {
    const savedShipping = localStorage.getItem("shippingAddress");
    if (!savedShipping) return null;

    try {
      return JSON.parse(savedShipping);
    } catch {
      localStorage.removeItem("shippingAddress");
      return null;
    }
  });

  useEffect(() => {
    const savedShipping = localStorage.getItem("shippingAddress");
    if (!savedShipping) {
      navigate("/shipping");
      return;
    }

    try {
      JSON.parse(savedShipping);
    } catch {
      localStorage.removeItem("shippingAddress");
      navigate("/shipping");
      return;
    }
  }, [navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!method) {
      return toast.error("Please select a payment method");
    }

    localStorage.setItem("paymentMethod", method);
    toast.success("Payment method saved");
    navigate("/placeorder");
  };

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step.id === 2 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                {step.id}
              </div>
              <span className={`text-sm font-medium ${step.id === 2 ? "text-slate-900" : "text-slate-500"}`}>{step.label}</span>
              {index < steps.length - 1 ? <span className="text-slate-300">→</span> : null}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-slate-900">{STORE_NAME} - Payment Method</h1>
            <p className="mt-1 text-slate-500">Choose how you want to pay for your order.</p>
          </div>

          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Delivery address</p>
            <p className="mt-1 font-semibold text-slate-900">
              {shippingAddress ? `${shippingAddress.address}, ${shippingAddress.city}` : "Complete shipping first"}
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${method === "COD" ? "border-emerald-500 bg-emerald-50/80 shadow-sm" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
              <input type="radio" name="payment" value="COD" checked={method === "COD"} onChange={(e) => setMethod(e.target.value)} className="accent-emerald-500" />
              <div>
                <p className="font-medium text-slate-900">Cash on Delivery</p>
                <p className="text-sm text-slate-500">Pay at the time your order arrives.</p>
              </div>
            </label>

            <label className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 opacity-60">
              <input type="radio" disabled />
              <div>
                <p className="font-medium text-slate-900">Online Payment (Coming Soon)</p>
                <p className="text-sm text-slate-500">Card / Stripe / JazzCash / Easypaisa</p>
              </div>
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.98]"
            >
              Continue to Place Order
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}