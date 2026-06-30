import { Link } from "react-router-dom";
import { STORE_NAME } from "../../constants";

export default function PrivacyPolicy() {
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Legal</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Privacy Policy</h1>
        </div>

        <div className="space-y-5 text-sm leading-7 text-slate-600">
          <p>
            At {STORE_NAME}, we respect your privacy and are committed to protecting your personal information.
          </p>
          <div>
            <h2 className="text-base font-bold text-slate-900">Information We Collect</h2>
            <p>We collect details you provide during registration, checkout, and account updates, such as your name, email, shipping address, and payment information.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">How We Use Your Information</h2>
            <p>Your information helps us process orders, improve your shopping experience, communicate updates, and prevent fraud.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Data Security</h2>
            <p>We use secure systems and industry-standard practices to protect your data from unauthorized access.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Choices</h2>
            <p>You may update your account details at any time and contact us if you want to review or remove personal data.</p>
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
