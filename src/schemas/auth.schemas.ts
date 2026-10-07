import { z } from "zod";

/** Dados enviados na requisição de login. */
export const LoginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

/**
 * Resposta esperada da API após login bem-sucedido.
 * O token é do tipo "Bearer" e é injetado automaticamente nas requisições
 * via interceptor Axios em api.ts.
 * O token é persistido no SecureStore via session.ts.
 */
export const LoginResponseSchema = z.object({
	accessToken: z.string(),
	tokenType: z.literal("Bearer"),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
