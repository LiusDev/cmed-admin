import { User } from "@/types";
import axios from "axios";

export { twMerge as tw } from "tailwind-merge";

export const signout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.reload();
};

export const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
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

// auto refresh accessToken (/auth/refresh) if user have refreshToken and store new accessToken in localStorage
instance.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            originalRequest.url === "/auth/refresh"
        ) {
            // if refresh token is expired, logout user
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.reload();
            return Promise.reject(error);
        }
        if (
            error.response.status === 401 &&
            originalRequest.url !== "/auth/refresh"
        ) {
            const refreshToken =
                typeof window !== "undefined"
                    ? localStorage.getItem("refreshToken")
                    : null;

            if (refreshToken) {
                try {
                    const res = await instance.post("/auth/refresh", {
                        refresh: refreshToken,
                    });

                    if (res.status === 201) {
                        const accessToken = res.data.accessToken;

                        localStorage.setItem("accessToken", accessToken);
                        return instance(originalRequest);
                    }
                } catch (error) {
                    return Promise.reject(error);
                }
            }
        }
        return Promise.reject(error);
    }
);

export const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result as string);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};
// eg recive date format: 2023-12-19T04:49:45.000Z, output is 19/12/2023 - 11:49:45
export const convertDate = (date: string): string => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1
        }/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

// get user object from localStorage, also check type of window
export const getUserData = (): User => {
    const user =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!user) {
        window.location.href = "/signin";
    }
    return JSON.parse(user as string);
};

export const parseContent = (content: string) => {
    // content have string with html tag, also have img tag with src is blob url. Convert all blob url to base64 and return new content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const images = doc.querySelectorAll("img");
    if (images.length === 0) return Promise.resolve(doc.body.innerHTML);
    const promises: Promise<void>[] = [];
    images.forEach((image) => {
        promises.push(
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        image.src = reader.result as string;
                        resolve();
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.onerror = function () {
                    reject();
                };
                xhr.open("GET", image.src);
                xhr.responseType = "blob";
                xhr.send();
            })
        );
    });
    return new Promise((resolve, reject) => {
        Promise.all(promises)
            .then(() => {
                resolve(doc.body.innerHTML);
            })
            .catch(() => {
                reject();
            });
    });
};

export const langOptions = [{ label: "Tiếng Việt", value: '' }, { label: 'Tiếng Anh', value: "EN" }, { label: "Tiếng Nhật", value: 'JP' }]

export const alias = { '': '', 'EN': '(Tiếng Anh)', 'JP': '(Tiếng Nhật)' }
