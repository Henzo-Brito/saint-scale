import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import ReturnHeader from "@/components/allPages/returnHeader";
import SendBtn from "@/components/auth/sendBtn";
import TextInput from "@/components/auth/textInput";
import sty from "@/constants/styles";
import { forgotPassword } from "@/services/users";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const mutation = useMutation({
		mutationFn: forgotPassword,
		onSuccess: () => {
			Alert.alert(
				"Senha alterada",
				"Sua senha foi alterada com sucesso. Faça login com a nova senha.",
				[
					{
						text: "OK",
						onPress: () => router.replace("/auth/login"),
					},
				],
			);
		},
		onError: () => {
			setError("Email não encontrado ou erro ao alterar a senha.");
		},
	});

	function handleSubmit() {
		setError("");

		// Validação local básica
		if (!email.trim()) {
			setError("Informe o seu email.");
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Email inválido.");
			return;
		}

		if (password.length < 8) {
			setError("A nova senha deve ter pelo menos 8 caracteres.");
			return;
		}

		if (password.length > 60) {
			setError("A nova senha deve ter no máximo 60 caracteres.");
			return;
		}

		if (password !== confirmPassword) {
			setError("As senhas não coincidem.");
			return;
		}

		mutation.mutate({ email: email.trim(), password });
	}

	return (
		<KeyboardAvoidingView
			style={styles.root}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<ReturnHeader title="Redefinir Senha" />

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.container}>
					<Text style={styles.title}>Esqueceu sua senha?</Text>
					<Text style={styles.subtitle}>
						Informe seu email cadastrado e defina uma nova senha.
					</Text>

					<View style={styles.form}>
						<View style={styles.field}>
							<Text style={styles.label}>Email</Text>
							<TextInput
								onChange={setEmail}
								placeholder="Seu email cadastrado"
								type="email"
							/>
						</View>

						<View style={styles.field}>
							<Text style={styles.label}>Nova Senha</Text>
							<TextInput
								onChange={setPassword}
								placeholder="Mínimo 8 caracteres"
								type="password"
							/>
						</View>

						<View style={styles.field}>
							<Text style={styles.label}>Confirmar Nova Senha</Text>
							<TextInput
								onChange={setConfirmPassword}
								placeholder="Repita a nova senha"
								type="password"
							/>
						</View>

						{error ? <Text style={styles.errorText}>{error}</Text> : null}

						<SendBtn
							text={mutation.isPending ? "Alterando..." : "Redefinir Senha"}
							func={handleSubmit}
							sty={styles.button}
						/>

						<TouchableOpacity
							onPress={() => router.back()}
							style={styles.backLink}
						>
							<Text style={styles.backLinkText}>Voltar para o login</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: sty.c6,
	},
	scrollContent: {
		flexGrow: 1,
	},
	container: {
		flex: 1,
		paddingHorizontal: 28,
		paddingTop: 32,
		paddingBottom: 40,
	},
	title: {
		fontSize: 28,
		color: sty.c4,
		fontWeight: "800",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 15,
		color: sty.c5,
		opacity: 0.8,
		marginBottom: 32,
		lineHeight: 22,
	},
	form: {
		gap: 16,
	},
	field: {
		gap: 7,
	},
	label: {
		fontSize: 16,
		color: sty.c5,
		fontWeight: "600",
	},
	errorText: {
		fontSize: 14,
		color: sty.c10,
		textAlign: "center",
	},
	button: {
		width: "100%",
		borderRadius: 100,
		marginTop: 8,
	},
	backLink: {
		alignItems: "center",
		paddingVertical: 12,
	},
	backLinkText: {
		color: sty.c4,
		fontSize: 14,
		fontWeight: "600",
	},
});
