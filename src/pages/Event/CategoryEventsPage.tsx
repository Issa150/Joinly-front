import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CategoryEventsPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) {
      navigate(`/search?categoryId=${categoryId}`);
    }
  }, [categoryId, navigate]);

  return null;
}
