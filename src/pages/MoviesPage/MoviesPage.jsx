import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import MovieList from "../../components/MovieList/MovieList";

const API_KEY = "3fa3075458c3b845bce5fb93c1046053";
const BASE_URL = "https://api.themoviedb.org/3";

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchQuery = searchParams.get("query") || "";

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a valid search term.");
      return;
    }

    setError(null);
    setSearchParams({ query: query.trim() });
  };

  return (
    <div>
      <h1>Search Movies</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter movie name"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div>Loading...</div>}

      {error && <div style={{ color: "red" }}>{error}</div>}

      {!loading && !error && <MovieList movies={movies} />}
    </div>
  );
};

export default MoviesPage;
