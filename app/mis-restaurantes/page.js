import RestaurantList from "@/components/restaurants/RestaurantList";
import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center mt-4">
        Mis Restaurantes
      </h1>
      <div>
        <RestaurantList />
      </div>
    </div>
  );
};

export default page;
