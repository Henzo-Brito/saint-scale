/**
 * Tipos TypeScript derivados dos schemas da API backend.
 * Garante alinhamento completo entre frontend e backend.
 *
 * Estrutura organizacional:
 * - User (perfil e edição)
 * - Home (calendário, escalas, indisponibilidades)
 * - Alert (lembretes e notificações)
 * - Scale (detalhes de escala, músicas, membros)
 */

// ──────────────────────────────────────────────────────────────────
// USER TYPES
// ──────────────────────────────────────────────────────────────────

export interface Logradouro {
	rua: string;
	numero: number;
}

export interface EquipeItem {
	img_id: string | null;
	title: string;
	quant_part: number;
}

export interface Me {
	id_membro: number;
	nome: string;
	email: string;
	img_id: string | null;
	cargo: string;
	funcoes: string[];
	data_nascimento: string | null; // YYYY-MM-DD
	telefone: string | null; // 11 dígitos sem máscara
	logradouro: Logradouro | null;
	equipes: EquipeItem[];
	data_registro: string; // ISO datetime
}

export interface AlterEmail {
	email: string;
}

export interface ForgotPassword {
	email: string;
	password: string;
}

export interface AlterLogradouro {
	rua: string;
	numero: number;
}

export interface AlterBirthday {
	birth_date: string; // YYYY-MM-DD
}

export interface AlterTelephone {
	telephone: string; // 11 dígitos
}

export interface PatchResponse {
	message: string;
}

// ──────────────────────────────────────────────────────────────────
// HOME TYPES
// ──────────────────────────────────────────────────────────────────

export interface MonthItem {
	id_escala: string;
	dia: string; // DD/MM/YYYY
}

export interface UnavailabilityItem {
	id_escala: string;
	nome: string;
	funcao: string;
	img_id: string;
	dia: string; // DD/MM/YYYY
}

export interface ScaleItem {
	id_escala: string;
	confirmados: number;
	title_scale: string;
	funcao: string;
	img_id: string[];
	quant_music: number;
	data_hora: string; // DD/MM/YYYY HH:MM:SS
	dia: string; // DD/MM/YYYY
}

export interface ScaleDayItem {
	id_escala: string;
	confirmados: number;
	nome_escala: string;
	img_id: string[];
	quant_music: number;
	data_hora: string; // DD/MM/YYYY HH:MM:SS
	dia: string; // DD/MM/YYYY
}

// ──────────────────────────────────────────────────────────────────
// ALERT TYPES
// ──────────────────────────────────────────────────────────────────

export interface AlertItem {
	id_lembrete: string;
	name: string;
	date: string; // DD/MM/YYYY
	functions: string[];
}

export interface NotificationItem {
	id_notification: string;
	title: string;
	conteudo: string | null;
	date: string; // DD/MM/YYYY
}

export interface ReminderList {
	alert: AlertItem[];
	notifications: NotificationItem[];
}

export interface ReminderDetail {
	id_lembrete: string;
	name: string;
	date: string; // DD/MM/YYYY
	tempo: string; // HH:MM
	description: string;
	functions: string[];
}

// ──────────────────────────────────────────────────────────────────
// SCALE TYPES
// ──────────────────────────────────────────────────────────────────

export interface ScaleDetail {
	id_escala: string;
	nome: string;
	dia: string;
	dia_da_semana: string;
	data: string; // DD/MM/YYYY
}

export interface ScaleMusicItem {
	id_music_escalas: string;
	nome: string;
	banda: string;
	ordem: number;
	tom: string;
	image_id: string;
}

export interface ScaleMusicDetail {
	id_musica: string;
	nome: string;
	autor: string;
	tom_atual: string;
	tom_original: string;
	bpm: number | null;
	ordem: number;
	link_spotify: string;
	link_youtube: string;
	link_cifra: string;
	link_letra: string;
	duracao: string; // MM:SS
	img_id: string;
}

export interface IndisponibilidadeItem {
	image_id: string;
	name: string;
	funcao: string;
}

export interface ScaleInfo {
	id_escala: string;
	membros_confirmados: number;
	local: string | null;
	indisponibilidades: IndisponibilidadeItem[];
}

export interface ScaleMemberItem {
	id_membro_escala: string;
	nome: string;
	funcao: string;
	disponibilidade: "confirmado" | "pendente" | "indisponível";
	image_id: string;
}

export interface SairBody {
	id_escala: string;
}

export interface SubstituirBody {
	id_membro_escala: string;
}

// ──────────────────────────────────────────────────────────────────
// MONTH NAMES (para endpoint /home/month/{mes})
// ──────────────────────────────────────────────────────────────────

export type MonthName =
	| "janeiro"
	| "fevereiro"
	| "marco"
	| "abril"
	| "maio"
	| "junho"
	| "julho"
	| "agosto"
	| "setembro"
	| "outubro"
	| "novembro"
	| "dezembro";
