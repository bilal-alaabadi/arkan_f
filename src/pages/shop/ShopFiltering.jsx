// components/shop/ShopFiltering.jsx
import React from 'react';

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
  return (
    <div className='space-y-5 bg-white p-4 rounded-lg shadow'>
      <h3 className='text-xl font-bold text-gray-800 mb-2'>الفلاتر</h3>

      {/* الفئات */}
      <div className='flex flex-col space-y-2'>
        <h4 className='font-medium text-lg text-gray-700'>الفئة</h4>
        <hr />
        {filters.categories.map((category) => (
          <label key={category} className='cursor-pointer text-gray-700'>
            <input
              type="radio"
              name="category"
              value={category}
              checked={filtersState.category === category}
              onChange={(e) =>
                setFiltersState({
                  ...filtersState,
                  category: e.target.value,
                  size: '',
                })
              }
              className='ml-2 accent-[#e9b86b]'
            />
            {category}
          </label>
        ))}
      </div>

      {/* زر مسح الفلاتر */}
      <button
        onClick={clearFilters}
        className='bg-[#e9b86b] hover:bg-[#d1a45d] py-2 px-4 text-white rounded mt-4 w-full transition-colors'
      >
        مسح كل الفلاتر
      </button>
    </div>
  );
};

export default ShopFiltering;
