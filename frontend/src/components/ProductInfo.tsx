import React, { useState } from 'react'; // Import useState
import { Heart, Share2, Shield, Truck, RotateCcw, Tag } from 'lucide-react';
import StarRating from './StarRating';
import SizeRecommendationCard from './SizeRecommendation'; // Import the new component

const ProductInfo = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // State to track the selected size

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
          Women's Cotton Floral Print Kurti with Palazzo Set - Comfortable Ethnic Wear
        </h1>
        <div className="flex items-center mt-2 space-x-4">
          <StarRating rating={4.3} showNumber className="text-yellow-500" />
          <span className="text-sm text-gray-600">4.3 • 2,847 reviews</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">₹599</span>
          <span className="text-lg text-gray-500 line-through">₹1,299</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
            54% OFF
          </span>
        </div>
        <p className="text-sm text-green-600">Inclusive of all taxes</p>
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
        <div className="flex space-x-2">
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              // Add an onClick handler to update the state
              onClick={() => setSelectedSize(size)}
              // Add conditional classes for the active state
              className={`border px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedSize === size
                  ? 'border-pink-500 text-pink-500 ring-2 ring-pink-500'
                  : 'border-gray-300 hover:border-pink-500 hover:text-pink-500'}`
              }
            >
              {size}
            </button>
          ))}
        </div>
        {/* Conditional Rendering of the Size Recommendation Card */}
        {selectedSize && <SizeRecommendationCard selectedSize={selectedSize} />}
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Color</h3>
        <div className="flex space-x-3">
          {[
            { name: 'Pink', color: 'bg-pink-400' },
            { name: 'Blue', color: 'bg-blue-400' },
            { name: 'Green', color: 'bg-green-400' },
            { name: 'Purple', color: 'bg-purple-400' }
          ].map((colorOption) => (
            <button
              key={colorOption.name}
              className={`w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 ${colorOption.color}`}
              title={colorOption.name}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
          Add to Cart
        </button>
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
          Buy Now
        </button>

        {/* Secondary Actions */}
        <div className="flex space-x-4 pt-2">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
            <Heart className="h-5 w-5" />
            <span>Add to Wishlist</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Truck className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">Free delivery above ₹499</span>
          </div>
          <div className="flex items-center space-x-3">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">7 days easy returns</span>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-700">Quality assured</span>
          </div>
          <div className="flex items-center space-x-3">
            <Tag className="h-5 w-5 text-orange-600" />
            <span className="text-sm text-gray-700">Best price guaranteed</span>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Sold by</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Fashion Hub Store</p>
            <div className="flex items-center space-x-2 mt-1">
              <StarRating rating={4.5} size="sm" />
              <span className="text-sm text-gray-600">(4.5/5)</span>
            </div>
          </div>
          <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
            View Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;