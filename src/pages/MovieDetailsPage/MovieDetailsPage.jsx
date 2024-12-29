import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./MovieDetailsPage.module.css";

const API_KEY = "3fa3075458c3b845bce5fb93c1046053";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const backLocationRef = useRef(location.state?.from || "/");

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const castRef = useRef(null);
  const reviewsRef = useRef(null);

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

  useEffect(() => {
    if (activeSection === "cast" && castRef.current) {
      castRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (activeSection === "reviews" && reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSection]);

  const goBack = () => {
    navigate(backLocationRef.current);
  };

  const toggleSection = (section) => {
    setActiveSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  if (error) return <div>{error}</div>;
  if (!movie) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <button onClick={goBack} className={styles.goBack}>
        &lt; Go Back
      </button>

      <div className={styles.movieDetails}>
        <img
          className={styles.moviePoster}
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
              : "path/to/default-image.jpg"
          }
          alt={movie.title}
        />
        <div className={styles.movieInfo}>
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

      <div className={styles.additionalInfo}>
        <h2>Additional information</h2>
        <Link
          to="#cast"
          className={styles.link}
          onClick={() => toggleSection("cast")}
        >
          {activeSection === "cast" ? "Hide Cast" : "Show Cast"}
        </Link>
        <Link
          to="#reviews"
          className={styles.link}
          onClick={() => toggleSection("reviews")}
        >
          {activeSection === "reviews" ? "Hide Reviews" : "Show Reviews"}
        </Link>
      </div>

      {activeSection === "cast" && credits.length > 0 && (
        <div id="cast" ref={castRef} className={styles.castList}>
          <h2>Cast</h2>
          {credits.slice(0, 10).map((actor) => (
            <div key={actor.cast_id} className={styles.castItem}>
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
        <div id="reviews" ref={reviewsRef} className={styles.reviewsList}>
          <h2>Reviews</h2>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewItem}>
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
