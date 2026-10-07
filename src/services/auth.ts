import { type LoginRequest, LoginResponseSchema } from "@/schemas/auth.schemas";
import { api } from "./api";
import { session } from "./session";

/**
 * Realiza login do usuário na API.
 * Em caso de sucesso, o token é automaticamente armazenado no SecureStore.
 */
export async function login(data: LoginRequest) {
	const response = await api.post("/auth/login", data);

	// Valida a resposta com Zod para garantir que o token chegou no formato esperado.
	// Lança erro automaticamente se a estrutura for inválida (ex.: campo ausente ou tipo errado).
	const loginResponse = LoginResponseSchema.parse(response.data);

	// Persiste o token no armazenamento seguro
	await session.save(loginResponse.accessToken);

	return loginResponse;
}

/**
 * Realiza logout do usuário.
 * Remove o token do armazenamento seguro, encerrando a sessão.
 */
export async function logout() {
	await session.clear();
}
