"use client";

import { useState, useEffect, useCallback } from "react";
import FloatCard from "@/components/float-card";
import Map from "@/components/Map";
import { getReseña, getRestaurants } from "@/utils/supabaseClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Fetch de restaurantes DB (Ejemplo de campos en "components/restaurants/RestaurantList.jsx")

export default function MapPage() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [minRating, setMinRating] = useState(1);

  // Add state for sidebar position
  const [isDragging, setIsDragging] = useState(false);
  const [initialCardPosition, setInitialCardPosition] = useState(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const newWidth = window.innerWidth - e.clientX;
        setSidebarWidth(Math.max(300, Math.min(600, newWidth))); // Min 300px, Max 600px
      }
    },
    [isDragging]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Calculate average rating for a restaurant
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 1;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 2) / 2;
  };

  // Process restaurants data to include average ratings
  const processRestaurantsData = async (restaurants) => {
    // Use Promise.all to fetch all reviews in parallel
    const restaurantsWithReviews = await Promise.all(
      restaurants.map(async (restaurant) => {
        const reviews = await getReseña(restaurant.id);
        return {
          ...restaurant,
          averageRating: calculateAverageRating(reviews)
        };
      })
    );
    return restaurantsWithReviews;
  };

  useEffect(() => {
    setInitialCardPosition({
      x: window.innerWidth - 450,
      y: 20,
    });

    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        const processedData = await processRestaurantsData(data);
        setReviews(processedData);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []); // Empty dependency array means this runs once on mount

  const getAllTags = useCallback(() => {
    const tags = new Set();
    reviews.forEach((review) => {
      review.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [reviews]);

  useEffect(() => {
    let filtered = reviews;
    if (selectedTags.length > 0) {
      filtered = filtered.filter((review) =>
        review.tags.some((tag) => selectedTags.includes(tag))
      );
    }
    filtered = filtered.filter((review) => review.averageRating >= minRating);
    setFilteredReviews(filtered);
  }, [reviews, selectedTags, minRating]);

  // Star rating component
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">⯨</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">☆</span>
        ))}
        <span className="ml-1 text-sm text-gray-500">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {reviews && (
        <div>
          <Map reviews={filteredReviews} />

          {initialCardPosition && (
            <FloatCard
              initialPosition={initialCardPosition}
              initialSize={{ width: 400, height: window.innerHeight - 40 }}
              minSize={{ width: 300, height: 400 }}
              maxSize={{ width: 600, height: window.innerHeight - 40 }}
            >
              <div className="flex flex-col h-full overflow-hidden">
                {/* Filter Section */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getAllTags().map((tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            setSelectedTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag]
                            )
                          }
                          className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${selectedTags.includes(tag)
                            ? "bg-gray-900 text-white"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">
                      Rating {minRating}+
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full accent-gray-900"
                    />
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-3 overflow-y-auto">
                  {filteredReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900">
                          {review.nombre}
                        </h3>
                        <StarRating rating={review.averageRating} />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        {review.ubicacion}
                      </p>
                      <div className="flex justify-between">
                        <div className="flex flex-wrap gap-1">
                          {review.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link href={`/restaurante/${review.id}`}>
                          <Button
                            className="bg-gray-900 text-white hover:bg-gray-800"
                          >
                            Ver Reseñas
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FloatCard>
          )}
        </div>
      )}
    </div>
  );
}