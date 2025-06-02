import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';
/*
interface MoviesResponse {
  results: Movie[];
}*/

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}
/*
export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<MoviesResponse>(`${BASE_URL}`, {
    params: {
      query,
      language: 'en-US',
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });
  return response.data.results;
};*/

export const fetchMovies = async (query: string, page: number): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(BASE_URL, {
    params: { query, page },
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
  });
  return response.data;
};
