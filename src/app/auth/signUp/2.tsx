import SendBtn from "@/components/auth/sendBtn";
import TextInput from "@/components/auth/textInput";
import style from "@/constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
	return (
		<SafeAreaView style={styles.container}>

			<KeyboardAvoidingView
				style={styles.keyboard}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					contentContainerStyle={styles.scroll}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.header}>
						<Text style={styles.title}>Cadastre-se!</Text>

						<Text style={styles.subtitle}>
							Preencha seus dados para criar sua conta.
						</Text>
					</View>

					<View style={styles.form}>
						<View style={styles.field}>
							<Text style={styles.label}>Senha</Text>

							<TextInput placeholder="Insira sua senha" type="password" />
						</View>

						<View style={styles.field}>
							<Text style={styles.label}>Confirmar Senha</Text>

							<TextInput placeholder="confirme a sua senha" type="password" />
						</View>

						<View style={styles.button}>
							<SendBtn text="Cadastre-se" />
						</View>
					</View>

					<View style={styles.footer}>
						<Text style={styles.register}>
							Já possui uma conta?{" "}
							<Text
								onPress={() => router.push("/auth/login")}
								style={styles.registerLink}
							>
								Entrar
							</Text>
						</Text>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: style.c6,
	},

	keyboard: {
		flex: 1,
	},
    
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 28,
		paddingTop: 70,
		paddingBottom: 20,
        width: "100%"
	},

	header: {
		marginBottom: 30,
	},

	title: {
		fontSize: 34,
		color: style.c4,
		fontFamily: style.font1,
		fontWeight: "800",
		lineHeight: 40,
	},

	subtitle: {
		fontSize: 18,
		color: style.c5,
		fontFamily: style.font1,
		fontWeight: "400",
		opacity: 0.65,
		lineHeight: 22,
		marginTop: 8,
		maxWidth: 320,
	},

	form: {
		gap: 30,
	},

	field: {
		gap: 8,
	},

	label: {
		fontSize: 14,
		color: style.c5,
		fontFamily: style.font1,
		fontWeight: "700",
	},

	button: {
		marginTop: 8,
	},

	footer: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		minHeight: 35,
	},

	register: {
		fontSize: 14,
		color: style.c5,
		fontFamily: style.font1,
		opacity: 0.65,
	},

	registerLink: {
		color: style.c4,
		fontWeight: "800",
		opacity: 1,
	},
});
