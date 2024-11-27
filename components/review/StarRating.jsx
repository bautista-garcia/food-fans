import React from 'react';
import { FaStar } from 'react-icons/fa';



const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <FaStar
            key={index}
            className="cursor-pointer"
            color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
            size={24}
            onClick={() => onRatingChange(ratingValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;