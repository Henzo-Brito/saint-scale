import { z } from "zod";

export const LoginSchema = z.object({
	email: z.email("Email inválido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const LoginResponseSchema = z.object({
	accessToken: z.string(),
	tokenType: z.literal("Bearer"),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;