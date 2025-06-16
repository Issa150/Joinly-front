// src/pages/ParticipantPage.tsx
import  { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { fetchParticipantRequests } from "../../api/participationApi";
import { ParticipantRequest } from "../../interface/ParticipationTypes";
import ParticipantCard from "../../components/participantCard/ParticipantCard2";

export default function ParticipantPage() {
  const [events, setEvents] = useState<ParticipantRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL"); 

  useEffect(():void => {
    const fetchEvents = async ():Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const fetchedEvents: ParticipantRequest[] = await fetchParticipantRequests();
        setEvents(fetchedEvents);
      } catch (err) {
        setError("Impossible de récupérer les événements.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <Typography className="text-center">Chargement...</Typography>;
  if (error) return <Typography className="text-center text-red-500">{error}</Typography>;

  // Filter events based on the active tab
  const filteredEvents = events.filter((event) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACCEPTED") return event.status === "ACCEPTED";
    if (activeTab === "REJECTED") return event.status === "REJECTED";
    if (activeTab === "PENDING") return event.status === "PENDING";
    return false;
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-8 mt-10 text-center text-joinly_blue-contraste">
        MES PARTICIPATIONS
      </h1>

      {/* Tab Buttons */}
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 mx-1 rounded ${activeTab === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("ALL")}>
          Tous
        </button>
        <button
          className={`px-4 py-2 mx-1 rounded ${activeTab === "ACCEPTED" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("ACCEPTED")}>
          Accepté
        </button>
        <button
          className={`px-4 py-2 mx-1 rounded ${activeTab === "REJECTED" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("REJECTED")}>
          Refusé
        </button>
        <button
          className={`px-4 py-2 mx-1 rounded ${activeTab === "PENDING" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("PENDING")}>
          En attente
        </button>
      </div>

      <div className="space-y-6 px-4 sm:px-6 mb-8">
        {filteredEvents.map((event) => (
          <ParticipantCard key={event.eventId} event={event} />
        ))}
      </div>
    </>
  );
}