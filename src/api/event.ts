import { useApi } from "../hooks/useApi";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../interface/EventLoad";

const api = useApi();

export const getEvents = async (page: number = 1, limit: number = 9) => {
  try {
    const response = await api.get(`/event`, {
      params: {
        page,
        limit,
      }
    });

    
    return {
      events: response.data,
      totalCount: response.headers['x-total-count'], // Si votre API fournit le total
      hasMore: response.data.length === limit
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    throw error;
  }
};

export async function getEventMedia(eventId: number) {
  try {
    const { data } = await api.get(`media/event/${eventId}`);
    
    // Vérifier si la réponse contient des médias et ajouter une URL complète pour chaque image
    const formattedMedia = data.map((media: any) => ({
      ...media,
      imageUrl: `http://localhost:3000/media/uploads/${media.img}`,
    }));

    return formattedMedia;
  } catch (error) {
    console.error("Erreur lors de la récupération des médias pour l'événement :", error);
    return {
      error: error
    };
  }
}

export async function searchEvents(params: {
  term?: string;
  city?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.term) searchParams.append('term', params.term);
    if (params.city) searchParams.append('city', params.city);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    const response = await api.get(`event/search?${searchParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche des événements:", error);
    throw error;
  }
}
  
export async function getEventById(id: number): Promise<Event | { error: any }> {
  try {
    const { data } = await api.get(`event/${id}`);
    console.log("Données brutes de l'API pour l'événement:", data);
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'événement ${id}:`, error);
    return {
      error:error
    };
  }
}

export async function createEvent(eventFormData: {
  name: string;
  description: string;
  categoryId: number;
  startDate: string;
  endDate: string;
  address: string;
  city: string;
  postalCode: string;
  budget: number;
  image: File | null;
  numberPlace: number;
}) {
  console.log("🚀 ~ Données envoyées pour création :", eventFormData);
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("Utilisateur non authentifié");
    }
    
    // Créer l'événement d'abord (sans l'image)
    const { data: createdEvent } = await api.post("event", {
      name: eventFormData.name,
      description: eventFormData.description,
      categoryId: eventFormData.categoryId,
      startDate: new Date(eventFormData.startDate).toISOString(),
      endDate: new Date(eventFormData.endDate).toISOString(),
      address: eventFormData.address,
      city: eventFormData.city,
      postalCode: eventFormData.postalCode,
      budget: eventFormData.budget,
      numberPlace: eventFormData.numberPlace,
      userId: user.id
    });
    
    // Si nous avons une image et que l'événement a été créé avec succès
    if (eventFormData.image && createdEvent.id) {
      // Télécharger l'image séparément
      const formData = new FormData();
      formData.append('file', eventFormData.image);
      formData.append('userId', user.id.toString());
      formData.append('eventId', createdEvent.id.toString());
      formData.append('type', 'EVENT_PHOTO');
      
      const { data: mediaData } = await api.post("media/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Retourner l'événement avec les informations du média
      return { ...createdEvent, media: mediaData };
    }
    
    return createdEvent;
  } catch (error) {
    console.log("🚀 ~ error:", error);
    console.error("Erreur lors de la création de l'événement:", error);
    return { error };
  }
}

// méthode pour récupérer les catégories
export async function getCategories() {
  try {
    const { data } = await api.get(`category`);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return {
      error: error
    };
  }
}

export async function getPersonalNote(eventId: number, userId: number) {
  try {
    const { data } = await api.get(`event/${eventId}/personal-note`, {
      params: { userId },
    });
    // Vérifiez si la note appartient à l'utilisateur connecté
    if (data.userId !== userId) {
      throw new Error("Vous n'avez pas accès à cette note.");
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la note personnelle:", error);
    return null;
  }
}

export async function savePersonalNote(eventId: number, userId: number, content: string) {
  try {
    const { data } = await api.post(`event/${eventId}/personal-note`, {
      userId,
      eventId,
      content,
    });
    return data;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la note personnelle:", error);
    return null;
  }
}

export async function updateEvent(eventId: number, eventData: FormData): Promise<Event | { error: any }> {
  try {
    const { data } = await api.patch(`event/edit/${eventId}`, eventData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data as Event;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    return { error };
  }
}


export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Aucun token trouvé, l'utilisateur n'est pas connecté.");
    }

    const decoded: DecodedToken = jwtDecode(token);
    
    const user = {
      id: decoded.sub, // Utilise sub comme ID
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
    };
    return user;
  } catch (error) {
    console.error("getCurrentUser : Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
}

export async function deleteEvent(id: number) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await api.delete(`event/${id}`);
    
    if (response.status === 204 || response.status === 200) {
      return { success: true };
    } else {
      throw new Error("Erreur lors de la suppression de l'événement");
    }
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    throw new Error(error.response?.data?.message || "Erreur lors de la suppression de l'événement");
  }
}

// Créer une réservation
export async function createReservation(eventId: number) {
  try {
    const response = await api.post('/participation/reserve', { eventId });
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erreur lors de la création de la réservation");
  }
}

export const getEventParticipationCount = async (eventId: number): Promise<number> => {
  try {
    const response = await api.get(`/event/${eventId}/participation-count`);
    // L'API renvoie { count: number }, donc on extrait la valeur count
    return response.data.count;
  } catch (error) {
    console.error(`Erreur lors du comptage des participations pour l'événement ${eventId}:`, error);
    return 0;
  }
};

export const getMyEvents = async (page: number = 1, limit: number = 9) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await api.get(`/event/user/${user.id}`, {
      params: {
        page,
        limit
      }
    });
    
    return {
      events: response.data.items || response.data, // Gérer les deux formats possibles de réponse
      total: response.data.total || response.data.length,
      hasMore: response.data.items 
        ? response.data.items.length === limit 
        : response.data.length === limit
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de mes événements:", error);
    throw error;
  }
};

export const getEventsByCategory = async (categoryId: number) => {
  try {
    const response = await api.get(`/event/category/${categoryId}`);
    console.log(`Événements trouvés pour la catégorie ${categoryId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des événements de la catégorie ${categoryId}:`, error);
    throw error;
  }
};

export const toggleEventPublishing = async (eventId: number, isPublished: boolean) => {
  try {
    const response = await api.patch(`/event/${eventId}/publishing`, { isPublished });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la modification du statut de publication:', error);
    throw error;
  }
};

export async function checkReservation(eventId: number) {
  try {
    const response = await api.get(`/participation/check/${eventId}`);
    return response.data.hasParticipation; // Au lieu de isReserved
  } catch (error) {
    console.error("Erreur lors de la vérification de la réservation:", error);
    return false;
  }
}

export const getGeneralStats = async () => {
  try {
    const response = await api.get('/event/stats/general');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};