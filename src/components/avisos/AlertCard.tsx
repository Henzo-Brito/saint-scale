import { faBullhorn } from "@fortawesome/free-solid-svg-icons/faBullhorn";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import sty from "@/constants/styles";

type Props = {
	title: string;
	subTitle: string;
	/** Grupo ou função alvo do alerta (ex.: "Guitarristas e tecladistas"). */
	targetGroup: string;
	onPress: () => void;
};

/** Card de alerta genérico exibido na seção de Avisos. */
export default function AlertCard({
	title,
	subTitle,
	targetGroup,
	onPress,
}: Props) {
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.row}>
				<FontAwesomeIcon icon={faBullhorn} size={48} color={sty.c1} />
				<View style={styles.textGroup}>
					<Text style={styles.subTitle} numberOfLines={1}>
						{subTitle}
					</Text>
					<Text style={styles.title} numberOfLines={1}>
						{title}
					</Text>
					<Text style={styles.targetGroup} numberOfLines={1}>
						{targetGroup}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 12,
		backgroundColor: sty.c8,
		borderRadius: 10,
		width: 250,
		maxWidth: 250,
		gap: 7,
	},
	row: {
		flexDirection: "row",
		gap: 18,
		alignItems: "center",
	},
	textGroup: {
		flex: 1,
		gap: 6,
	},
	title: {
		fontWeight: "700",
		fontSize: 24,
		overflow: "hidden",
		color: sty.c4,
	},
	subTitle: {
		fontWeight: "500",
		fontSize: 14,
		overflow: "hidden",
		color: sty.c4,
	},
	targetGroup: {
		fontSize: 12,
		color: sty.c4,
	},
});
