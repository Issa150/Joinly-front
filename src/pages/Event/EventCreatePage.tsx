import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "../../components/form/EventForm";
import { useAuth } from "../../contexts/AuthContext";

export default function EventCreatePage() {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();

  useEffect(() => {
    // il faut que tu utilises les variable de authContext! comme "isAuthenticated"
    if (!isAuthenticated) {
      navigate("/signin"); // Redirect if not authenticated.
      return;
    }
    if (role === "PARTICIPANT") {
      navigate("/"); // Redirect if participant.
    }
  }, [role, navigate, isAuthenticated]);

  if (!isAuthenticated || role === "PARTICIPANT") {
    return null; // Prevent rendering if redirecting.
  }

  return <EventForm />;
}

