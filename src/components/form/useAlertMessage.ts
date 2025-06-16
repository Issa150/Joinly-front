import { useState } from "react";
import { AlertType } from "./AlertMessage";

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
    setAlertState((prev) => ({
      ...prev,
      show: false,
    }));

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