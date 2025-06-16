import { useState, useEffect } from "react";
import { Avatar, Card, CardBody, CardHeader, Typography, Button } from "@material-tailwind/react";
import { fetchOrganizerRequests, acceptParticipation, rejectParticipation, fetchFilteredHistoricalRequests } from "../../api/participationApi";
import { ParticipationRequestsByOrganizer, ParticipationStatus } from "../../interface/ParticipationTypes";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


export default function OrganizerPage() {
  const [pendingEvents, setPendingEvents] = useState<ParticipationRequestsByOrganizer[]>([]);
  const [historicalEvents, setHistoricalEvents] = useState<ParticipationRequestsByOrganizer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [historyStatusFilter, setHistoryStatusFilter] = useState<ParticipationStatus | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<ParticipationStatus | 'all' | undefined>('all');
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    // Redirect if the user is a participant
    if (role === "PARTICIPANT") {
      navigate("/");
      return; // Exit the useEffect early
    }

    const fetchAllData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const pending: ParticipationRequestsByOrganizer[] = await fetchOrganizerRequests();
        setPendingEvents(pending);
        const historical: ParticipationRequestsByOrganizer[] = await fetchFilteredHistoricalRequests(historyStatusFilter);
        setHistoricalEvents(historical);
      } catch (err: any) {
        if (err.status === 403) {
          setError('Unauthorized access!');
        } else {
          setError('Failed to fetch data!');
        }
      } finally {
        setLoading(false);
      }
    };



    fetchAllData();
  }, [historyStatusFilter]);

  const handleAccept = async (eventId: number, participantId: number): Promise<void> => {
    setActionLoading(participantId);
    setError(null);
    try {
      await acceptParticipation(eventId, participantId);
      const updatedPending = await fetchOrganizerRequests();
      setPendingEvents(updatedPending);
      const updatedHistory = await fetchFilteredHistoricalRequests(historyStatusFilter);
      setHistoricalEvents(updatedHistory);
    } catch (err) {
      setError('Failed to accept participation.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (eventId: number, participantId: number): Promise<void> => {
    setActionLoading(participantId);
    setError(null);
    try {
      await rejectParticipation(eventId, participantId);
      const updatedPending = await fetchOrganizerRequests();
      setPendingEvents(updatedPending);
      const updatedHistory = await fetchFilteredHistoricalRequests(historyStatusFilter);
      setHistoricalEvents(updatedHistory);
    } catch (err) {
      setError('Failed to reject participation.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500 text-white";
      case "REJECTED":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleHistoryFilterChange = (status: ParticipationStatus | undefined) => {
    setHistoryStatusFilter(status);
    setActiveFilter(status === undefined ? 'all' : status);
  };

  const getButtonClass = (filter: ParticipationStatus | 'all' | undefined) => {
    if (filter === activeFilter) {
      return 'bg-blue-500 text-white';
    }
    return '';
  };

  if (loading) return <Typography className="text-center">Loading...</Typography>;
  if (error) return <Typography className="text-center text-red-500">{error}</Typography>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 mt-8 text-center text-joinly_blue-contraste">
        GERER LES PARTICIPATIONS
      </h1>

      {/* Pending Requests Section */}
      <div className="space-y-4 px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-joinly_blue-contraste">
          En attente d'approbation
        </h2>
        {pendingEvents.length === 0 ? (
          <Typography className="text-center">Aucune demande en attente</Typography>
        ) : (
          pendingEvents.map((event, index) => (
            <Card key={index} color="transparent" shadow={false} className="w-full max-w-sm sm:max-w-md mx-auto border border-gray-300 p-4">
              <CardHeader color="transparent" floated={false} shadow={false} className="flex items-center gap-4 pt-0 pb-2">
                <Avatar size="lg" variant="square" src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80" alt={`${event.eventName}-image`} />
                <div className="flex w-full flex-col gap-1">
                  <Typography variant="h5" color="black" className="text-lg font-bold">{event.participantName}</Typography>
                  <Typography color="black" className="text-sm">{event.eventName}</Typography>
                </div>
              </CardHeader>
              <CardBody className="p-3">
                <div className="flex justify-around mt-4">
                  <Button size="sm" className={`px-6 py-2 rounded-lg font-semibold ${getStatusStyles("ACCEPTED")}`} onClick={() => handleAccept(event.eventId, event.participantId)} disabled={actionLoading === event.participantId}>
                    {actionLoading === event.participantId ? 'Accepting...' : 'Accepter'}
                  </Button>
                  <Button size="sm" className={`px-6 py-2 rounded-lg font-semibold ${getStatusStyles("REJECTED")}`} onClick={() => handleReject(event.eventId, event.participantId)} disabled={actionLoading === event.participantId}>
                    {actionLoading === event.participantId ? 'Rejecting...' : 'Refuser'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Historical Requests Section */}
      <div className="space-y-4 px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-joinly_blue-contraste">
          Approbations effectuées
        </h2>
        <div className="flex justify-center gap-4 mb-4">
          <Button type="button" size="sm" className={`bg-gray-600 ${getButtonClass('all')}`} onClick={() => handleHistoryFilterChange(undefined)}>Tous</Button>
          <Button type="button" size="sm" className={`bg-gray-600 ${getButtonClass(ParticipationStatus.ACCEPTED)}`} onClick={() => handleHistoryFilterChange(ParticipationStatus.ACCEPTED)}>Acceptés</Button>
          <Button type="button" size="sm" className={`bg-gray-600 ${getButtonClass(ParticipationStatus.REJECTED)}`} onClick={() => handleHistoryFilterChange(ParticipationStatus.REJECTED)}>Refusés</Button>
        </div>
        {historicalEvents.length === 0 ? (
          <Typography className="text-center">Aucune approbation effectuée</Typography>
        ) : (
          historicalEvents.map((event, index) => (
            <Card key={index} color="transparent" shadow={false} className="w-full max-w-sm sm:max-w-md mx-auto border border-gray-300 p-4">
              <CardHeader color="transparent" floated={false} shadow={false} className="flex items-center gap-4 pt-0 pb-2">
                <Avatar size="lg" variant="square" src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80" alt={`${event.eventName}-image`} />
                <div className="flex w-full flex-col gap-1">
                  <Typography variant="h5" color="black" className="text-lg font-bold">{event.participantName}</Typography>
                  <Typography color="black" className="text-sm">{event.eventName}</Typography>
                </div>
              </CardHeader>
              <CardBody className="p-3">
                <div className={`flex justify-center items-center border rounded-lg px-4 py-2 mb-2 font-semibold ${getStatusStyles(event.status)}`}>
                  {event.status === "ACCEPTED" ? "Accepté" : "Refusé"}
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </>
  );
}