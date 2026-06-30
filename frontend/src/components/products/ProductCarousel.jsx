import ProductCard from "./ProductCard"; 

export default function ProductCarousel({ title = "Featured Products", products = [] }) { 
  if (!products.length) return null; 

  return ( 
    <section className="my-12 py-4 animate-in fade-in duration-300"> 
      {/* Section Typography Title */} 
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"> 
          {title} 
        </h2> 
        <div className="h-0.5 flex-1 bg-slate-100 mx-6 hidden sm:block" />
      </div>

      {/* Responsive Inline Scroll Track */} 
      <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"> 
        {products.map((product) => ( 
          <div 
            key={product._id} 
            className="min-w-[260px] sm:min-w-[300px] max-w-[320px] snap-start" 
          > 
            <ProductCard product={product} /> 
          </div> 
        ))} 
      </div> 
    </section> 
  ); 
}