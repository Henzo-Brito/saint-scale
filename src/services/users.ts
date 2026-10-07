import type { CreateUser } from "@/schemas/user.schemas";
import type {
	AlterBirthday,
	AlterEmail,
	AlterLogradouro,
	AlterTelephone,
	ForgotPassword,
	Me,
	PatchResponse,
} from "@/types/api.types";
import { api } from "./api";

/**
 * Cria um novo usuário na API.
 *
 * Conversões realizadas:
 * - Data de nascimento: DD/MM/YYYY (formulário) → YYYY-MM-DD (API ISO)
 * - Telefone: remove caracteres não numéricos (máscara)
 */
export async function createUser(user: CreateUser) {
	// A API espera a data no formato ISO "YYYY-MM-DD", mas o formulário envia "DD/MM/YYYY".
	const [day, month, year] = user.birth_date.split("/");
	const birthDate = `${year}-${month}-${day}`;

	// Remove qualquer caractere não numérico antes de enviar (ex.: "(11) 98705-1565" → "11987051565").
	const telephone = user.telephone.replace(/\D/g, "");

	const response = await api.post("/user", {
		name: user.name,
		birth_date: birthDate,
		telephone,
		email: user.email,
		password: user.password,
		// role não é enviado — o backend define automaticamente como "membro"
	});

	return response.data;
}

/**
 * Busca os dados completos do perfil do usuário autenticado.
 * Inclui: funções, equipes, logradouro, etc.
 */
export async function getMe(): Promise<Me> {
	const response = await api.get<Me>("/user/me");
	return response.data;
}

/**
 * Altera o email do usuário autenticado.
 */
export async function alterEmail(data: AlterEmail): Promise<PatchResponse> {
	const response = await api.patch<PatchResponse>("/user/alterEmail", data);
	return response.data;
}

/**
 * Altera a senha do usuário.
 * Endpoint público - identificação por email (para fluxo "esqueci senha").
 */
export async function forgotPassword(
	data: ForgotPassword,
): Promise<PatchResponse> {
	const response = await api.patch<PatchResponse>("/user/forgotPassword", data);
	return response.data;
}

/**
 * Altera o logradouro do usuário autenticado.
 * Faz upsert no banco - cria ou reutiliza logradouro existente.
 */
export async function alterLogradouro(
	data: AlterLogradouro,
): Promise<PatchResponse> {
	const response = await api.patch<PatchResponse>(
		"/user/alterLogradouro",
		data,
	);
	return response.data;
}

/**
 * Altera a data de nascimento do usuário autenticado.
 * @param data.birth_date Formato: YYYY-MM-DD
 */
export async function alterBirthday(
	data: AlterBirthday,
): Promise<PatchResponse> {
	const response = await api.patch<PatchResponse>("/user/alterBirthday", data);
	return response.data;
}

/**
 * Altera o telefone do usuário autenticado.
 * @param data.telephone Apenas dígitos, sem máscara (max 11)
 */
export async function alterTelephone(
	data: AlterTelephone,
): Promise<PatchResponse> {
	const response = await api.patch<PatchResponse>("/user/alterTelephone", data);
	return response.data;
}
