import type {
	PatchResponse,
	SairBody,
	ScaleDetail,
	ScaleInfo,
	ScaleMemberItem,
	ScaleMusicDetail,
	ScaleMusicItem,
	SubstituirBody,
} from "@/types/api.types";
import { api } from "./api";

/**
 * Busca os detalhes básicos de uma escala (nome, data, dia da semana).
 *
 * @param id ID da escala
 * @returns Detalhes básicos da escala
 */
export async function getScale(id: string): Promise<ScaleDetail> {
	const response = await api.get<ScaleDetail>(`/scale/${id}`);
	return response.data;
}

/**
 * Busca as músicas de uma escala (lista resumida).
 *
 * @param id ID da escala
 * @returns Array de músicas com ordem e tom
 */
export async function getScaleMusics(id: string): Promise<ScaleMusicItem[]> {
	const response = await api.get<ScaleMusicItem[]>(`/scale/${id}/musics`);
	return response.data;
}

/**
 * Busca os detalhes completos de uma música específica de uma escala.
 *
 * @param idScale ID da escala
 * @param idMusicEscalas ID da relação música-escala
 * @returns Detalhes completos da música (links, tom, BPM, etc)
 */
export async function getScaleMusicDetail(
	idScale: string,
	idMusicEscalas: string,
): Promise<ScaleMusicDetail> {
	const response = await api.get<ScaleMusicDetail>(
		`/scale/${idScale}/music/${idMusicEscalas}`,
	);
	return response.data;
}

/**
 * Busca informações gerais de uma escala (membros confirmados, local, indisponibilidades).
 *
 * @param id ID da escala
 * @returns Informações gerais da escala
 */
export async function getScaleInfo(id: string): Promise<ScaleInfo> {
	const response = await api.get<ScaleInfo>(`/scale/${id}/info`);
	return response.data;
}

/**
 * Busca a lista de membros de uma escala com suas disponibilidades.
 *
 * @param id ID da escala
 * @returns Array de membros com status de disponibilidade
 */
export async function getScaleMembers(id: string): Promise<ScaleMemberItem[]> {
	const response = await api.get<ScaleMemberItem[]>(`/scale/${id}/members`);
	return response.data;
}

/**
 * Marca o usuário autenticado como indisponível para uma escala.
 * ID do membro é extraído do JWT automaticamente pelo backend.
 *
 * @param data Objeto com id_escala
 * @returns Mensagem de confirmação
 */
export async function sairDaEscala(data: SairBody): Promise<PatchResponse> {
	const response = await api.post<PatchResponse>("/scale/sair", data);
	return response.data;
}

/**
 * Solicita substituição de um membro em uma escala.
 * O usuário autenticado (via JWT) assume o lugar do membro selecionado.
 *
 * Contrato: POST /scale/substituir retorna ScaleMemberItem[] — a lista
 * atualizada de membros da escala após a substituição. O frontend invalida
 * o cache de members após a chamada e não utiliza o retorno diretamente.
 *
 * @param data Objeto com id_membro_escala
 * @returns Lista atualizada de membros da escala
 */
export async function substituirMembro(
	data: SubstituirBody,
): Promise<ScaleMemberItem[]> {
	const response = await api.post<ScaleMemberItem[]>("/scale/substituir", data);
	return response.data;
}

/**
 * Busca os detalhes completos de uma música pelo ID da relação música-escala.
 * Endpoint independente — não requer o ID da escala (resolve DR-001 opção B).
 * Usado pela tela /music/[id] do frontend.
 *
 * @param idMusicEscalas ID da relação musicas_escalas
 * @returns Detalhes completos da música
 */
export async function getMusicDetail(
	idMusicEscalas: string,
): Promise<ScaleMusicDetail> {
	const response = await api.get<ScaleMusicDetail>(`/music/${idMusicEscalas}`);
	return response.data;
}
