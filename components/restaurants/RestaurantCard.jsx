import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";
import DeleteRestaurantButton from "./DeleteRestaurantButton";
import { useSession } from "next-auth/react";

const RestaurantCard = ({ restaurant }) => {
  const { data: session } = useSession();

  return (
    <Card
      className={`w-full max-w-sm mx-auto ${
        !(session?.user?.name === restaurant.usuario) ? "hidden" : "block"
      }`}
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold">{restaurant.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <Image
            src={restaurant.foto || "/placeholder.jpg"}
            width={500}
            height={300}
            alt={restaurant.nombre}
            className="object-cover rounded-md w-full max-h-[300px]"
          />
        </div>
        <p className="text-sm text-gray-500 mb-2">{restaurant.ubicacion}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {restaurant.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <a
          href={restaurant.menu}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          Ver Menú
        </a>
        {session?.user.name == restaurant.usuario && (
          <div className="mt-[10px]">
            <DeleteRestaurantButton restaurantId={restaurant.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
