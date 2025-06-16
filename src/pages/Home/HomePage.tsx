import { useEffect, useState } from "react";
import EventCategories from "../../components/event/EventCategories";
import EventList from "../../components/event/EventList";
import { getCategories } from "../../api/event";

export default function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((data) => {
        if (!data.error) {
          setCategories(data);
        } else {
          console.error("Erreur lors de la récupération des catégories :", data.error);
        }
      })
      .catch((error) => console.error("Erreur lors de la récupération des catégories :", error));
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-8 mt-10 text-center text-joinly_blue-contraste">
        Bienvenue sur Joinly
      </h1>
      <div className="flex flex-col gap-6">
        <EventCategories categories={categories} onCategoryClick={function (_categoryId: number): void {
          throw new Error("Function not implemented.");
        } } />
        <EventList />
      </div>
    </>
  );
}