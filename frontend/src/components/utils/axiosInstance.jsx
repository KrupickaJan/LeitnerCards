import axios from "axios";
import UserService from "../service/UserService";
import { jwtDecode } from "jwt-decode";

const getAccessToken = () => localStorage.getItem("token");
const setAccessToken = (token) => localStorage.setItem("token", token);
const getRefreshToken = () => localStorage.getItem("refreshtoken");

const axiosInstance = axios.create({
  baseURL: "https://leitnercardsapi.onrender.com/",
  // baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (request) => {
    let accessToken = getAccessToken();
    if (accessToken) {
      if (isTokenExpired(accessToken)) {
        try {
          const responseToRefreshToken = await refreshRequest();
          setAccessToken(responseToRefreshToken.token);
          request.headers["Authorization"] = `Bearer ${getAccessToken()}`;
        } catch (error) {
          UserService.logout();
          window.location.href = "/login";
          throw error;
        }
      } else {
        request.headers["Authorization"] = `Bearer ${getAccessToken()}`;
      }
    }
    return request;
  },
  (error) => Promise.reject(error)
);

const refreshRequest = async () => {
  try {
    const refreshToken = getRefreshToken();
    const response = await axios.post(
      `https://leitnercardsapi.onrender.com/auth/refresh`,
      {
        refreshToken,
      }
    );
    const isTokenPresent = "token" in response.data;
    if (!isTokenPresent) {
      UserService.logout();
      window.location.href = "/login";
    }
    return response.data;
  } catch (err) {
    throw err;
  }
};

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= (exp - 2) * 1000;
  } catch (e) {
    console.log(e);
    return true;
  }
};

export default axiosInstance;
