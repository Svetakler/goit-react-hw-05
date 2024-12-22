import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "3fa3075458c3b845bce5fb93c1046053";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieReviews = () => {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/movie/${movieId}/reviews`,
          {
            params: { api_key: API_KEY, language: "en-US" },
          }
        );
        setReviews(response.data.results);
      } catch (error) {
        setError("Failed to load reviews. Please try again later.");
      }
    };

    fetchReviews();
  }, [movieId]);

  if (error) return <div>{error}</div>;
  if (reviews.length === 0) return <div>No reviews available.</div>;
  return (
    <div>
      <h2>Reviews</h2>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <h3>Author: {review.author}</h3>
            <p>{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieReviews;
