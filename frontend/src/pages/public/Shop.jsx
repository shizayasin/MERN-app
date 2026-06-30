import { useState, useEffect } from "react"; 
import { FaSearch, FaSlidersH } from "react-icons/fa"; 
import { STORE_NAME } from "../../constants";
import { useGetProductsQuery } from "../../redux/api/productApiSlice"; 
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice"; 
import ProductCard from "../../components/products/ProductCard"; 
import Loader from "../../components/ui/Loader"; 
import Message from "../../components/ui/Message"; 
import { useLocation, useNavigate } from "react-router-dom"; 

const Shop = () => { 
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse state parameters directly during the render phase
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get("category") || "";

  // Dynamic local UI states
  const [pageNumber, setPageNumber] = useState(1); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortOption, setSortOption] = useState(""); 

  // Inline Search Input Debouncing Engine
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: categories = [] } = useGetCategoriesQuery(); 
  
  const { data, isLoading, isError, error } = useGetProductsQuery({ 
    keyword: debouncedSearchTerm, 
    category: categoryFilter, 
    pageNumber, 
    sort: sortOption, 
  }); 

  const products = data?.products || []; 
  const pages = data?.pages || 1; 
  const page = data?.page || 1; 

  const clearFilters = () => { 
    setSearchTerm(""); 
    setSortOption(""); 
    setPageNumber(1); 
    if (categoryFilter) {
      navigate("/shop");
    }
  }; 

  return ( 
    <section className="min-h-screen bg-slate-50/60 px-4 sm:px-6 lg:px-8 py-8 text-slate-800"> 
      <div className="max-w-7xl mx-auto"> 
        
        {/* HEADER */} 
        <div className="mb-8 pb-4 border-b border-slate-200/60 flex flex-col md:flex-row md:items-end justify-between gap-4"> 
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase"> 
              {STORE_NAME} Catalog 
            </h1> 
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5"> 
              Discover premium fashion, lifestyle collections and functional footwear styles.
            </p> 
          </div> 
          {!isLoading && !isError && ( 
            <span className="bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 shadow-2xs self-start md:self-auto"> 
              ⚡ {data?.total || 0} items discovered
            </span> 
          )}
        </div> 

        {/* SEARCH & FILTERS PANEL */} 
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/50 shadow-xs mb-6 space-y-4"> 
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group"> 
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-slate-800 transition-colors" /> 
              <input 
                value={searchTerm} 
                onChange={(e) => { setSearchTerm(e.target.value); setPageNumber(1); }} 
                placeholder="Query items, signatures, brands..." 
                className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-800 focus:bg-white outline-hidden transition" 
              /> 
            </div> 

            <div className="min-w-[240px] flex items-center gap-2"> 
              <FaSlidersH className="text-slate-400 text-xs hidden sm:block" />
              <select 
                value={sortOption} 
                onChange={(e) => { setSortOption(e.target.value); setPageNumber(1); }} 
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 font-semibold focus:border-slate-800 focus:bg-white outline-hidden transition shadow-2xs cursor-pointer" 
              > 
                <option value="">Sort: New Arrivals</option> 
                <option value="price-low">Price: Low to High</option> 
                <option value="price-high">Price: High to Low</option> 
                <option value="name-asc">Name: A-Z</option> 
                <option value="name-desc">Name: Z-A</option> 
              </select> 
            </div> 
          </div>

          {/* CATEGORIES TRACK FILTER CHIPS */} 
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2"> 
            <button 
              onClick={() => { navigate("/shop"); setPageNumber(1); }} 
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition duration-200 border shadow-2xs ${ 
                !categoryFilter 
                  ? "bg-slate-900 text-white border-slate-900" 
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100" 
              }`} 
            > 
              All Categories
            </button> 
            {categories.map((cat) => ( 
              <button 
                key={cat._id} 
                onClick={() => { navigate(`/shop?category=${cat._id}`); setPageNumber(1); }} 
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition duration-200 border shadow-2xs ${ 
                  categoryFilter === cat._id 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100" 
                }`} 
              > 
                {cat.name} 
              </button> 
            ))} 

            {(searchTerm || categoryFilter || sortOption) && ( 
              <button onClick={clearFilters} className="text-xs font-bold text-rose-600 hover:text-rose-700 ml-auto transition-colors pt-2 sm:pt-0" > 
                Reset All Filters
              </button> 
            )} 
          </div> 
        </div> 

        {/* LOADING & ERROR CALLOUTS */} 
        {isLoading && <Loader text="Mapping latest database entries..." />} 
        {isError && ( 
          <Message variant="danger"> 
            {error?.data?.message || "Failed to successfully sync retail catalog indices."} 
          </Message> 
        )} 

        {/* PRODUCTS MATRIX GRID */} 
        {!isLoading && !isError && ( 
          <> 
            {products.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/60 shadow-xs max-w-md mx-auto my-8">
                <p className="text-sm font-semibold text-slate-400">No storefront matching items could be found matching specifications.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"> 
                {products.map((product) => ( 
                  <ProductCard key={product._id} product={product} />
                ))} 
              </div> 
            )}

            {/* PAGINATION PANEL */} 
            {pages > 1 && ( 
              <div className="flex justify-center items-center gap-1.5 mt-12 flex-wrap"> 
                {[...Array(pages).keys()].map((x) => ( 
                  <button 
                    key={x + 1} 
                    onClick={() => setPageNumber(x + 1)} 
                    className={`h-9 w-9 text-xs font-bold rounded-xl border transition shadow-2xs ${ 
                      page === x + 1 
                        ? "bg-slate-900 text-white border-slate-900" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50" 
                    }`} 
                  > 
                    {x + 1} 
                  </button> 
                ))} 
              </div> 
            )} 
          </> 
        )} 
      </div> 
    </section> 
  ); 
}; 

export default Shop;