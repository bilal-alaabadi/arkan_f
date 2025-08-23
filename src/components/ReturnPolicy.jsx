


// ===== ReturnPolicy.jsx =====
import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir='rtl'>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        {/* العنوان الرئيسي */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#9B2D1F] mb-8">
          سياسة الاستبدال والاسترجاع
        </h1>
        
        {/* مقدمة الصفحة */}
        <div className="mb-10 text-right">
          <p className="text-2xl text-gray-800 mb-6 leading-relaxed">
            في <span className="font-bold text-[#d3ae27]">أركان الجودة العالمية</span>، نضع رضا عملائنا في مقدمة أولوياتنا.
          </p>
        </div>

        {/* البنود الأساسية */}
        <div className="space-y-8 text-right">
          <div className="border-b border-[#d3ae27] pb-6">
            <h3 className="text-2xl font-bold text-[#9B2D1F] mb-4">شروط الاسترجاع</h3>
            <p className="text-xl text-gray-700 leading-relaxed">
              يحق للزبون استرجاع أو استبدال المنتج في حال:
            </p>
            <ul className="text-xl text-gray-700 mt-4 space-y-3 list-disc pr-6">
              <li>وجود خلل أو تلف في المنتج عند الاستلام</li>
              <li>استلام منتج مختلف عن الطلب</li>
            </ul>
          </div>

          {/* شروط إضافية */}
          <div className="pt-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">ملاحظات هامة:</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              • يجب أن يكون المنتج في عبوته الأصلية ولم يتم استخدامه
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mt-2">
              • يرجى التواصل مع خدمة العملاء خلال 3 أيام من الاستلام
            </p>
          </div>
        </div>

        {/* خاتمة الصفحة */}
        <div className="mt-12 text-center">
          <p className="text-xl text-[#9B2D1F] font-medium">
            أركان الجودة العالمية — ثقة تبنى على جودة
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
