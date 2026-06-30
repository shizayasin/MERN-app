import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; 

export default function Rating({ value = 0, text = "" }) { 
  const renderStar = (i) => { 
    if (value >= i) return <FaStar />; 
    if (value >= i - 0.5) return <FaStarHalfAlt />; 
    return <FaRegStar />; 
  }; 

  return ( 
    <div className="inline-flex items-center gap-2 text-amber-400 font-sans"> 
      <div className="flex items-center gap-0.5 text-sm sm:text-base">
        {[1, 2, 3, 4, 5].map((i) => ( 
          <span key={i} className="flex items-center">{renderStar(i)}</span> 
        ))} 
      </div>
      {text && ( 
        <span className="text-xs sm:text-sm font-semibold text-slate-500 pl-0.5"> 
          {text} 
        </span> 
      )} 
    </div> 
  ); 
}