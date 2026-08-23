import style from "@/constants/styles";
import {
	type KeyboardType,
	type StyleProp,
	StyleSheet,
	TextInput,
	type TextStyle,
} from "react-native";

type Props = {
	placeholder: string;
	keyboardType?: KeyboardType;
	sty?: StyleProp<TextStyle>;
};

export default function TextInputComponent({
	keyboardType = "default",
	placeholder,
	sty,
}: Props) {
	return (
		<TextInput
			keyboardType={keyboardType}
			placeholder={placeholder}
			placeholderTextColor={style.c9}
			style={[styles.container, sty]}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		borderRadius: 18,
		padding: 10,
		fontSize: 25,
		fontWeight: "500",
		color: style.c4,
		borderColor: style.c9,
		borderWidth: 2,
		fontFamily: style.font1,
	},
});
