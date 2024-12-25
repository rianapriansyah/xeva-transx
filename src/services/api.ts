import axios from 'axios';

const API_BASE_URL = 'https://srv664937.hstgr.cloud/api';

export const fetchProducts = () => axios.get(`${API_BASE_URL}/products`);
export const createProduct = (productsData: any) =>
  axios.post(`${API_BASE_URL}/products`, productsData);

export const fetchCategories = () => axios.get(`${API_BASE_URL}/category`);
export const createCategory = (categoryData: any) =>
  axios.post(`${API_BASE_URL}/category`, categoryData);

export const fetchPaymentMethods = () => axios.get(`${API_BASE_URL}/paymentmethods`);
export const createTransaction = (transactionData: any) =>
  axios.post(`${API_BASE_URL}/transactions`, transactionData);

export const updateTransaction = (transactionId: any, transactionData:any) =>
  axios.put(
    `${API_BASE_URL}/transactions/${transactionId}`,
    transactionData
  );

export const fetchTransaction = () => axios.get(`${API_BASE_URL}/transactions`);

export const fetchParkedTransactions = () =>
  axios.get(`${API_BASE_URL}/transactions/parked`);
