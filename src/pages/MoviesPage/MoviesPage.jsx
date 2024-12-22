import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_KEY = "3fa3075458c3b845bce5fb93c1046053";
const BASE_URL = "https://api.themoviedb.org/3";

const MoviesPage = () => {
  const [query, setQuery] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchQuery = query.get("query") || "";

  useEffect(() => {
    if (!searchQuery) return;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
          params: {
            api_key: API_KEY,
            query: searchQuery,
            language: "en-US",
          },
        });

        const results = response.data.results;

        if (results.length === 0) {
          setError("No movies found for your search. Please try again.");
        } else {
          setMovies(results);
        }
      } catch (err) {
        console.error("Error searching movies:", err);
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a valid search term.");
      return;
    }

    setError(null);
    setQuery({ query: searchQuery.trim() });
  };

  return (
    <div>
      <h1>Search Movies</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setQuery({ query: e.target.value })}
        placeholder="Enter movie name"
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <div>Loading...</div>}

      {error && <div style={{ color: "red" }}>{error}</div>}

      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>
              <h2>{movie.title}</h2>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                  alt={movie.title}
                  width={100}
                />
              )}
            </Link>
            <p>Release Date: {movie.release_date || "N/A"}</p>
            <p>Rating: {movie.vote_average || "N/A"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoviesPage;
