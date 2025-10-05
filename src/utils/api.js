import { supabase } from "../supabaseClient"; // Assuming this path exists and is correct

const BASE_URL = "http://localhost:3001/api";

/**
 * Custom fetch wrapper to securely communicate with the Express backend.
 * It automatically injects the user's Supabase access token into the request headers.
 * It also correctly handles 204 No Content responses.
 * @param {string} endpoint - The API endpoint (e.g., '/reservations').
 * @param {object} options - Standard fetch options (method, body, etc.).
 * @returns {Promise<object | null>} The JSON response from the API or null for a 204 status.
 */
export const secureFetch = async (endpoint, options = {}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.access_token) {
    // Throw an error if the user is not logged in.
    throw new Error("User not authenticated. Please log in.");
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    // The crucial security step: Attach the JWT token
    Authorization: `Bearer ${session.access_token}`,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.ok) {
    if (response.status === 204) {
      return null; // Return null for successful deletion/update with no body
    }
    
    // For all other successful statuses (200, 201), proceed to parse JSON
    return response.json();
  }

  const errorText = await response.text();

  try {
    // Attempt to parse the single body read as JSON
    const errorBody = JSON.parse(errorText);

    throw new Error(
      `API Error: ${response.status} - ${errorBody.error || errorBody.message || "Request failed"}`
    );
  } catch (e) {
    throw new Error(
      `API Error: ${response.status} - ${errorText || "Unknown Server Error"}`
    );
  }
};

export const toggleSlotActiveStatus = async (slotId) => {
    return secureFetch(`/api/slots/${slotId}/toggle`, {
        method: 'PUT',
    });
};
