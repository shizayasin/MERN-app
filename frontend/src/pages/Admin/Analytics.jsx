import { STORE_NAME } from "../../constants";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { useGetUsersQuery } from "../../redux/api/userApiSlice";

export default function Analytics() {
  const { data: productsData } = useGetProductsQuery({ pageNumber: 1, pageSize: 100 });
  const { data: orders = [] } = useGetOrdersQuery();
  const { data: usersData } = useGetUsersQuery();

  const productsCount = productsData?.total || 0;
  const ordersCount = Array.isArray(orders) ? orders.length : 0;
  const usersCount = Array.isArray(usersData?.users) ? usersData.users.length : 0;

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const paidOrders = orders.filter((order) => order.isPaid).length;

  const stats = [
    { label: "Products", value: productsCount },
    { label: "Orders", value: ordersCount },
    { label: "Users", value: usersCount },
    { label: "Revenue", value: `$${totalRevenue.toFixed(2)}` },
  ];

  const chartData = [
    { label: "Products", value: productsCount },
    { label: "Orders", value: ordersCount },
    { label: "Users", value: usersCount },
    { label: "Paid", value: paidOrders },
  ];

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Analytics</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-slate-900">{STORE_NAME} Overview</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">Performance Snapshot</h2>
            <span className="text-xs font-bold text-slate-500">{paidOrders} paid orders</span>
          </div>
          <div className="flex h-72 items-end gap-3 overflow-hidden rounded-xl bg-slate-50 p-4">
            {chartData.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-slate-900 to-emerald-500"
                    style={{ height: `${Math.max((item.value / Math.max(...chartData.map((d) => d.value), 1)) * 100, 12)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}