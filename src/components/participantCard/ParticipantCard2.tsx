// src/components/ParticipantCard.tsx
import React from "react";
import { Card,  CardHeader, Typography } from "@material-tailwind/react";
import { ParticipantRequest } from "../../interface/ParticipationTypes";
import { CheckIcon, XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";

interface ParticipantCardProps {
  event: ParticipantRequest;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ event }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-200 text-green-800 border border-green-400";
      case "REJECTED":
        return "bg-red-200 text-red-800 border border-red-400";
      case "PENDING":
        return "bg-yellow-200 text-orange-800 border border-yellow-400";
      default:
        return "bg-gray-200 text-gray-800 border border-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckIcon className="h-5 w-5 mr-1" />;
      case "REJECTED":
        return <XMarkIcon className="h-5 w-5 mr-1" />;
      case "PENDING":
        return <ClockIcon className="h-5 w-5 mr-1" />;
      default:
        return null;
    }
  };

  const statusText = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "Accepté";
      case "REJECTED":
        return "Refusé";
      case "PENDING":
        return "En attente";
      default:
        return "";
    }
  };

  return (
    <Card
      key={event.eventId}
      color="transparent"
      shadow={false}
      className={`w-full max-w-md mx-auto border border-gray-200 rounded-md p-4 shadow-md ${getStatusStyles(
        event.status
      )}`}
    >
      <div className={`flex items-center justify-center rounded-md text-lg font-semibold px-2 py-1 mt-1`}>
        {getStatusIcon(event.status)}
        {statusText(event.status)}
      </div>
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className={`mx-0 flex flex-col items-start pt-0 pb-2 `}
      >
        
        <Typography variant="h5" color="black" className="text-lg sm:text-xl">
          {event.eventName}
        </Typography>
        
        <Typography color="gray" className="text-sm sm:text-base mt-1">
          {event.eventDescription}
        </Typography>
      </CardHeader>
      {/* <CardBody className="p-3"></CardBody> */}
    </Card>
  );
};

export default ParticipantCard;