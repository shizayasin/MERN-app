import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
const AuthLayout = ({ title, subtitle, children }) => {
  return (
    /* FIXED: Flex container wrapped inside safety margin boundaries to perfectly fit app workspace windows */
    <div className="w-full min-h-screen bg-slate-50/30 px-2 sm:px-4 md:px-6 py-4 flex items-center justify-center">
      
      <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-xs min-h-[600px] lg:min-h-[700px]">
        
        {/* ===================== LEFT SIDE: AUTH FORM COLLATERALS ===================== */}
        <div className="flex flex-col justify-between col-span-1 lg:col-span-5 xl:col-span-4 p-6 sm:p-8 md:p-10 bg-white">
          
          {/* Top Brand Marker Header */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src={Logo} alt="StyleHub" className="h-6 w-6 object-contain transition-transform group-hover:rotate-6" />
              <span className="text-xs font-black tracking-tight text-slate-800 uppercase">
                StyleHub
              </span>
            </Link>
          </div>

          {/* Central Core Form Content Box */}
          <div className="w-full max-w-sm mx-auto my-auto py-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>

          {/* Bottom Small Print Legalities */}
          <div className="text-[10px] text-slate-400 text-center lg:text-left font-bold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} StyleHub Inc. Secure Shield Protected.
          </div>
        </div>

        {/* ===================== RIGHT SIDE: THE VISUAL MARKETING SLATE ===================== */}
        <div className="hidden lg:flex col-span-7 xl:col-span-8 relative bg-slate-900 overflow-hidden items-center p-12 xl:p-16">
          {/* Dynamic Abstract Background Geometry Overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/15 via-slate-900 to-slate-950 z-10" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Fallback pattern graphic block or image banner */}
          <div className="absolute inset-0 opacity-25 mix-blend-luminosity bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600')]" />

          {/* Interactive Floating Micro-Card Overlays */}
          <div className="relative z-20 w-full max-w-lg text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-extrabold tracking-wider text-emerald-300 uppercase">Season Drops 2026</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-black tracking-tight leading-[1.15] text-slate-50 uppercase">
              Redefining Contemporary Curated Fashion Trends.
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed max-w-md">
              Discover bespoke apparel choices made exclusively for your aesthetic profile. Complete tracking ecosystem, lightning rapid fulfillments, and intuitive tailored sizing models.
            </p>

            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/60 text-left">
              <div>
                <p className="text-xl font-black text-white tracking-tight">99.4%</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Satisfaction</p>
              </div>
              <div>
                <p className="text-xl font-black text-white tracking-tight">24/7</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Live Support</p>
              </div>
              <div>
                <p className="text-xl font-black text-white tracking-tight">Secured</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">SSL Protected</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default AuthLayout;