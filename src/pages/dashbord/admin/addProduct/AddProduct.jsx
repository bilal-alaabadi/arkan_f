// src/components/dashboard/products/AddProduct/AddProduct.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'أختر منتج', value: '' },
  { label: 'أعسال عمانية', value: 'أعسال عمانية' },
  { label: 'غذاء ملكات', value: 'غذاء ملكات' },
  { label: 'منتجات النحله', value: 'منتجات النحله' },
  { label: 'أعشاب علاجيه', value: 'أعشاب علاجيه' },
  { label: 'مكسرات', value: 'مكسرات' },
  { label: 'بن ( قهوة)', value: 'بن ( قهوة)' },
];


const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    category: '',
    size: '',          // اختياري وقابل للكتابة
    price: '',
    oldPrice: '',
    description: '',
    stock: '',         // ✅ إدخال الكمية
  });

  const [image, setImage] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = {
      'أسم المنتج': product.name,
      'صنف المنتج': product.category,
      'السعر': product.price,
      'الوصف': product.description,
      'الصور': image.length > 0,
    };

    const missing = Object.entries(required).filter(([_, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      alert(`الرجاء ملء الحقول التالية: ${missing.join('، ')}`);
      return;
    }

    // التحقق من الكمية (يمكن تركها فارغة => 0)
    const parsedStock = product.stock !== '' ? Number(product.stock) : 0;
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      alert('الكمية يجب أن تكون رقمًا صحيحًا أكبر أو يساوي 0');
      return;
    }

    try {
      await addProduct({
        name: product.name,
        category: product.category,
        size: product.size || undefined, // غير إجباري
        price: Number(product.price),
        oldPrice: product.oldPrice !== '' ? Number(product.oldPrice) : undefined,
        description: product.description,
        image,
        author: user?._id,
        stock: parsedStock, // ✅ إرسال الكمية
      }).unwrap();

      alert('تمت إضافة المنتج بنجاح');
      setProduct({ name: '', category: '', size: '', price: '', oldPrice: '', description: '', stock: '' });
      setImage([]);
      navigate('/shop');
    } catch (err) {
      console.error('Failed to submit product', err);
      alert('حدث خطأ أثناء إضافة المنتج');
    }
  };

  return (
    <div className="container mx-auto mt-8" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">أضافة منتج جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="أسم المنتج"
          name="name"
          placeholder="أكتب أسم المنتج"
          value={product.name}
          onChange={handleChange}
        />

        <SelectInput
          label="صنف المنتج"
          name="category"
          value={product.category}
          onChange={handleChange}
          options={categories}
        />

        <TextInput
          label="الحجم (اختياري)"
          name="size"
          placeholder="مثال: 250 جرام أو 1 كجم"
          value={product.size}
          onChange={handleChange}
        />

        <TextInput
          label="السعر"
          name="price"
          type="number"
          placeholder="50"
          value={product.price}
          onChange={handleChange}
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
        />

        <UploadImage name="image" id="image" setImage={setImage} />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            وصف المنتج
          </label>
          <textarea
            name="description"
            id="description"
            className="add-product-InputCSS"
            value={product.description}
            placeholder="اكتب وصف المنتج"
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <button type="submit" className="add-product-btn" disabled={isLoading}>
            {isLoading ? 'جاري الإضافة...' : 'أضف منتج'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
