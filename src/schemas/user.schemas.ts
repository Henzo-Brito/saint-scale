import { z } from "zod";

export const UserSchema = z.object({
	id_member: z.string().uuid(),
	name: z.string().max(150),
	register_date: z.string().datetime(),
	birth_date: z.string().date(),
	telephone: z.string().max(11),
	email: z.string().max(100),
	password: z.string().max(100),
	role: z.enum(["organizador", "líder", "membro"]),
	id_function: z.string().uuid().nullable(),
	id_logradouro: z.string().uuid().nullable(),
});

export const CreateUserSchema = z.object({
	name: z.string().max(150),
	birth_date: z.string().date(),
	telephone: z.string().max(11),
	email: z.string().max(100),
	password: z.string().max(60),
	role: z.enum(["organizador", "líder", "membro"]),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
