import { Menu } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import sty from "../constants/styles";

type Props = {
	title: string;
	children?: React.ReactNode;
};

export default function Header({ title, children }: Props) {
	return (
		<SafeAreaView style={style.container} edges={["top"]}>
			<TouchableOpacity
				style={{ alignItems: "center", justifyContent: "center" }}
			>
				<Menu size={25} color={sty.c4} strokeWidth={3} />
			</TouchableOpacity>

			<Text style={style.title}>{title}</Text>

			{children}
		</SafeAreaView>
	);
}

const style = StyleSheet.create({
	container: {
		gap: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
		paddingBottom: 5,
		backgroundColor: sty.c7,
	},
	title: {
		fontWeight: "700",
		fontFamily: sty.font1,
		fontSize: 25,
		color: sty.c4,
		flex: 1,
	},
});
