// import { useQuery } from '@tanstack/react-query';
// import { fetchCoordinates } from '../../services/MapApiget';


// export const useGeocode = (address) => {
//     return useQuery({
//         queryKey: ['geocode', address],
//         queryFn: () => fetchCoordinates(address), // Pass the address to fetchCoordinates
//         enabled: !!address, // Prevents the query from running when there's no address
//     });
// };


// // Address Map

// import { useQuery } from '@tanstack/react-query';
// import { fetchCoordinates } from '../../services/MapApiget';

// export const useGeocode = (addresses) => {
//     return useQuery({
//         queryKey: ['geocode', addresses],
//         queryFn: () => fetchCoordinates(addresses), // Pass the array of addresses to fetchCoordinates
//         enabled: addresses.length > 0, // Prevents the query from running when there's no address
//     });
// };
