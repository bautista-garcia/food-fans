import { Star, MapPin, ExternalLink } from 'lucide-react'
import Image from "next/image";
import Link from "next/link";

import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Component() {
    // Mock data - en una aplicación real, esto vendría de una API o base de datos
    const restaurant = {
        name: "MACCCCCCCCCCC",
        coverImage: "/placeholder.png", // Cambiado a la imagen placeholder.png en la carpeta public
        tags: ["Burgas", "Burgas", "y mas burgas"],
        menuLink: "https://drive.google.com/drive/folders/1l5bvccFsHMWiFN9NmVbCRSvreMMbxTjn?hl=es-419",
        location: "123 Calle Culinaria, Distrito Gastronómico",
        averageRating: 4.7,
        reviews: [
            {
                id: "rev1",
                user: "María S.",
                dishImage: "/plato.jpg", // Cambiado a la imagen plato.jpg en la carpeta public
                dishName: "Cuarto de Libra",
                createdAt: "2024-02-15",
                description: "Al tibu le encanto ¡Absolutamente divino! La salsa estaba perfectamente reducida y la carne increíblemente tierna. Uno de los mejores platos franceses que he probado fuera de París.",
                rating: 5
            },
            {
                id: "rev2",
                user: "Jaime L.",
                dishImage: "/grand-big-mac.jpg", // Cambiado a la imagen plato.jpg en la carpeta public
                dishName: "Big Mac",
                createdAt: "2024-02-14",
                description: "Rico, sustancioso y lleno de sabor. La carne estaba cocinada a la perfección y la salsa de vino era excepcional.",
                rating: 4.5
            },
            {
                id: "rev3",
                user: "Sofía R.",
                dishImage: "/plato.jpg", // Cambiado a la imagen plato.jpg en la carpeta public
                dishName: "Burga veggie",
                createdAt: "2024-02-13",
                description: "Deja, ni la pruebes",
                rating: 1
            }
        ]
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
            />
        ))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sección Hero */}
            <div className="relative h-[400px] w-full">
                <Image
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        {restaurant.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-white/20">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                            {renderStars(restaurant.averageRating)}
                            <span className="ml-2 font-semibold">{restaurant.averageRating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{restaurant.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Contenido */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button asChild>
                        <Link href={restaurant.menuLink} className="flex items-center gap-2">
                            Ver Menú <ExternalLink className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                {/* Sección de Reseñas */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Reseñas</h2>
                    {restaurant.reviews.map((review) => (
                        <Card key={review.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="grid md:grid-cols-[300px,1fr] gap-6">
                                    <div className="relative h-[200px]">
                                        <Image
                                            src={review.dishImage}
                                            alt={review.dishName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">{review.dishName}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Reseña por {review.user} • {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {renderStars(review.rating)}
                                                <span className="ml-2 font-semibold">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground mb-4">{review.description}</p>
                                        <div className="text-sm text-muted-foreground">
                                            ID de reseña: {review.id}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
