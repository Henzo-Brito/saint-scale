import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, type DateData, LocaleConfig } from "react-native-calendars";
import style from "@/constants/styles";
import {
	MONTH_NAMES,
	MONTH_NAMES_SHORT,
	WEEKDAY_NAMES,
	WEEKDAY_NAMES_SHORT,
} from "@/utils/date";

LocaleConfig.locales["pt-br"] = {
	monthNames: [...MONTH_NAMES],
	monthNamesShort: [...MONTH_NAMES_SHORT],
	dayNames: [...WEEKDAY_NAMES],
	dayNamesShort: [...WEEKDAY_NAMES_SHORT],
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
					textSectionTitleColor: style.c2,
					selectedDayBackgroundColor: style.c2,
					selectedDayTextColor: style.c4,
					todayTextColor: style.c3,
					dayTextColor: style.c4,
					textDisabledColor: style.c2,
					dotColor: style.c4,
					arrowColor: style.c4,
					monthTextColor: style.c4,
					textDayFontSize: 18,
					textMonthFontSize: 22,
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
		maxWidth: 500,
		alignSelf: "center",
		borderWidth: 2,
		borderColor: style.c5,
		overflow: "hidden",
	},
});
