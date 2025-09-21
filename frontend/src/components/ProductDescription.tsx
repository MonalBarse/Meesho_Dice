import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ProductDescription = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const tabs = [
    { id: 'description', label: 'Product Details' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'care', label: 'Care Instructions' },
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-white rounded-lg border">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">
                This beautiful cotton kurti with palazzo set is perfect for everyday wear and special occasions. 
                Made from premium quality cotton fabric, it features an elegant floral print that adds a touch of 
                sophistication to your ethnic wardrobe. The comfortable fit and breathable material make it ideal 
                for all-day wear.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Premium quality cotton fabric</li>
                <li>Beautiful floral print design</li>
                <li>Comfortable regular fit</li>
                <li>Complete set with matching palazzo</li>
                <li>Suitable for casual and semi-formal occasions</li>
                <li>Available in multiple sizes and colors</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Styling Tips:</h4>
              <p className="text-gray-700">
                Pair this kurti set with statement earrings and sandals for a casual look, or dress it up with 
                heels and traditional jewelry for special occasions. The versatile design makes it perfect for 
                work, parties, or festive celebrations.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Fabric</span>
                  <span className="text-gray-900 font-medium">100% Cotton</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Pattern</span>
                  <span className="text-gray-900 font-medium">Floral Print</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Sleeve Type</span>
                  <span className="text-gray-900 font-medium">3/4 Sleeves</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Neck Type</span>
                  <span className="text-gray-900 font-medium">Round Neck</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Fit</span>
                  <span className="text-gray-900 font-medium">Regular</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Length</span>
                  <span className="text-gray-900 font-medium">Knee Length</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Occasion</span>
                  <span className="text-gray-900 font-medium">Casual, Festive</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Season</span>
                  <span className="text-gray-900 font-medium">All Season</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Care Instructions</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Machine wash cold with like colors</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Use mild detergent, avoid bleach</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Tumble dry low or hang to dry</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Iron on medium heat if needed</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Store in a cool, dry place</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;