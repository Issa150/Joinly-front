import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography, Button, Textarea, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, BanknotesIcon, TagIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { getEventById, getPersonalNote, savePersonalNote, deleteEvent, createReservation, getEventMedia, getCurrentUser, checkReservation} from "../../api/event";
import { AlertMessage, useAlertMessage } from "../form/AlertMessage";
import { useAuth } from "../../contexts/AuthContext";
import { isEventPassed } from "../../utils/dateUtils";

interface Event {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  address: string;
  city: string;
  postalCode: string;
  budget: number;
  numberPlace: number;
  userId: number;
  categories: Array<{ id: number; name: string }>;
  media: Array<{ img: string }>;
  participationCount: number;
  isPublished: boolean;
}

interface EventDetailInterface extends Event {}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetailInterface | null>(null);
  const [personalNote, setPersonalNote] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null); // Initialisé à null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [reservationStatus] = useState<string | null>(null);
  const [media, setMedia] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  const { alertState, showSuccess, showError, hideAlert } = useAlertMessage();
  const { role, isAuthenticated } = useAuth(); // Utiliser useAuth pour obtenir les informations de l'utilisateur

  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
      }
      console.log("Utilisateur connecté:", user); // Log pour le débogage
    }
    if (isAuthenticated) {
      loadCurrentUser();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    async function loadEvent() {
      try {
        if (!id) {
          setError("ID de l'événement manquant");
          setLoading(false);
          return;
        }

        const eventData = await getEventById(Number(id)) as unknown as EventDetailInterface;
        if ('error' in eventData) {
          throw new Error("Erreur lors du chargement de l'événement");
        }
        
        setEvent(eventData);

        if (eventData.startDate && eventData.endDate) {
          const start = new Date(eventData.startDate);
          const end = new Date(eventData.endDate);

          const formatDate = (date: Date) =>
            date.toLocaleDateString("fr-FR", { timeZone: "UTC" });

          const formatHour = (date: Date) =>
            date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });

          setFormattedDate(`du ${formatDate(start)} au ${formatDate(end)}`);
          setDuration(`de ${formatHour(start)} à ${formatHour(end)}`);
        }

        const mediaData = await getEventMedia(Number(id));
        console.log("Données média récupérées:", mediaData);

        if (mediaData && mediaData.length > 0) {
          const mediaUrl = `http://localhost:3000/media/uploads/${mediaData[0].img}`;
          console.log("URL de l'image construite:", mediaUrl);
          setMedia(mediaUrl);
        } else {
          console.log("Aucun média trouvé pour cet événement");
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement de l'événement");
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  useEffect(() => {
    async function fetchPersonalNote() {
      if (!id || !userId) return;
      try {
        const note = await getPersonalNote(Number(id), userId);
        if (note) setPersonalNote(note.content);
      } catch (error) {
        console.error("Erreur lors de la récupération de la note personnelle:", error);
        showError("Vous n'avez pas accès à cette note.");
      }
    }
    fetchPersonalNote();
  }, [id, userId]);

  useEffect(() => {
    const checkUserReservation = async () => {
      if (!isAuthenticated || !id) return;
      
      try {
        const hasReserved = await checkReservation(Number(id));
        setIsReserved(hasReserved);
      } catch (error) {
        console.error("Erreur lors de la vérification de la réservation:", error);
      }
    };

    checkUserReservation();
  }, [id, isAuthenticated]);

  const handleSaveNote = async () => {
    if (!id || !userId) return;
    try {
      console.log("Enregistrement de la note pour l'utilisateur:", userId); // Log pour le débogage
      const updatedNote = await savePersonalNote(Number(id), userId, personalNote);
      if (updatedNote) {
        showSuccess("Note enregistrée avec succès !");
      } else {
        showError("Erreur lors de l'enregistrement !");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la note:", error);
      showError("Erreur lors de l'enregistrement de la note.");
    }
  };

  const handleEdit = () => {
    navigate(`/event/edit/${id}`);
  };

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteEvent(Number(id));
      showSuccess("Événement supprimé avec succès !");
      setOpenDialog(false);
      navigate("/event");
    } catch (error: any) {
      console.error("Erreur lors de la suppression :", error);
      showError(error.message || "Erreur lors de la suppression de l'événement");
    } finally {
      setLoading(false);
    }
  };

  const canEditOrDelete = () => {
    if (!event || !userId) return false;

    // L'administrateur ou l'organisateur peut toujours modifier/supprimer
    const isAdmin = role === 'ADMIN';
    const isOwner = role === 'ORGANIZER' && userId === event.userId;

    return isAdmin || isOwner;
  };

  if (loading) {
    return <p className="text-center">Chargement...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!event) {
    return <p className="text-center text-red-500">Événement introuvable.</p>;
  }

  const handleReservation = async () => {
    if (!isAuthenticated) {
      navigate('/signin', { 
        state: { 
          redirectTo: `/event/${id}`,
          message: "Veuillez vous connecter pour réserver cet événement"
        } 
      });
      return;
    }

    try {
      await createReservation(Number(id));
      showSuccess("Réservation effectuée avec succès !");
      setIsReserved(true);
    } catch (error: any) {
      if (error.response?.status === 400) {
        showError(error.response.data.message || "Erreur lors de la réservation");
      } else {
        showError("Une erreur est survenue lors de la réservation");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AlertMessage {...alertState} onClose={hideAlert} />
      <h1 className="text-2xl font-bold text-joinly_blue-contraste mb-6 text-center">
        DETAIL DE L'EVENEMENT
      </h1>
      <Card className="max-w-full md:max-w-md lg:max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {media ? (
          <img
            src={media}
            alt="event-image"
            className="w-full h-56 object-cover sm:h-64 md:h-72 lg:h-96"
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            alt="default-event-image"
            className="w-full h-56 object-cover sm:h-64 md:h-72 lg:h-96"
          />
        )}
        <div className="p-4">
          <Typography variant="h5" color="black" className="font-bold mb-2 text-center">
            {event.name || "Sans titre"}
          </Typography>
          <Typography color="gray" className="mb-4 text-center">
            {event.description || "Aucune description disponible"}
          </Typography>
          <div className="bg-gray-100 p-4 rounded-lg space-y-3">
            <Typography color="black" className="font-bold mb-2">Informations de l'événement</Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <TagIcon className="h-5 w-5 text-joinly_blue-principale" />
                <Typography className="text-sm">
                  <span className="font-medium">Catégories : </span>
                  {Array.isArray(event.categories) && event.categories.length > 0
                    ? event.categories.map(cat => cat.name || "Non spécifié").join(", ")
                    : "Non spécifié"}
                </Typography>
              </div>

              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-joinly_blue-principale" />
                <Typography className="text-sm">
                  <span className="font-medium">Date : </span>
                  {formattedDate}
                </Typography>
              </div>

              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-joinly_blue-principale" />
                <Typography className="text-sm">
                  <span className="font-medium">Durée : </span>
                  {duration}
                </Typography>
              </div>

              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-joinly_blue-principale" />
                <Typography className="text-sm">
                  <span className="font-medium">Adresse : </span>
                  {event.address}
                </Typography>
              </div>

              <div className="flex items-center space-x-2">
                <BuildingOfficeIcon className="h-5 w-5 text-joinly_blue-principale" />
                <Typography className="text-sm">
                  <span className="font-medium">Ville : </span>
                  {event.city} ({event.postalCode})
                </Typography>
              </div>

              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-5 w-5 text-joinly_blue-principale" />
                <Typography className="text-sm">
                  <span className="font-medium">Places : </span>
                  {event.numberPlace}
                </Typography>
              </div>

              <div className="flex items-center space-x-2">
                <BanknotesIcon className="h-5 w-5 text-joinly_blue-principale" />
                <Typography className="text-sm">
                  <span className="font-medium">Prix : </span>
                  {event.budget}€
                </Typography>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {!reservationStatus ? (
              <Button
                onClick={handleReservation}
                disabled={isReserved || (event.participationCount ?? 0) >= event.numberPlace}
                className={`w-full mt-4 ${
                  isReserved 
                    ? 'bg-green-500'
                    : (event.participationCount ?? 0) >= event.numberPlace
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-joinly_blue-principale hover:bg-joinly_blue-contraste'
                }`}
              >
                {isReserved 
                  ? 'Déjà réservé'
                  : (event.participationCount ?? 0) >= event.numberPlace
                    ? 'Complet'
                    : isAuthenticated
                      ? 'Réserver'
                      : 'Se connecter pour réserver'
                }
              </Button>
            ) : (
              <div className="bg-gray-50 p-3 rounded-md border">
                <Typography className={`font-medium ${
                  reservationStatus === 'PENDING' ? 'text-yellow-500' :
                  reservationStatus === 'APPROVED' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {reservationStatus === 'PENDING' ? 'Votre demande est en attente d\'approbation' :
                    reservationStatus === 'APPROVED' ? 'Votre réservation a été approuvée' :
                    'Votre demande a été rejetée'}
                </Typography>
              </div>
            )}
            {canEditOrDelete() && (
              <div className="flex gap-2 mt-2">
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                  onClick={handleEdit}
                >
                  Modifier
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Supprimer
                </Button>
              </div>
            )}
            {isEventPassed(event.endDate) && (
              <Typography color="gray" className="text-sm text-center mt-2">
                Cet événement est passé
              </Typography>
            )}
            {isAuthenticated ? (
              <div className="mt-6 space-y-2">
                <Typography variant="h6" className="font-medium">
                  Note personnelle
                </Typography>
                <Textarea
                  label="Ajoutez une note personnelle"
                  className="resize-none border-gray-300 rounded-md"
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Écrivez vos notes personnelles ici..."
                />
                <Button
                  className="bg-gray-500 text-white w-full py-2 rounded-md hover:bg-gray-600"
                  onClick={handleSaveNote}
                >
                  Sauvegarder la note
                </Button>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <Typography className="text-center text-joinly_blue-principale">
                  Connectez-vous pour ajouter une note personnelle
                </Typography>
              </div>
            )}
          </div>
        </div>
      </Card>
      <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
        <DialogHeader className="text-joinly_blue-principale">Confirmer la suppression</DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <Typography color="red" variant="h5">
            Êtes-vous sûr de vouloir supprimer cet événement ?
          </Typography>
          <Typography color="gray" className="text-center font-normal">
            Cette action est irréversible. L'événement et toutes les données associées seront définitivement supprimés.
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button 
            variant="text" 
            color="gray" 
            onClick={() => setOpenDialog(false)}
            className="mr-1"
          >
            Annuler
          </Button>
          <Button 
            variant="gradient" 
            color="red" 
            onClick={confirmDelete}
            className="flex items-center gap-2"
          >
            Confirmer la suppression
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
