import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { STORE_NAME } from "../../constants";
import {
  useGetOrderByIdQuery,
  useGetOrdersQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";

export default function Orders() {
  const { id } = useParams();
  const hasValidOrderId =
    typeof id === "string" && id.trim() !== "" && id !== "undefined";
  const shouldFetchOrder = hasValidOrderId;
  const routeId = hasValidOrderId ? id : undefined;

  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    isError: isOrdersError,
    error: ordersError,
  } = useGetOrdersQuery(undefined, { skip: shouldFetchOrder });

  const {
    data: order,
    isLoading: isLoadingOrder,
    isError: isOrderError,
    error: orderError,
    refetch,
  } = useGetOrderByIdQuery(routeId, { skip: !shouldFetchOrder });

  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();
  const [txnRef, setTxnRef] = useState("");

  const handlePaymentResolution = async (e) => {
    e.preventDefault();
    if (order.paymentMethod === "BANK" && !txnRef.trim()) {
      return toast.error("Please insert a valid bank transfer transaction ID reference.");
    }

    try {
      await payOrder({
        id: routeId,
        paymentResult: {
          id: `MOCK_TX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: "SETTLED",
          referenceNotes:
            order.paymentMethod === "BANK"
              ? `Bank Txn ID: ${txnRef.trim()}`
              : "Settled via Courier Cash Collection",
        },
      }).unwrap();
      toast.success("Payment state committed to global node layers.");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Execution exception occurred during state mutation.");
    }
  };

  if (shouldFetchOrder) {
    if (isLoadingOrder) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader />
        </div>
      );
    }

    if (isOrderError) {
      return (
        <section className="p-6 max-w-3xl mx-auto">
          <Message variant="error">
            {orderError?.data?.message || "Failed to link node records."}
          </Message>
        </section>
      );
    }

    if (!order) {
      return (
        <section className="p-6 max-w-3xl mx-auto">
          <Message variant="error">Order details could not be loaded.</Message>
        </section>
      );
    }

    return (
      <section className="min-h-screen bg-slate-50/60 px-4 sm:px-6 py-10 text-slate-800">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">{STORE_NAME} Invoice Sheet</h1>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Tracking Block: <span className="text-slate-600 font-mono select-all">{order._id}</span>
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider self-start sm:self-auto ${order.isPaid ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
              {order.isPaid ? "Ledger Settled" : "Balance Outstanding"}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-3 shadow-xs text-sm">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Consignee Routing Details</h2>
                <div className="grid sm:grid-cols-2 gap-2 border-b pb-3 border-slate-100">
                  <p>
                    <strong className="text-slate-400 uppercase text-[10px] block tracking-wide">Client Name</strong>
                    {order.shippingAddress?.fullName || "-"}
                  </p>
                  <p>
                    <strong className="text-slate-400 uppercase text-[10px] block tracking-wide">Contact Number</strong>
                    {order.shippingAddress?.phoneNumber || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong className="text-slate-400 uppercase text-[10px] block tracking-wide">Destination Address Path</strong>
                    {order.shippingAddress
                      ? `${order.shippingAddress.address || ""}, ${order.shippingAddress.city || ""}, ${order.shippingAddress.province || ""}, ${order.shippingAddress.postalCode || ""}`
                      : "-"}
                  </p>
                  {order.shippingAddress?.nearestLandmark && (
                    <p>
                      <strong className="text-slate-400 uppercase text-[10px] block tracking-wide">Proximity Landmark Notes</strong>
                      {order.shippingAddress.nearestLandmark}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-2 shadow-xs">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Itemizations</h2>
                <div className="divide-y divide-slate-100">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center py-3 first:pt-0 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover border bg-slate-50" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 font-semibold">{item.qty} units &times; ${item.price}</p>
                      </div>
                      <p className="text-xs font-bold text-slate-900">${(item.qty * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-xs">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Statement Valuation</h2>
              <div className="space-y-2 text-xs border-b border-slate-100 pb-3 font-semibold text-slate-500">
                <div className="flex justify-between"><span>Method Group</span><span className="text-slate-900 font-bold uppercase">{order.paymentMethod}</span></div>
                <div className="flex justify-between"><span>Items Raw Price</span><span className="text-slate-900">${order.itemsPrice?.toFixed(2) || "0.00"}</span></div>
                <div className="flex justify-between"><span>Freight Carriage</span><span className="text-slate-900">${order.shippingPrice?.toFixed(2) || "0.00"}</span></div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-dashed">
                  <span>Net Liabilities</span><span className="text-emerald-600">${order.totalPrice?.toFixed(2) || "0.00"}</span>
                </div>
              </div>

              <div className="space-y-2">
                {order.isPaid ? (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-center space-y-1">
                    <p className="text-xs font-black uppercase tracking-wider">Settled on Record Books</p>
                    <p className="text-[10px] font-semibold">{new Date(order.paidAt).toLocaleString()}</p>
                    {order.paymentResult?.referenceNotes && <p className="text-[10px] font-mono text-emerald-600 mt-1 bg-white/60 p-1.5 rounded-md break-all">{order.paymentResult.referenceNotes}</p>}
                  </div>
                ) : (
                  <form onSubmit={handlePaymentResolution} className="space-y-2.5">
                    {order.paymentMethod === "BANK" && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Insert Transaction ID / Receipt Ref *</label>
                        <input required type="text" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} placeholder="e.g., PK-JZ-9847123" className="w-full text-xs border border-slate-200 bg-slate-50/50 p-2.5 rounded-xl outline-hidden focus:border-slate-400 focus:bg-white" />
                      </div>
                    )}
                    <button type="submit" disabled={isPaying} className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs tracking-wide transition shadow-2xs active:scale-[0.98] disabled:opacity-50">
                      {order.paymentMethod === "BANK" ? "Submit Bank Receipt Trace Reference" : "Simulate Instant COD Delivery Payment"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  if (isOrdersError) {
    return (
      <section className="p-6 max-w-3xl mx-auto">
        <Message variant="warning">
          {ordersError?.data?.message || "Failed to load orders. Showing an empty order state until the backend is reachable."}
        </Message>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50/60 px-4 sm:px-6 py-10 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Control Panel</p>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{STORE_NAME} Orders</h1>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Order ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Customer</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Total</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Payment</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((orderItem, index) => {
                  const orderId = orderItem?._id;
                  return (
                    <tr key={orderId || `${orderItem?.user?.email || "guest"}-${index}`}>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{orderId || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{orderItem.user?.username || orderItem.user?.email || "Guest"}</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">${orderItem.totalPrice?.toFixed(2) || "0.00"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{orderItem.paymentMethod || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${orderItem.isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {orderItem.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {orderId ? (
                          <Link to={`/admin/orders/${orderId}`} className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-emerald-600">
                            View
                          </Link>
                        ) : (
                          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}