"use client";
import { Star, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReviewCard from "@/components/review/ReviewCard";
import { getRestaurant } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";

export default function Component() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRestaurant = async (id) => {
      try {
        const data = await getRestaurant(id);
        setRestaurant(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch restaurants");
        setLoading(false);
      }
    };
    fetchRestaurant(1);
  }, []);

  // reviews = [
  //   {
  //     id: "rev1",
  //     user: "María S.",
  //     dishImage: "/plato.jpg", // Cambiado a la imagen plato.jpg en la carpeta public
  //     dishName: "Cuarto de Libra",
  //     createdAt: "2024-02-15",
  //     description:
  //       "Al tibu le encanto ¡Absolutamente divino! La salsa estaba perfectamente reducida y la carne increíblemente tierna. Uno de los mejores platos franceses que he probado fuera de París.",
  //     rating: 5,
  //   },
  // ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

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
                  <Badge key={tag} variant="secondary" className="bg-white/20">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  {renderStars(restaurant.rating)}
                  <span className="ml-2 font-semibold">
                    {restaurant.rating}
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
            <div className="mb-8">
              <Button asChild>
                <Link
                  href={restaurant.menu}
                  className="flex items-center gap-2"
                >
                  Ver Menú <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Sección de Reseñas */}
            {/* <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Reseñas</h2>
            {restaurant.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
