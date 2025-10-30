import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import imge from '../../../assets/01.png';

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useFetchProductByIdQuery(id);
  const { country } = useSelector((state) => state.cart);

  const singleProduct = data;
  const productReviews = data?.reviews || [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [qty, setQty] = useState(1);

  const currency = country === 'الإمارات' ? 'د.إ' : 'ر.ع.';
  const exchangeRate = country === 'الإمارات' ? 9.5 : 1;

  useEffect(() => {
    setImageScale(1.05);
    const timer = setTimeout(() => setImageScale(1), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (product) => {
    setIsAddingToCart(true);

    const productToAdd = {
      ...product,
      price: product.regularPrice ?? product.price ?? 0,
      quantity: Number(qty) > 0 ? Number(qty) : 1,
    };

    dispatch(addToCart(productToAdd));

    // ✅ تصفير الكمية وإزالة التركيز عن الزر بعد الإضافة
    setQty(1);
    if (document && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setTimeout(() => {
      setIsAddingToCart(false);
    }, 800);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === singleProduct.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? singleProduct.image.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) return <p>جاري التحميل...</p>;
  if (error) return <p>حدث خطأ أثناء تحميل تفاصيل المنتج.</p>;
  if (!singleProduct) return null;

  // الأسعار (للعرض فقط)
  const basePrice = singleProduct.regularPrice ?? singleProduct.price ?? 0;
  const price = basePrice * exchangeRate;
  const oldPrice = singleProduct.oldPrice != null ? singleProduct.oldPrice * exchangeRate : null;

  const hasDiscount = !!(oldPrice && oldPrice > price);
  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <>
      {/* Hero */}
      <section className="relative w-full">
        <div className="relative h-64 md:h-80">
          <img
            src={imge}
            alt="صفحة المتجر"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">صفحة المتجر</h2>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="hover:text-[#e9b86b] transition-colors">
                <Link to="/">الرئيسية</Link>
              </span>
              <i className="ri-arrow-right-s-line"></i>
              <span className="hover:text-[#e9b86b] transition-colors">
                <Link to="/shop">المتجر</Link>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Product */}
      <section className="section__container mt-8" dir="rtl">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* صور المنتج */}
          <div className="w-full md:w-1/2 relative flex justify-center">
            {hasDiscount && discountPercentage > 0 && (
              <div className="absolute top-3 left-3 bg-[#e9b86b] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                خصم {discountPercentage}%
              </div>
            )}

            {singleProduct.image && singleProduct.image.length > 0 ? (
              <>
                <div className="overflow-hidden rounded-md w-full max-w-[520px] mx-auto bg-gray-50 shadow">
                  {/* ارتفاع ثابت للصورة */}
                  <div className="w-full h-[400px] md:h-[500px]">
                    <img
                      src={singleProduct.image[currentImageIndex]}
                      alt={singleProduct.name}
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{ transform: `scale(${imageScale})` }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/600';
                        e.currentTarget.alt = 'Image not found';
                      }}
                    />
                  </div>
                </div>

                {singleProduct.image.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </>
                )}
              </>
            ) : (
              <p className="text-red-600">لا توجد صور متاحة لهذا المنتج.</p>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-right">
            <h3 className="text-2xl font-semibold mb-4">{singleProduct.name}</h3>

            <div className="text-xl text-[#3D4B2E] mb-4 space-x-1">
              {price.toFixed(2)} {currency}
              {hasDiscount && (
                <s className="text-gray-500 text-sm ml-2">
                  {oldPrice.toFixed(2)} {currency}
                </s>
              )}
            </div>

            {/* 🔢 التحكم بالكمية مع لون bg-[#e9b86b] */}
            <div className="mb-5 flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">الكمية:</span>
              <div className="inline-flex items-center border-2 border-[#e9b86b] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-white bg-[#e9b86b] hover:bg-[#d1a45d] transition"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-16 text-center outline-none py-2 text-gray-800 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2 text-white bg-[#e9b86b] hover:bg-[#d1a45d] transition"
                >
                  +
                </button>
              </div>
            </div>

            <p className="text-gray-500 mb-4 text-lg font-medium leading-relaxed">
              <span className="text-gray-800 font-bold block">الفئة:</span>
              <span className="text-gray-600">{singleProduct.category}</span>
            </p>

            <p className="text-gray-500 mb-4 text-lg font-medium leading-relaxed">
              <span className="text-gray-800 font-bold block">الوصف:</span>
              <span className="text-gray-600">{singleProduct.description}</span>
            </p>

            {/* زر الإضافة للسلة */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(singleProduct);
              }}
              className={`mt-2 px-6 py-3 bg-[#e9b86b] text-white rounded-md transition-all duration-200 relative overflow-hidden ${
                isAddingToCart ? 'bg-green-600' : ''
              }`}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <span className="animate-bounce">تمت الإضافة!</span>
              ) : (
                'إضافة إلى السلة'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* المراجعات */}
      <section className="section__container mt-8" dir="rtl">
        <ReviewsCard productReviews={productReviews} />
      </section>
    </>
  );
};

export default SingleProduct;
