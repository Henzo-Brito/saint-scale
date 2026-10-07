import { z } from "zod";

/**
 * Schema de criação de usuário.
 *
 * Observações de formato:
 * - `birth_date`: deve ser enviado como "YYYY-MM-DD" (ISO format);
 *   o formulário envia "DD/MM/YYYY" e a conversão ocorre em `services/users.ts`.
 * - `telephone`: máximo 11 dígitos sem máscara; os não-numéricos são removidos antes do envio.
 * - `password`: mínimo 8 caracteres (alinhado com backend).
 *
 * O campo `role` não é enviado pelo frontend — o backend define automaticamente como "membro".
 */
export const CreateUserSchema = z.object({
	name: z.string().max(150),
	birth_date: z
		.string()
		.regex(
			/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
			"Data deve estar no formato YYYY-MM-DD",
		),
	telephone: z.string().max(11, "Telefone deve ter no máximo 11 dígitos"),
	email: z.string().email("Email inválido").max(255),
	password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").max(60),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
