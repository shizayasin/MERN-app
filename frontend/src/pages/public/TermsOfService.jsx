import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Legal</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Terms of Service</h1>
        </div>

        <div className="space-y-5 text-sm leading-7 text-slate-600">
          <p>By using this website, you agree to comply with these terms and all applicable laws.</p>
          <div>
            <h2 className="text-base font-bold text-slate-900">Account Responsibility</h2>
            <p>You are responsible for keeping your login credentials secure and for any activity under your account.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Product Information</h2>
            <p>We work to provide accurate product descriptions and pricing, but occasional errors may occur.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Order Acceptance</h2>
            <p>Orders are subject to confirmation, availability, and payment verification before fulfillment.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Limitation of Liability</h2>
            <p>We are not liable for indirect or incidental damages arising from using our platform.</p>
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
