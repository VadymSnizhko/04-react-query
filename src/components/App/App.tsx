import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import { fetchMovies } from '../../services/movieService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import {type Movie } from '../../types/movie';
import css from './App.module.css';

function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error('Please enter your search query.');
      return;
    }
    setQuery(newQuery);
    setPage(1); // Скидаємо на першу сторінку
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (isSuccess && !isLoading && !isError && data?.results?.length === 0 && query){
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, isLoading, isError, data, query]);
  
  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />

      

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && data && data?.results.length > 0 && (
        
        <>

          {data.total_pages > 1 && data.results.length > 0 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
        </>
      )}


      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
