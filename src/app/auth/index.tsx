import style from "@/constants/styles";
import { StyleSheet, Text, View } from "react-native";

export default function Login() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Já possui uma conta? entre agora!</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: style.c6,
	},
	title: {
		fontSize: 20,
	},
});
