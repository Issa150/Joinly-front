import { useState, useEffect } from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import {
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useApi } from "../../hooks/useApi";

interface EventStatistics {
  totalEvents: number;
  totalParticipants: number;
  activeEvents: number;
  averageFillRate: number; // Remplacer totalOrganizers par averageFillRate
}

export default function EventStats() {
  const [stats, setStats] = useState<EventStatistics>({
    totalEvents: 0,
    totalParticipants: 0,
    activeEvents: 0,
    averageFillRate: 0
  });

  const api = useApi();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/event/stats/general');
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      icon: CalendarIcon,
      title: "Total des événements",
      value: stats.totalEvents,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: UsersIcon,
      title: "Total des participants",
      value: stats.totalParticipants,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: ChartBarIcon,
      title: "Événements actifs",
      value: stats.activeEvents,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: ChartBarIcon,
      title: "Taux de remplissage",
      value: `${stats.averageFillRate}%`,  // Ajout du symbole %
      color: "text-amber-500",
      bgColor: "bg-amber-50"
    }
  ];

  return (
    <div className="mb-8">
      <Typography variant="h4" className="mb-4 text-joinly_blue-contraste">
        Statistiques Globales
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-4">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${item.bgColor}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                  <Typography className="text-gray-600 text-sm">
                    {item.title}
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {item.value}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}