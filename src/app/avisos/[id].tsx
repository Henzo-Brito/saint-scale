import { faBullhorn } from "@fortawesome/free-solid-svg-icons/faBullhorn";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import ReturnHeader from "@/components/allPages/returnHeader";
import sty from "@/constants/styles";
import { getReminderDetail } from "@/services/alerts";

export default function Avisos() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const {
		data: aviso,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["alert", "detail", id],
		queryFn: () => getReminderDetail(id || ""),
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<View style={styles.container}>
				<ReturnHeader title="Alerta" />
				<View
					style={[
						styles.mainContent,
						{ justifyContent: "center", alignItems: "center" },
					]}
				>
					<ActivityIndicator size="large" color={sty.c1} />
				</View>
			</View>
		);
	}

	if (isError || !aviso) {
		return (
			<View style={styles.container}>
				<ReturnHeader title="Alerta" />
				<View style={styles.notFoundContainer}>
					<Text style={styles.notFound}>Aviso não encontrado.</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ReturnHeader title="Alerta" />

			<View style={styles.mainContent}>
				{/* Seção Superior */}
				<View style={styles.headerSection}>
					<View style={styles.iconCircle}>
						<FontAwesomeIcon icon={faBullhorn} size={36} color={sty.c11} />
					</View>
					<Text style={styles.title}>{aviso.name}</Text>
					<Text style={styles.subtitle}>{aviso.functions.join(", ")}</Text>
				</View>

				{/* Card de Conteúdo */}
				<View style={styles.cardContainer}>
					<ScrollView
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.dateRow}>
							<Text style={styles.dateText}>{aviso.date}</Text>
							<Text style={styles.dateText}>{aviso.tempo}</Text>
						</View>

						<Text style={styles.descriptionTitle}>Descrição</Text>
						<Text style={styles.descriptionText}>{aviso.description}</Text>
					</ScrollView>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: sty.c11,
	},
	mainContent: {
		flex: 1,
	},
	headerSection: {
		alignItems: "center",
		paddingVertical: 24,
		paddingHorizontal: 20,
	},
	iconCircle: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: sty.c1,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		color: sty.c4,
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 6,
	},
	subtitle: {
		color: sty.c16,
		fontSize: 14,
		textAlign: "center",
	},
	cardContainer: {
		flex: 1,
		backgroundColor: sty.c14,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	scrollContent: {
		paddingBottom: 40,
	},
	dateRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	dateText: {
		color: sty.c16,
		fontSize: 14,
	},
	descriptionTitle: {
		color: sty.c4,
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 16,
	},
	descriptionText: {
		color: sty.c4,
		fontSize: 16,
		lineHeight: 24,
	},
	notFoundContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	notFound: {
		color: sty.c4,
		fontSize: 16,
	},
});
