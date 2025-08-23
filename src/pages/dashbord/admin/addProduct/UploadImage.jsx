import React, { useState } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../../../utils/baseURL';

const UploadImage = ({ name, setImage }) => {
    const [loading, setLoading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState([]);

    // دالة لتحويل الملف إلى base64
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    // دالة لتحميل الصور
    const uploadImages = async (event) => {
        const files = event.target.files;
        if (files.length === 0) return;

        setLoading(true);

        try {
            // تحويل الملفات إلى base64
            const base64Images = await Promise.all(
                Array.from(files).map((file) => convertBase64(file))
            );

            // إرسال الصور إلى الخادم
            const response = await axios.post(`${getBaseUrl()}/uploadImages`, { images: base64Images });
            const uploadedUrls = response.data;

            setUploadedUrls(uploadedUrls); // حفظ روابط الصور
            setImage(uploadedUrls); // إرسال الروابط إلى الدالة الأب
            alert("تم تحميل الصور بنجاح!");
        } catch (error) {
            console.error("Error uploading images:", error);
            alert("حدث خطأ أثناء تحميل الصور!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <label htmlFor={name}>تحميل الصور</label>
            <input
                type="file"
                name={name}
                id={name}
                onChange={uploadImages}
                className="add-product-InputCSS"
                multiple // السماح باختيار عدة ملفات
            />
            {loading && (
                <div className="mt-2 text-sm text-blue-600">جاري تحميل الصور...</div>
            )}
            {uploadedUrls.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-green-600">تم تحميل الصور بنجاح:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {uploadedUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`uploaded-image-${index}`}
                                className="w-20 h-20 object-cover rounded"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/100"; // صورة بديلة في حالة الخطأ
                                    e.target.alt = "Image not found";
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadImage; 