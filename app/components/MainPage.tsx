import CartList from "./CartList";
import MyMap from "./Map";
import SelectSmall from "../shared/ui/Select";

export default function HomePage() {
  
  return (
    <main className="flex flex-col min-h-screen">
      
        <SelectSmall />
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
            Карта загрязнений
          </h2>
            <MyMap />
        </section>

    </main>
  );
}
