import React, { useRef, useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  MusicalNoteIcon,
  SparklesIcon,
  UserGroupIcon,
  WrenchIcon,
  TableCellsIcon,
  UsersIcon,
  TvIcon,
  TrophyIcon,
  FaceSmileIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

interface EventCategory {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

interface EventCategoriesProps {
  categories: EventCategory[];
  onCategoryClick: (categoryId: number) => void; // Ajout d'une fonction de gestion des clics
}

const EventCategories: React.FC<EventCategoriesProps> = ({ categories }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category/${categoryId}`); // Redirection vers la page de la catégorie
  };

  const categoryIcons: { [key: number]: React.ReactNode } = {
    1: <MusicalNoteIcon className="h-8 w-8 text-blue-500" />,     // no
    2: <SparklesIcon className="h-8 w-8 text-green-500" />,       // no
    3: <UserGroupIcon className="h-8 w-8 text-red-500" />,        // no
    4: <WrenchIcon className="h-8 w-8 text-deep-orange-500" />,   // no
    5: <TableCellsIcon className="h-8 w-8 text-amber-500" />,     // yes
    6: <UsersIcon className="h-8 w-8 text-teal-500" />,           // yes
    7: <AcademicCapIcon className="h-8 w-8 text-indigo-500" />,   // yes
    8: <TvIcon className="h-8 w-8 text-pink-500" />,              // yes
    9: <TrophyIcon className="h-8 w-8 text-teal-500" />,          // yes
    10: <FaceSmileIcon className="h-8 w-8 text-blue-gray-500" />, // yes
  };

  return (
    <div className="relative max-w-screen-xl mx-auto px-4">
      {showLeftButton && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 hover:bg-gray-100 transition-all duration-200"
          onClick={() => handleScroll('left')}
          aria-label="Défiler vers la gauche"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-500" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto flex space-x-4 py-4 px-2 scrollbar-hide scroll-smooth"
        onScroll={checkScroll}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card cursor-pointer border rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 flex flex-col items-center min-w-[120px] hover:scale-105"
            onClick={() => handleCategoryClick(category.id)}
          >
            {categoryIcons[category.id] || (
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            )}
            <h3 className="text-sm font-semibold mt-2 text-center">{category.name}</h3>
          </div>
        ))}
      </div>

      {showRightButton && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 hover:bg-gray-100 transition-all duration-200"
          onClick={() => handleScroll('right')}
          aria-label="Défiler vers la droite"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default EventCategories;
