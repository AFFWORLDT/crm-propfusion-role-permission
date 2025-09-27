// // import axios from "axios";

// // export const fetchCoordinates = async (address) => { 
   
   
    
// //     try {
// //         // Encode the address for URL
// //         const response = await axios.get(
// //             `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
// //                 address
// //             )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
// //         );

// //         const data = response.data;
     

// //         if (data.results && data.results.length > 0) {
// //             // Extract exact location's latitude and longitude
// //             const location = data.results[0].geometry.location;
// //             const formattedAddress = data.results[0].formatted_address;
           
// //             return location;
// //         } else {
// //             throw new Error("Geocoding failed: Address not found");
// //         }
// //     } catch (error) {
      
// //         throw new Error(`Geocoding failed: ${error.message}`);
// //     }
// // };



// // address 

// import axios from "axios";

// export const fetchCoordinates = async (addresses) => {
//     try {
//         const coordinatePromises = addresses.map(async (address) => {
//             // Encode the address for URL
//             const response = await axios.get(
//                 `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//                     address
//                 )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
//             );

//             const data = response.data;

//             if (data.results && data.results.length > 0) {
//                 // Extract exact location's latitude and longitude
//                 const location = data.results[0].geometry.location;
//                 return {
//                     address, // Original address
//                     location, // Coordinates
//                     formattedAddress: data.results[0].formatted_address, // Optional: formatted address
//                 };
//             } else {
//                 throw new Error(`Geocoding failed: Address "${address}" not found`);
//             }
//         });

//         // Wait for all the coordinate promises to resolve
//         const coordinates = await Promise.all(coordinatePromises);
//         return coordinates; // Return an array of coordinates
//     } catch (error) {
//         throw new Error(`Geocoding failed: ${error.message}`);
//     }
// };
