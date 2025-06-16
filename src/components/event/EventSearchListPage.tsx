import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Alert,
  Select,
  Option,
  Input,
} from "@material-tailwind/react";
import { resultInterface } from "../../interface/EventLoad";
import { searchEvents, getEventMedia, getCategories } from "../../api/event";
import { formatShortEventDate, calculateEventDuration } from "../../utils/dateUtils";

export default function EventSearchListPage() {
  const [events, setEvents] = useState<resultInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    categoryId: "",
    startDate: "",
    endDate: "",
  });

  // Charger les catégories au montage du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Construire l'URL avec les nouveaux filtres
    const currentParams = new URLSearchParams(location.search);
    if (value) {
      currentParams.set(name, value);
    } else {
      currentParams.delete(name);
    }
    
    // Mettre à jour l'URL et déclencher une nouvelle recherche
    navigate(`/search?${currentParams.toString()}`);
  };

  const handleSearch = async (searchParams = "") => {
    setLoading(true);
    setError(null);
  
    try {
      const cleanParams = searchParams.startsWith('?') ? searchParams.substring(1) : searchParams;
      const urlParams = new URLSearchParams(cleanParams);
      
      const searchResults = await searchEvents({
        term: urlParams.get('term') || '',
        city: urlParams.get('city') || '',
        categoryId: urlParams.get('categoryId') || '',
        startDate: urlParams.get('startDate') || '',
        endDate: urlParams.get('endDate') || ''
      });

      // Filtrer les événements publiés
      const publishedEvents = searchResults.filter((event: any) => event.isPublished);

      // Ajouter les médias pour chaque événement
      const eventsWithMedia = await Promise.all(
        publishedEvents.map(async (event: any) => {
          const mediaResult = await getEventMedia(event.id);
          const media = Array.isArray(mediaResult) ? mediaResult : [];
          
          return {
            ...event,
            formattedDateRange: formatShortEventDate(event.startDate, event.endDate),
            media
          };
        })
      );

      setEvents(eventsWithMedia);
      //console.log("Événements trouvés:", eventsWithMedia);
    } catch (err: any) {
      console.error("Erreur lors de la recherche:", err);
      setError(err.message || "Une erreur est survenue lors de la recherche");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(location.search);
  }, [location.search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barre de filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <Typography variant="h6" className="mb-4">
          Filtres
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre par catégorie */}
          <Select
            label="Catégorie"
            value={filters.categoryId}
            onChange={(value) => handleFilterChange("categoryId", value || "")}
          >
            <Option value="">Toutes les catégories</Option>
            {categories.map((category) => (
              <Option key={category.id} value={category.id.toString()}>
                {category.name}
              </Option>
            ))}
          </Select>

          {/* Filtre par date de début */}
          <Input
            type="datetime-local"
            label="Date de début"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />

          {/* Filtre par date de fin */}
          <Input
            type="datetime-local"
            label="Date de fin"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
        </div>
      </div>

      {/* En-tête des résultats */}
      <div className="mb-8">
        <Typography variant="h3" className="text-2xl font-bold mb-2">
          Résultats de recherche
        </Typography>
        <Typography color="gray" className="text-sm">
          {events.length} événement(s) trouvé(s)
        </Typography>
      </div>

      {error && (
        <Alert color="red" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8">
        {events.map((event) => (
          <Link to={`/event/${event.id}`} key={event.id}>
            <Card className="flex flex-row h-64 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Image */}
              <div className="w-1/3 relative">
                <img
                  src={event.media?.[0]?.imageUrl || "/default-event-image.jpg"}
                  alt={event.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Contenu */}
              <CardBody className="w-2/3 flex flex-col justify-between p-6">
                <div className="space-y-3">
                  {/* Date et Durée */}
                  <div>
                    <Typography color="gray" className="text-sm font-medium">
                      {event.formattedDateRange}
                    </Typography>
                    <Typography color="gray" className="text-xs">
                      Durée : {calculateEventDuration(new Date(event.startDate), new Date(event.endDate))}
                    </Typography>
                  </div>

                  {/* Titre et Ville */}
                  <div>
                    <Typography variant="h5" className="font-bold line-clamp-2">
                      {event.name}
                    </Typography>
                    <Typography color="gray" className="text-sm mt-1">
                      <span className="inline-flex items-center">
                        {event.city}
                      </span>
                    </Typography>
                  </div>

                  {/* Description */}
                  <Typography color="gray" className="text-sm line-clamp-3">
                    {event.description}
                  </Typography>
                </div>
                
                {/* Footer: Prix et Places */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <Typography className="text-sm font-semibold text-joinly_blue-principale">
                    {event.budget > 0 ? `${event.budget}€` : 'Gratuit'}
                  </Typography>
                  <Typography className="text-sm text-gray-600">
                    {event.numberPlace} places disponibles
                  </Typography>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}