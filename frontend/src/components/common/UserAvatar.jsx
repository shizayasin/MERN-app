import { getAssetUrl } from "../../constants";

const UserAvatar = ({ userInfo, className = "h-10 w-10", fallbackClassName = "bg-emerald-600 text-white" }) => {
  const profileImage = userInfo?.profileImage;
  const initial = userInfo?.username?.charAt(0).toUpperCase() || "U";

  if (profileImage) {
    return (
      <img
        src={getAssetUrl(profileImage)}
        alt={userInfo?.username || "User avatar"}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80";
        }}
        className={`${className} object-cover rounded-xl shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-xl font-bold text-sm shadow-sm select-none ${fallbackClassName}`}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
