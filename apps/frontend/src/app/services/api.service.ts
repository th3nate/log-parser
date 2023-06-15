import axios from 'axios';
import { environment } from '../../environments/environment';
import { toast } from 'react-toastify';
import ErrorToast from '../components/error-toast';

const API_BASE_URL = environment.API_BASE_URL;

const apiService = axios.create({
  baseURL: API_BASE_URL,
});

const toastId = new Date().toISOString();

export interface ApiGetData {
  <T>(endpoint: string, params?: Record<string, any>): Promise<T[]>;
}

export interface ApiPostData {
  <T>(
    endpoint: string,
    data?: Record<string, any>,
    headers?: Record<string, any>
  ): Promise<T>;
}

export interface ApiDeleteData {
  (endpoint: string, params?: Record<string, any>): Promise<number>;
}

export const getData: ApiGetData = async function getData<T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  try {
    const response = await apiService.get(endpoint, { params });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data
      ? {
          name: error.response.data.error,
          message: error.response.data.message,
          code: error.code,
        }
      : error;
    toast(ErrorToast, { data, toastId });
    throw new Error(error);
  }
};

export const postData: ApiPostData = async function postData<T>(
  endpoint: string,
  data: Record<string, any> = {},
  headers: Record<string, any> = {}
): Promise<T> {
  try {
    const response = await apiService.post(endpoint, data, { headers });
    return response.data;
  } catch (error: any) {
    const data = error.response?.data
      ? {
          name: error.response.data.error,
          message: error.response.data.message,
          code: error.code,
        }
      : error;
    toast(ErrorToast, { data, toastId });
    throw new Error(error);
  }
};

export const deleteData: ApiDeleteData = async function deleteData(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<number> {
  try {
    const response = await apiService.delete(endpoint, { params });
    return response.status;
  } catch (error: any) {
    const data = error.response?.data
      ? {
          name: error.response.data.error,
          message: error.response.data.message,
          code: error.code,
        }
      : error;
    toast(ErrorToast, { data, toastId });
    throw new Error(error);
  }
};
