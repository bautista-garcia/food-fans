"use client";
import { Star, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/review/ReviewCard";
import { getRestaurant, getReseña } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";
import ReviewModal from "@/components/review/ReviewModal";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Component({ params: id }) {
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [minRating, setMinRating] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshReviews = async () => {
    try {
      const [restaurantData, reviewsData] = await Promise.all([
        getRestaurant(id.id),
        getReseña(id.id),
      ]);
      setRestaurant(restaurantData);
      setReviews(reviewsData);
      setFilteredReviews(reviewsData);
      setRating(
        reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length || 0
      );
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const [restaurantData, reviewsData] = await Promise.all([
          getRestaurant(id),
          getReseña(id),
        ]);
        setRestaurant(restaurantData);
        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
        setRating(reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length || 0);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData(id.id);
  }, [id.id]);

  // Filter reviews based on minimum rating
  useEffect(() => {
    if (reviews) {
      const filtered = reviews.filter((review) => review.rating >= minRating);
      setFilteredReviews(filtered);
    }
  }, [reviews, minRating]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < Math.floor(rating)
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300"
          }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {restaurant && (
        <div>
          <div className="relative h-[400px] w-full">
            <Image
              src={restaurant.foto}
              alt={restaurant.nombre}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{restaurant.nombre}</h1>
              <div className="flex items-center gap-2 mb-4">
                {restaurant.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                  <span className="ml-2 font-semibold">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{restaurant.ubicacion}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Contenido */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 ">
              <Button asChild>
                <Link
                  href={restaurant.menu}
                  className="flex items-center gap-2"
                >
                  Ver Menú <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
              <div className="mt-6">
                <ReviewModal
                  idres={id.id}
                  onReviewAdded={refreshReviews}
                />
              </div>
            </div>

            {/* Sección de Reseñas */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Reseñas</h2>
                <div className="flex items-center gap-4 w-64">
                  <label className="text-sm text-gray-500">
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

              {filteredReviews && (
                <div className="space-y-4">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No hay reseñas con {minRating} o más estrellas
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
