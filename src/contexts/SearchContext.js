import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from 'routes';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Get all searchable routes (only those that should appear in sidebar)
  const searchableRoutes = routes.filter(route => 
    route.showInSidebar && 
    route.name && 
    route.name !== 'logout' &&
    !route.subRoutes // Exclude parent routes with subroutes
  );

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = searchableRoutes.filter(route => {
      const searchTerm = query.toLowerCase();
      const routeName = route.name.toLowerCase();
      
      return routeName.includes(searchTerm);
    });

    setSearchResults(results);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    performSearch(value);
    setIsSearchOpen(true);
  };

  const handleSearchSelect = (route) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
    
    // Navigate to the selected route
    const fullPath = `${route.layout}${route.path}`;
    navigate(fullPath);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchResults([]);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target)) {
        closeSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const value = {
    searchQuery,
    searchResults,
    isSearchOpen,
    handleSearchChange,
    handleSearchSelect,
    closeSearch,
    setIsSearchOpen
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 