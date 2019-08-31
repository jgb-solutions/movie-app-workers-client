import { useState, useEffect } from 'react';

function useMovies() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState(undefined)
  const [lastSearchTerm, setLastSearchTerm] = useState('')

  const fetchMovies = async () => {
    setIsLoading(true);
    if (searchTerm !== lastSearchTerm) {
      setPage(1);
      setMovies([]);
    }

    try {
      const response = await fetch(
        `https://movie-api-app.jgb.solutions/search/${searchTerm}?page=${page}`
      );
      const responseBody = await response.json();
      const movies = responseBody.Search;
      const totalResults = parseInt(responseBody.totalResults);
      setIsLoading(false);

      if (searchTerm === lastSearchTerm) {
        setMovies(prevMovies => [...prevMovies, ...movies]);
      } else {
        setMovies([...movies]);
        setLastSearchTerm(searchTerm);
      }

      if (totalResults - (page * 10) > 0) {
        setCanLoadMore(true);
        setPage(prevPage => prevPage + 1)
      } else {
        setCanLoadMore(false);
        setPage(1)
      }

      console.log('response', responseBody);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm)
      fetchMovies();
  }, [searchTerm]);

  return [
    movies,
    setSearchTerm,
    isLoading,
    canLoadMore,
    fetchMovies,
    lastSearchTerm,
    setMovies,
  ];
}

export default useMovies;