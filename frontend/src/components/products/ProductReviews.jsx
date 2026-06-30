import { FaStar } from "react-icons/fa"; 

export default function ProductReviews({ reviews = [] }) { 
  if (!reviews.length) { 
    return ( 
      <div className="bg-white border border-slate-100 rounded-2xl p-8 mt-10 text-center shadow-xs"> 
        <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 font-semibold text-lg">
          ?
        </div>
        <h3 className="text-base font-bold text-slate-800"> 
          No Reviews Shared Yet 
        </h3> 
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed"> 
          Purchased this item? Be the first to provide helpful product feedback for future shoppers.
        </p> 
      </div> 
    ); 
  } 

  return ( 
    <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 mt-10 shadow-xs"> 
      <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-6 tracking-tight"> 
        Verified Customer Feedback 
      </h2> 
      
      <div className="divide-y divide-slate-100"> 
        {reviews.map((review, index) => ( 
          <div key={index} className="py-5 first:pt-0 last:pb-0 flex items-start gap-4" > 
            {/* User Avatar Placeholder */}
            <div className="h-9 w-9 min-w-[36px] bg-slate-100 border border-slate-200/50 rounded-xl flex items-center justify-center font-bold text-xs text-slate-600 uppercase">
              {review.name ? review.name.charAt(0).toUpperCase() : "A"}
            </div>

            {/* Content Segment */}
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1"> 
                <h4 className="font-bold text-sm text-slate-800 truncate"> 
                  {review.name || "Anonymous Buyer"} 
                </h4> 

                {/* Star Matrix Array */} 
                <div className="flex gap-0.5 text-amber-400"> 
                  {[...Array(5)].map((_, i) => ( 
                    <FaStar 
                      key={i} 
                      size={12}
                      className={i < Math.round(review.rating || 0) ? "text-amber-400" : "text-slate-200"} 
                    /> 
                  ))} 
                </div> 
              </div> 

              {/* Message Comment Block */} 
              <p className="text-sm text-slate-600 font-medium leading-relaxed break-words"> 
                {review.comment || "No text comments provided."} 
              </p> 
            </div>
          </div> 
        ))} 
      </div> 
    </div> 
  ); 
}