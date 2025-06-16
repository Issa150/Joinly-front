import { useState } from "react";
import { Input, Button, IconButton } from "@material-tailwind/react";
import { MagnifyingGlassIcon, MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface EventSearchBarProps {
  onSearch: (searchParams: string) => void;
}

export default function EventSearchBar({ onSearch }: EventSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit exécuté");
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("term", searchTerm.trim());
    if (city.trim()) params.append("city", city.trim());
    console.log("Recherche soumise avec les paramètres :", params.toString());

    if (!searchTerm.trim() && !city.trim()) {
      console.log("Recherche ignorée car les champs sont vides.");
      return;
    }

    onSearch(params.toString());
  };

  /* const clearFields = () => {
    setSearchTerm("");
    setCity("");
  }; */

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 bg-white rounded-lg">
        {/* Recherche par terme */}
        <div className="flex items-center flex-1 border-r border-gray-200 relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 ml-2" />
          <Input
            type="text"
            placeholder="Rechercher un événement"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none focus:ring-0"
            containerProps={{
              className: "min-w-0"
            }}
          />
          {searchTerm && (
            <IconButton
              variant="text"
              size="sm"
              className="!absolute right-0 mr-1"
              onClick={() => setSearchTerm("")}
            >
              <XMarkIcon className="h-4 w-4" />
            </IconButton>
          )}
        </div>

        {/* Recherche par ville */}
        <div className="flex items-center flex-1 relative">
          <MapPinIcon className="h-5 w-5 text-gray-500 ml-2" />
          <Input
            type="text"
            placeholder="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border-none focus:ring-0"
            containerProps={{
              className: "min-w-0"
            }}
          />
          {city && (
            <IconButton
              variant="text"
              size="sm"
              className="!absolute right-0 mr-1"
              onClick={() => setCity("")}
            >
              <XMarkIcon className="h-4 w-4" />
            </IconButton>
          )}
        </div>

        {/* Bouton de recherche */}
        <Button
          type="submit"
          size="sm"
          className="bg-joinly_blue-principale hover:bg-joinly_blue-contraste p-2 aspect-square"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-white" />
        </Button>
      </div>
    </form>
  );
}