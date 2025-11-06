// pages/shop/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import imge from "../../assets/01.png";

const categories = [
  { label: 'الكل', value: 'الكل' },
  { label: 'أعسال عمانية', value: 'أعسال عمانية' },
  { label: 'غذاء ملكات', value: 'غذاء ملكات' },
  { label: 'منتجات النحله', value: 'منتجات النحله' },
  { label: 'أعشاب علاجيه', value: 'أعشاب علاجيه' },
  { label: 'مكسرات', value: 'مكسرات' },
  { label: 'بن ( قهوة)', value: 'بن ( قهوة)' },
];

const filters = {
  categories: categories.map(c => c.value),
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

  const queryArgs = {
    category: category !== 'الكل' ? category : undefined,
    size: category === 'حناء بودر' ? size : undefined,
    page: currentPage,
    limit: ProductsPerPage,
  };

  const { data, error, isLoading } = useFetchAllProductsQuery(queryArgs);
  const products = Array.isArray(data?.products) ? data.products : [];
  const totalPages = data?.totalPages || 1;
  const totalProducts = data?.totalProducts || products.length;

  const clearFilters = () => setFiltersState({ category: 'الكل', size: '' });
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  if (isLoading) return <div className="text-center py-8">جاري تحميل المنتجات...</div>;
  if (error) return <div className="text-center py-8 text-red-500">حدث خطأ أثناء تحميل المنتجات.</div>;

  const startProduct = (currentPage - 1) * ProductsPerPage + 1;
  const endProduct = Math.min(startProduct + ProductsPerPage - 1, totalProducts);
  const pageCount = Math.max(1, totalPages);
  const pageList = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img src={imge} alt="متجر العسل" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
            متجرنا
          </h2>
        </div>
      </section>

      {/* Products Section */}
      <section className='section__container py-8'>
        <div className='flex flex-col md:flex-row md:gap-8 gap-6'>
          
          {/* ✅ زر إظهار/إخفاء الفلاتر في الجوال */}
          <div className="flex justify-center md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-2 bg-[#e9b86b] text-white font-medium rounded-md shadow hover:bg-[#d1a45d] transition"
            >
              {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
            </button>
          </div>

          {/* ✅ الفلاتر (تظهر دائمًا في الكمبيوتر وتبدّل في الجوال) */}
          {(showFilters || window.innerWidth >= 768) && (
            <aside className='md:w-1/4'>
              <ShopFiltering
                filters={filters}
                filtersState={filtersState}
                setFiltersState={setFiltersState}
                clearFilters={clearFilters}
              />
            </aside>
          )}

          {/* المنتجات */}
          <div className='w-full'>
            {products.length > 0 ? (
              <>
                <ProductCards products={products} />

                {pageCount > 1 && (
                  <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <div className="text-sm text-gray-600">
                      الصفحة {currentPage} من {pageCount}
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#e9b86b] text-white hover:bg-[#d1a45d]'}`}
                      >
                        السابق
                      </button>

                      <div className="flex gap-1">
                        {pageList.map((num) => (
                          <button
                            key={num}
                            onClick={() => handlePageChange(num)}
                            className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === num ? 'bg-[#e9b86b] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pageCount}
                        className={`px-4 py-2 rounded-md ${currentPage === pageCount ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#e9b86b] text-white hover:bg-[#d1a45d]'}`}
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
                  className="mt-4 px-4 py-2 bg-[#e9b86b] text-white rounded-md hover:bg-[#d1a45d]"
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
