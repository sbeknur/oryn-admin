import axios from "axios";

export const fetchFeaturedData = async (user) => {
    try {
        const response = await axios.get("stats/featured");
        return response.data;
    } catch (error) {
        console.error("Error fetching featured data:", error);
        return {};
    }
};
