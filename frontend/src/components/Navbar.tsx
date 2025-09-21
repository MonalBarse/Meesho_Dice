import React from 'react';
import { Search, ShoppingCart, User, Heart, Menu, Bell } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface NavbarProps {
  setFullscreenImage: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setFullscreenImage }) => {
  // use setFullscreenImage somewhere

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-pink-600">Meesho</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Try Saree, Kurti or Search by Product Code"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <Heart className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-600 hover:text-pink-600 transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <button className="p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <User className="h-6 w-6" />
              </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white border border-govt-orange/20">
                <DropdownMenuItem onClick={()=>{
                  setFullscreenImage(true);
                }} className="cursor-pointer">MyFit</DropdownMenuItem>
              </DropdownMenuContent>

            </DropdownMenu>
            <button className="md:hidden p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
            placeholder="Search products..."
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;