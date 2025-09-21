import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, MapPin, Truck } from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top notification bar */}
      <div className="bg-pink-50 border-b border-pink-100 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Truck className="w-4 h-4 text-pink-600" />
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="w-4 h-4 text-pink-600">↩</span>
            <span>7-day Return Policy</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="w-4 h-4 text-pink-600">₹</span>
            <span>Lowest Price</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-pink-600">
              meesho
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try Saree, Kurti or Search by Product Code"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 bg-gray-50"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Download App */}
            <div className="hidden lg:flex items-center gap-2 text-gray-700">
              <div className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center">
                <span className="text-pink-600 text-xs">📱</span>
              </div>
              <span className="text-sm font-medium">Download App</span>
            </div>

            {/* Become a Supplier */}
            <div className="hidden lg:flex items-center gap-2 text-gray-700">
              <span className="text-sm font-medium">Become a Supplier</span>
            </div>

            {/* Profile & Cart */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
                <User className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium">Profile</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-pink-600 relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium">Cart</span>
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;