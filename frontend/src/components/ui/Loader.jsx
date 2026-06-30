export default function Loader() { 
  return ( 
    <div className="flex flex-col items-center justify-center min-h-[240px] p-6 animate-in fade-in duration-300"> 
      <div className="relative flex items-center justify-center">
        {/* Outer Ring Pulse Geometry */}
        <div className="absolute w-12 h-12 border-4 border-emerald-500/10 rounded-full"></div>
        {/* Primary Animated Core Ring Spinner */}
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin shadow-inner"></div>
      </div>
      <span className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 animate-pulse">
        Syncing Interface...
      </span>
    </div> 
  ); 
}