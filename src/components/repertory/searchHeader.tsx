import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import sty from "@/constants/styles";
import IconBtn from "../iconBtn";

export default function SearchHeader() {
	return (
		<SafeAreaView style={style.container}>
			<IconBtn
				icon={ArrowLeft}
				stroke={2.5}
				size={25}
				func={() => {
					router.push("/repertory");
				}}
			/>
			<TextInput
				style={style.input}
				onChangeText={() => {}}
				placeholder="Título ou Artista"
				placeholderTextColor={sty.c5}
			></TextInput>
		</SafeAreaView>
	);
}

const style = StyleSheet.create({
	container: {
		backgroundColor: sty.c6,
		padding: 15,
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		width: "100%",
		color: sty.c4,
		padding: 5,
		fontSize: 16,
		fontWeight: 600,
	},
});
