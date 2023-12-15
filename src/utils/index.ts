import axios from "axios";

export { twMerge as tw } from "tailwind-merge";

export const instance = axios.create({
    baseURL: "https://cmed-server.onrender.com/api/v1",
});
instance.interceptors.request.use(
    function (config) {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("accessToken")
                : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// auto refresh accessToken if user have refreshToken
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem("refreshToken");
            const res = await axios.post(
                "https://cmed-server.onrender.com/api/v1/auth/refresh",
                {
                    refresh,
                }
            );
            if (res.status === 200) {
                localStorage.setItem("accessToken", res.data.accessToken);
                instance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${res.data.accessToken}`;
                return instance(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export interface User {
    id: string;
    username: string;
    role: string;
}

// get user object from localStorage, also check type of window
export const getUserData = (): User => {
    const user =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
    return user ? JSON.parse(user) : null;
};
