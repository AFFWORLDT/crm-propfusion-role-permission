import axios from 'axios';
import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";

const API_BASE_URL = getApiUrl();
const cookies = new Cookies();

export const fetchFAQs = async (page = 1, size = 100) => {
  try {
    let user = cookies.get("USER");
    if (!user) {
      const localUser = localStorage.getItem("CRMUSER");
      if (localUser) {
        user = JSON.parse(localUser);
      }
    }
    const response = await axios.get(`${API_BASE_URL}/faqs`, {
      params: { page, size },
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${user?.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
}; 