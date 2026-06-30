import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { STORE_NAME } from "../../constants";
import Message from "../../components/ui/Message";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApiSlice";

const EmptyState = ({ title, description }) => (
  <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
    <p className="text-sm font-bold text-slate-700">{title}</p>
    <p className="mt-2 text-sm text-slate-500">{description}</p>
  </div>
);

const Users = () => {
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const users = Array.isArray(data?.users) ? data.users : [];

  const deleteHandler = async (id) => {
    const targetUser = users.find((user) => user._id === id);
    const name = targetUser?.username || "this user";

    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return;

    try {
      await deleteUser(id).unwrap();
      toast.success(`${name} was deleted successfully`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-50/60 px-4 py-10">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200" />
          <div className="h-16 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-slate-50/60 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <Message type="warning">{error?.data?.message || "We couldn’t load the users right now. The page will show an empty state until the API is available."}</Message>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Users</p>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{STORE_NAME} Users</h1>
          </div>
          <button onClick={() => refetch()} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">
            Refresh
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Username</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Email</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Role</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <EmptyState
                        title="No users found"
                        description="There are no registered users to display right now."
                      />
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">{user.username}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${user.isAdmin ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {user.isAdmin ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <Link to={`/admin/users/${user._id}/edit`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Edit</Link>
                          <button onClick={() => deleteHandler(user._id)} disabled={deleting} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 disabled:opacity-50">{deleting ? "Deleting..." : "Delete"}</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Users;
