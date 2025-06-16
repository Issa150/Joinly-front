// src/utils/dateUtils.ts
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Configuration des plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.locale('fr');

export const formatEventDate = (startDate: number, endDate: number) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  // Même jour
  if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
    return `${start.format('DD MMMM YYYY')} de ${start.format('HH:mm')} à ${end.format('HH:mm')}`;
  }
  
  // Même mois
  if (start.format('YYYY-MM') === end.format('YYYY-MM')) {
    return `Du ${start.format('DD')} au ${end.format('DD MMMM YYYY')}`;
  }
  
  // Différent mois
  return `Du ${start.format('DD MMMM')} au ${end.format('DD MMMM YYYY')}`;
};

// Ajout
export const formatShortEventDate = (startDate: number, endDate: number) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  // Même jour
  if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
    return start.format('DD MMM YYYY');
  }
  
  // Même mois
  if (start.format('YYYY-MM') === end.format('YYYY-MM')) {
    return `${start.format('DD')} - ${end.format('DD MMM YYYY')}`;
  }
  
  // Différents jours
  return `${start.format('DD MMM')} - ${end.format('DD MMM YYYY')}`;
};

export const getDuration = (startDate: number, endDate: number) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const durationInHours = end.diff(start, 'hour');
  
  if (durationInHours < 24) {
    return `${durationInHours}h`;
  }
  
  const days = Math.floor(durationInHours / 24);
  const hours = durationInHours % 24;
  
  if (hours === 0) {
    return `${days} jour${days > 1 ? 's' : ''}`;
  }
  
  return `${days} jour${days > 1 ? 's' : ''} et ${hours}h`;
};

export const calculateEventDuration = (startDate: Date | string, endDate: Date | string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffInMilliseconds = end.getTime() - start.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return `${Math.round(diffInHours)}h`;
  } else {
    const days = Math.floor(diffInHours / 24);
    const remainingHours = Math.round(diffInHours % 24);
    return remainingHours > 0 ? `${days}j ${remainingHours}h` : `${days}j`;
  }
};

export const formatDateTime = (date: string | number) => {
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

export const isEventPassed = (endDate: string | Date): boolean => {
  const eventEndDate = new Date(endDate);
  const now = new Date();
  return eventEndDate < now;
};