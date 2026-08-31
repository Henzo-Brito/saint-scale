import { api } from "./api";
import {
	LoginResponseSchema,
	type LoginRequest,
} from "@/schemas/auth.schemas";

export async function login(data: LoginRequest) {
	const response = await api.post("/auth/login", data);

	return LoginResponseSchema.parse(response.data);
}