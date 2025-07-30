import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { AuthTokens } from '@common/context/auth';

interface RetryableRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

interface QueueItem {
	res: (token: string) => void;
	rej: (error: any) => void;
}

const baseUrl = process.env.REACT_APP_BASE_URL;

const axiosClient: AxiosInstance = axios.create({
	baseURL: baseUrl,
	headers: { 'Content-Type': 'application/json' }
});

const bareClient: AxiosInstance = axios.create({
	baseURL: baseUrl,
	headers: { 'Content-Type': 'application/json' }
});

let isRefreshing = false;
let queue: QueueItem[] = [];

// inject access token on every request
axiosClient.interceptors.request.use((cfg) => {
	const t = localStorage.getItem('tokens');
	const tokens: AuthTokens | null = t ? JSON.parse(t) : null;
	if (tokens?.access && cfg.headers) {
		cfg.headers.Authorization = `Bearer ${tokens.access}`;
	}
	return cfg;
});

// on 401 → refresh, retry, queue others
axiosClient.interceptors.response.use(
	(res: AxiosResponse) => res,
	async (err: AxiosError) => {
		const orig = err.config as RetryableRequestConfig;
		const t = localStorage.getItem('tokens');
		const tokens: AuthTokens | null = t ? JSON.parse(t) : null;

		const shouldRefresh =
			err.response?.status === 401 &&
			tokens?.refresh &&
			!orig._retry &&
			typeof orig.url === 'string' &&
			!orig.url.includes('/token/refresh/');

		if (shouldRefresh) {
			orig._retry = true;

			if (isRefreshing) {
				return new Promise<AxiosResponse>((resolve, reject) => {
					queue.push({
						res: (token) =>
							resolve(axiosClient({ ...orig, headers: { ...orig.headers, Authorization: `Bearer ${token}` } })),
						rej: reject
					});
				});
			}

			isRefreshing = true;
			try {
				const response = await bareClient.post<{ access: string }>('token/refresh/', { refresh: tokens.refresh });
				const newAccess = response.data.access;

				localStorage.setItem('tokens', JSON.stringify({ access: newAccess, refresh: tokens.refresh }));
				axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

				queue.forEach((p) => p.res(newAccess));
				queue = [];

				orig.headers = { ...orig.headers, Authorization: `Bearer ${newAccess}` };
				return axiosClient(orig);
			} catch (refreshError) {
				localStorage.removeItem('tokens');
				window.location.href = '/login/';
				queue.forEach((p) => p.rej(refreshError));
				queue = [];
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(err);
	}
);

export default axiosClient;
