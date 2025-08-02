import axios from 'axios';
import { Valve, ManufacturerInterval } from '../types/valve';

// Base API URL - this should be configured via environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.valvechain.com';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export class ValveService {
  /**
   * Fetch all valves from the backend
   */
  static async getValves(): Promise<Valve[]> {
    try {
      const response = await api.get('/valves');
      return response.data;
    } catch (error) {
      // For now, return mock data if API fails
      console.warn('API call failed, returning mock data:', error);
      return this.getMockValves();
    }
  }

  /**
   * Fetch manufacturer intervals from the backend
   */
  static async getManufacturerIntervals(): Promise<ManufacturerInterval> {
    try {
      const response = await api.get('/manufacturer-intervals');
      return response.data;
    } catch (error) {
      // For now, return mock data if API fails
      console.warn('API call failed, returning mock data:', error);
      return this.getMockManufacturerIntervals();
    }
  }

  /**
   * Mock data for valves (fallback when API is not available)
   */
  private static getMockValves(): Valve[] {
    return [
      {
        id: "VAL-001",
        serial: "SN12345",
        manufacturer: "Emerson",
        model: "A100",
        location: "Plant 1",
        status: "In Service",
        lastServiceDate: "2024-12-01",
        plantOverrideMonths: 6,
        processConditions: "High Temp",
      },
      {
        id: "VAL-002",
        serial: "SN67890",
        manufacturer: "Kitz",
        model: "B200",
        location: "Plant 2",
        status: "Needs Repair",
        lastServiceDate: "2023-10-10",
        plantOverrideMonths: null,
        processConditions: "Standard",
      },
    ];
  }

  /**
   * Mock data for manufacturer intervals (fallback when API is not available)
   */
  private static getMockManufacturerIntervals(): ManufacturerInterval {
    return {
      Emerson: { A100: 12 },
      Kitz: { B200: 18 },
    };
  }
}

export default ValveService;