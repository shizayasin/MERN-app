import { apiSlice } from "./apiSlice"; 
import { CATEGORIES_URL } from "../../constants"; 

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // GET ALL CATEGORIES
    getCategories: builder.query({
      query: () => CATEGORIES_URL,
      refetchOnMountOrArgChange: true,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Category", id: _id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    // CREATE A NEW CATEGORY
    createCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORIES_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // UPDATE CATEGORY BY ID
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    // DELETE CATEGORY BY ID
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

  }),
}); 

export const { 
  useGetCategoriesQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation, 
} = categoryApiSlice;