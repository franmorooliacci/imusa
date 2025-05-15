// axiosClient.js
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

const axiosClient = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' }
});

const bareClient = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' }
});

let isRefreshing = false;
let queue = [];

// inject access token on every request
axiosClient.interceptors.request.use(cfg => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (tokens?.access) cfg.headers.Authorization = `Bearer ${tokens.access}`;
    return cfg;
});

// on 401 → refresh, retry, queue others
axiosClient.interceptors.response.use(
    res => res,
    async err => {
        const orig = err.config;
        const tokens = JSON.parse(localStorage.getItem('tokens'));

        if (err.response?.status === 401 &&
            tokens?.refresh &&
            !orig._retry &&
            !orig.url.includes('/token/refresh/')) {

            orig._retry = true;
            if (isRefreshing) {
                return new Promise((res, rej) =>
                queue.push({ res, rej })
                ).then(token => {
                orig.headers.Authorization = `Bearer ${token}`;
                return axiosClient(orig);
                });
            }

            isRefreshing = true;
            try {
                const { data } = await bareClient.post('token/refresh/', {
                refresh: tokens.refresh
                });
                localStorage.setItem('tokens', JSON.stringify({
                access: data.access,
                refresh: tokens.refresh
                }));
                axiosClient.defaults.headers.Authorization = `Bearer ${data.access}`;
                queue.forEach(p => p.res(data.access));
                queue = [];
                orig.headers.Authorization = `Bearer ${data.access}`;
                return axiosClient(orig);
            } catch (e) {
                localStorage.removeItem('tokens');
                window.location.href = '/login/';
                queue.forEach(p => p.rej(e));
                queue = [];
                return Promise.reject(e);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default axiosClient;
