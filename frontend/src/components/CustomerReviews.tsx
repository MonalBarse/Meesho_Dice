import React, { useState } from 'react';
import { Star, ThumbsUp, ChevronDown } from 'lucide-react';
import StarRating from './StarRating';

const CustomerReviews = () => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [filterRating, setFilterRating] = useState('all');

  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      date: '2 days ago',
      review: 'Absolutely love this kurti set! The fabric quality is excellent and the fit is perfect. The floral print is beautiful and the colors are vibrant. Highly recommended!',
      helpful: 12,
      verified: true,
      images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=100']
    },
    {
      id: 2,
      name: 'Anita Patel',
      rating: 4,
      date: '1 week ago',
      review: 'Good quality product. The material is comfortable and breathable. Size fits as expected. Fast delivery. Only issue is the color was slightly different from what I expected.',
      helpful: 8,
      verified: true,
      images: []
    },
    {
      id: 3,
      name: 'Sneha Kumar',
      rating: 5,
      date: '2 weeks ago',
      review: 'Amazing quality for the price! I have ordered multiple kurtis from this seller and they never disappoint. The palazzo is very comfortable and the kurti length is perfect.',
      helpful: 15,
      verified: true,
      images: []
    },
    {
      id: 4,
      name: 'Meera Singh',
      rating: 4,
      date: '3 weeks ago',
      review: 'Beautiful design and good fabric quality. The kurti is comfortable to wear all day. Palazzo could be a bit more fitted but overall satisfied with the purchase.',
      helpful: 6,
      verified: false,
      images: []
    },
    {
      id: 5,
      name: 'Kavya Reddy',
      rating: 3,
      date: '1 month ago',
      review: 'The product is okay. Quality is decent but not exceptional. The print started fading slightly after few washes. For the price, it\'s acceptable.',
      helpful: 3,
      verified: true,
      images: []
    }
  ];

  const ratingDistribution = [
    { stars: 5, count: 1204, percentage: 62 },
    { stars: 4, count: 583, percentage: 30 },
    { stars: 3, count: 97, percentage: 5 },
    { stars: 2, count: 39, percentage: 2 },
    { stars: 1, count: 19, percentage: 1 }
  ];

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h2>
        
        {/* Rating Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Overall Rating */}
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl font-bold text-gray-900">4.3</div>
              <div>
                <StarRating rating={4.3} size="lg" />
                <p className="text-sm text-gray-600 mt-1">Based on 2,847 reviews</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-gray-600">{item.stars}</span>
                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-gray-600 w-12 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterRating === 'all'
                  ? 'bg-pink-100 text-pink-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating.toString())}
                className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                  filterRating === rating.toString()
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{rating}</span>
                <Star className="h-3 w-3 fill-current text-yellow-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-medium text-sm">
                    {review.name.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{review.name}</h4>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.review}</p>
                  
                  {review.images.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt="Review"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {reviews.length > 3 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="flex items-center space-x-2 mx-auto text-pink-600 hover:text-pink-700 font-medium"
            >
              <span>{showAllReviews ? 'Show Less Reviews' : 'Show All Reviews'}</span>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform ${
                  showAllReviews ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;