import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import AlertCard from "@/components/avisos/AlertCard";
import Notice from "@/components/avisos/notice";
import Section from "@/components/Section";
import sty from "@/constants/styles";
import { getReminder } from "@/services/alerts";

export default function Warnings() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["alerts", "reminder"],
		queryFn: getReminder,
	});

	if (isLoading) {
		return (
			<View
				style={[
					style.container,
					{ justifyContent: "center", alignItems: "center", flex: 1 },
				]}
			>
				<ActivityIndicator size="large" color={sty.c1} />
			</View>
		);
	}

	if (isError || !data) {
		return (
			<View
				style={[
					style.container,
					{ justifyContent: "center", alignItems: "center", flex: 1 },
				]}
			>
				<Text style={style.errorText}>Erro ao carregar avisos</Text>
			</View>
		);
	}

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: sty.c7 }}
			contentContainerStyle={style.container}
		>
			{data.alert.length > 0 && (
				<Section title="Alertas" btnTitle="" onPress={() => {}}>
					{data.alert.map((alert) => (
						<AlertCard
							key={alert.id_lembrete}
							title={alert.name}
							subTitle={alert.date}
							targetGroup={alert.functions.join(", ")}
							onPress={() => {
								router.push(`/avisos/${alert.id_lembrete}`);
							}}
						/>
					))}
				</Section>
			)}

			{data.notifications.length > 0 && (
				<>
					<Text style={style.title}>Notificações</Text>
					{data.notifications.map((notification) => (
						<Notice
							key={notification.id_notification}
							title={notification.title}
							subTitle={notification.date}
						/>
					))}
				</>
			)}

			{data.alert.length === 0 && data.notifications.length === 0 && (
				<Text style={style.emptyText}>
					Nenhum aviso ou notificação no momento
				</Text>
			)}
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
		fontWeight: "600" as const,
		fontSize: 18,
		width: "100%",
	},
	errorText: {
		color: sty.c10,
		fontSize: 18,
		textAlign: "center",
	},
	emptyText: {
		color: sty.c5,
		fontSize: 14,
		textAlign: "center",
		padding: 20,
	},
});
