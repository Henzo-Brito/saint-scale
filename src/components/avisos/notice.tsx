import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import sty from "@/constants/styles";

type Props = {
	title: string;
	subTitle: string;
};

/** Item de notificação simples exibido na lista de avisos. */
export default function Notice({ title, subTitle }: Props) {
	return (
		<TouchableOpacity style={style.container}>
			<View style={style.row}>
				<FontAwesomeIcon icon={faBell} size={30} color={sty.c5} />
				<Text style={style.title} numberOfLines={1}>
					{title}
				</Text>
				<Text style={style.subTitle} numberOfLines={1}>
					{subTitle}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 14,
		backgroundColor: sty.c8,
		borderRadius: 10,
		width: "100%",
	},
	row: {
		alignItems: "center",
		flexDirection: "row",
		gap: 18,
		width: "100%",
		justifyContent: "space-between",
	},
	title: {
		flex: 1,
		fontWeight: "600",
		fontSize: 20,
		overflow: "hidden",
		color: sty.c4,
	},
	subTitle: {
		fontWeight: "700",
		fontSize: 13,
		flexShrink: 0,
		overflow: "hidden",
		color: sty.c1,
		textAlign: "right",
	},
});
