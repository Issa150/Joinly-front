import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { UsersIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { getEventMedia, getEvents, getEventParticipationCount, checkReservation } from "../../api/event";
import { isEventPassed } from "../../utils/dateUtils";
import { useAuth } from "../../contexts/AuthContext";

const ITEMS_PER_PAGE = 9; // 3x3 grid

interface EventWithParticipations {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  numberPlace: number;
  participationCount: number;
  formattedStartDate: { date: string; time: string };
  formattedEndDate: { date: string; time: string };
  city: string;
  media?: Array<{ imageUrl: string }>;
}

export default function EventList() {
  const [events, setEvents] = useState<EventWithParticipations[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Format date et heure
  const formatDateTime = (date: string) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      time: d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  // Référence pour l'infinite scroll
  const lastEventElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Charger les événements
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents(page, ITEMS_PER_PAGE);

        if (!Array.isArray(response.events)) {
          console.error("La réponse n'est pas un tableau:", response);
          return;
        }

        const formattedEvents = await Promise.all(
          // Filtrer pour n'avoir que les événements publiés
          response.events
            .filter(event => event.isPublished)
            .map(async (event: any) => {
              try {
                const [media, participationCount] = await Promise.all([
                  getEventMedia(event.id),
                  getEventParticipationCount(event.id)
                ]);

                const formattedMedia = media && media.length > 0 ? media.map((m: any) => ({
                  imageUrl: m.img ? `http://localhost:3000/media/uploads/${m.img}` : '',
                })) : [];

                return {
                  ...event,
                  media: formattedMedia,
                  formattedStartDate: formatDateTime(event.startDate),
                  formattedEndDate: formatDateTime(event.endDate),
                  participationCount: participationCount // Maintenant c'est un nombre
                };
              } catch (error) {
                console.error(`Erreur lors du traitement de l'événement ${event.id}:`, error);
                return {
                  ...event,
                  media: [],
                  formattedStartDate: formatDateTime(event.startDate),
                  formattedEndDate: formatDateTime(event.endDate),
                  participationCount: 0
                };
              }
            })
        );

        setEvents(prev => {
          // Éviter les doublons en vérifiant les IDs
          const existingIds = new Set(prev.map(e => e.id));
          const newEvents = formattedEvents.filter(e => !existingIds.has(e.id));
          
          return page === 1 ? formattedEvents : [...prev, ...newEvents];
        });

        setHasMore(response.hasMore);
        
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
        setError("Erreur lors du chargement des événements");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [page]);

  // Fonction pour calculer le pourcentage de places prises
  const calculatePlacesPercentage = (event: EventWithParticipations) => {
    const total = event.numberPlace;
    const taken = event.participationCount || 0;
    return (taken / total) * 100;
  };

  // Séparer les événements en cours et passés
  const { upcomingEvents, pastEvents } = events.reduce(
    (acc, event) => {
      if (isEventPassed(event.endDate)) {
        acc.pastEvents.push(event);
      } else {
        acc.upcomingEvents.push(event);
      }
      return acc;
    },
    { upcomingEvents: [], pastEvents: [] } as {
      upcomingEvents: EventWithParticipations[];
      pastEvents: EventWithParticipations[];
    }
  );

  // Composant de carte d'événement réutilisable
  const EventCard = ({ event, isPast = false }: { event: EventWithParticipations; isPast?: boolean }) => {
    const [hasReservation, setHasReservation] = useState(false);
    const { isAuthenticated } = useAuth();
  
    useEffect(() => {
      const verifyReservation = async () => {
        if (!isAuthenticated) return;
        try {
          const isReserved = await checkReservation(event.id);
          setHasReservation(isReserved);
        } catch (error) {
          console.error("Erreur lors de la vérification de la réservation:", error);
        }
      };
  
      verifyReservation();
    }, [event.id, isAuthenticated]);
  
    return (
      <Card className={`h-full flex flex-col hover:shadow-lg transition-shadow duration-300 ${
        isPast ? 'opacity-75' : ''
      }`}>
        {/* Image avec badge de réservation */}
        <div className="relative h-48">
          <img
            src={event.media?.[0]?.imageUrl || "/default-event-image.jpg"}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {hasReservation && (
              <div className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <CheckBadgeIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Réservé</span>
              </div>
            )}
            {event.participationCount >= event.numberPlace && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <UsersIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Complet</span>
              </div>
            )}
          </div>
        </div>
  
        <CardBody className="flex-1 flex flex-col justify-between p-4">
          {/* Date et Heure */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-joinly_blue-principale" />
              <Typography className="text-sm">
                {event.formattedStartDate?.date || "Date non disponible"}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-joinly_blue-principale" />
              <Typography className="text-sm">
                {event.formattedStartDate?.time || "00:00"} - {event.formattedEndDate?.time || "00:00"}
              </Typography>
            </div>
          </div>
  
          {/* Titre et Description */}
          <div className="mb-4">
            <Typography variant="h5" className="font-bold mb-2 line-clamp-2">
              {event.name}
            </Typography>
            <Typography color="gray" className="text-sm mb-2">
              {event.city}
            </Typography>
          </div>
  
          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-gray-600" />
              <div>
                <Typography className="text-sm text-gray-600">
                  {event.participationCount || 0}/{event.numberPlace} places
                </Typography>
                <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      calculatePlacesPercentage(event) >= 90 
                        ? 'bg-red-500' 
                        : calculatePlacesPercentage(event) >= 70 
                          ? 'bg-orange-500' 
                          : 'bg-joinly_blue-principale'
                    }`}
                    style={{ width: `${calculatePlacesPercentage(event)}%` }}
                  />
                </div>
              </div>
            </div>
            <Link to={`/event/${event.id}`}>
              <Button 
                size="sm"
                className="bg-joinly_blue-principale hover:bg-joinly_blue-contraste"
              >
                Voir plus
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section des événements à venir */}
      <h1 className="text-2xl font-bold text-joinly_blue-contraste mb-6 text-center">
        ÉVÉNEMENTS À VENIR
      </h1>
      
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.map((event, index) => (
          <div
            ref={index === events.length - 1 ? lastEventElementRef : null}
            key={event.id}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {/* Section des événements passés */}
      {pastEvents.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-600 mt-16 mb-6 text-center">
            ÉVÉNEMENTS PASSÉS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div key={event.id}>
                <EventCard event={event} isPast={true} />
              </div>
            ))}
          </div>
        </>
      )}

      {loading && (
        <div className="flex justify-center mt-8">
          <Spinner className="h-8 w-8" />
        </div>
      )}
    </div>
  );
}
