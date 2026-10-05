export enum Mounth {
	Janeiro = "Janeiro",
	Fevereiro = "Fevereiro",
	Março = "Março",
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

export enum WeekDay {
	Domingo = "Domingo",
	Segunda = "Segunda",
	Terça = "Terça",
	Quarta = "Quarta",
	Quinta = "Quinta",
	Sexta = "Sexta",
	Sábado = "Sábado",
}

export type Date = {
	Day: number;
	Mounth: Mounth;
	WeekDay: WeekDay;
	hour: string;
};

export type Status = {
	persons: number;
	confirmed: number;
	songs: number;
};
