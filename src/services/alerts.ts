import type { ReminderDetail, ReminderList } from "@/types/api.types";
import { api } from "./api";

/**
 * Busca a lista de lembretes (alertas) e notificações do usuário autenticado.
 * ID do membro é extraído do JWT automaticamente pelo backend.
 *
 * @returns Objeto com arrays de alertas e notificações
 */
export async function getReminder(): Promise<ReminderList> {
	const response = await api.get<ReminderList>("/alert/reminder");
	return response.data;
}

/**
 * Busca o detalhe de um lembrete específico.
 *
 * @param id ID do lembrete
 * @returns Detalhes completos do lembrete
 */
export async function getReminderDetail(id: string): Promise<ReminderDetail> {
	const response = await api.get<ReminderDetail>(`/alert/reminder/${id}`);
	return response.data;
}
