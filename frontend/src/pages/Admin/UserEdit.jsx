import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, isError, refetch } = useGetUserDetailsQuery(id);
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      isAdmin: false,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        isAdmin: !!user.isAdmin,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUser({ id, ...data }).unwrap();
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/users");
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-50/60 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">
          Loading user details...
        </div>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section className="min-h-screen bg-slate-50/60 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center text-sm font-bold text-rose-600">
          User details could not be loaded.
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link to="/admin/users" className="inline-flex text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900">? Back to users</Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Edit</p>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">User Details</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
              <input {...register("username", { required: "Username is required" })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
              {errors.username && <p className="mt-1 text-xs font-bold text-rose-600">{errors.username.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
              <input type="email" {...register("email", { required: "Email is required" })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
              {errors.email && <p className="mt-1 text-xs font-bold text-rose-600">{errors.email.message}</p>}
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <input type="checkbox" id="isAdmin" {...register("isAdmin")} className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
              <label htmlFor="isAdmin" className="text-xs font-bold uppercase tracking-wider text-slate-700">Make admin</label>
            </div>

            <button type="submit" disabled={updating} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50">
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserEdit;
