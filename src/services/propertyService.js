import axios from 'axios';
import { getApiUrl } from '../utils/getApiUrl';

const BASE_URL = getApiUrl();
const API_TOKEN = 'your_api_token_here'; // यहाँ अपना टोकन डालें

// API कॉल्स के लिए axios इंस्टेंस
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
  }
});

// प्रॉपर्टीज फेच करने का फंक्शन
export const fetchProperties = async ({ page = 1, size = 10 } = {}) => {
  try {
    const response = await api.get(`/properties/get_new_properties`, {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('प्रॉपर्टीज फेच करने में एरर:', error);
    throw error;
  }
};

// सिंगल प्रॉपर्टी फेच करने का फंक्शन
export const fetchPropertyById = async (propertyId) => {
  try {
    const response = await api.get(`/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('प्रॉपर्टी फेच करने में एरर:', error);
    throw error;
  }
};

// प्रॉपर्टी सर्च का फंक्शन
export const searchProperties = async ({ query, page = 1, size = 10 } = {}) => {
  try {
    const response = await api.get(`/properties/search`, {
      params: {
        query,
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('प्रॉपर्टी सर्च में एरर:', error);
    throw error;
  }
};

// ChatGPT के लिए प्रॉपर्टी डेटा फेच करने का फंक्शन
export const fetchPropertiesForChatGPT = async (query) => {
  try {
    // पहले सर्च करें
    const searchResponse = await searchProperties({ query, size: 5 });
    
    // अगर सर्च में कुछ नहीं मिला तो नई प्रॉपर्टीज फेच करें
    if (!searchResponse.properties || searchResponse.properties.length === 0) {
      const newPropertiesResponse = await fetchProperties({ size: 5 });
      return formatPropertiesForChatGPT(newPropertiesResponse.properties);
    }
    
    return formatPropertiesForChatGPT(searchResponse.properties);
  } catch (error) {
    console.error('ChatGPT के लिए प्रॉपर्टीज फेच करने में एरर:', error);
    throw error;
  }
};

// ChatGPT के लिए प्रॉपर्टी डेटा को फॉर्मेट करने का फंक्शन
const formatPropertiesForChatGPT = (properties) => {
  return properties.map(property => ({
    id: property.id,
    title: property.title,
    type: property.property_type,
    price: `${property.price} ${property.priceType}`,
    location: property.area?.name || 'लोकेशन नहीं मिली',
    details: {
      bedrooms: property.bedRooms,
      bathrooms: property.bathrooms,
      size: `${property.size} sq ft`,
      furnished: property.isFurnished === 'Yes' ? 'फर्निश्ड' : 'अनफर्निश्ड'
    },
    agent: property.agent ? {
      name: property.agent.name,
      phone: property.agent.phone,
      email: property.agent.email
    } : null
  }));
};

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "your_openai_key_here"; 