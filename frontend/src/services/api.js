// Shared axios instance for talking to the backend API.
//
// The base URL comes from VITE_API_BASE_URL (see .env.example) so that
// teammates can point the same code at a local or deployed backend without
// editing any source files.
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
