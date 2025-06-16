import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Chip } from "@material-tailwind/react";
import { checkReservation } from '../../api/event';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    // ...autres propriétés de l'événement
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [hasParticipation, setHasParticipation] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkParticipationStatus = async () => {
      if (!isAuthenticated) return;
      
      try {
        const isReserved = await checkReservation(event.id);
        setHasParticipation(isReserved);
      } catch (error) {
        console.error("Erreur lors de la vérification de la participation:", error);
      }
    };

    checkParticipationStatus();
  }, [event.id, isAuthenticated]);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardBody className="space-y-4">
        {/* ...autres contenus de la carte... */}

        <div className="flex justify-between items-center mt-4">
          {hasParticipation ? (
            <Chip
              value="Déjà réservé"
              color="blue"
              className="normal-case"
              variant="ghost"
            />
          ) : (
            <Link to={`/event/${event.id}`}>
              <Button 
                size="sm"
                color="blue"
                variant="filled"
                className="normal-case"
              >
                Réserver
              </Button>
            </Link>
          )}
          
          <Link to={`/event/${event.id}`}>
            <Button 
              size="sm"
              variant="text"
              className="normal-case"
            >
              Voir plus
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default EventCard;
