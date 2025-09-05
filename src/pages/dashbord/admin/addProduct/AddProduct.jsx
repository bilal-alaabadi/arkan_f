// src/components/dashboard/products/AddProduct/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'أختر منتج', value: '' },
  { label: 'عسل سمر', value: 'عسل سمر' },
  { label: 'عسل السدر', value: 'عسل السدر' },
  { label: 'عسل زهرة الربيع', value: 'عسل زهرة الربيع' },
  { label: 'خبز النحل', value: 'خبز النحل' },
  { label: 'حبوب لقاح', value: 'حبوب لقاح' },
  { label: 'غذاء ملكات بلغاري', value: 'غذاء ملكات بلغاري' },
  { label: 'غذاء ملكات استرالي', value: 'غذاء ملكات استرالي' },
  { label: 'غذاء ملكات صيني', value: 'غذاء ملكات صيني' },
];

const honeyCategories = ['عسل سمر', 'عسل السدر', 'عسل زهرة الربيع'];

const fixedSizesByCategory = {
  'خبز النحل': '100 جرام',
  'حبوب لقاح': '100 جرام',
  'غذاء ملكات بلغاري': '50 جرام',
  'غذاء ملكات استرالي': '50 جرام',
  'غذاء ملكات صيني': '50 جرام',
};

const honeySizes = [
  { label: 'اختر الحجم', value: '' },
  { label: '1 كجم', value: '1 كجم' },
  { label: '0.5 كجم', value: '0.5 كجم' },
];

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    category: '',
    size: '',
    price: '',
    oldPrice: '',
    description: '',
  });

  const [image, setImage] = useState([]);
  const [showHoneySize, setShowHoneySize] = useState(false);

  useEffect(() => {
    const cat = product.category;

    if (honeyCategories.includes(cat)) {
      setShowHoneySize(true);
      setProduct((p) => ({ ...p, size: '' })); // يخليه يختار من القائمة
    } else if (fixedSizesByCategory[cat]) {
      setShowHoneySize(false);
      setProduct((p) => ({ ...p, size: fixedSizesByCategory[cat] }));
    } else {
      setShowHoneySize(false);
      setProduct((p) => ({ ...p, size: '' }));
    }
  }, [product.category]);

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
      'الحجم': product.size,
    };

    const missing = Object.entries(required).filter(([_, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      alert(`الرجاء ملء الحقول التالية: ${missing.join('، ')}`);
      return;
    }

    try {
      await addProduct({
        name: product.name,           // السيرفر يضيف الحجم للاسم
        category: product.category,
        size: product.size,
        price: Number(product.price),
        oldPrice: product.oldPrice !== '' ? Number(product.oldPrice) : undefined,
        description: product.description,
        image,
        author: user?._id,
      }).unwrap();

      alert('تمت إضافة المنتج بنجاح');
      setProduct({ name: '', category: '', size: '', price: '', oldPrice: '', description: '' });
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

        {showHoneySize && (
          <SelectInput
            label="الحجم"
            name="size"
            value={product.size}
            onChange={handleChange}
            options={honeySizes}
          />
        )}

        {!showHoneySize && fixedSizesByCategory[product.category] && (
          <TextInput
            label="الحجم"
            name="size"
            value={product.size}
            onChange={() => {}}
            readOnly
          />
        )}

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
