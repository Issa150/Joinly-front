import React, { useState, useEffect } from "react";
import { Alert, Typography, IconButton } from "@material-tailwind/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type AlertType = "success" | "warning" | "error" | "info";

export interface AlertMessageProps {
  message: string;
  type?: AlertType;
  duration?: number;
  show: boolean;
  onClose?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type = "success",
  duration = 30000,
  show,
  onClose = () => {},
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(show);

  useEffect(() => {
    setIsVisible(show);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (show && duration > 0) {
      timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  const getAlertConfig = () => {
    switch (type) {
      case "success":
        return {
          color: "green",
          icon: <CheckCircleIcon className="h-6 w-6" />,
          title: "Succès !",
        };
      case "warning":
        return {
          color: "amber",
          icon: <ExclamationTriangleIcon className="h-6 w-6" />,
          title: "Attention",
        };
      case "error":
        return {
          color: "red",
          icon: <XCircleIcon className="h-6 w-6" />,
          title: "Erreur",
        };
      case "info":
        return {
          color: "blue",
          icon: <InformationCircleIcon className="h-6 w-6" />,
          title: "Information",
        };
      default:
        return {
          color: "green",
          icon: <CheckCircleIcon className="h-6 w-6" />,
          title: "Succès !",
        };
    }
  };

  const { color, icon, title } = getAlertConfig();

  return (
    <div
      className={`
      fixed top-4 right-4 z-50 max-w-screen-md 
      transition-all duration-500 transform
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
    `}
    >
      <Alert
        variant="gradient"
        color={color as any}
        icon={icon}
        open={isVisible}
        animate={{
          mount: { opacity: 1, y: 0 },
          unmount: { opacity: 0, y: -10 },
        }}
        className="rounded-lg border border-blue-gray-50 shadow-lg backdrop-blur-sm"
        action={
          <IconButton
            variant="text"
            color="white"
            size="sm"
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="hover:bg-white/10 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        }
      >
        <div className="flex flex-col gap-0.5">
          <Typography color="white" className="font-bold">
            {title}
          </Typography>
          <Typography color="white" className="font-normal text-sm">
            {message}
          </Typography>
        </div>
      </Alert>
    </div>
  );
};

// Hook personnalisé pour faciliter l'utilisation
export const useAlertMessage = () => {
  const [alertState, setAlertState] = useState<{
    message: string;
    type: AlertType;
    show: boolean;
    duration: number;
  }>({
    message: "",
    type: "success",
    show: false,
    duration: 20000,
  });

  const showAlert = (
    message: string,
    type: AlertType = "success",
    duration: number = 20000
  ) => {
    // Fermer l'alerte précédente si elle existe
    setAlertState((prev) => ({
      ...prev,
      show: false,
    }));

    // Petit délai avant d'afficher la nouvelle alerte
    setTimeout(() => {
      setAlertState({
        message,
        type,
        show: true,
        duration,
      });
    }, 100);
  };

  const hideAlert = () => {
    setAlertState((prev) => ({
      ...prev,
      show: false,
    }));
  };

  const showSuccess = (message: string, duration?: number) =>
    showAlert(message, "success", duration);

  const showError = (message: string, duration?: number) =>
    showAlert(message, "error", duration);

  const showWarning = (message: string, duration?: number) =>
    showAlert(message, "warning", duration);

  const showInfo = (message: string, duration?: number) =>
    showAlert(message, "info", duration);

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
