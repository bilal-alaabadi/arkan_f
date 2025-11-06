// src/pages/search/Search.jsx
import React, { useEffect, useState } from 'react';
import ProductCards from '../shop/ProductCards';
import { getBaseUrl } from '../../utils/baseURL';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 جلب المنتجات (كلها إذا لم يوجد نص بحث)
  const fetchResults = async (q = '') => {
    try {
      setIsLoading(true);
      const url = new URL(`${getBaseUrl()}/api/products/search`);
      if (q.trim()) url.searchParams.set('q', q.trim());
      const res = await fetch(url.toString());
      const data = await res.json();
      setFilteredProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('خطأ في جلب النتائج:', err);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ جلب كل المنتجات عند تحميل الصفحة
  useEffect(() => {
    fetchResults();
  }, []);

  // 🔁 بحث لحظي
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchResults(searchQuery);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <>
      <section className='section__container bg-[#f7f4ee]'>
        <h2 className='section__header capitalize text-center'>ابحث عن المنتجات</h2>
        <p className='section__subheader text-center'>
          يمكنك كتابة اسم المنتج أو ترك الحقل فارغًا لعرض جميع المنتجات.
        </p>
      </section>

      <section className='section__container'>
        <div className='w-full mb-8 flex flex-col md:flex-row items-center justify-center gap-4' dir="rtl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full max-w-4xl p-3 border rounded outline-none focus:ring-2 focus:ring-[#e9b86b]'
            placeholder='ابحث باسم المنتج أو الوصف...'
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-lg text-gray-600">جاري تحميل المنتجات...</div>
        ) : filteredProducts.length > 0 ? (
          <ProductCards products={filteredProducts} />
        ) : (
          <div className="text-center py-12 text-gray-600">لا توجد منتجات متاحة</div>
        )}
      </section>
    </>
  );
};

export default Search;
