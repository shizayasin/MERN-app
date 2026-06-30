import { useMemo, useState } from "react"; 
import { useNavigate, Link } from "react-router-dom"; 
import { toast } from "react-toastify"; 
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../../redux/api/userApiSlice"; 
import { setCredentials } from "../../redux/features/auth/authSlice";
import AuthLayout from "../../components/layout/AuthLayout";
import { validateEmail, validatePassword } from "../../utils/validation";

export default function Register() { 
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [register, { isLoading }] = useRegisterMutation(); 

  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 

  const emailValidation = useMemo(() => validateEmail(email), [email]);
  const passwordValidation = useMemo(() => validatePassword(password), [password]);
  const isFormValid = name.trim() && emailValidation.isValid && passwordValidation.isValid;

  const submitHandler = async (e) => { 
    e.preventDefault(); 
    if (!name.trim()) {
      return toast.error("Please enter your full name.");
    }

    if (!emailValidation.isValid) {
      return toast.error("Email must end with @gmail.com");
    }

    if (!passwordValidation.isValid) {
      return toast.error("Password must be 6-12 characters with uppercase, lowercase, numbers, and a special character.");
    }
    try { 
      const response = await register({ username: name.trim(), email: email.trim(), password }).unwrap();
      const normalizedUser = {
        _id: response?._id || response?.user?._id || null,
        username: response?.username || name.trim(),
        email: response?.email || email.trim(),
        isAdmin: Boolean(response?.isAdmin),
        profileImage: response?.profileImage || null,
      };
      dispatch(setCredentials(normalizedUser));
      toast.success("Account created successfully. You are now signed in.");
      navigate("/");
    } catch (err) { 
      toast.error(err?.data?.message || err?.message || "Registration processing failed"); 
    } 
  }; 

  return ( 
    <AuthLayout 
      title="Create account" 
      subtitle="Join to manage curated fashion custom collections today."
    >
      <form onSubmit={submitHandler} className="space-y-5 animate-in fade-in duration-300"> 
        {/* Full Identity Registration Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Full Signature Name
          </label>
          <input 
            type="text"
            placeholder="John Doe" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            disabled={isLoading}
            className="w-full text-sm border border-slate-200 bg-white text-slate-900 placeholder-slate-400 p-3 rounded-xl outline-hidden focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 shadow-xs disabled:bg-slate-50 disabled:text-slate-400"
            required 
          /> 
        </div>

        {/* Email Address Registration Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Email Address
          </label>
          <input 
            type="email"
            placeholder="name@gmail.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={isLoading}
            className={`w-full text-sm border ${email && !emailValidation.isValid ? "border-rose-400" : "border-slate-200"} bg-white text-slate-900 placeholder-slate-400 p-3 rounded-xl outline-hidden focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 shadow-xs disabled:bg-slate-50 disabled:text-slate-400`}
            required 
          /> 
          {email && !emailValidation.isValid && (
            <p className="text-xs font-semibold text-rose-600">{emailValidation.message}</p>
          )}
        </div> 

        {/* Password Security Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Secure Account Password
          </label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={isLoading}
            className={`w-full text-sm border ${password && !passwordValidation.isValid ? "border-rose-400" : "border-slate-200"} bg-white text-slate-900 placeholder-slate-400 p-3 rounded-xl outline-hidden focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 shadow-xs disabled:bg-slate-50 disabled:text-slate-400`}
            required 
          /> 
          {password && !passwordValidation.isValid && (
            <div className="space-y-1 text-xs font-semibold text-rose-600">
              <p>- Length: 6 to 12 characters</p>
              <p>- Must include uppercase, lowercase, numbers, and special characters</p>
            </div>
          )}
        </div> 

        {/* Primary Action Button Registration Trigger */}
        <button 
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full mt-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm tracking-wide shadow-xs active:scale-[0.99] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
        > 
          {isLoading ? "Creating Security Profile..." : "Register Account"} 
        </button> 

        {/* Alternate Routing Reference Row */}
        <p className="mt-6 text-center text-xs font-medium text-slate-500"> 
          Already have a profile?{" "} 
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold tracking-tight transition-colors">
            Login here instead
          </Link> 
        </p> 
      </form> 
    </AuthLayout>
  ); 
}