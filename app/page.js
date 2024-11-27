"use client";

import { useState, useEffect, useCallback } from "react";
import FloatCard from "@/components/float-card";
import Map from "@/components/Map";
import { getRestaurants, getReseñas } from "@/utils/supabaseClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Fetch de restaurantes DB (Ejemplo de campos en "components/restaurants/RestaurantList.jsx")

export default function MapPage() {
  const [restaurants, setrestaurants] = useState([]);
  const [selectedrestaurant, setSelectedrestaurant] = useState(null);
  const [filteredrestaurants, setFilteredrestaurants] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [minRating, setMinRating] = useState(1);
  const [viewState, setViewState] = useState({
    longitude: -57.9545,
    latitude: -34.9205,
    zoom: 13,
  });
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  // Add state for sidebar position
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(350); // Initial width in pixels
  const [initialCardPosition, setInitialCardPosition] = useState(null);

  const [error, setError] = useState(null);

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
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setrestaurants(data);
      } catch (err) {
        setError("Failed to fetch restaurants");
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReseñas();
        setReviews(data);
      } catch (err) {
        setError("Failed to fetch restaurants");
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (restaurants.length > 0 && reviews.length > 0) {
      const ratingsMap = {};

      // Agrupar las reseñas por idres
      reviews.forEach(({ idres, rating }) => {
        if (!ratingsMap[idres]) {
          ratingsMap[idres] = { total: 0, count: 0 };
        }
        ratingsMap[idres].total += rating;
        ratingsMap[idres].count += 1;
      });

      // Calcular el promedio y actualizar los restaurantes
      const updatedRestaurants = restaurants.map((restaurant) => ({
        ...restaurant,
        rating:
          ratingsMap[restaurant.id]?.total / ratingsMap[restaurant.id]?.count ||
          0, // Si no hay reseñas, asignar 0
      }));

      setrestaurants(updatedRestaurants);
    }
  }, [reviews]);

  const getAllTags = useCallback(() => {
    const tags = new Set();
    restaurants.forEach((restaurant) => {
      restaurant.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [restaurants]);

  useEffect(() => {
    let filtered = restaurants;

    if (selectedTags.length > 0) {
      filtered = filtered.filter((restaurant) =>
        restaurant.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    filtered = filtered.filter((restaurant) => restaurant.rating >= minRating);

    setFilteredrestaurants(filtered);
  }, [restaurants, selectedTags, minRating]);

  const handlerestaurantClick = useCallback((restaurant) => {
    setSelectedrestaurant(restaurant);
    setViewState({
      longitude: restaurant.longitude,
      latitude: restaurant.latitude,
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
      {restaurants && (
        <div>
          <Map restaurants={filteredrestaurants} />

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

                {/* restaurants List */}
                <div className="space-y-3 overflow-y-auto">
                  {filteredrestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      onClick={() => handlerestaurantClick(restaurant)}
                      className="p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900">
                          {restaurant.nombre}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {"★".repeat(Math.round(restaurant.rating))}
                          {"☆".repeat(5 - Math.round(restaurant.rating))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        {restaurant.ubicacion}
                      </p>
                      <div className="flex justify-between">
                        <div className="flex flex-wrap gap-1">
                          {restaurant.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link href={`/restaurante/${restaurant.id}`}>
                          <Button className="bg-gray-900 text-white hover:bg-gray-800">
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
