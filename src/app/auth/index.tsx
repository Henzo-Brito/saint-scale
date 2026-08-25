import ContinueBtn from "@/components/auth/continueBtn";
import SendBtn from "@/components/auth/sendBtn";
import style from "@/constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const pages = [
	{
		image: require("@/assets/auth/1.png"),
		label: "COMECE AGORA",
		title: "SaintScale",
		subtitle: "Seu app para gerenciar escalas de forma simples e organizada.",
		footer: "Organize. Compartilhe. Simplifique.",
	},

	{
		image: require("@/assets/auth/2.png"),
		label: "ORGANIZE",
		title: "Tenha tudo em um só lugar",
		subtitle:
			"Gerencie suas escalas, membros e funções de maneira rápida e prática.",
		footer: "Tudo organizado para você.",
	},

	{
		image: require("@/assets/auth/3.png"),
		label: "COMPARTILHE",
		title: "Facilite a comunicação",
		subtitle:
			"Avise os membros sobre novas escalas, alterações e indisponibilidades.",
		footer: "Todos ficam por dentro.",
	},

	{
		image: require("@/assets/auth/3.png"),
		label: "PRONTO!",
		title: "Vamos começar?",
		subtitle:
			"Sua equipe está pronta para ter uma organização muito mais simples.",
		footer: "Bem-vindo ao SaintScale.",
	},
];

export default function Index() {
	const [idPage, setIdPage] = useState(0);

	const page = pages[idPage];

	function handleContinue() {
		if (idPage < pages.length - 1) {
			setIdPage((prev) => prev + 1);
		}
	}

	function handleLogin() {
		router.push("/auth/login");
	}

	function handleRegister() {
		router.push("/auth/signUp");
	}

	return (
		<View style={styles.container}>
			<LinearGradient
				colors={[style.c3, style.c1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.top}
			>
				<View style={styles.imageContainer}>
					<Image source={page.image} style={styles.img} resizeMode="contain" />
				</View>
			</LinearGradient>

			<View style={styles.content}>
				<View style={styles.textContainer}>
					<Text style={styles.text}>{page.label}</Text>

					<Text style={styles.title}>
						{page.title}
						<Text style={styles.dot}>.</Text>
					</Text>

					<Text style={styles.subtitle}>{page.subtitle}</Text>
				</View>

				<View style={styles.buttonContainer}>
					{idPage === 3 ? (
						<View style={styles.finalButtons}>
							<SendBtn
								text="Entrar"
								sty={styles.loginButton}
								func={handleLogin}
							/>

							<SendBtn
								text="Cadastrar"
								sty={styles.registerButton}
								func={handleRegister}
							/>
						</View>
					) : (
						<ContinueBtn
							text="Continuar"
							sty={styles.button}
							func={handleContinue}
						/>
					)}
				</View>

				<Text style={styles.footer}>{page.footer}</Text>
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
		height: "52%",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		overflow: "hidden",
	},

	imageContainer: {
		width: "85%",
		maxWidth: 400,
		height: "85%",
		alignItems: "center",
		justifyContent: "center",
	},

	img: {
		width: "100%",
		height: "100%",
	},

	content: {
		flex: 1,
		paddingHorizontal: 30,
		paddingTop: 28,
		paddingBottom: 22,
		justifyContent: "space-between",
	},

	textContainer: {
		gap: 8,
	},

	text: {
		fontSize: 13,
		letterSpacing: 2,
		color: style.c5,
		fontFamily: style.font1,
		fontWeight: "700",
	},

	title: {
		fontSize: 40,
		color: style.c4,
		fontFamily: style.font1,
		fontWeight: "900",
		letterSpacing: -1,
	},

	dot: {
		color: style.c5,
	},

	subtitle: {
		maxWidth: 330,
		fontSize: 24,
		lineHeight: 30,
		color: style.c4,
		fontFamily: style.font1,
		fontWeight: "400",
		opacity: 0.75,
	},

	buttonContainer: {
		alignItems: "flex-end",
		marginTop: 20,
	},

	button: {
		width: 180,
	},

	finalButtons: {
		width: "100%",
		gap: 12,
	},

	loginButton: {
		width: "100%",
	},

	registerButton: {
		width: "100%",
		backgroundColor: style.c5,
	},

	footer: {
		textAlign: "center",
		fontSize: 12,
		color: style.c4,
		fontFamily: style.font1,
		opacity: 0.4,
	},
});
