import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import Calendar from "@/components/calendar";
import Outages from "@/components/home/outages";
import Section from "@/components/Section";
import Scales from "@/components/scales";
import sty from "@/constants/styles";
import {
	getMonth,
	getMyScales,
	getScaleDay,
	getUnavailability,
} from "@/services/home";
import type { MonthName } from "@/types/api.types";
import { Month, WeekDay } from "@/types/scales.type";
import { parseDateString } from "@/utils/date";

// Mapa de nomes de meses em português para o enum Month
const MONTH_MAP: Record<string, Month> = {
	janeiro: Month.Janeiro,
	fevereiro: Month.Fevereiro,
	marco: Month.Marco,
	abril: Month.Abril,
	maio: Month.Maio,
	junho: Month.Junho,
	julho: Month.Julho,
	agosto: Month.Agosto,
	setembro: Month.Setembro,
	outubro: Month.Outubro,
	novembro: Month.Novembro,
	dezembro: Month.Dezembro,
};

// Mapa de dias da semana
const WEEKDAY_MAP: Record<string, WeekDay> = {
	domingo: WeekDay.Domingo,
	segunda: WeekDay.Segunda,
	"segunda-feira": WeekDay.Segunda,
	terça: WeekDay.Terca,
	"terça-feira": WeekDay.Terca,
	quarta: WeekDay.Quarta,
	"quarta-feira": WeekDay.Quarta,
	quinta: WeekDay.Quinta,
	"quinta-feira": WeekDay.Quinta,
	sexta: WeekDay.Sexta,
	"sexta-feira": WeekDay.Sexta,
	sábado: WeekDay.Sabado,
	sabado: WeekDay.Sabado,
};

export default function Index() {
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split("T")[0],
	);

	const { diaSemana, dia, mes } = parseDateString(selectedDate);

	// Converte mês atual para o formato da API (ex: "novembro")
	const mesAPI = mes.toLowerCase() as MonthName;

	// Busca escalas do mês para marcar no calendário
	const { data: monthData } = useQuery({
		queryKey: ["home", "month", mesAPI],
		queryFn: () => getMonth(mesAPI),
	});

	// Busca indisponibilidades do mês
	const { data: unavailabilityData } = useQuery({
		queryKey: ["home", "unavailability", mesAPI],
		queryFn: () => getUnavailability(mesAPI),
	});

	// Busca minhas escalas
	const { data: myScales, isLoading: myScalesLoading } = useQuery({
		queryKey: ["home", "myScales"],
		queryFn: getMyScales,
	});

	// Busca escalas do dia selecionado (formato DDMMYYYY)
	const dayFormatted = selectedDate.split("-").reverse().join(""); // "2026-11-14" -> "14112026"
	const { data: scaleDayData, isLoading: scaleDayLoading } = useQuery({
		queryKey: ["home", "scaleDay", dayFormatted],
		queryFn: () => getScaleDay(dayFormatted),
		enabled: !!selectedDate,
	});

	// Converte dados do mês para formato do calendário
	const compromissos = useMemo(() => {
		if (!monthData) return [];
		return monthData.map((item) => {
			const [day, month, year] = item.dia.split("/");
			return {
				date: `${year}-${month}-${day}`, // Converte DD/MM/YYYY -> YYYY-MM-DD
				scaleId: Number.parseInt(item.id_escala, 10),
			};
		});
	}, [monthData]);

	function parseScaleDateTime(dataHora: string) {
		// "14/11/2026 19:00:00" -> { day: 14, month: Month.Novembro, hour: "19:00" }
		const [datePart, timePart] = dataHora.split(" ");
		const [day, _month, _year] = datePart.split("/");
		const [hour, minute] = timePart.split(":");

		const monthName = MONTH_MAP[mes.toLowerCase()] || Month.Janeiro;

		return {
			Day: Number.parseInt(day, 10),
			Month: monthName,
			WeekDay: WEEKDAY_MAP[diaSemana.toLowerCase()] || WeekDay.Segunda,
			hour: `${hour}:${minute}`,
		};
	}

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: sty.c7 }}
			contentContainerStyle={style.container}
		>
			<Calendar
				initialDate={selectedDate}
				compromissos={compromissos}
				onDateChange={setSelectedDate}
			/>

			{unavailabilityData && unavailabilityData.length > 0 && (
				<Section title="Indisponibilidades, de " mes={mes} onPress={() => {}}>
					{unavailabilityData.map((item) => (
						<Outages
							key={item.id_escala + item.nome}
							img={
								item.img_id ? { uri: item.img_id } : require("@/assets/1.jpg")
							}
							subTitle={item.dia}
							title={item.nome}
							memberRole={item.funcao}
							onPress={() => {
								router.push({
									pathname: "/scale/[id]",
									params: { id: item.id_escala },
								});
							}}
						/>
					))}
				</Section>
			)}

			<Text style={style.title}>
				{diaSemana}, {dia} de {mes}
			</Text>

			{scaleDayLoading ? (
				<ActivityIndicator size="small" color={sty.c1} />
			) : scaleDayData && scaleDayData.length > 0 ? (
				scaleDayData.map((scale) => (
					<Scales
						key={scale.id_escala}
						scaleDate={parseScaleDateTime(scale.data_hora)}
						Persons={scale.img_id.map((img) => ({ uri: img }))}
						onPress={() => {
							router.push({
								pathname: "/scale/[id]",
								params: { id: scale.id_escala },
							});
						}}
						status={{
							persons: scale.img_id.length,
							confirmed: scale.confirmados,
							songs: scale.quant_music,
						}}
						title={scale.nome_escala}
						styles={{ width: "100%" }}
					/>
				))
			) : (
				<Text style={style.emptyText}>Nenhuma escala neste dia</Text>
			)}

			<Text style={style.title}>Minhas Escalas</Text>

			{myScalesLoading ? (
				<ActivityIndicator size="small" color={sty.c1} />
			) : myScales && myScales.length > 0 ? (
				myScales.map((scale) => (
					<Scales
						key={scale.id_escala}
						scaleDate={parseScaleDateTime(scale.data_hora)}
						Persons={scale.img_id.map((img) => ({ uri: img }))}
						onPress={() => {
							router.push({
								pathname: "/scale/[id]",
								params: { id: scale.id_escala },
							});
						}}
						status={{
							persons: scale.img_id.length,
							confirmed: scale.confirmados,
							songs: scale.quant_music,
						}}
						title={scale.title_scale}
						styles={{ width: "100%" }}
					/>
				))
			) : (
				<Text style={style.emptyText}>Você não tem escalas agendadas</Text>
			)}
		</ScrollView>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 15,
		gap: 18,
	},
	title: {
		color: sty.c4,
		fontWeight: "600" as const,
		fontSize: 18,
		width: "100%",
	},
	emptyText: {
		color: sty.c5,
		fontSize: 14,
		textAlign: "center",
		padding: 20,
	},
});
