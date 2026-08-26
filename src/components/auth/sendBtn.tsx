import {
	type StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	type ViewStyle,
} from "react-native";
import style from "@/constants/styles";

type Props = {
	text: string;
	bgcolor?: string;
	sty?: StyleProp<ViewStyle>;
	func?: () => void;
};

export default function SendBtn({
	text,
	sty,
	bgcolor = style.c1,
	func,
}: Props) {
	return (
		<TouchableOpacity
			style={[
				styles.container,
				{
					backgroundColor: bgcolor,
				},
				sty,
			]}
			onPress={func}
		>
			<Text style={styles.text}>{text}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		borderRadius: 20,
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		fontSize: 28,
		fontWeight: 900,
		fontFamily: style.font1,
	},
});
