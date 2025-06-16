// src/components/ParticipantCard.tsx
import React from "react";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { ParticipantRequest } from "../../interface/ParticipationTypes";

interface ParticipantCardProps {
  event: ParticipantRequest;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ event }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500 text-white";
      case "REJECTED":
        return "bg-red-500 text-white";
      case "PENDING":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card
      key={event.eventId}
      color="transparent"
      shadow={false}
      className="w-full max-w-md mx-auto border border-gray-300 p-4"
    >
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="mx-0 flex items-center gap-4 pt-0 pb-2"
      >
        <div className="flex w-full flex-col gap-1">
          <Typography variant="h5" color="black" className="text-lg sm:text-xl">
            {event.eventName}
          </Typography>
          <Typography color="black" className="text-sm sm:text-base">
            {event.eventDescription}
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="p-3">
        <div
          className={`flex justify-center items-center border rounded-lg px-4 py-2 mb-2 font-semibold ${getStatusStyles(event.status)}`}
        >
          {event.status === "ACCEPTED"
            ? "Accepté"
            : event.status === "REJECTED"
            ? "Refusé"
            : "En attente"}
        </div>
      </CardBody>
    </Card>
  );
};

export default ParticipantCard;