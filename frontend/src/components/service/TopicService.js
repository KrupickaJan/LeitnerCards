import axiosInstance from "../utils/axiosInstance";


class TopicService {

    static async create(topicDto) {
        try {
            const response = await axiosInstance.post(`/user/topic/create`, { topicDto })
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async getUsersTopics() {
        try {
            const response = await axiosInstance.get(`/user/topic/get-users-topics`)
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async deleteTopic(topicId) {
        try {
            const response = await axiosInstance.delete(`/user/topic/delete/${topicId}`)
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }

    static async updateTopic(topicId, topicDto) {
        try {
            const response = await axiosInstance.put(`/user/topic/update/${topicId}`, { topicDto })
            return response.data;
        }
        catch (err) {
            throw err;
        }
    }
}

export default TopicService;