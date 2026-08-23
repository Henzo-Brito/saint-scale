import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, type DateData, LocaleConfig } from "react-native-calendars";
import style from "@/constants/styles";

LocaleConfig.locales["pt-br"] = {
	monthNames: [
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
	],
	monthNamesShort: [
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
	],
	dayNames: [
		"Domingo",
		"Segunda-feira",
		"Terça-feira",
		"Quarta-feira",
		"Quinta-feira",
		"Sexta-feira",
		"Sábado",
	],
	dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
};

LocaleConfig.defaultLocale = "pt-br";

type Compromissos = {
	date: string;
	scaleId: number;
};

type Props = {
	initialDate: string;
	compromissos?: Compromissos[];
	onDateChange?: (date: string) => void;
};

// Objeto de configuração para as marcações da biblioteca
type MarkedDatesType = {
	[date: string]: {
		marked?: boolean;
		dotColor?: string;
		selected?: boolean;
		selectedColor?: string;
		selectedTextColor?: string;
	};
};

export default function CustomCalendar({
	initialDate,
	compromissos = [],
	onDateChange,
}: Props) {
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split("T")[0],
	);
	const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});

	useEffect(() => {
		const datesMarkings: MarkedDatesType = {};

		compromissos.forEach((compromisso) => {
			datesMarkings[compromisso.date] = {
				marked: true,
				dotColor: style.c2,
			};
		});

		if (selectedDate) {
			datesMarkings[selectedDate] = {
				...datesMarkings[selectedDate],
				selected: true,
				selectedColor: style.c1,
				selectedTextColor: style.c4,
			};
		}

		setMarkedDates(datesMarkings);
	}, [selectedDate, compromissos]);

	return (
		<View style={styles.container}>
			<Calendar
				current={initialDate}
				onDayPress={(day: DateData) => {
					setSelectedDate(day.dateString);
					onDateChange?.(day.dateString);
				}}
				markedDates={markedDates}
				markingType={"dot"}
				theme={{
					backgroundColor: "rgba(0, 0, 0, 0)",
					calendarBackground: "rgba(0, 0, 0, 0)",
					textSectionTitleColor: style.c2, // Cor dos dias da semana (Dom, Seg...)
					selectedDayBackgroundColor: style.c2, // Fundo do dia selecionado (padrão)
					selectedDayTextColor: style.c4,
					todayTextColor: style.c3, // Cor do texto do dia de hoje
					dayTextColor: style.c4, // Cor do texto dos dias normais
					textDisabledColor: style.c2, // Cor dos dias do mês anterior/próximo
					dotColor: style.c4, // Cor da bolinha de compromisso padrão
					arrowColor: style.c4, // Cor das setas de navegar nos meses
					monthTextColor: style.c4, // Cor do título do mês (Ex: Junho 2026)
					textDayFontSize: 18, // Tamanho da fonte dos dias
					textMonthFontSize: 22, // Tamanho da fonte do mês
					textDayFontWeight: 400,
					textMonthFontWeight: 600,
					textDayHeaderFontWeight: 700,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 5,
		borderRadius: 20,
		width: "100%",
		borderWidth: 2,
		maxWidth: 500,
		borderColor: style.c5,
	},
});
