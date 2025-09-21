import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar = ({ isOpen, onClose }: FilterSidebarProps) => {
  const categories = [
    'Sarees', 'Kurtis', 'Kurta Sets', 'Suits & Dress Material', 'Other Ethnic'
  ];
  
  const priceRanges = [
    'Under ₹199', '₹200 - ₹399', '₹400 - ₹599', '₹600 - ₹999', '₹1000 & Above'
  ];
  
  const discounts = ['90% and above', '80% and above', '70% and above', '60% and above', '50% and above'];
  
  const ratings = ['4★ & above', '3★ & above'];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose}></div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform z-50 lg:static lg:transform-none lg:shadow-none lg:w-64 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6 lg:justify-start">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            <button onClick={onClose} className="lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">CATEGORY</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">PRICE</h4>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-sm text-gray-700">{range}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">DISCOUNT</h4>
            <div className="space-y-2">
              {discounts.map((discount) => (
                <label key={discount} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-sm text-gray-700">{discount}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">RATING</h4>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-sm text-gray-700">{rating}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;