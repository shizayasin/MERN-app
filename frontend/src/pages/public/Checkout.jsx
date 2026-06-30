import { Navigate } from "react-router-dom";
export default function Checkout() {
  const shippingAddress = JSON.parse(
    localStorage.getItem("shippingAddress")
  );
  const paymentMethod = localStorage.getItem("paymentMethod");

  // If the user didn't fill shipping details, send them back.
  if (!shippingAddress) {
    return <Navigate to="/shipping" replace />;
  }

  // If shipping exists but payment is missing, go to payment.
  if (!paymentMethod) {
    return <Navigate to="/payment" replace />;
  }

  // If everything exists, send them to place order.
  return <Navigate to="/placeorder" replace />;
}