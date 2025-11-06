// src/redux/features/products/productsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Product", "ProductList"],
  endpoints: (builder) => ({
    // جلب جميع المنتجات مع إمكانية التصفية والترتيب
    fetchAllProducts: builder.query({
      query: ({
        category,
        gender,
        minPrice,
        maxPrice,
        search,
        sort = "createdAt:desc",
        page = 1,
        limit = 10,
      }) => {
        const params = {
          page: String(page),
          limit: String(limit),
          sort,
        };

        if (category && category !== "الكل") params.category = category;
        if (gender) params.gender = gender;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (search) params.search = search;

        const queryParams = new URLSearchParams(params).toString();
        return `/?${queryParams}`;
      },
      transformResponse: (response) => ({
        products: Array.isArray(response?.products)
          ? response.products.map((p) => ({
              _id: p._id,
              name: p.name,
              category: p.category,
              size: p.size || "",
              description: p.description,
              price: p.price,
              oldPrice: p.oldPrice ?? null,
              image: Array.isArray(p.image) ? p.image : [p.image].filter(Boolean),
              author: p.author,
              stock: typeof p.stock === "number" ? p.stock : 0,
              rating: typeof p.rating === "number" ? p.rating : 0,
              createdAt: p.createdAt,
            }))
          : [],
        totalPages: response?.totalPages ?? 1,
        totalProducts: response?.totalProducts ?? 0,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    // جلب منتج واحد بالتفاصيل
    fetchProductById: builder.query({
      query: (id) => `/product/${id}`,
      transformResponse: (response) => {
        if (!response?.product) {
          throw new Error("المنتج غير موجود");
        }
        const { product } = response;
        return {
          _id: product._id,
          name: product.name,
          category: product.category,
          size: product.size || "",
          price: product.price,
          oldPrice: product.oldPrice ?? null,
          description: product.description,
          image: Array.isArray(product.image) ? product.image : [product.image].filter(Boolean),
          author: product.author,
          stock: typeof product.stock === "number" ? product.stock : 0,
          rating: typeof product.rating === "number" ? product.rating : 0,
          createdAt: product.createdAt,
        };
      },
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // جلب المنتجات المرتبطة (مشابهة)
    fetchRelatedProducts: builder.query({
      query: (id) => `/related/${id}`,
      transformResponse: (response) =>
        Array.isArray(response)
          ? response.map((p) => ({
              _id: p._id,
              name: p.name,
              category: p.category,
              size: p.size || "",
              description: p.description,
              price: p.price,
              oldPrice: p.oldPrice ?? null,
              image: Array.isArray(p.image) ? p.image : [p.image].filter(Boolean),
              author: p.author,
              stock: typeof p.stock === "number" ? p.stock : 0,
              rating: typeof p.rating === "number" ? p.rating : 0,
              createdAt: p.createdAt,
            }))
          : [],
      providesTags: (result, error, id) => [{ type: "Product", id }, "ProductList"],
    }),

    // إضافة منتج جديد (JSON)
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct, // يُفضّل تحويل الأرقام (price/oldPrice/stock) قبل الإرسال من الشاشة
      }),
      invalidatesTags: ["ProductList"],
    }),

    // تحديث المنتج (يدعم FormData للصور)
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-product/${id}`,
        method: "PATCH",
        body, // يمكن أن يكون FormData أو JSON حسب المسار
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }, "ProductList"],
    }),

    // حذف المنتج
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }, "ProductList"],
    }),

    // البحث عن المنتجات
    searchProducts: builder.query({
      query: (searchTerm) => `/search?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response) =>
        Array.isArray(response)
          ? response.map((p) => ({
              _id: p._id,
              name: p.name,
              category: p.category,
              size: p.size || "",
              description: p.description,
              // في بعض المشاريع قد يوجد regularPrice، نحافظ على المنطق السابق إن وجد
              price: p.category === "حناء بودر" ? p.price : (p.regularPrice ?? p.price),
              oldPrice: p.oldPrice ?? null,
              images: Array.isArray(p.image) ? p.image : [p.image].filter(Boolean),
              stock: typeof p.stock === "number" ? p.stock : 0,
              rating: typeof p.rating === "number" ? p.rating : 0,
              createdAt: p.createdAt,
            }))
          : [],
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Product", id: _id })), "ProductList"]
          : ["ProductList"],
    }),

    // المنتجات الأكثر مبيعًا
    fetchBestSellingProducts: builder.query({
      query: (limit = 4) => `/best-selling?limit=${limit}`,
      transformResponse: (response) =>
        Array.isArray(response)
          ? response.map((p) => ({
              _id: p._id,
              name: p.name,
              category: p.category,
              size: p.size || "",
              description: p.description,
              price: p.price,
              oldPrice: p.oldPrice ?? null,
              image: Array.isArray(p.image) ? p.image : [p.image].filter(Boolean),
              stock: typeof p.stock === "number" ? p.stock : 0,
              rating: typeof p.rating === "number" ? p.rating : 0,
              createdAt: p.createdAt,
            }))
          : [],
      providesTags: ["ProductList"],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useLazyFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useLazyFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useFetchBestSellingProductsQuery,
} = productsApi;

export default productsApi;
