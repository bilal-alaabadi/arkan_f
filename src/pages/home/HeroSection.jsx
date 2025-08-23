import React from 'react'

import card1 from "../../assets/Screenshot 2025-02-22 013457.png"
import card3 from "../../assets/Screenshot 2025-02-22 013644.png"
import card2 from "../../assets/Screenshot 2025-02-22 172838.png"

const cards = [
    {
        id: 1,
        image: card1,
        trend: '',
        title: ''
    },
    {
        id: 2,
        image: card2,
        trend: '',
        title: ''
    },
    {
        id: 3,
        image: card3,
        trend: '',
        title: ''
    },
]

const HeroSection = () => {
  return (
    <section className='section__container hero__container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {
            cards.map((card) => (
                <div key={card.id} className='hero__card relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
                    <img 
                        src={card.image} 
                        alt={card.title} 
                        className='w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300'
                    />
                    <div className=' absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-6'>
                        <p className='text-sm font-semibold text-gray-300'>{card.trend}</p>
                        <h4 className='text-2xl font-bold mt-2'>{card.title}</h4>
                        {/* <a 
                            href="#" 
                            className='mt-4 inline-block text-sm text-white hover:text-gray-300 transition-colors duration-300'
                        >
                            اكتشف المزيد
                        </a> */}
                    </div>
                </div>
            ))
        }
    </section>
  )
}

export default HeroSection