import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function normalizeError(error) {
  if (error.code === 'ECONNABORTED') {
    return {
      code: 'TIMEOUT',
      message: 'The request timed out. Please try again.',
    };
  }

  if (!error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network error. Check your connection and that the API server is running.',
    };
  }

  const data = error.response.data || {};
  return {
    code: data.code || `HTTP_${error.response.status}`,
    message: data.message || 'Something went wrong while contacting Talk2Trip.',
    details: data.details,
  };
}

export async function generateTrip(prompt) {
  try {
    const { data } = await api.post('/generate-trip', { prompt });
    if (!data?.success || !data?.data) {
      throw {
        response: {
          status: 502,
          data: {
            code: 'EMPTY_RESPONSE',
            message: 'Empty response from server.',
          },
        },
      };
    }
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function refineTrip(trip, refinement) {
  try {
    const { data } = await api.post('/refine-trip', { trip, refinement });
    if (!data?.success || !data?.data) {
      throw {
        response: {
          status: 502,
          data: {
            code: 'EMPTY_RESPONSE',
            message: 'Empty response from server.',
          },
        },
      };
    }
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function checkHealth() {
  try {
    const { data } = await api.get('/health');
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}
