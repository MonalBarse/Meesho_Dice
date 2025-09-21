import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReactDOMServerReadableStream } from 'react-dom/server';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  freeDelivery: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
const navigate =useNavigate();
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div onClick={
        ()=>{
          navigate('/product')
        }
      } className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
        {product.freeDelivery && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
            Free Delivery
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-green-500 text-green-500'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;