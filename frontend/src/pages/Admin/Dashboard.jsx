import { Link } from "react-router-dom";
import { STORE_NAME } from "../../constants";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { useGetUsersQuery } from "../../redux/api/userApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";

const Dashboard = () => {
  const { data: productsData } = useGetProductsQuery({ pageNumber: 1, pageSize: 100 });
  const { data: orders = [] } = useGetOrdersQuery();
  const { data: usersData } = useGetUsersQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  const productsCount = productsData?.total || 0;
  const ordersCount = Array.isArray(orders) ? orders.length : 0;
  const usersCount = Array.isArray(usersData?.users) ? usersData.users.length : 0;
  const categoriesCount = Array.isArray(categories) ? categories.length : 0;
  const isOffline = !productsData && !orders.length && !usersData && !categories.length;

  const stats = [
    {
      label: "Products",
      value: productsCount,
      to: "/admin/products",
      accent: "from-emerald-500 to-emerald-400",
    },
    {
      label: "Orders",
      value: ordersCount,
      to: "/admin/orders",
      accent: "from-sky-500 to-sky-400",
    },
    {
      label: "Users",
      value: usersCount,
      to: "/admin/users",
      accent: "from-violet-500 to-violet-400",
    },
    {
      label: "Categories",
      value: categoriesCount,
      to: "/admin/categories",
      accent: "from-amber-500 to-amber-400",
    },
  ];

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Dashboard</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-slate-900">{STORE_NAME} Admin</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5"
            >
              <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-r ${item.accent} px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white`}>
                {item.label}
              </div>
              <p className="text-3xl font-black text-slate-900">{item.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">Quick Actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link to="/admin/product/create" className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white">Add New Product</Link>
              <Link to="/admin/categories" className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700">Manage Categories</Link>
              <Link to="/admin/orders" className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700">Review Orders</Link>
              <Link to="/admin/users" className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700">Manage Users</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">Store Status</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Inventory</span>
                <span className="font-bold text-slate-900">{productsCount} items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pending Orders</span>
                <span className="font-bold text-slate-900">{ordersCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Registered Users</span>
                <span className="font-bold text-slate-900">{usersCount}</span>
              </div>
              {isOffline && (
                <p className="text-[11px] font-semibold text-amber-600">Offline mode: stats are showing local defaults until the API is reachable.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;