import { useState } from "react"; 
import { useSelector, useDispatch } from "react-redux"; 
import { Navigate, Link } from "react-router-dom"; 
import { toast } from "react-toastify"; 
import { 
  AiOutlineEye, 
  AiOutlineEyeInvisible, 
  AiOutlineShoppingCart, 
  AiOutlineHeart, 
  AiOutlineShopping, 
  AiOutlineUser, 
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineHome,
  AiOutlineUpload,
  AiOutlineDelete,
} from "react-icons/ai"; 

import { useUpdateProfileMutation, useUploadProfileImageMutation } from "../../redux/api/userApiSlice"; 
import { setCredentials } from "../../redux/features/auth/authSlice"; 
import { STORE_NAME } from "../../constants"; 
import UserAvatar from "../../components/common/UserAvatar";

const Profile = () => { 
  const dispatch = useDispatch(); 
  const { userInfo } = useSelector((state) => state.auth); 
  const { cartItems = [] } = useSelector((state) => state.cart || {}); 
  const { favorites = [] } = useSelector((state) => state.favorites || {}); 
  
  const [updateProfile, { isLoading }] = useUpdateProfileMutation(); 
  const [uploadProfileImage, { isLoading: isUploading }] = useUploadProfileImageMutation();
  
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [profileImage, setProfileImage] = useState(userInfo?.profileImage || null);
  const [orders] = useState(0);
  
  const [formData, setFormData] = useState({ 
    username: userInfo?.username || "", 
    email: userInfo?.email || "", 
    phone: userInfo?.phone || "",
    address: userInfo?.address || "",
    city: userInfo?.city || "",
    postalCode: userInfo?.postalCode || "",
    province: userInfo?.province || "",
    password: "", 
    confirmPassword: "", 
  }); 

  if (!userInfo) return <Navigate to="/login" replace />; 

  const handleChange = (e) => { 
    setFormData((prev) => ({ 
      ...prev, 
      [e.target.name]: e.target.value, 
    })); 
  }; 

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      const res = await uploadProfileImage(formDataObj).unwrap();
      const nextImage = res.image || null;
      setProfileImage(nextImage);
      dispatch(setCredentials({ ...userInfo, profileImage: nextImage }));
      toast.success("Profile image uploaded successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Image upload failed");
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    dispatch(setCredentials({ ...userInfo, profileImage: null }));
    toast.success("Profile image removed");
  };

  const submitHandler = async (e) => { 
    e.preventDefault(); 
    const { username, email, password, confirmPassword, phone, address, city, postalCode, province } = formData; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (!username.trim()) return toast.error("Username required"); 
    if (!emailRegex.test(email)) return toast.error("Invalid email"); 
    if (password && password.length < 6) return toast.error("Password must be 6+ characters"); 
    if (password !== confirmPassword) return toast.error("Passwords do not match"); 

    try { 
      const res = await updateProfile({ 
        username, 
        email,
        phone,
        address,
        city,
        postalCode,
        province,
        ...(password && { password }), 
      }).unwrap(); 
      
      dispatch(setCredentials({ ...res, profileImage })); 
      setFormData((p) => ({ ...p, password: "", confirmPassword: "" })); 
      toast.success("Profile updated successfully"); 
    } catch (err) { 
      toast.error(err?.data?.message || "Update failed"); 
    } 
  }; 

  return ( 
    <section className="min-h-screen bg-slate-50/60 py-10 px-4 text-slate-800"> 
      <div className="max-w-7xl mx-auto"> 
        
        {/* HEADER */} 
        <div className="mb-8 pb-4 border-b border-slate-200/60"> 
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase"> 
            {STORE_NAME} — Selection Profile
          </h1> 
          <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5">
            Manage your credentials, platform settings, and monitor account metrics.
          </p>
        </div> 

        {/* PROFILE CARD */} 
        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs"> 
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"> 
            {/* AVATAR WITH UPLOAD */} 
            <div className="relative group">
              <div className="h-20 w-20 overflow-hidden rounded-2xl shadow-xs">
                <UserAvatar userInfo={{ ...userInfo, profileImage, username: formData.username }} className="h-20 w-20 rounded-2xl" fallbackClassName="bg-slate-900 text-white" />
              </div>
              <label className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <AiOutlineUpload className="text-white text-2xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500 shadow-sm transition hover:bg-rose-50"
                  title="Remove profile image"
                >
                  <AiOutlineDelete size={16} />
                </button>
              )}
            </div>
            
            <div> 
              <h2 className="text-xl font-bold text-slate-900 tracking-tight"> 
                {formData.username} 
              </h2> 
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{formData.email}</p> 
              <span className="inline-flex mt-3 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50"> 
                Active Account 
              </span> 
            </div> 
          </div> 
        </div> 

        {/* CORE GRID LAYOUT */} 
        <div className="grid lg:grid-cols-3 gap-6 items-start"> 
          
          {/* LEFT COLUMN: REGISTRATION REFORM FORM */} 
          <div className="lg:col-span-2 bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-xs"> 
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-6"> 
              Account Settings 
            </h2> 
            <form onSubmit={submitHandler} className="space-y-5"> 
              <div className="grid sm:grid-cols-2 gap-5">
                <Input 
                  icon={<AiOutlineUser />} 
                  label="Username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                /> 
                <Input 
                  icon={<AiOutlineMail />} 
                  label="Email Address" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Input 
                  icon={<AiOutlinePhone />} 
                  label="Phone Number" 
                  name="phone" 
                  type="tel"
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="Optional"
                /> 
                <Input 
                  icon={<AiOutlineHome />} 
                  label="City" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Input 
                  icon={<AiOutlineHome />} 
                  label="Province/State" 
                  name="province" 
                  value={formData.province} 
                  onChange={handleChange}
                  placeholder="Optional"
                />
                <Input 
                  icon={<AiOutlineHome />} 
                  label="Postal Code" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <Input 
                icon={<AiOutlineHome />} 
                label="Address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                placeholder="Optional"
              />
              
              <PasswordField 
                label="New Password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                visible={showPassword} 
                setVisible={setShowPassword} 
                placeholder="Leave empty to keep current password" 
              /> 
              <PasswordField 
                label="Confirm Password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                visible={showConfirmPassword} 
                setVisible={setShowConfirmPassword} 
                placeholder="Re-type new password"
              /> 
              
              <button 
                disabled={isLoading || isUploading} 
                className="w-full mt-2 bg-slate-900 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]" 
              > 
                {isLoading ? "Updating Profile Assets..." : "Update Profile"} 
              </button> 
            </form> 
          </div> 

          {/* RIGHT COLUMN: ACCOUNT STATS & ROUTING CHIPS */} 
          <div className="space-y-6 lg:sticky lg:top-4"> 
            
            {/* STATS MATRIX SUMMARY */} 
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 sm:p-6 shadow-xs"> 
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-4"> 
                Account Status Metrics 
              </h3> 
              <div className="space-y-2.5">
                <StatCard icon={<AiOutlineShopping />} title="Orders History" value={orders} /> 
                <StatCard icon={<AiOutlineHeart />} title="Wishlist Items" value={favorites.length} /> 
                <StatCard icon={<AiOutlineShoppingCart />} title="Items In Cart" value={cartItems.length} /> 
              </div>
            </div> 

            {/* QUICK LINK ACTION ROUTERS */} 
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 sm:p-6 shadow-xs"> 
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-4"> 
                Quick System Actions 
              </h3> 
              <div className="space-y-2"> 
                <Link 
                  to="/order-history" 
                  className="block text-center bg-slate-900 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs tracking-wide transition shadow-2xs active:scale-[0.98]" 
                > 
                  My Orders 
                </Link> 
                <Link 
                  to="/favorites" 
                  className="block text-center border border-slate-200 text-slate-700 font-bold bg-white py-3 rounded-xl text-xs tracking-wide hover:bg-slate-50 transition shadow-2xs active:scale-[0.98]" 
                > 
                  Wishlist 
                </Link> 
                <Link 
                  to="/cart" 
                  className="block text-center border border-slate-200 text-slate-700 font-bold bg-white py-3 rounded-xl text-xs tracking-wide hover:bg-slate-50 transition shadow-2xs active:scale-[0.98]" 
                > 
                  Cart Profile 
                </Link> 
              </div> 
            </div> 

          </div> 
        </div> 
      </div> 
    </section> 
  ); 
}; 

/* ================= COMPONENT: HOVER INPUT ================= */ 
const Input = ({ icon, label, ...props }) => ( 
  <div className="space-y-1.5"> 
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide"> 
      {label} 
    </label> 
    <div className="relative"> 
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-emerald-600 transition-colors"> 
        {icon} 
      </span> 
      <input 
        {...props} 
        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/60 border border-slate-200/60 text-slate-900 text-sm font-semibold focus:border-slate-400 focus:bg-white outline-none transition" 
      /> 
    </div> 
  </div> 
); 

/* ================= COMPONENT: PASSWORD FIELD ================= */ 
const PasswordField = ({ label, visible, setVisible, ...props }) => ( 
  <div className="space-y-1.5"> 
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide"> 
      {label} 
    </label> 
    <div className="relative"> 
      <input 
        {...props} 
        type={visible ? "text" : "password"} 
        className="w-full px-4 pr-11 py-3 rounded-xl bg-slate-50/60 border border-slate-200/60 text-slate-900 text-sm font-semibold focus:border-slate-400 focus:bg-white outline-none transition placeholder:text-slate-300 placeholder:text-xs" 
      /> 
      <button 
        type="button" 
        onClick={() => setVisible(!visible)} 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition" 
      > 
        {visible ? <AiOutlineEyeInvisible className="text-lg" /> : <AiOutlineEye className="text-lg" />} 
      </button> 
    </div> 
  </div> 
); 

/* ================= COMPONENT: STAT CARD TILE ================= */ 
const StatCard = ({ icon, title, value }) => ( 
  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-100"> 
    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wide"> 
      <span className="text-slate-900 text-lg">{icon}</span> 
      {title} 
    </div> 
    <span className="font-black text-sm text-slate-900 tracking-tight"> 
      {value} 
    </span> 
  </div> 
); 

export default Profile;