import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "3fa3075458c3b845bce5fb93c1046053";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, creditsRes, reviewsRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: { api_key: API_KEY, language: "en-US" },
          }),
          axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
            params: { api_key: API_KEY, language: "en-US" },
          }),
          axios.get(`${BASE_URL}/movie/${movieId}/reviews`, {
            params: { api_key: API_KEY, language: "en-US" },
          }),
        ]);

        setMovie(movieRes.data);
        setCredits(creditsRes.data.cast);
        setReviews(reviewsRes.data.results);
      } catch (error) {
        setError("Failed to load movie details. Please try again later.");
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const goBack = () => {
    navigate(-1);
  };

  const toggleSection = (section) => {
    setActiveSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  if (error) return <div>{error}</div>;
  if (!movie) return <div>Loading...</div>;

  return (
    <div className="container">
      <button onClick={goBack}>&lt; Go Back</button>

      <div className="movie-details">
        <img
          className="movie-poster"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
              : "path/to/default-image.jpg"
          }
          alt={movie.title}
        />
        <div className="movie-info">
          <h1>
            {movie.title} ({movie.release_date?.split("-")[0]})
          </h1>
          <p>
            <strong>User Score:</strong> {Math.round(movie.vote_average * 10)}%
          </p>
          <p>
            <strong>Overview:</strong> {movie.overview}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres.map((g) => g.name).join(", ")}
          </p>
        </div>
      </div>

      <div className="additional-info">
        <h2>Additional information</h2>
        <button onClick={() => toggleSection("cast")}>
          {activeSection === "cast" ? "Hide Cast" : "Show Cast"}
        </button>
        <button onClick={() => toggleSection("reviews")}>
          {activeSection === "reviews" ? "Hide Reviews" : "Show Reviews"}
        </button>
      </div>

      {activeSection === "cast" && credits.length > 0 && (
        <div id="cast" className="cast-list">
          <h2>Cast</h2>
          {credits.slice(0, 10).map((actor) => (
            <div key={actor.cast_id} className="cast-item">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}`
                    : "path/to/default-avatar.jpg"
                }
                alt={actor.name}
              />
              <p>
                <strong>{actor.name}</strong>
              </p>
              <p>Character: {actor.character}</p>
            </div>
          ))}
        </div>
      )}

      {activeSection === "reviews" && reviews.length > 0 && (
        <div id="reviews">
          <h2>Reviews</h2>
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <h3>Author: {review.author}</h3>
              <p>{review.content}</p>
            </div>
          ))}
        </div>
      )}

      {activeSection === "reviews" && reviews.length === 0 && (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

export default MovieDetailsPage;
