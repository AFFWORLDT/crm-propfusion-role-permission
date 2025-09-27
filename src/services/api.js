import axios from 'axios';
import Cookies from 'universal-cookie';
import { getApiUrl } from '../utils/getApiUrl';

const cookies = new Cookies();

const api = axios.create({
  baseURL: getApiUrl(),
});

// Add request interceptor to add authorization header
api.interceptors.request.use((config) => {
  const user = cookies.get('USER');
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

export const getAgentLeadCounts = () => {
  return api.get('/properties/agent_lead_counts').then(response => response.data);
};

export const getAgentPropertyCounts = async () => {
  try {
    const response = await api.get('/properties/agent_property_counts');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch agent property counts');
  }
};

export default api; 