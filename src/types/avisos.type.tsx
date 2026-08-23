import type { Person } from "./person.type";

export type Aviso = {
	idAviso: string;
	title: string;
	desc: string;
	date: string;
	persons: Person[];
};
