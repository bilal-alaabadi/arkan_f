import React from 'react';
import companyImg from '../assets/WhatsApp Image 2025-08-20 at 11.40.15 PM (1).jpeg'; // ضع صورة مناسبة للشركة هنا

const About = () => {
  return (
    <div dir="rtl" className="bg-white text-[#4E5A3F]">
      <section className="max-w-6xl mx-auto py-16 px-4 md:px-8">
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          {/* صورة الشركة */}
          <div className="md:w-1/2">
            <img
              src={companyImg}
              alt="أركان الجودة العالمية"
              className="w-full max-w-md mx-auto rounded-xl shadow-lg transform scale-105"
            />
          </div>

          {/* النص */}
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-[#d3ae27] mb-6">
              أركان الجودة العالمية
            </h2>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-xl italic text-[#9B2D1F] font-semibold">
                "نمنحك من الطبيعة صفاءها.. ومن الجودة أركانها"
              </p>

              <p>
                تأسست <span className="font-bold">أركان الجودة العالمية</span> على
                مبدأ أن الصحة الحقيقية تبدأ من الطبيعة. نحن شركة متخصصة في تقديم
                منتجات طبيعية عالية الجودة، نسعى من خلالها لخلق توازن بين الصحة،
                الطعم الأصيل، والجودة التي تدوم.
              </p>

              <p>
                رؤيتنا أن نكون الخيار الأول لكل من يبحث عن منتجات طبيعية موثوقة،
                وأن نعيد تعريف مفهوم الجودة من خلال تقديم منتجات تلبي تطلعات عملائنا
                وتفوق توقعاتهم.
              </p>

              <p>
                رسالتنا تتمثل في المساهمة في تحسين أنماط الحياة من خلال منتجات
                طبيعية نقية، نختارها بعناية فائقة لتجمع بين الفائدة الصحية والمذاق
                الفريد.
              </p>

              <p className="font-semibold text-[#4E5A3F]">
                قيمنا: الجودة، المصداقية، الأصالة، والالتزام بتقديم الأفضل دائمًا.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-2xl text-[#d3ae27] font-semibold">
            أركان الجودة العالمية.. حيث تلتقي الطبيعة مع الثقة
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
