import { Link } from "react-router-dom";
import { STORE_NAME } from "../../constants";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";

export default function AllProducts() {
  const PAGE_SIZE = 100;
  const { data, isLoading, isError } = useGetProductsQuery({ pageNumber: 1, pageSize: PAGE_SIZE });
  const products = Array.isArray(data?.products) ? data.products : []; 
  const totalProducts = data?.total ?? products.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/60">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing catalog tracks...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/60">
        <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Network connectivity error on product lookup. Showing a safe empty catalog state.</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{STORE_NAME} Master Ledger</h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Total registered listings: {totalProducts} units.</p>
          </div>
          
          <Link to="/admin/product/create" className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-slate-800 transition">
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-slate-200/50 rounded-2xl p-12 text-center text-xs font-semibold text-slate-400">
            No live production stock indicators cataloged in the environment ledger.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden flex flex-col justify-between group transition hover:border-slate-300">
                <div className="p-4 space-y-3">
                  <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-xl bg-slate-50" />
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-slate-700 transition">{p.name}</h3>
                      <span className="text-xs font-black text-emerald-600 shrink-0">${p.price}</span>
                    </div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">{p.brand}</p>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                  <Link to={`/admin/product/edit/${p._id}`} className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">
                    Update
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
