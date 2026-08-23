import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import style from "@/constants/styles";

type Props = {
	icon: LucideIcon;
	title: string;
	desc: string;
	func: () => void;
};

export default function Alert({ icon: Icon, title, desc, func }: Props) {
	return (
		<TouchableOpacity onPress={func} style={styles.container}>
			<Icon strokeWidth={2.2} color={style.c4} />
			<View style={styles.right}>
				<Text numberOfLines={1} style={styles.title}>
					{title}
				</Text>
				<Text numberOfLines={1} style={styles.text}>
					{desc}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		borderRadius: 10,
		backgroundColor: style.c6,
		width: 230,
		maxWidth: 350,
		padding: 15,
	},
	text: {
		color: style.c5,
		fontSize: 13,
		overflow: "hidden",
	},
	title: {
		color: style.c4,
		fontWeight: 600,
		fontSize: 15,
		overflow: "hidden",
		width: "100%",
	},
	right: {
		width: "80%",
	},
});
