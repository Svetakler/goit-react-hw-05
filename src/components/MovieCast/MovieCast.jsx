import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "3fa3075458c3b845bce5fb93c1046053";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieCast = () => {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/movie/${movieId}/credits`,
          {
            params: { api_key: API_KEY, language: "en-US" },
          }
        );
        setCast(response.data.cast);
      } catch (error) {
        setError("Failed to load cast details. Please try again later.");
      }
    };

    fetchCast();
  }, [movieId]);

  if (error) return <div>{error}</div>;
  if (cast.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h2>Cast</h2>
      <div className="cast-list">
        {cast.map((actor) => (
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
    </div>
  );
};

export default MovieCast;
