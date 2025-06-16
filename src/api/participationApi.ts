// src/api/participationApi.ts
import { useApi } from '../hooks/useApi';
import { ParticipantRequest, ParticipationRequestsByOrganizer, ParticipationStatus } from '../interface/ParticipationTypes';

export const fetchOrganizerRequests = async (): Promise<ParticipationRequestsByOrganizer[]> => {
    const api = useApi();

    const response = await api.get<ParticipationRequestsByOrganizer[]>('/participation/my-events-requests');
    return response.data;
};

export const acceptParticipation = async (eventId: number, participantId: number): Promise<void> => {
    const api = useApi();
    await api.patch('/participation/accept', {
        eventId: eventId,
        participantId: participantId,
    });
};

export const rejectParticipation = async (eventId: number, participantId: number): Promise<void> => {
    const api = useApi();
    await api.patch('/participation/reject', {
        eventId: eventId,
        participantId: participantId,
    });
};

export const fetchFilteredHistoricalRequests = async (status?: ParticipationStatus): Promise<ParticipationRequestsByOrganizer[]> => {
    const api = useApi();
    const params = status ? { status } : {}; // Create params object if status is defined
    const response = await api.get<ParticipationRequestsByOrganizer[]>('/participation/organizer/history/filtered', { params });
    return response.data;
};

export const fetchParticipantRequests = async (): Promise<ParticipantRequest[]> => {
    const api = useApi();
    const response = await api.get<ParticipantRequest[]>('/participation/my-requests');
    return response.data;
};