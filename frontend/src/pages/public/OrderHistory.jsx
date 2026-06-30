import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";
import { STORE_NAME } from "../../constants";

export default function OrderHistory() {
  const { data, isLoading, isError, error } = useGetMyOrdersQuery();
  const orders = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <section className="p-6">
        <Message type="error">
          {error?.data?.message || "Failed to load order history"}
        </Message>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          {STORE_NAME} - Order History
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border text-center">
            <h2 className="text-xl font-semibold text-slate-900">No Orders Yet</h2>
            <p className="text-slate-500 mt-2">You haven’t placed any orders yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            >
              Start Shopping
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Order ID</p>
                    <p className="font-semibold text-slate-900">{order._id}</p>
                    <p className="text-sm text-slate-500 mt-2">Items: {order.orderItems?.length || 0}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="text-xl font-bold text-emerald-500">${(order.totalPrice || 0).toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                    <Link to={`/order/${order._id}`} className="text-emerald-500 font-medium hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}