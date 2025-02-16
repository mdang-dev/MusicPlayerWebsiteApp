import axios, {AxiosResponse} from "axios";

const fetchProtected = async (): Promise<AxiosResponse | null> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access Token not set");
        return await axios.get(`${process.env.NEXT_PUBLIC_API}/api/protected`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (err) {
        console.error("Error fetching protected resource:", err);
        try {
            await refreshAccessToken();
            return await axios.get(`${process.env.NEXT_PUBLIC_API}/api/protected`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
        } catch (refreshError) {
            console.error("Error refreshing access token:", refreshError);
            return null;
        }
    }
};

const refreshAccessToken = async (): Promise<void> => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/api/refresh`,
            {},
            {
                withCredentials: true,
            }
        );
        localStorage.setItem("accessToken", response.data.accessToken);
    } catch (err) {
        console.error("Failed to refresh access token:", err);
        throw err;
    }
};
export { fetchProtected, refreshAccessToken };