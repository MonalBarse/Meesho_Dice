import React from 'react';

interface SizeRecommendationCardProps {
  selectedSize: string;
}

const SizeRecommendationCard: React.FC<SizeRecommendationCardProps> = ({ selectedSize }) => {
  // Dummy data for demonstration
  const sizeData = {
    S: { fit: 'Fits a bit small', feedback: 'Customers suggest sizing up for a relaxed fit.' },
    M: { fit: 'True to size', feedback: 'Most customers found this size to fit perfectly.' },
    L: { fit: 'Fits a bit large', feedback: 'Consider sizing down if you prefer a snug fit.' },
    XL: { fit: 'True to size', feedback: 'A great fit for most body types.' },
    XXL: { fit: 'True to size', feedback: 'Perfect for a comfortable, loose fit.' },
  };

  const data = sizeData[selectedSize as keyof typeof sizeData];

  if (!data) return null; // Handle cases where data is not available

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-fadeIn">
      <h4 className="text-md font-semibold text-gray-800">Size Recommendation for {selectedSize}</h4>
      <p className="mt-2 text-sm text-gray-700">
        **Fit:** {data.fit}
      </p>
      <p className="mt-1 text-sm text-gray-700">
        **Customer Feedback:** {data.feedback}
      </p>
    </div>
  );
};

export default SizeRecommendationCard;