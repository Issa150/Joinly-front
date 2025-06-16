/* export interface resultInterface {
    id: number;
    name: string;
    description: string;
    date: string;
    city: string;
    startDate: number;
    endDate: number;
    formattedDateRange?: string;
    media?: { imageUrl: string }[];
} */

export interface resultInterface {
    id: number;
    name: string;
    description: string;
    date: string;
    address: string;
    postalCode: number;
    city: string;
    startDate: number;
    endDate: number;
    formattedDateRange?: string;
    budget: number;
    numberPlace: number;
    media?: { 
        id: number;
        img: string;
        createdAt: string;
        updatedAt: string;
        userId: number;
        eventId: number;
        type: string;
        imageUrl: string;
    }[];
}

export interface EventDetailInterface {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  address: string;
  postalCode: string;
  city: string;
  budget: number;
  numberPlace: number;
  userId: number;
  categories: Array<{ id: number; name: string }>;
  media: Array<{ img: string }>;
  participationCount: number;
  isPublished: boolean;
}

export interface Event {
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
  participationCount?: number;
  isPublished: boolean;
  error?: any;
}

/* export interface Category {
    id: number;
    name: string;
} */

export interface DecodedToken {
    sub: number;
    role: string;
    iat: number;
    exp: number;
}

export interface EventWithParticipations {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    numberPlace: number;
    participationCount: number;
    formattedStartDate: { date: string; time: string };
    formattedEndDate: { date: string; time: string };
    isPublished: boolean;
    media?: Array<{ imageUrl: string }>;
}
