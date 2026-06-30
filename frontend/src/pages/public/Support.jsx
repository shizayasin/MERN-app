import { Link } from "react-router-dom";

export default function Support() {
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Support</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Help & Assistance</h1>
        </div>

        <div className="space-y-5 text-sm leading-7 text-slate-600">
          <p>Need help with an order, payment, or account? Our support team is ready to assist.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email</p>
              <p className="mt-1 font-semibold text-slate-900">support@stylehub.com</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone</p>
              <p className="mt-1 font-semibold text-slate-900">+1 (800) 555-0199</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Hours</p>
              <p className="mt-1 font-semibold text-slate-900">Mon–Sat, 9AM–6PM</p>
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Common Questions</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>How do I track my order?</li>
              <li>Can I change my shipping address after checkout?</li>
              <li>How do I return a product?</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
