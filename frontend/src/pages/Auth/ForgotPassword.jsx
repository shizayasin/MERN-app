import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Password Reset Coming Soon</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            We&apos;re currently working on a secure password reset feature.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600 space-y-2">
          <p>If you need help accessing your account, please contact support.</p>
          <p className="font-semibold text-slate-800">Need immediate help?</p>
          <p className="text-emerald-700">Contact: support@stylehub.com</p>
        </div>

        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Back to Login
        </Link>
      </div>
    </section>
  );
}
