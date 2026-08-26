import { ArrowRight } from "lucide-react-native";
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

export default function ContinueBtn({
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
			<ArrowRight strokeWidth={2.5}></ArrowRight>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		borderRadius: 50,
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		gap: 10,
	},
	text: {
		fontSize: 22,
		fontWeight: 900,
		fontFamily: style.font1,
	},
});
