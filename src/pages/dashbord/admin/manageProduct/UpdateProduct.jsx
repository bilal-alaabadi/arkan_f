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

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: productData, isLoading: isFetching, error: fetchError } = useFetchProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [product, setProduct] = useState({
    name: '',
    category: '',
    size: '',
    price: '',
    oldPrice: '',
    description: '',
    image: [],
  });

  const [showHoneySize, setShowHoneySize] = useState(false);
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
      });

      const cat = productData.category;
      if (honeyCategories.includes(cat)) {
        setShowHoneySize(true);
      } else {
        setShowHoneySize(false);
        const fixed = fixedSizesByCategory[cat] || '';
        setProduct((p) => ({ ...p, size: fixed }));
      }
    }
  }, [productData]);

  useEffect(() => {
    const cat = product.category;
    if (honeyCategories.includes(cat)) {
      setShowHoneySize(true);
      // لا نعبّي الحجم تلقائي، يختاره من القائمة
    } else {
      setShowHoneySize(false);
      const fixed = fixedSizesByCategory[cat] || '';
      setProduct((p) => ({ ...p, size: fixed }));
    }
  }, [product.category]);

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
      'الحجم': product.size,
    };

    const missing = Object.entries(requiredFields).filter(([_, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      alert(`الرجاء ملء الحقول التالية: ${missing.join('، ')}`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', product.name); // السيرفر يضمن "name - size"
      formData.append('category', product.category);
      formData.append('price', String(Number(product.price)));
      formData.append('oldPrice', product.oldPrice ? String(Number(product.oldPrice)) : '');
      formData.append('description', product.description);
      formData.append('size', product.size);
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

        {showHoneySize && (
          <SelectInput
            label="الحجم"
            name="size"
            value={product.size}
            onChange={handleChange}
            options={honeySizes}
            required
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
