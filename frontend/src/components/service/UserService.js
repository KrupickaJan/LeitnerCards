import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

class UserService {

    static async login(email, password) {
        try {
            const userDto = { email, password }
            const response = await axios.post(`https://leitnercardsapi.onrender.com/auth/login`, { userDto })
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async register(userDto) {
        try {

            const response = await axios.post(`https://leitnercardsapi.onrender.com/auth/register`, { userDto })
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async getAllUsers() {
        try {
            const response = await axiosInstance.get(`/admin/get-all-users`)
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async getYourProfile() {
        try {
            const response = await axiosInstance.get(`/user/get-profile`)
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async getUserById(userId) {
        try {
            const response = await axiosInstance.get(`/admin/get-user/${userId}`)
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async deleteUser(userId) {
        try {
            const response = await axiosInstance.delete(`/admin/delete/${userId}`)
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async updateUser(userId, userDto) {
        try {
            const response = await axiosInstance.put(`/admin/update/${userId}`, { userDto })
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async updateActiveProfile(userDto) {
        try {
            const response = await axiosInstance.put(`/user/update-profile`, { userDto })
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('refreshtoken');
    }

    static isAuthenticated() {
        const refreshtoken = localStorage.getItem('refreshtoken');
        return (!!refreshtoken);
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isRefreshtokenExpired() {
        const decodedToken = jwtDecode(localStorage.getItem('refreshtoken'));
        return Date.now() >= decodedToken.exp * 1000;
    }
}

export default UserService;