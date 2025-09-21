import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import Banner from '../components/Banner';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { Filter, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Landing() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [content,setContent]=useState();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  useEffect(() => {
    async function productcall() {
      await axios.get(`${HTTPBackend}/api/products`, {}).then((response) => {
        setContent(response.data.products);
      });
    }

    productcall();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryNav />
      <Banner />

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Sort and Filter Bar */}
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-gray-700 hover:text-pink-600"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-pink-500">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Discount</option>
                <option>Rating</option>
                <option>New Arrivals</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar isOpen={false} onClose={() => {}} />
          </div>

          {/* Mobile Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main content */}
          <div className="flex-1">
            <ProductGrid content={content} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-pink-50 border-t border-pink-100 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-pink-600 mb-4">meesho</h3>
              <p className="text-gray-600 text-sm mb-4">
                Meesho is a technology platform to enable 10 million online
                entrepreneurs across India.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Sell Online</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Sell on Meesho
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Seller Hub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Become a Supplier
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Hall of Fame
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">
                Legal and Policies
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Meesho Tech Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Code of Conduct
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">
                Reach out to us
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Grievance Officer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600">
                    Contact Us
                  </a>
                </li>
              </ul>

              <h4 className="font-semibold mb-4 mt-6 text-gray-900">
                Shop Non-Stop on Meesho
              </h4>
              <div className="flex gap-2">
                <div className="w-32 h-10 bg-gray-200 rounded"></div>
                <div className="w-32 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="border-t border-pink-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">© 2015-2024 Meesho.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
