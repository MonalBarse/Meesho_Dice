import React from 'react';

const categories = [
  { name: 'Women Ethnic', subcategories: ['Sarees', 'Kurtis', 'Suits'] },
  { name: 'Women Western', subcategories: ['Tops', 'Dresses', 'Jeans'] },
  { name: 'Men', subcategories: ['Shirts', 'T-Shirts', 'Jeans'] },
  { name: 'Kids', subcategories: ['Boys', 'Girls', 'Baby'] },
  { name: 'Home & Kitchen', subcategories: ['Decor', 'Kitchen', 'Bedding'] },
  { name: 'Beauty & Health', subcategories: ['Makeup', 'Skincare', 'Hair'] },
  { name: 'Jewellery & Accessories', subcategories: ['Earrings', 'Necklaces', 'Bags'] },
  { name: 'Bags & Footwear', subcategories: ['Handbags', 'Shoes', 'Sandals'] },
  { name: 'Electronics', subcategories: ['Mobile', 'Headphones', 'Speakers'] }
];

const CategoryNav = () => {
  return (
    <nav className="bg-white border-b border-gray-200 py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <div key={category.name} className="relative group">
              <button className="whitespace-nowrap text-gray-700 hover:text-pink-600 font-medium transition-colors py-3 text-sm">
                {category.name}
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 rounded-lg p-4 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <a
                      key={sub}
                      href="#"
                      className="block text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-2 py-1 rounded"
                    >
                      {sub}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;