import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faMusic, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
	ActivityIndicator,
	Alert,
	Linking,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import ReturnHeader from "@/components/allPages/returnHeader";
import sty from "@/constants/styles";
import { getMusicDetail } from "@/services/scales";

type LinkItem = {
	id: string;
	icon: IconDefinition;
	url: string;
	displayUrl: string;
	label: string;
};

export default function MusicDetails() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const {
		data: music,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["music", id],
		queryFn: () => getMusicDetail(id || ""),
		enabled: !!id,
	});

	const handleOpenLink = async (url: string) => {
		try {
			const supported = await Linking.canOpenURL(url);
			if (supported) {
				await Linking.openURL(url);
			} else {
				Alert.alert("Erro", "Não foi possível abrir este link.");
			}
		} catch (_error) {
			Alert.alert("Erro", "Ocorreu um erro ao tentar abrir a página.");
		}
	};

	if (isLoading) {
		return (
			<View style={styles.container}>
				<ReturnHeader title="Música" />
				<View style={styles.loading}>
					<ActivityIndicator size="large" color={sty.c1} />
				</View>
			</View>
		);
	}

	if (isError || !music) {
		return (
			<View style={styles.container}>
				<ReturnHeader title="Música" />
				<View style={styles.loading}>
					<Text style={styles.errorText}>Música não encontrada</Text>
				</View>
			</View>
		);
	}

	const links: LinkItem[] = [
		{
			id: "spotify",
			icon: faSpotify,
			url: music.link_spotify,
			displayUrl: music.link_spotify,
			label: "Spotify",
		},
		{
			id: "youtube",
			icon: faYoutube,
			url: music.link_youtube,
			displayUrl: music.link_youtube,
			label: "YouTube",
		},
		{
			id: "cifra",
			icon: faStar,
			url: music.link_cifra,
			displayUrl: music.link_cifra,
			label: "Cifra",
		},
		{
			id: "letra",
			icon: faMusic,
			url: music.link_letra,
			displayUrl: music.link_letra,
			label: "Letra",
		},
	].filter((link) => link.url); // Remove links vazios

	return (
		<View style={styles.container}>
			<ReturnHeader title="Música" />

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Informações da Música */}
				<View style={styles.headerInfo}>
					<View style={styles.musicImagePlaceholder}>
						<FontAwesomeIcon icon={faMusic} size={40} color={sty.c1} />
					</View>
					<View style={styles.musicTextContainer}>
						<Text style={styles.musicTitle}>{music.nome}</Text>
						<Text style={styles.musicSubtitle}>{music.autor}</Text>
						{music.bpm && <Text style={styles.musicBpm}>BPM: {music.bpm}</Text>}
					</View>
				</View>

				{/* Botões de Tom */}
				<View style={styles.toneContainer}>
					<View style={styles.toneButtonActive}>
						<Text style={styles.toneTextActive}>Tom: {music.tom_atual}</Text>
					</View>
					<View style={styles.toneButtonInactive}>
						<Text style={styles.toneTextInactive}>
							Tom original: {music.tom_original}
						</Text>
					</View>
				</View>

				{/* Card de Links */}
				<View style={styles.linksCard}>
					<View style={styles.cardHeader}>
						<Text style={styles.cardHeaderNumber}>{music.ordem}ª</Text>
						<Text style={styles.cardHeaderText}>Música a ser tocada</Text>
					</View>

					{links.length > 0 ? (
						links.map((item, index) => (
							<View key={item.id}>
								<TouchableOpacity
									style={styles.linkRow}
									onPress={() => handleOpenLink(item.url)}
									activeOpacity={0.7}
								>
									<FontAwesomeIcon icon={item.icon} size={20} color={sty.c4} />
									<Text style={styles.linkText} numberOfLines={1}>
										{item.label}
									</Text>
								</TouchableOpacity>

								{index < links.length - 1 && <View style={styles.divider} />}
							</View>
						))
					) : (
						<Text style={styles.emptyText}>Nenhum link disponível</Text>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

/* =========================================================
   ESTILOS
========================================================= */

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: sty.c12,
	},
	loading: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
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
		padding: 16,
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingBottom: 40,
		paddingTop: 10,
	},

	// Informações da Música
	headerInfo: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
	},
	musicImagePlaceholder: {
		width: 80,
		height: 80,
		borderRadius: 12,
		backgroundColor: sty.c19,
		marginRight: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	musicTextContainer: {
		flex: 1,
		justifyContent: "center",
	},
	musicTitle: {
		fontSize: 22,
		color: sty.c4,
		fontWeight: "bold" as const,
	},
	musicSubtitle: {
		fontSize: 14,
		color: sty.c16,
		marginTop: 2,
	},
	musicBpm: {
		fontSize: 18,
		color: sty.c18,
		fontWeight: "bold" as const,
		marginTop: 6,
	},

	// Tons
	toneContainer: {
		flexDirection: "row",
		marginBottom: 30,
		backgroundColor: sty.c13,
		borderRadius: 30,
	},
	toneButtonActive: {
		flex: 1,
		backgroundColor: sty.c1,
		paddingVertical: 12,
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	toneTextActive: {
		color: sty.c14,
		fontWeight: "bold",
		fontSize: 14,
	},
	toneButtonInactive: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	toneTextInactive: {
		color: sty.c16,
		fontSize: 14,
		fontWeight: "600",
		textDecorationLine: "line-through",
	},

	// Card de Links
	linksCard: {
		backgroundColor: sty.c13,
		borderRadius: 16,
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 8,
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		paddingHorizontal: 4,
	},
	cardHeaderNumber: {
		fontSize: 24,
		fontWeight: "bold",
		color: sty.c18,
		marginRight: 12,
	},
	cardHeaderText: {
		fontSize: 16,
		fontWeight: "bold",
		color: sty.c18,
	},
	linkRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 4,
	},
	linkText: {
		color: sty.c4,
		fontSize: 14,
		marginLeft: 16,
		fontWeight: "600",
		flex: 1,
	},
	divider: {
		height: 1,
		backgroundColor: sty.c15,
	},
});
