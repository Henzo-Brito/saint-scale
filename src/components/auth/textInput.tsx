import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
	Pressable,
	type StyleProp,
	StyleSheet,
	TextInput,
	type TextStyle,
	View,
} from "react-native";
import style from "@/constants/styles";

type InputType = "text" | "email" | "password" | "phone" | "date";

type Props = {
	placeholder: string;
	type?: InputType;
	sty?: StyleProp<TextStyle>;
	onChange?: (str: string) => void;
};

export default function TextInputComponent({
	placeholder,
	type = "text",
	onChange = () => {},
	sty,
}: Props) {
	const [showPassword, setShowPassword] = useState(false);
	const [phone, setPhone] = useState("");
	const [date, setDate] = useState("");

	const isPassword = type === "password";
	const isPhone = type === "phone";
	const isDate = type === "date";

	function formatPhone(value: string) {
		const numbers = value.replace(/\D/g, "").slice(0, 11);

		if (numbers.length <= 2) {
			return numbers;
		}

		if (numbers.length <= 7) {
			return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
		}

		return `(${numbers.slice(0, 2)}) ${numbers.slice(
			2,
			7,
		)}-${numbers.slice(7, 11)}`;
	}

	function formatDate(value: string) {
		const numbers = value.replace(/\D/g, "").slice(0, 8);

		if (numbers.length <= 2) {
			return numbers;
		}

		if (numbers.length <= 4) {
			return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
		}

		return `${numbers.slice(0, 2)}/${numbers.slice(
			2,
			4,
		)}/${numbers.slice(4, 8)}`;
	}

	function handleChange(value: string) {
		if (isPhone) {
			const formatted = formatPhone(value);

			setPhone(formatted);
			onChange(formatted);

			return;
		}

		if (isDate) {
			const formatted = formatDate(value);

			setDate(formatted);
			onChange(formatted);

			return;
		}

		onChange(value);
	}

	return (
		<View style={styles.inputWrapper}>
			<TextInput
				placeholder={placeholder}
				placeholderTextColor={style.c9}
				keyboardType={
					type === "email"
						? "email-address"
						: type === "phone"
							? "phone-pad"
							: "default"
				}
				secureTextEntry={isPassword && !showPassword}
				autoCapitalize={type === "email" ? "none" : "sentences"}
				autoCorrect={type !== "email" && type !== "password"}
				value={isPhone ? phone : isDate ? date : undefined}
				onChangeText={handleChange}
				style={[styles.input, sty]}
			/>

			{isPassword && (
				<Pressable
					onPress={() => setShowPassword((prev) => !prev)}
					style={styles.eyeButton}
				>
					{showPassword ? (
						<EyeOff size={24} color={style.c9} />
					) : (
						<Eye size={24} color={style.c9} />
					)}
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	inputWrapper: {
		width: "100%",
		minHeight: 58,
		borderRadius: 18,
		borderWidth: 2,
		borderColor: style.c9,
		flexDirection: "row",
		alignItems: "center",
	},

	input: {
		flex: 1,
		paddingHorizontal: 14,
		paddingVertical: 10,
		fontSize: 20,
		fontWeight: "500",
		color: style.c4,
		fontFamily: style.font1,
	},

	eyeButton: {
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
});
