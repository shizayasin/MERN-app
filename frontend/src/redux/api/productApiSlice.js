import { PRODUCTS_URL } from "../../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // Fetch all products with filter/pagination parameters
    getProducts: builder.query({
      query: ({ keyword, category, pageNumber, sort, pageSize }) => ({
        url: `${PRODUCTS_URL}`,
        params: { keyword, category, pageNumber, sort, pageSize },
      }),
      refetchOnMountOrArgChange: true,
      providesTags: (result) =>
        result && result.products
          ? [
              ...result.products.map(({ _id }) => ({ type: "Product", id: _id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Fetch a single product by its unique ID
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      providesTags: (result, error, productId) => [{ type: "Product", id: productId }],
    }),

    // Delete a single product
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Create a brand new product catalog profile
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCTS_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Update an existing product profile (Ensures ProductUpdate.jsx won't crash)
    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" }
      ],
    }),

    // Upload an image asset for a product record
    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),

    createProductReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),

    deleteProductReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }, { type: "Product", id: "LIST" }],
    }),
  }),
});

export const { 
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useCreateProductReviewMutation,
  useDeleteProductReviewMutation,
} = productApiSlice;