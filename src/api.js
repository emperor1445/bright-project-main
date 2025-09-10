import axios from "axios";

const baseURL = "https://bright-backend-k6it.onrender.com/api" || "http://localhost:5000/api";

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // use Bearer token convention
  }
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const addTransaction = (data) => API.post("/transactions", data);
export const getTransactions = () => API.get("/transactions");
