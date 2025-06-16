import { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteEvent, getMyEvents } from '../../api/event';
import { formatDateTime, isEventPassed } from '../../utils/dateUtils';
import { EventWithParticipations } from '../../interface/EventLoad';
import { AlertMessage, useAlertMessage } from '../../components/form/AlertMessage';
import EventStats from '../../components/event/EventStats';

const ITEMS_PER_PAGE = 9;

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventWithParticipations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { alertState, showSuccess, showError, hideAlert } = useAlertMessage();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    // Vérification des autorisations
    if (!isAuthenticated || (role !== 'ORGANIZER' && role !== 'ADMIN')) {
      navigate('/');
      return;
    }

    const loadMyEvents = async () => {
      try {
        setLoading(true);
        const response = await getMyEvents(1, ITEMS_PER_PAGE);
        
        const formattedEvents = response.events.map((event: EventWithParticipations) => ({
          ...event,
          formattedStartDate: formatDateTime(event.startDate),
          formattedEndDate: formatDateTime(event.endDate),
        }));

        setEvents(formattedEvents);
      } catch (error) {
        setError("Erreur lors du chargement de vos événements");
      } finally {
        setLoading(false);
      }
    };

    loadMyEvents();
  }, [isAuthenticated, role, navigate]);

  // Protection supplémentaire du rendu
  if (!isAuthenticated || (role !== 'ORGANIZER' && role !== 'ADMIN')) {
    return null; // Ou un composant de redirection/erreur
  }

  const handleDelete = async (eventId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        await deleteEvent(eventId);
        showSuccess("Événement supprimé avec succès");
        // Rafraîchir la liste des événements
        const updatedEvents = events.filter(event => event.id !== eventId);
        setEvents(updatedEvents);
      } catch (error) {
        showError("Erreur lors de la suppression de l'événement");
      }
    }
  };

  const handleCreateEvent = () => {
    navigate('/eventform');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AlertMessage {...alertState} onClose={hideAlert} />
      
      {/* Ajout des statistiques */}
      <div className="mb-8">
        <EventStats />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-joinly_blue-contraste">
          MES ÉVÉNEMENTS
        </h1>
        <Button 
          className="bg-joinly_blue-principale hover:bg-joinly_blue-contraste"
          onClick={handleCreateEvent}
        >
          Créer un événement
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card 
            key={event.id} 
            className={`hover:shadow-lg transition-shadow ${
              isEventPassed(event.endDate) ? 'opacity-75' : ''
            }`}
          >
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <Typography variant="h5" className="font-bold">
                    {event.name}
                  </Typography>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    event.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.isPublished ? 'Publié' : 'Brouillon'}
                  </div>
                </div>
                
                <Typography color="gray" className="text-sm">
                  {event.formattedStartDate.date} à {event.formattedStartDate.time}
                </Typography>

                <Typography className="line-clamp-2">
                  {event.description}
                </Typography>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Link to={`/event/edit/${event.id}`}>
                        <Button 
                          size="sm" 
                          className="flex items-center gap-2 bg-blue-gray-50 text-blue-gray-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Modifier
                        </Button>
                      </Link>
                      <Button 
                        size="sm"
                        color="red"
                        className="flex items-center gap-2"
                        onClick={() => handleDelete(event.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                    {isEventPassed(event.endDate) && (
                      <Typography className="text-sm text-gray-500">
                        Événement passé
                      </Typography>
                    )}
                  </div>
                  <Link to={`/event/${event.id}`}>
                    <Button 
                      size="sm"
                      className="bg-joinly_blue-principale hover:bg-joinly_blue-contraste"
                    >
                      Voir
                    </Button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <Spinner className="h-8 w-8" />
        </div>
      )}
    </div>
  );
}