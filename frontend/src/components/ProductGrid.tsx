import React from 'react';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    name: "Women Rayon Floral Print Anarkali Kurta (Pink)",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg",
    price: 299,
    originalPrice: 1299,
    discount: 77,
    rating: 4.1,
    reviews: 12847,
    freeDelivery: true
  },
  {
    id: 2,
    name: "Men Cotton Casual Shirt Regular Fit",
    image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg",
    price: 399,
    originalPrice: 1599,
    discount: 75,
    rating: 3.9,
    reviews: 8934,
    freeDelivery: true
  },
  {
    id: 3,
    name: "Women Handbag Shoulder Bag for Girls",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
    price: 249,
    originalPrice: 999,
    discount: 75,
    rating: 4.2,
    reviews: 5632,
    freeDelivery: true
  },
  {
    id: 4,
    name: "Kids Cotton T-Shirt Combo Pack of 3",
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg",
    price: 399,
    originalPrice: 1197,
    discount: 67,
    rating: 4.0,
    reviews: 3421,
    freeDelivery: true
  },
  {
    id: 5,
    name: "Women Georgette Saree with Blouse Piece",
    image: "https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg",
    price: 499,
    originalPrice: 2499,
    discount: 80,
    rating: 4.3,
    reviews: 9876,
    freeDelivery: true
  },
  {
    id: 6,
    name: "Men Sports Running Shoes Lightweight",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    price: 599,
    originalPrice: 2999,
    discount: 80,
    rating: 4.1,
    reviews: 6543,
    freeDelivery: true
  },
  {
    id: 7,
    name: "Non-Stick Cookware Set 7 Pieces",
    image: "https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg",
    price: 899,
    originalPrice: 3999,
    discount: 78,
    rating: 4.4,
    reviews: 2134,
    freeDelivery: true
  },
  {
    id: 8,
    name: "Women Western Dress Midi Length",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg",
    price: 349,
    originalPrice: 1399,
    discount: 75,
    rating: 3.8,
    reviews: 4567,
    freeDelivery: true
  },
  {
    id: 9,
    name: "Bluetooth Wireless Earbuds with Mic",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
    price: 299,
    originalPrice: 1999,
    discount: 85,
    rating: 4.0,
    reviews: 8765,
    freeDelivery: true
  },
  {
    id: 10,
    name: "Home Decor Wall Stickers 3D",
    image: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg",
    price: 199,
    originalPrice: 799,
    discount: 75,
    rating: 4.2,
    reviews: 1234,
    freeDelivery: true
  },
  {
    id: 11,
    name: "Women Face Wash & Scrub Combo",
    image: "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg",
    price: 249,
    originalPrice: 998,
    discount: 75,
    rating: 4.3,
    reviews: 5432,
    freeDelivery: true
  },
  {
    id: 12,
    name: "Men Analog Watch Leather Strap",
    image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg",
    price: 399,
    originalPrice: 1999,
    discount: 80,
    rating: 4.1,
    reviews: 3456,
    freeDelivery: true
  },
  {
    id: 13,
    name: "Women Cotton Printed Kurti Set",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg",
    price: 449,
    originalPrice: 1799,
    discount: 75,
    rating: 4.2,
    reviews: 7890,
    freeDelivery: true
  },
  {
    id: 14,
    name: "Men Denim Jeans Slim Fit",
    image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg",
    price: 499,
    originalPrice: 1999,
    discount: 75,
    rating: 4.0,
    reviews: 4321,
    freeDelivery: true
  },
  {
    id: 15,
    name: "Women Sandals Flat Comfortable",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
    price: 299,
    originalPrice: 1199,
    discount: 75,
    rating: 3.9,
    reviews: 2345,
    freeDelivery: true
  },
  {
    id: 16,
    name: "Kids School Bag Waterproof",
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg",
    price: 399,
    originalPrice: 1599,
    discount: 75,
    rating: 4.1,
    reviews: 1876,
    freeDelivery: true
  }
];

//@ts-ignore
const ProductGrid = (content) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Products For You</h2>
        <p className="text-gray-600 text-sm">{products.length} of 10 lakh+ products</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="bg-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors">
          View More
        </button>
      </div>
    </section>
  );
};

export default ProductGrid;