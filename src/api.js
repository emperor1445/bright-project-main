import axios from "axios";

// Set your backend base URL
const API = axios.create({
  baseURL: "https://bright-backend-k6it.onrender.com",
});

// Automatically attach token to requests if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

// Auth endpoints
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Transaction endpoints
export const addTransaction = (data) => API.post("/transactions", data);
export const getTransactions = () => API.get("/transactions");
