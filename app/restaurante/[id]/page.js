"use client";
import { Star, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReviewCard from "@/components/review/ReviewCard";
import { getRestaurant, getReseña, getReseñas } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";
import ReviewModal from "@/components/review/ReviewModal";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Component({ params: id }) {
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const [restaurantData, reviewsData] = await Promise.all([
          getRestaurant(id),
          getReseña(id),
        ]);
        setRestaurant(restaurantData);
        setReviews(reviewsData);
        setRating(reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length || 0);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData(id.id);
  }, [id.id]);


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
                <ReviewModal idres={id.id} />
              </div>
            </div>

            {/* Sección de Reseñas */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Reseñas</h2>
              {reviews && (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
