import { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom"; 
import { toast } from "react-toastify"; 
import { useDispatch } from "react-redux"; 
import { useLoginMutation } from "../../redux/api/userApiSlice"; 
import { setCredentials } from "../../redux/features/auth/authSlice"; 
import { clearCartLocal } from "../../redux/features/cart/cartSlice";
import { clearFavoritesLocal } from "../../redux/features/favorites/favoritesSlice";
import AuthLayout from "../../components/layout/AuthLayout";

export default function Login() { 
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const [login, { isLoading }] = useLoginMutation(); 

  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 

  const submitHandler = async (e) => { 
    e.preventDefault(); 
    if (!email.trim() || !password) {
      return toast.error("Please provide both email and password keys.");
    }
    try { 
      const res = await login({ email: email.trim(), password }).unwrap();
      const normalizedUser = {
        _id: res?._id || null,
        username: res?.username || email.trim(),
        email: res?.email || email.trim(),
        isAdmin: Boolean(res?.isAdmin),
        profileImage: res?.profileImage || null,
      };
      dispatch(clearCartLocal());
      dispatch(clearFavoritesLocal());
      dispatch(setCredentials(normalizedUser));
      toast.success("Welcome back! Signed in successfully");
      navigate("/");
    } catch (err) { 
      toast.error(err?.data?.message || err?.message || "Invalid authentication credentials"); 
    } 
  }; 

  return ( 
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your verified details below to manage your orders."
    >
      <form onSubmit={submitHandler} className="space-y-5 animate-in fade-in duration-300"> 
        {/* Email Form Field Grid */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Email Address
          </label>
          <input 
            type="email"
            placeholder="name@company.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={isLoading}
            className="w-full text-sm border border-slate-200 bg-white text-slate-900 placeholder-slate-400 p-3 rounded-xl outline-hidden focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 shadow-xs disabled:bg-slate-50 disabled:text-slate-400" 
            required
          /> 
        </div>

        {/* Password Form Field Grid */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Account Password
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Forgot?
            </Link>
          </div>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={isLoading}
            className="w-full text-sm border border-slate-200 bg-white text-slate-900 placeholder-slate-400 p-3 rounded-xl outline-hidden focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 shadow-xs disabled:bg-slate-50 disabled:text-slate-400" 
            required
          /> 
        </div> 

        {/* Primary Form Access Submission Trigger */}
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm tracking-wide shadow-xs active:scale-[0.99] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
        > 
          {isLoading ? "Validating Session..." : "Sign In Securely"} 
        </button> 

        {/* Alternate Auth Routing Option */}
        <p className="mt-6 text-center text-xs font-medium text-slate-500"> 
          New to the platform?{" "} 
          <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-bold tracking-tight transition-colors">
            Create an account here
          </Link> 
        </p> 
      </form> 
    </AuthLayout>
  ); 
}