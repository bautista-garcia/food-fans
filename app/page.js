"use client";

import { useState, useEffect, useCallback } from "react";
import FloatCard from "@/components/float-card";
import Map from "@/components/Map";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapPage() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [minRating, setMinRating] = useState(1);
  const [viewState, setViewState] = useState({
    longitude: -57.9545,
    latitude: -34.9205,
    zoom: 13,
  });

  // Add state for sidebar position
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(350); // Initial width in pixels
  const [initialCardPosition, setInitialCardPosition] = useState(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

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

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    const mockReviews = [
      {
        id: 1,
        restaurantName: "La Pizza de Tano",
        location: "La Plata, Buenos Aires",
        rating: 4,
        tags: ["pizza", "italian"],
        latitude: -34.9205,
        longitude: -57.9536,
      },
      {
        id: 2,
        restaurantName: "El Rincón de las Empanadas",
        location: "La Plata, Buenos Aires",
        rating: 5,
        tags: ["empanadas", "argentinian"],
        latitude: -34.9215,
        longitude: -57.9545,
      },
      {
        id: 3,
        restaurantName: "Parrilla Don Carlos",
        location: "La Plata, Buenos Aires",
        rating: 4,
        tags: ["asado", "argentinian"],
        latitude: -34.9195,
        longitude: -57.9526,
      },
      {
        id: 4,
        restaurantName: "Café Martinez",
        location: "La Plata, Buenos Aires",
        rating: 5,
        tags: ["coffee", "pastries"],
        latitude: -34.9225,
        longitude: -57.9556,
      },
      {
        id: 5,
        restaurantName: "La Trattoria",
        location: "La Plata, Buenos Aires",
        rating: 4,
        tags: ["pasta", "italian"],
        latitude: -34.9185,
        longitude: -57.9516,
      },
    ];
    setReviews(mockReviews);
  }, []);

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

    filtered = filtered.filter((review) => review.rating >= minRating);

    setFilteredReviews(filtered);
  }, [reviews, selectedTags, minRating]);

  const handleReviewClick = useCallback((review) => {
    setSelectedReview(review);
    setViewState({
      longitude: review.longitude,
      latitude: review.latitude,
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    setInitialCardPosition({
      x: window.innerWidth - 450,
      y: 20,
    });
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="fixed inset-0 overflow-hidden">
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
                <label className="text-sm text-gray-500 mb-2 block">Tags</label>
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
                      className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                        selectedTags.includes(tag)
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
                  onClick={() => handleReviewClick(review)}
                  className="p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-100"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900">
                      {review.restaurantName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    {review.location}
                  </p>
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
                </div>
              ))}
            </div>
          </div>
        </FloatCard>
      )}
    </div>
  );
}
