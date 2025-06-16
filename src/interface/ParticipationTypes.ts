// src/interface/ParticipationTypes.ts
export interface ParticipationRequestsByOrganizer {
    organizerId: number;
    eventId: number;
    eventName: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    participantId: number;
    participantName: string;
}

export enum ParticipationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

export interface ParticipantRequest {
    eventId: number;
    eventName: string;
    eventDescription: string;
    status: string; // "ACCEPTED", "PENDING", "REJECTED"
    // reservationDate: string; // ISO string
}

export type DataProfileTabs ={
    label: string;
    value: string;
    component: JSX.Element;
    icon: JSX.Element;
}
export type DataProfileSettingTabs = {
    label: string;
    value: string;
    component: JSX.Element;
}