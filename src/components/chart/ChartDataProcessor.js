import axios from "axios";

export const fetchChartData = async () => {
    try {
        const response = await axios.get("/stats/chart");
        return response.data;
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return [];
    }
};
