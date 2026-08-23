import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import Calendar from "@/components/calendar";
import Scales from "@/components/scales";
import sty from "@/constants/styles";

import { Mounth, WeekDay } from "@/types/scales.type";

export default function Index() {
	const [selectedDate, setSelectedDate] = useState<string>("2026-06-02");

	function dateConverser(dateString: string) {
		const [year, month, day] = dateString.split("-").map(Number);
		const date = new Date(year, month - 1, day);

		const diasSemana = [
			"Domingo",
			"Segunda-feira",
			"Terça-feira",
			"Quarta-feira",
			"Quinta-feira",
			"Sexta-feira",
			"Sábado",
		];

		const meses = [
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
		];

		const diaSemana = diasSemana[date.getDay()];
		const dia = date.getDate();
		const mes = meses[date.getMonth()];

		return { diaSemana, dia, mes };
	}

	const { diaSemana, dia, mes } = dateConverser(selectedDate);

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: sty.c7 }}
			contentContainerStyle={style.container}
		>
			<Calendar
				initialDate="2026-06-08"
				compromissos={[
					{
						date: "2026-06-20",
						scaleId: 12,
					},
				]}
				onDateChange={setSelectedDate}
			/>

			<Text style={style.title}>
				{diaSemana}, {dia} de {mes}
			</Text>

			<Scales
				Date={{
					Day: 12,
					Mounth: Mounth.Abril,
					WeekDay: WeekDay.Domingo,
					hour: "00:80",
				}}
				Persons={[
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
				]}
				func={() => {
					router.push({
						pathname: "/scale/[id]",
						params: { id: "123" },
					});
				}}
				status={{
					persons: 2,
					confirmed: 2,
					songs: 3,
				}}
				title="Banda das Quartas"
				styles={{ width: "100%" }}
			/>

			<Text style={style.title}>Minhas Escalas</Text>

			<Scales
				Date={{
					Day: 12,
					Mounth: Mounth.Abril,
					WeekDay: WeekDay.Domingo,
					hour: "00:80",
				}}
				Persons={[
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
				]}
				func={() => {
					router.push({
						pathname: "/scale/[id]",
						params: { id: "123" },
					});
				}}
				status={{
					persons: 2,
					confirmed: 2,
					songs: 3,
				}}
				title="Banda das Quartas"
				styles={{ width: "100%" }}
			/>
			<Scales
				Date={{
					Day: 12,
					Mounth: Mounth.Abril,
					WeekDay: WeekDay.Domingo,
					hour: "00:80",
				}}
				Persons={[
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
					require("@/assets/1.jpg"),
				]}
				func={() => {
					router.push({
						pathname: "/scale/[id]",
						params: { id: "123" },
					});
				}}
				status={{
					persons: 2,
					confirmed: 2,
					songs: 3,
				}}
				title="Banda das Quartas"
				styles={{ width: "100%" }}
			/>
		</ScrollView>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 15,
		gap: 15,
	},
	title: {
		color: sty.c4,
		fontWeight: 600,
		fontSize: 18,
		width: "100%",
	},
});
