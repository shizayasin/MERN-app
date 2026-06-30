import { 
  AiOutlineCheckCircle, 
  AiOutlineCloseCircle, 
  AiOutlineExclamationCircle, 
  AiOutlineInfoCircle 
} from "react-icons/ai";

export default function Message({ children, type = 'info', variant }) { 
  const configurationMap = { 
    success: {
      classes: 'bg-emerald-50/60 text-emerald-800 border-emerald-100/80',
      icon: <AiOutlineCheckCircle className="text-xl text-emerald-600" />
    },
    error: {
      classes: 'bg-rose-50/60 text-rose-800 border-rose-100/80',
      icon: <AiOutlineCloseCircle className="text-xl text-rose-600" />
    },
    warning: {
      classes: 'bg-amber-50/60 text-amber-800 border-amber-100/80',
      icon: <AiOutlineExclamationCircle className="text-xl text-amber-600" />
    },
    info: {
      classes: 'bg-sky-50/60 text-sky-800 border-sky-100/80',
      icon: <AiOutlineInfoCircle className="text-xl text-sky-600" />
    },
  }; 

  const normalizedType = ['success', 'error', 'warning', 'info'].includes(type)
    ? type
    : variant === 'danger'
      ? 'error'
      : variant || 'info';

  const activeConfig = configurationMap[normalizedType] || configurationMap.info;

  return ( 
    <div 
      role="alert"
      className={`rounded-2xl border p-4 flex items-start gap-3.5 text-[13.5px] font-medium leading-relaxed shadow-xs backdrop-blur-xs animate-in fade-in slide-in-from-top-1 duration-200 ${activeConfig.classes}`}
    > 
      <span className="flex-shrink-0 mt-0.5">
        {activeConfig.icon}
      </span> 
      <div className="flex-1">
        {children}
      </div> 
    </div> 
  ); 
}