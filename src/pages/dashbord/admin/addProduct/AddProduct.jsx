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
    { label: 'عسل زهرة', value: 'عسل زهرة' },
    { label: 'خبز النحل', value: 'خبز النحل' },
    { label: 'حبوب لقاح', value: 'حبوب لقاح' },
    { label: 'غذاء ملكات بلغاري', value: 'غذاء ملكات بلغاري' },
    { label: 'غذاء ملكات استرالي', value: 'غذاء ملكات استرالي' },
    { label: 'غذاء ملكات صيني', value: 'غذاء ملكات صيني' }
];

const sizes = [
    { label: 'اختر الحجم', value: '' },
    { label: '1 كيلو', value: '1 كيلو' },
    { label: '500 جرام', value: '500 جرام' }
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        size: '',
        price: '',
        description: ''
    });
    
    const [showSizeField, setShowSizeField] = useState(false);
    const [image, setImage] = useState([]);

    const [AddProduct, { isLoading, error }] = useAddProductMutation();
    const navigate = useNavigate();

    useEffect(() => {
        // إظهار حقل الحجم فقط عند اختيار أحد أنواع العسل
        const honeyTypes = ['عسل سمر', 'عسل السدر', 'عسل زهرة'];
        setShowSizeField(honeyTypes.includes(product.category));
        
        // إعادة تعيين الحجم عند تغيير الفئة
        if (!showSizeField) {
            setProduct(prev => ({ ...prev, size: '' }));
        }
    }, [product.category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // التحقق من الحقول المطلوبة
        const requiredFields = {
            'أسم المنتج': product.name,
            'صنف المنتج': product.category,
            'السعر': product.price,
            'الوصف': product.description,
            'الصور': image.length > 0
        };
        
        // إذا كانت الفئة من أنواع العسل، نتحقق من وجود الحجم
        const honeyTypes = ['عسل سمر', 'عسل السدر', 'عسل زهرة'];
        if (honeyTypes.includes(product.category) && !product.size) {
            alert('الرجاء اختيار الحجم للمنتج');
            return;
        }

        // التحقق من جميع الحقول المطلوبة
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([field]) => field);

        if (missingFields.length > 0) {
            alert(`الرجاء ملء الحقول التالية: ${missingFields.join('، ')}`);
            return;
        }

        try {
            await AddProduct({ 
                ...product, 
                image, 
                author: user?._id 
            }).unwrap();
            
            alert('تمت أضافة المنتج بنجاح');
            setProduct({
                name: '',
                category: '',
                size: '',
                price: '',
                description: ''
            });
            setImage([]);
            navigate("/shop");
        } catch (error) {
            console.log("Failed to submit product", error);
            alert('حدث خطأ أثناء إضافة المنتج');
        }
    };

    return (
        <div className="container mx-auto mt-8">
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
                
                {showSizeField && (
                    <SelectInput
                        label="حجم المنتج"
                        name="size"
                        value={product.size}
                        onChange={handleChange}
                        options={sizes}
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
                
                <UploadImage
                    name="image"
                    id="image"
                    setImage={setImage}
                />
                
                <div>
                    <label htmlFor="description" className='block text-sm font-medium text-gray-700'>
                        وصف المنتج
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        className='add-product-InputCSS'
                        value={product.description}
                        placeholder='اكتب وصف المنتج'
                        onChange={handleChange}
                        rows={4}
                    ></textarea>
                </div>
                
                <div>
                    <button 
                        type='submit' 
                        className='add-product-btn' 
                        disabled={isLoading}
                    >
                        {isLoading ? "جاري الإضافة..." : "أضف منتج"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;