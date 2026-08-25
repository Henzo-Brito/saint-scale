import style from "@/constants/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
	Platform,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	TextInput,
	type TextStyle,
	View,
} from "react-native";

type InputType =
	| "text"
	| "email"
	| "password"
	| "phone"
	| "date";

type Props = {
	placeholder: string;
	type?: InputType;
	sty?: StyleProp<TextStyle>;
};

export default function TextInputComponent({
	placeholder,
	type = "text",
	sty,
}: Props) {
	const [showPassword, setShowPassword] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState<Date | null>(null);
	const [phone, setPhone] = useState("");

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
		)}-${numbers.slice(7)}`;
	}

	function handlePhoneChange(value: string) {
		setPhone(formatPhone(value));
	}

	function handleDateChange(
		event: unknown,
		selectedDate?: Date,
	) {
		// Usuário cancelou o picker
		if (!selectedDate) {
			setShowDatePicker(false);
			return;
		}

		setDate(selectedDate);

		// No Android o picker é fechado depois da seleção
		if (Platform.OS === "android") {
			setShowDatePicker(false);
		}
	}

	/*
	 * DATE
	 */
	if (isDate) {
		return (
			<View>
				<Pressable
					onPress={() => setShowDatePicker(true)}
					style={styles.dateContainer}
				>
					<Text
						style={[
							styles.dateText,
							!date && styles.placeholder,
						]}
					>
						{date
							? date.toLocaleDateString("pt-BR")
							: placeholder}
					</Text>
				</Pressable>

				{showDatePicker && (
					<DateTimePicker
						value={date ?? new Date()}
						mode="date"
						onChange={handleDateChange}
						maximumDate={new Date()}
						display={
							Platform.OS === "ios"
								? "spinner"
								: "default"
						}
					/>
				)}
			</View>
		);
	}

	/*
	 * INPUT NORMAL
	 */
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
				secureTextEntry={
					isPassword && !showPassword
				}
				autoCapitalize={
					type === "email"
						? "none"
						: "sentences"
				}
				autoCorrect={
					type !== "email" &&
					type !== "password"
				}
				value={isPhone ? phone : undefined}
				onChangeText={
					isPhone
						? handlePhoneChange
						: undefined
				}
				style={[styles.input, sty]}
			/>

			{isPassword && (
				<Pressable
					onPress={() =>
						setShowPassword(
							(prev) => !prev,
						)
					}
					style={styles.eyeButton}
				>
					{showPassword ? (
						<EyeOff
							size={24}
							color={style.c9}
						/>
					) : (
						<Eye
							size={24}
							color={style.c9}
						/>
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

	dateContainer: {
		width: "100%",
		minHeight: 58,
		borderRadius: 18,
		paddingHorizontal: 14,
		borderWidth: 2,
		borderColor: style.c9,
		justifyContent: "center",
	},

	dateText: {
		fontSize: 20,
		fontWeight: "500",
		color: style.c4,
		fontFamily: style.font1,
	},

	placeholder: {
		color: style.c9,
	},
});