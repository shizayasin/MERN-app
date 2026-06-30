import { apiSlice } from "./apiSlice";
import { USERS_URL, UPLOAD_URL } from "../../constants";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}/profile`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    // Cart endpoints
    getCart: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/cart`,
        method: "GET",
        params: userId ? { userId } : undefined,
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/cart/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/cart/remove`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/cart/update`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/cart/clear`,
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
    // Favorites endpoints
    getFavorites: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/favorites`,
        method: "GET",
        params: userId ? { userId } : undefined,
      }),
      providesTags: ["Favorites"],
    }),
    addToFavorites: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/favorites/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFromFavorites: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/favorites/remove`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Favorites"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = usersApiSlice;
