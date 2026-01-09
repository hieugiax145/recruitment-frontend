import { useEffect, useState } from "react";
import { employeeServices } from "../services/employeeServices";

export const useEmployeeReviews = (employeeId, params = {}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!employeeId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await employeeServices.getEmployeeReviews(
          employeeId,
          params
        );
        setReviews(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error("Error fetching employee reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [employeeId, params]);

  return { reviews, loading, error };
};
