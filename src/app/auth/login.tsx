import img from "@/assets/1.jpg";
import SendBtn from "@/components/auth/sendBtn";
import TextInput from "@/components/auth/textInput";
import style from "@/constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Login() {
	return (
		<View style={styles.container}>
			<LinearGradient colors={[style.c1, style.c6]} style={styles.top}>
				<Image source={img} style={styles.img} />
			</LinearGradient>

			<View style={styles.buttom}>
				<Text style={styles.title}>Já possui uma conta? entre agora!</Text>
				<Text style={styles.text}>Email:</Text>
				<TextInput placeholder="Insira seu melhor email" />
				<Text style={styles.text}>Senha:</Text>
				<TextInput placeholder="Insira sua senha" />
				<View
					style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}
				>
					<Text style={styles.link}>Esqueceu a senha?</Text>
				</View>
				<SendBtn text="Login" sty={{ flex: 1, borderRadius: 100 }} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: style.c6,
	},
	top: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		height: "50%",
	},
	img: {
		width: "50%",
		height: "50%",
        maxWidth: 250,
        aspectRatio: 1,
		borderRadius: 20,
	},
	link: {
		color: style.c4,
		fontSize: 20,
		fontFamily: style.font1,
		fontWeight: 500,
		textDecorationLine: "underline",
	},
	buttom: {
		gap: 19,
		padding: 32,
		position: "absolute",
		bottom: 50,
		width: "100%",
	},
	title: {
		fontSize: 35,
		color: style.c4,
		fontFamily: style.font1,
		fontWeight: 800,
	},
	text: {
		fontSize: 22,
		color: style.c5,
		fontFamily: style.font1,
		fontWeight: 500,
	},
});
