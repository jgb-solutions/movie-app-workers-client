import React from 'react';
import { get } from 'lodash';

import useMovies from './useMovies';
import logo from './logo.svg';

let debounceSearch;

function MovieList() {
  const [
    movies,
    setSearchTerm,
    isLoading,
    canLoadMore,
    fetchMovies,
    lastSearchTerm,
    setMovies,
  ] = useMovies()

  const handleSearch = event => {
    const searchTerm = event.target.value.trim();

    if (searchTerm.length > 2) {
      clearTimeout(debounceSearch)
      // do search
      debounceSearch = setTimeout(() => {
        setSearchTerm(searchTerm);
      }, 500);
    } else {
      setMovies([]);
    }
  }

  return (
      <div className="col-sm-8 offset-sm-2">
        <header>
          <h1>
            <img src={logo} alt='Movie App Workers' className='logo' f/>
            Movie App
          </h1>
        </header>
        <form>
          <div className="input-group">
            <input type="text"
              className="form-control"
              placeholder="Search any movie, series or TV Shows"
              onChange={handleSearch}
            />
          </div>
        </form>
        <br />
        {isLoading && <h2>Search Loading...</h2>}
        <div className="row">
          {movies.length ? (
            movies.map(movie => {
              const title = get(movie, 'Title', `No Title`);
              const movieId = get(movie, 'imdbID')
              let poster = get(movie, 'Poster');
              if (!poster || poster === 'N/A') {
                poster = `https://dummyimage.com/300x448/2c96c7/ffffff.png&text=No+Image`;
              }
              const type = get(movie, 'Type', `undefined`);
              const year = get(movie, 'Year', `undefined`);

              return (
                <div key={movieId} className="col-sm-6 mb-3">
                  <div className="row">
                    <div className="col-7">
                      <img src={poster} alt={title} className='img-fluid' />
                    </div>
                    <div className="col-5">
                      <h3 className='movie-title'>{title}</h3>
                      <p>Type: {type}.<br /> Year: {year}</p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : lastSearchTerm.length > 2 ? <div className="col-12"><h2>No Movies Found</h2></div> : null}
        </div>
        {!!movies.length && canLoadMore && (
          <button
            className='btn btn-primary btn-large btn-block'
            onClick={fetchMovies}>
            Load More
          </button>
        )}
        <br />
        <br />
        <br />
      </div>
    )
}

export default MovieList;