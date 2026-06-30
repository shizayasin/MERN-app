import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { STORE_NAME } from "../../constants";

const steps = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review" },
];

export default function Shipping() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    if (typeof window === "undefined") {
      return { address: "", city: "", postalCode: "", country: "" };
    }

    const saved = localStorage.getItem("shippingAddress");
    if (!saved) {
      return { address: "", city: "", postalCode: "", country: "" };
    }

    try {
      const parsed = JSON.parse(saved);
      return {
        address: parsed.address || "",
        city: parsed.city || "",
        postalCode: parsed.postalCode || "",
        country: parsed.country || "",
      };
    } catch {
      localStorage.removeItem("shippingAddress");
      return { address: "", city: "", postalCode: "", country: "" };
    }
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const { address, city, postalCode, country } = form;

    if (!address.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
      return toast.error("Please fill all delivery fields");
    }

    if (postalCode.trim().length < 3) {
      return toast.error("Please enter a valid postal code");
    }

    const shippingAddress = {
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
    };

    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    toast.success("Shipping address saved");
    navigate("/payment");
  };

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step.id === 1 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                {step.id}
              </div>
              <span className={`text-sm font-medium ${step.id === 1 ? "text-slate-900" : "text-slate-500"}`}>{step.label}</span>
              {index < steps.length - 1 ? <span className="text-slate-300">→</span> : null}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-slate-900">{STORE_NAME} - Shipping Address</h1>
            <p className="mt-1 text-slate-500">Enter your delivery details for a fast and secure checkout.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <Input label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Street address" />
            <Input label="City" name="city" value={form.city} onChange={handleChange} placeholder="Your city" />
            <Input label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="e.g. 54000" />
            <Input label="Country" name="country" value={form.country} onChange={handleChange} placeholder="Your country" />

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.98]"
            >
              Continue to Payment
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Input({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block font-medium text-slate-700">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}