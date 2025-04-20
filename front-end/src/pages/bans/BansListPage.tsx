// src/pages/bans/BansListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Ban } from '../../interfaces/Ban';

import Spinner from '../../components/common/Spinner';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../context/AuthContext';
import { getAllBans, searchBans } from '../../services/api';
import BanSearchFilters from '../../components/bans/BanSearchFilters';
import BanCard from '../../components/bans/BanCard';

const BansListPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [bans, setBans] = useState<Ban[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    isActive: true,
  });
  
  const fetchBans = async () => {
    setLoading(true);
    try {
      let response;
      
      if (searchQuery.trim()) {
        response = await searchBans(searchQuery, currentPage, 10);
      } else {
        response = await getAllBans(currentPage, 10, filters);
      }
      
      setBans(response.bans);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error fetching bans:', err);
      setError('Failed to load bans. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBans();
  }, [currentPage, filters]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchBans();
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Player Bans</h1>
        
        {currentUser && currentUser.role !== 'viewer' && (
          <Link 
            to="/bans/create" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Ban
          </Link>
        )}
      </div>
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search by player name, ID, or reason..." />
      </div>
      
      <div className="mb-6">
        <BanSearchFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          {bans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No bans found. {currentUser && currentUser.role !== 'viewer' && (
                <Link to="/bans/create" className="text-blue-500 hover:underline">
                  Create one?
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bans.map(ban => (
                <Link key={ban._id} to={`/bans/${ban._id}`}>
                  <BanCard ban={ban} />
                </Link>
              ))}
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BansListPage;