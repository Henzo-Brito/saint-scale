import type { CreateUser } from "@/schemas/user.schemas";
import { api } from "./api";

export async function getUsers() {
	const response = await api.get("/user");

	return response.data;
}

export async function createUser(user: CreateUser) {
	const birthDate = user.birth_date
		.split("/")
		.reverse()
		.join("-");

	const telephone = user.telephone.replace(/\D/g, "");

	const response = await api.post("/user", {
		name: user.name,
		birth_date: birthDate,
		telephone: telephone,
		email: user.email,
		password: user.password,
		role: user.role
	});

	return response.data;
}