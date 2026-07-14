import { Navigate } from "react-router-dom";
export default function Checkout() {
  const shippingAddress = JSON.parse(
    localStorage.getItem("shippingAddress") || "null"
  );
  const paymentMethod = localStorage.getItem("paymentMethod");

  if (!shippingAddress) {
    return <Navigate to="/shipping" replace />;
  }

  if (!paymentMethod) {
    return <Navigate to="/payment" replace />;
  }

  return <Navigate to="/review-order" replace />;
}