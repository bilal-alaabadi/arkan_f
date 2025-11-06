// src/components/dashboard/products/UpdateProduct/UpdateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
import UploadImage from '../addProduct/UploadImage';

const categories = [
  { label: 'أختر منتج', value: '' },
  { label: 'أعسال عمانية', value: 'أعسال عمانية' },
  { label: 'غذاء ملكات', value: 'غذاء ملكات' },
  { label: 'منتجات النحله', value: 'منتجات النحله' },
  { label: 'أعشاب علاجيه', value: 'أعشاب علاجيه' },
  { label: 'مكسرات', value: 'مكسرات' },
  { label: 'بن ( قهوة)', value: 'بن ( قهوة)' },
];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: productData, isLoading: isFetching, error: fetchError } = useFetchProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [product, setProduct] = useState({
    name: '',
    category: '',
    size: '',           // اختياري وقابل للكتابة
    price: '',
    oldPrice: '',
    description: '',
    image: [],
    stock: '',          // ✅ الكمية
  });

  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (productData) {
      setProduct({
        name: productData.name || '',
        category: productData.category || '',
        size: productData.size || '',
        price: productData.price?.toString() || '',
        oldPrice: productData.oldPrice?.toString() || '',
        description: productData.description || '',
        image: productData.image || [],
        stock: (productData.stock ?? 0).toString(),
      });
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = {
      'أسم المنتج': product.name,
      'صنف المنتج': product.category,
      'السعر': product.price,
      'الوصف': product.description,
    };

    const missing = Object.entries(requiredFields).filter(([_, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      alert(`الرجاء ملء الحقول التالية: ${missing.join('، ')}`);
      return;
    }

    const parsedStock = product.stock !== '' ? Number(product.stock) : 0;
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      alert('الكمية يجب أن تكون رقمًا صالحًا أكبر أو يساوي 0');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', product.name); // السيرفر سيضيف الحجم إلى الاسم فقط إن وُجد
      formData.append('category', product.category);
      formData.append('price', String(Number(product.price)));
      formData.append('oldPrice', product.oldPrice ? String(Number(product.oldPrice)) : '');
      formData.append('description', product.description);
      formData.append('stock', String(parsedStock));
      if (product.size && String(product.size).trim()) {
        formData.append('size', product.size);
      }
      formData.append('author', user._id);

      if (newImages.length > 0) {
        newImages.forEach((img) => formData.append('image', img));
      } else {
        formData.append('existingImages', JSON.stringify(product.image || []));
      }

      await updateProduct({ id, body: formData }).unwrap();
      alert('تم تحديث المنتج بنجاح');
      navigate('/dashboard/manage-products');
    } catch (error) {
      console.error('فشل تحديث المنتج:', error);
      alert('حدث خطأ أثناء تحديث المنتج: ' + (error?.data?.message || error.message));
    }
  };

  if (isFetching) return <div className="text-center py-8">جاري تحميل بيانات المنتج...</div>;
  if (fetchError) return <div className="text-center py-8 text-red-500">خطأ في تحميل بيانات المنتج</div>;

  return (
    <div className="container mx-auto mt-8 px-4" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-right">تحديث المنتج</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="اسم المنتج"
          name="name"
          placeholder="أكتب اسم المنتج"
          value={product.name}
          onChange={handleChange}
          required
        />

        <SelectInput
          label="صنف المنتج"
          name="category"
          value={product.category}
          onChange={handleChange}
          options={categories}
          required
        />

        <TextInput
          label="الحجم (اختياري)"
          name="size"
          placeholder="مثال: 250 جرام أو 1 كجم"
          value={product.size}
          onChange={handleChange}
        />

        <TextInput
          label="السعر الحالي"
          name="price"
          type="number"
          placeholder="50"
          value={product.price}
          onChange={handleChange}
          required
        />

        <TextInput
          label="السعر القديم (اختياري)"
          name="oldPrice"
          type="number"
          placeholder="100"
          value={product.oldPrice}
          onChange={handleChange}
        />

        <TextInput
          label="الكمية المتاحة"
          name="stock"
          type="number"
          placeholder="0"
          value={product.stock}
          onChange={handleChange}
          min="0"
        />

        <UploadImage
          name="image"
          id="image"
          initialImages={product.image}
          setImages={setNewImages}
        />

        <div className="text-right">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            وصف المنتج
          </label>
          <textarea
            name="description"
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            value={product.description}
            placeholder="أكتب وصف المنتج"
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isUpdating}
          >
            {isUpdating ? 'جاري التحديث...' : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
