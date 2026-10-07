/** Nomes completos dos meses em português, indexados por mês (0 = Janeiro). */
export const MONTH_NAMES = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
] as const;

/** Nomes abreviados dos meses em português. */
export const MONTH_NAMES_SHORT = [
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez",
] as const;

/** Nomes completos dos dias da semana em português, indexados por getDay() (0 = Domingo). */
export const WEEKDAY_NAMES = [
	"Domingo",
	"Segunda-feira",
	"Terça-feira",
	"Quarta-feira",
	"Quinta-feira",
	"Sexta-feira",
	"Sábado",
] as const;

/** Nomes abreviados dos dias da semana em português. */
export const WEEKDAY_NAMES_SHORT = [
	"Dom",
	"Seg",
	"Ter",
	"Qua",
	"Qui",
	"Sex",
	"Sáb",
] as const;

/**
 * Converte uma string de data no formato "YYYY-MM-DD" para partes localizadas
 * em português (dia da semana, número do dia e nome do mês).
 *
 * @example
 * parseDateString("2026-06-20")
 * // → { diaSemana: "Sábado", dia: 20, mes: "Junho" }
 */
export function parseDateString(dateString: string): {
	diaSemana: string;
	dia: number;
	mes: string;
} {
	const [year, month, day] = dateString.split("-").map(Number);
	const date = new Date(year, month - 1, day);

	return {
		diaSemana: WEEKDAY_NAMES[date.getDay()],
		dia: date.getDate(),
		mes: MONTH_NAMES[date.getMonth()],
	};
}
