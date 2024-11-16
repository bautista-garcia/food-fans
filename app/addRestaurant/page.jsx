import RestaurantForm from "@/components/form/RestaurantForm";
import RestaurantList from "@/components/restaurants/RestaurantList";

export default function Page() {
  return (
    <div>
      <h1>Agregar restaurante</h1>
      <div>
        <RestaurantForm />
        <RestaurantList />
      </div>
    </div>
  );
}
