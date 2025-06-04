import React, { createContext, useContext, useState } from 'react';

type Artwork = {
  id: number;
  title: string;
  artistDisplayName: string;
  primaryImage: string;
  url: string;
};

type SearchState = {
  currentIndex: number;
  setCurrentIndex: (val: number) => void;
  currentPage: number;
  setCurrentPage: (val: number) => void;
  artistWorks: Artwork[];
  setArtistWorks: (works: Artwork[]) => void;
};

const SearchStateContext = createContext<SearchState | undefined>(undefined);

export const SearchStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [artistWorks, setArtistWorks] = useState<Artwork[]>([]);

  return (
    <SearchStateContext.Provider
      value={{ currentIndex, setCurrentIndex, currentPage, setCurrentPage, artistWorks, setArtistWorks }}
    >
      {children}
    </SearchStateContext.Provider>
  );
};

export const useSearchState = () => {
  const context = useContext(SearchStateContext);
  if (!context) throw new Error('useSearchState must be used within a SearchStateProvider');
  return context;
};
