import React from 'react';
import { Heart } from 'lucide-react';
import StarRating from './StarRating';

const RelatedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Cotton Printed Kurti',
      image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: '₹449',
      originalPrice: '₹899',
      discount: '50% OFF',
      rating: 4.2,
      reviews: 1234
    },
    {
      id: 2,
      name: 'Floral Palazzo Set',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: '₹699',
      originalPrice: '₹1399',
      discount: '50% OFF',
      rating: 4.4,
      reviews: 856
    },
    {
      id: 3,
      name: 'Ethnic Anarkali Dress',
      image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: '₹899',
      originalPrice: '₹1799',
      discount: '50% OFF',
      rating: 4.1,
      reviews: 567
    },
    {
      id: 4,
      name: 'Casual Kurta Set',
      image: 'https://images.pexels.com/photos/1070977/pexels-photo-1070977.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: '₹549',
      originalPrice: '₹1099',
      discount: '50% OFF',
      rating: 4.3,
      reviews: 923
    }
  ];

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Similar Products</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <button className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all">
                  <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                </button>
                
                <div className="absolute bottom-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {product.discount}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-1">
                  <StarRating rating={product.rating} size="sm" />
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;