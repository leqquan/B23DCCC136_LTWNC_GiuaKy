import { create } from 'zustand';
import { Genre } from '../types/book.types';

export type FilterGenre = 'All' | Genre;

interface FilterState {
  searchKeyword: string;
  selectedGenre: FilterGenre;
  setSearchKeyword: (keyword: string) => void;
  setSelectedGenre: (genre: FilterGenre) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchKeyword: '',
  selectedGenre: 'All',
  setSearchKeyword: (keyword: string) => set({ searchKeyword: keyword }),
  setSelectedGenre: (genre: FilterGenre) => set({ selectedGenre: genre }),
  resetFilters: () => set({ searchKeyword: '', selectedGenre: 'All' }),
}));
