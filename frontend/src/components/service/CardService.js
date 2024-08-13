import axiosInstance from "../utils/axiosInstance";

class CardService {

    static async create(cardDto) {
        try {
            const response = await axiosInstance.post(`/user/card/create`, { cardDto });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getCard(cardId) {
        try {
            const response = await axiosInstance.get(`/user/card/getCard/${cardId}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getCards(packId) {
        try {
            const response = await axiosInstance.get(`/user/card/getCards/${packId}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getCardsFromPacks(packsList) {
        try {
            const response = await axiosInstance.post(`/user/card/getCardsFromPacks`, packsList);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async deleteCard(cardId) {
        try {
            const response = await axiosInstance.delete(`/user/card/deleteCard/${cardId}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async updateCard(cardId, cardDto) {
        try {
            const response = await axiosInstance.put(`/user/card/updateCard/${cardId}`, { cardDto });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
}

export default CardService;
