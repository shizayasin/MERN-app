import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";
import ProductCard from "../../components/products/ProductCard";
import { FiArrowRight, FiShield, FiTruck, FiAward } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

import HeroBanner from "../../assets/header.png";
import SportsOutdoorsImg from "../../assets/Sports&Outdoors.jpg";
import HomeKitchenImg from "../../assets/Home&Kitchen.jpg";
import BeautyPersonalCareImg from "../../assets/Beauty&PersonalCare.jpg";
import ElectronicsImg from "../../assets/Electronics.jpg";
import FashionImg from "../../assets/Fashion.jpg";

const Home = () => {
  const { data, isLoading, error } = useGetProductsQuery({ pageNumber: 1 });
  const products = data?.products || [];

  const MAIN_CATEGORIES = [
    { name: "Sports & Outdoors", img: SportsOutdoorsImg, bgColor: "bg-[#eef7f1]" },
    { name: "Home & Kitchen", img: HomeKitchenImg, bgColor: "bg-[#fff1f4]" },
    { name: "Beauty & Personal Care", img: BeautyPersonalCareImg, bgColor: "bg-[#fff7ec]" },
    { name: "Electronics", img: ElectronicsImg, bgColor: "bg-[#eef3ff]" },
    { name: "Fashion", img: FashionImg, bgColor: "bg-[#f3eef9]" },
  ];

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="w-full bg-white text-slate-800">
      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-6 space-y-10">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full">
          <div
            className="relative overflow-hidden rounded-[12px] bg-[#f4fbf7]"
            style={{
              backgroundImage: `url(${HeroBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "right center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#f4fbf7]/95 via-[#f4fbf7]/80 to-transparent" />

              <div className="relative z-10 grid min-h-[460px] items-center gap-6 px-8 py-12 sm:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
              <div className="flex flex-col justify-center">
                <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#e6f6ee] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00966b]">
                  <HiSparkles className="h-3.5 w-3.5" />
                  New Collection 2026
                </span>

                <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl/tight">
                  Fashion that <span className="font-serif font-medium italic text-[#00966b] lowercase first-letter:uppercase">feels</span>
                  <br />
                  <span className="relative inline-block font-serif font-medium italic text-[#00966b] lowercase first-letter:uppercase pb-1 mt-1">
                    Premium
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#00966b]" />
                  </span>
                </h1>

                <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">
                  Discover premium clothing, shoes, watches and accessories<br /> designed for modern life.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#00966b] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#007d58] hover:shadow-lg hover:shadow-emerald-600/20"
                  >
                    Shop Now <FiArrowRight />
                  </Link>
                  <Link
                    to="/shop"
                    className="inline-flex items-center rounded-2xl border border-[#00966b]/20 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition-all duration-200 hover:bg-slate-50"
                  >
                    Browse Products
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-slate-200/60 pt-6 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiAward className="text-xl text-[#00966b]" />
                    <span>Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTruck className="text-xl text-[#00966b]" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiShield className="text-xl text-[#00966b]" />
                    <span>100% Secure</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block" />
            </div>
          </div>
        </section>

        {/* CATEGORY CARDS SECTION */}
        <section className="w-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
              Shop By Category
            </h2>
            <Link to="/shop" className="text-xs font-bold text-[#00966b] hover:underline">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {MAIN_CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={`/shop`}
                className={`group flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-slate-100/40 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${category.bgColor}`}
              >
                <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-white shadow-sm">
                  <img src={category.img} alt={category.name} className="w-full h-full object-cover object-center" />
                </div>
                <div className="w-full text-center">
                  <h3 className="text-sm font-extrabold text-slate-800 truncate">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS SECTION */}
        <section className="w-full">
          <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
              Featured Products
            </h2>
            <Link to="/shop" className="text-xs font-bold text-[#00966b] hover:underline">
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="h-40 rounded-xl bg-slate-200" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
                  <div className="mt-4 h-10 rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mx-auto max-w-md rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center">
              <p className="text-sm font-bold text-rose-700">Could not load products right now.</p>
              <p className="mt-2 text-sm text-rose-600">Please refresh the page or try again shortly.</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
              <p className="text-sm font-bold text-slate-700">No featured products found</p>
              <p className="mt-2 text-sm text-slate-500">The catalog is currently empty for this section.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;