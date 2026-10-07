import type {
	MonthItem,
	MonthName,
	ScaleDayItem,
	ScaleItem,
	UnavailabilityItem,
} from "@/types/api.types";
import { api } from "./api";

/**
 * Busca as escalas de um mês específico.
 * Retorna os dias que possuem escalas agendadas.
 *
 * @param mes Nome do mês em português (ex: "novembro")
 * @returns Array de dias com escalas
 */
export async function getMonth(mes: MonthName): Promise<MonthItem[]> {
	const response = await api.get<MonthItem[]>(`/home/month/${mes}`);
	return response.data;
}

/**
 * Busca membros indisponíveis em um mês específico.
 *
 * @param mes Nome do mês em português
 * @returns Array de indisponibilidades
 */
export async function getUnavailability(
	mes: MonthName,
): Promise<UnavailabilityItem[]> {
	const response = await api.get<UnavailabilityItem[]>(
		`/home/unavailability/${mes}`,
	);
	return response.data;
}

/**
 * Busca as escalas do usuário autenticado.
 * ID do membro é extraído do JWT automaticamente pelo backend.
 *
 * @returns Array de escalas do usuário
 */
export async function getMyScales(): Promise<ScaleItem[]> {
	const response = await api.get<ScaleItem[]>("/home/scale/me");
	return response.data;
}

/**
 * Busca todas as escalas de um dia específico.
 *
 * @param day Data no formato DDMMYYYY (ex: "14112026")
 * @returns Array de escalas do dia
 */
export async function getScaleDay(day: string): Promise<ScaleDayItem[]> {
	const response = await api.get<ScaleDayItem[]>(`/home/scale/day/${day}`);
	return response.data;
}
