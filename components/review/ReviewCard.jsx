"use client";
import { Star, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DeleteReviewButton from "./DeleteReviewButton";
import { useSession } from "next-auth/react";

export default function ReviewCard({ review }) {
  const { data: session, status } = useSession();

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
    <Card key={review.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          <div className="relative h-[200px]">
            <Image
              src={review.foto}
              alt={review.plato}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{review.plato}</h3>
                <p className="text-sm text-muted-foreground">
                  Reseña por {review.usuario} •{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
                <span className="ml-2 font-semibold">{review.rating}</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">{review.descripcion}</p>
            {/* Se comparan nombres para identificar si la reseña es de un usuario o no.
             Hay que tener cuidado con esto, ya que puede tener problemas, pero por ahora creo que esta bien */}
            {session?.user.name == review.usuario && (
              <div className="w-full flex justify-end">
                <DeleteReviewButton reviewId={review.id} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
