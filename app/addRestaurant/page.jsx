import RestaurantForm from "@/components/form/RestaurantForm";
import RestaurantList from "@/components/restaurants/RestaurantList";

export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center mt-4">
        Agregar Restaurante
      </h1>
      <div>
        <RestaurantForm />
        {/* <RestaurantList /> */}
      </div>
    </div>
  );
}
