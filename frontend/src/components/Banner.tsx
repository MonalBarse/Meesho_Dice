import React from 'react';

const Banner = () => {
  return (
    <section className="bg-gradient-to-r from-pink-500 to-pink-600 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Lowest Prices
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Best Quality Shopping
            </h2>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <img
              src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg"
              alt="Shopping"
              className="w-64 h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;