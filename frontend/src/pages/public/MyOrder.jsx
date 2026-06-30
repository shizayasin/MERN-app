import { Link, useParams } from "react-router-dom";
import { useGetMyOrdersQuery, useGetOrderByIdQuery } from "../../redux/api/orderApiSlice";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";
import { STORE_NAME } from "../../constants";

export default function MyOrder() {
  const { id } = useParams();

  const {
    data: ordersData,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
  } = useGetMyOrdersQuery(undefined, { skip: Boolean(id) });

  const {
    data: order,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useGetOrderByIdQuery(id, { skip: !id });

  const orders = Array.isArray(ordersData) ? ordersData : [];
  const isLoading = id ? isDetailLoading : isListLoading;
  const isError = id ? isDetailError : isListError;
  const error = id ? detailError : listError;

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
        <Message variant="error">
          {error?.data?.message || (id ? "Failed to load order details" : "Failed to load orders")}
        </Message>
      </section>
    );
  }

  if (id) {
    if (!order) {
      return (
        <section className="p-6">
          <Message variant="error">Order not found</Message>
        </section>
      );
    }

    return (
      <section className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Order Details</p>
              <h1 className="text-2xl font-bold text-slate-900">{STORE_NAME} Order #{order._id}</h1>
              <p className="mt-1 text-sm text-slate-500">Placed successfully and ready for review.</p>
            </div>
            <Link
              to="/order-history"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              ← Back to Orders
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-semibold text-slate-900">{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-semibold text-slate-900">{order.paymentMethod || "COD"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items</span>
                  <span className="font-semibold text-slate-900">{order.orderItems?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">${(order.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>${(order.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Shipping Info</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{order.shippingAddress?.fullName || "Customer"}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
                <p>{order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Items</h2>
            <div className="mt-4 space-y-3">
              {(order.orderItems || []).map((item, index) => (
                <div key={`${item._id || index}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold text-slate-900">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">{STORE_NAME} - My Orders</h1>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">No orders available</h2>
            <p className="mt-2 text-slate-500">You haven’t placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((orderItem) => (
              <div key={orderItem._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Order ID</p>
                    <p className="font-semibold text-slate-900">{orderItem._id}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="font-bold text-emerald-500">${(orderItem.totalPrice || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${orderItem.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {orderItem.isPaid ? "Paid" : "Pending"}
                  </span>
                  <Link to={`/order/${orderItem._id}`} className="font-medium text-emerald-600 hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}