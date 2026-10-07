/** Meses do ano em português. Usado nos cards de escala. */
export enum Month {
	Janeiro = "Janeiro",
	Fevereiro = "Fevereiro",
	/** Alias sem cedilha para compatibilidade com chaves de mapa baseadas em nomes de API. */
	Marco = "Março",
	Abril = "Abril",
	Maio = "Maio",
	Junho = "Junho",
	Julho = "Julho",
	Agosto = "Agosto",
	Setembro = "Setembro",
	Outubro = "Outubro",
	Novembro = "Novembro",
	Dezembro = "Dezembro",
}

/** Dias da semana em português. Usado nos cards de escala. */
export enum WeekDay {
	Domingo = "Domingo",
	Segunda = "Segunda",
	/** Alias sem cedilha para compatibilidade com chaves de mapa. */
	Terca = "Terça",
	Quarta = "Quarta",
	Quinta = "Quinta",
	Sexta = "Sexta",
	/** Alias sem acento para compatibilidade com chaves de mapa. */
	Sabado = "Sábado",
}

/** Data de uma escala, com dia da semana, dia do mês, mês e horário. */
export type ScaleDate = {
	Day: number;
	Month: Month;
	WeekDay: WeekDay;
	hour: string;
};

/** Contadores de status exibidos no card de escala. */
export type Status = {
	persons: number;
	confirmed: number;
	songs: number;
};
