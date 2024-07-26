import axiosInstance from "../utils/axiosInstance";

class PackService {

    static async create(packDto) {
        try {
            const response = await axiosInstance.post(`/user/pack/create`, { packDto })
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async getPacks(topicId) {
        try {
            const response = await axiosInstance.get(`/user/pack/getPacks/${topicId}`)
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async deletePack(packId) {
        try {
            const response = await axiosInstance.delete(`/user/pack/delete/${packId}`)
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async updatePack(packId, packDto) {
        try {
            const response = await axiosInstance.put(`/user/pack/update/${packId}`, { packDto })
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async updateSession(packId) {
        try {
            const response = await axiosInstance.get(`/user/pack/update-session/${packId}`)
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }
}

export default PackService;