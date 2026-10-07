import axios from "axios";
import { session } from "./session";

/**
 * Instância Axios compartilhada por todos os serviços.
 *
 * Interceptor de request: injeta automaticamente o token JWT no header Authorization.
 * Interceptor de response: trata erros 401 (não autorizado) limpando a sessão.
 */
export const api = axios.create({
	baseURL: "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * Interceptor de requisição: injeta o token JWT se existir.
 */
api.interceptors.request.use(async (config) => {
	const token = await session.load();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

/**
 * Interceptor de resposta: trata erros 401 limpando a sessão.
 * NOTA: O redirecionamento para login deve ser feito pelos componentes,
 * não aqui, para evitar dependência circular com expo-router.
 */
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// Sessão expirada ou inválida - limpa o token
			await session.clear();
			// O app detectará a ausência do token e redirecionará para login
		}
		return Promise.reject(error);
	},
);
