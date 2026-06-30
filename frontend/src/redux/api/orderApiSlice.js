import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: ORDERS_URL,
        method: "POST",
        body: data,
      }),
    }),
    getMyOrders: builder.query({
      query: () => `${ORDERS_URL}/myorders`,
    }),
    getOrders: builder.query({
      query: () => ORDERS_URL,
      providesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (id) => `${ORDERS_URL}/${id}`,
      providesTags: ["Order"],
    }),
    payOrder: builder.mutation({
      query: ({ id, paymentResult }) => ({
        url: `${ORDERS_URL}/${id}/pay`,
        method: "PUT",
        body: paymentResult,
      }),
      invalidatesTags: ["Order"],
    }),
    getPaypalClientId: builder.query({
      query: () => "/config/paypal",
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
} = orderApiSlice;