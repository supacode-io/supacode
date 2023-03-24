import Axios from 'axios';
import Cookies from 'js-cookie';

export const cmsRequest = Axios.create({ baseURL: process.env.SERVER_URL });

cmsRequest.interceptors.request.use((config) => {
	const token = Cookies.get('sess_token');
	const { noAuth = false } = config;
	const newConfig = { ...config };
	if (token && !noAuth) {
		newConfig.headers.Authorization = `Bearer ${token}`;
	}
	return newConfig;
});

export const request = Axios.create();
