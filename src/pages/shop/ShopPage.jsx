// pages/shop/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import imge from "../../assets/01.png";

const filters = {
  categories: ['الكل'],
};

const ShopPage = () => {
  const [filtersState, setFiltersState] = useState({
    category: 'الكل',
    size: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [ProductsPerPage] = useState(8);
  const [showFilters, setShowFilters] = useState(false);

  const { category, size } = filtersState;

  useEffect(() => {
    setCurrentPage(1);
  }, [filtersState]);

  // 🔒 لا نعمل تفكيك متداخل من hook مباشرة لتفادي أخطاء undefined
  const queryArgs = {
    category: category !== 'الكل' ? category : undefined,
    size: category === 'حناء بودر' ? size : undefined,
    page: currentPage,
    limit: ProductsPerPage,
  };

  const queryResult = useFetchAllProductsQuery(queryArgs);
  const { data, error, isLoading } = queryResult || {};

  // قيم آمنة مهما رجع الـ API
  const products = Array.isArray(data?.products) ? data.products : [];
  const totalPages = Number.isFinite(Number(data?.totalPages)) && Number(data?.totalPages) > 0
    ? Number(data.totalPages)
    : 1;
  const totalProducts = Number.isFinite(Number(data?.totalProducts)) && Number(data?.totalProducts) >= 0
    ? Number(data.totalProducts)
    : products.length;

  const clearFilters = () => {
    setFiltersState({ category: 'الكل', size: '' });
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (isLoading) return <div className="text-center py-8">جاري تحميل المنتجات...</div>;
  if (error) {
    // 🔎 لو عندك Console، هذا يساعد في التشخيص
    // console.error('Shop fetch error:', error);
    return <div className="text-center py-8 text-red-500">حدث خطأ أثناء تحميل المنتجات.</div>;
  }

  const startProduct = (currentPage - 1) * ProductsPerPage + 1;
  const endProduct = Math.min(startProduct + ProductsPerPage - 1, totalProducts);

  // 🔢 توليد صفحات آمن
  const pageCount = Math.max(1, totalPages);
  const pageList = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <>
      {/* Hero Section with Banner Image */}
      <section className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img 
          src={imge} 
          alt="متجر الحناء" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
            متجرنا
          </h2>
        </div>
      </section>

      {/* Products Section */}
      <section className='section__container py-8'>
        <div className='flex flex-col md:flex-row md:gap-8 gap-6'>
          {/* ممكن تُرجع فلتر لاحقًا */}
          {/* <aside className='md:w-1/4'>
            <ShopFiltering ... />
          </aside> */}

          {/* Products List */}
          <div className='w-full'>
            {/* إن حبيت تفعيل سطر عرض العدد، فعل هذا */}
            {/* <div className='flex justify-between items-center mb-6'>
              <h3 className='text-lg font-medium text-gray-700'>
                عرض {startProduct}-{endProduct} من {totalProducts} منتج
              </h3>
            </div> */}

            {products.length > 0 ? (
              <>
                <ProductCards products={products} />

                {/* Pagination */}
                {pageCount > 1 && (
                  <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <div className="text-sm text-gray-600">
                      الصفحة {currentPage} من {pageCount}
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#9B2D1F] text-white hover:bg-[#7a241a]'}`}
                      >
                        السابق
                      </button>

                      <div className="flex gap-1">
                        {pageList.map((num) => (
                          <button
                            key={num}
                            onClick={() => handlePageChange(num)}
                            className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === num ? 'bg-[#9B2D1F] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pageCount}
                        className={`px-4 py-2 rounded-md ${currentPage === pageCount ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#9B2D1F] text-white hover:bg-[#7a241a]'}`}
                      >
                        التالي
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-lg text-gray-600">لا توجد منتجات متاحة حسب الفلتر المحدد</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-[#9B2D1F] text-white rounded-md hover:bg-[#7a241a]"
                >
                  عرض جميع المنتجات
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopPage;
