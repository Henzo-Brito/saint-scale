const img = require("@/assets/1.jpg");

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import SendBtn from "@/components/auth/sendBtn";
import TextInput from "@/components/auth/textInput";
import style from "@/constants/styles";

export default function Login() {
	return (
		<View style={styles.container}>
			<LinearGradient
				colors={[style.c3, style.c1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.top}
			>
				<View style={styles.imageContainer}>
					<Image source={img} style={styles.img} />
				</View>
			</LinearGradient>

			<View style={styles.bottom}>
				<Text style={styles.title}>Bem-vindo de volta!</Text>

				<Text style={styles.subtitle}>Entre na sua conta para continuar.</Text>

				<View style={styles.form}>
					<View style={styles.field}>
						<Text style={styles.text}>Email</Text>
						<TextInput placeholder="Insira seu email" type="email" />
					</View>

					<View style={styles.field}>
						<Text style={styles.text}>Senha</Text>
						<TextInput placeholder="Insira sua senha" type="password" />
					</View>

					<Text
						onPress={() => {
							router.push("/auth/forgotPassword");
						}}
						style={styles.link}
					>
						Esqueceu a senha?
					</Text>

					<SendBtn text="Entrar" sty={styles.button} />
				</View>

				<Text style={styles.register}>
					Ainda não possui uma conta?{" "}
					<Text
						onPress={() => {
							router.push("/auth/signUp");
						}}
						style={styles.registerLink}
					>
						Cadastre-se
					</Text>
				</Text>
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
		height: "48%",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},

	imageContainer: {
		width: "48%",
		maxWidth: 220,
		aspectRatio: 1,
		borderRadius: 30,
		overflow: "hidden",

		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.4,
		shadowRadius: 15,
		elevation: 10,
	},

	img: {
		width: "100%",
		height: "100%",
	},

	bottom: {
		flex: 1,
		backgroundColor: style.c6,
		borderTopLeftRadius: 35,
		borderTopRightRadius: 35,
		marginTop: -30,
		paddingHorizontal: 28,
		paddingTop: 32,
		paddingBottom: 25,
	},

	title: {
		fontSize: 32,
		color: style.c4,
		fontFamily: style.font1,
		fontWeight: "800",
		lineHeight: 38,
	},

	subtitle: {
		fontSize: 16,
		color: style.c5,
		fontFamily: style.font1,
		fontWeight: "400",
		opacity: 0.7,
		marginTop: 6,
		marginBottom: 25,
	},

	form: {
		gap: 14,
	},

	field: {
		gap: 7,
	},

	text: {
		fontSize: 16,
		color: style.c5,
		fontFamily: style.font1,
		fontWeight: "600",
	},

	link: {
		alignSelf: "flex-end",
		color: style.c4,
		fontSize: 14,
		fontFamily: style.font1,
		fontWeight: "600",
		marginTop: -2,
	},

	button: {
		width: "100%",
		borderRadius: 100,
		marginTop: 8,
	},

	register: {
		textAlign: "center",
		fontSize: 14,
		color: style.c5,
		fontFamily: style.font1,
		opacity: 0.7,
		marginTop: "auto",
	},

	registerLink: {
		color: style.c4,
		fontWeight: "700",
		opacity: 1,
	},
});
