import RestaurantForm from "@/components/form/RestaurantForm";

export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center mt-4">
        Agregar Restaurante
      </h1>
      <div>
        <RestaurantForm />
      </div>
    </div>
  );
}
