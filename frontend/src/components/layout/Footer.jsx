import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { FaTwitter, FaInstagram, FaFacebookF, FaPinterestP } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/50 bg-white text-slate-600 font-sans mt-auto w-full">
      {/* CHANGED: Removed max-w-7xl mx-auto constraints */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Anchor column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={Logo} alt="StyleHub" className="w-8 h-8 object-contain" />
              <h2 className="font-black text-base text-slate-900 tracking-tight uppercase">StyleHub</h2>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold max-w-sm leading-relaxed">
              Premium tailored garments and modern lifestyle accessories, curated thoughtfully to elevate your day-to-day fashion statements.
            </p>
            <div className="flex gap-2.5 pt-1">
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                <FaInstagram size={15} />
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                <FaTwitter size={15} />
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                <FaFacebookF size={13} />
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                <FaPinterestP size={14} />
              </a>
            </div>
          </div>

          {/* Nav Links column */}
          <div className="grid grid-cols-2 gap-8 md:col-span-7">
            <div className="space-y-3.5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900">Marketplace</p>
              <ul className="space-y-2 text-xs sm:text-sm font-semibold">
                <li><Link to="/shop" className="text-slate-400 hover:text-slate-900 transition-colors">Browse Collections</Link></li>
                <li><Link to="/shop?category=new" className="text-slate-400 hover:text-slate-900 transition-colors">New Arrivals</Link></li>
                <li><Link to="/favorites" className="text-slate-400 hover:text-slate-900 transition-colors">Member Wishlist</Link></li>
              </ul>
            </div>
            <div className="space-y-3.5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-900">Legal & Operations</p>
              <ul className="space-y-2 text-xs sm:text-sm font-semibold">
                <li><Link to="/privacy" className="text-slate-400 hover:text-slate-900 transition-colors">Privacy Charter</Link></li>
                <li><Link to="/terms" className="text-slate-400 hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                <li><Link to="/support" className="text-slate-400 hover:text-slate-900 transition-colors">Help & Assistance</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Bottom Border */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <p>&copy; {currentYear} StyleHub. Engineered securely with modern stack architectures.</p>
          <div className="flex gap-6">
            <span>Global Fulfillments</span>
            <span>SSL Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
