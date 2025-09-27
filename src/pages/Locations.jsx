import { useState, useEffect } from 'react';
import { fetchLocations } from '../services/apiLocations';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import PlotMap from '../ui/PlotMap';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        const data = await fetchLocations(search, page);
        setLocations(data.locations || []);
        setTotalPages(Math.ceil(data.total / data.size) || 1);
        setError(null);
      } catch (err) {
        setError('Failed to load locations. Please try again later.');
        console.error('Error loading locations:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      loadLocations();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search, page]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="py-4">
      <div className="mb-4">
        <div className="flex items-center">
          <FaMapMarkerAlt size={32} className="text-blue-600 mr-3" />
          <h2 className="m-0 text-2xl font-bold">Locations</h2>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-grow mr-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search locations..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <button
              className={`px-4 py-2 rounded mr-2 font-medium border ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'} transition`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
            <button
              className={`px-4 py-2 rounded font-medium border ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'} transition`}
              onClick={() => setViewMode('map')}
            >
              Map View
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : (
        <>
          {viewMode === 'table' && (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">City</th>
                      <th className="px-4 py-2 border-b">Community</th>
                      <th className="px-4 py-2 border-b">Sub Community</th>
                      <th className="px-4 py-2 border-b">Property Name</th>
                      <th className="px-4 py-2 border-b">Latitude</th>
                      <th className="px-4 py-2 border-b">Longitude</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map((location) => (
                      <tr key={location.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{location.city}</td>
                        <td className="px-4 py-2 border-b">{location.community}</td>
                        <td className="px-4 py-2 border-b">{location.sub_community || '-'}</td>
                        <td className="px-4 py-2 border-b">{location.property_name || '-'}</td>
                        <td className="px-4 py-2 border-b">{location.latitude}</td>
                        <td className="px-4 py-2 border-b">{location.longitude}</td>
                      </tr>
                    ))}
                    {locations.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-gray-500">
                          No locations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <nav>
                  <ul className="inline-flex -space-x-px">
                    <li>
                      <button
                        className={`px-3 py-1 border rounded-l ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-600'}`}
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index + 1}>
                        <button
                          className={`px-3 py-1 border-t border-b border-blue-600 ${page === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        className={`px-3 py-1 border rounded-r ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-600'}`}
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          )}
          {viewMode === 'map' && (
            <div>
              <PlotMap
                listingType={null}
                addresses={locations
                  .filter(loc => !!loc.sub_community && loc.community === "Jumeirah Village Circle")
                  .map(loc => ({
                    ...loc,
                    position: `${loc.latitude},${loc.longitude}`,
                    name: loc.property_name
                      ? `${loc.sub_community} - ${loc.property_name}`
                      : loc.sub_community,
                    description: `${loc.community ? loc.community + ', ' : ''}${loc.city}`
                  }))}
                initialHeight={700}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Locations; 