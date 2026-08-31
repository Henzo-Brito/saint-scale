import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";

import SendBtn from "@/components/auth/sendBtn";
import TextInput from "@/components/auth/textInput";
import style from "@/constants/styles";
import { createUser } from "@/services/users";

const formSchema = z.object({
	name: z
		.string()
		.min(1, "Formato do nome inválido!")
		.max(255, "Formato do nome inválido!"),

	email: z
		.string()
		.email("Formato de e-mail inválido!")
		.max(255, "Formato de e-mail inválido!"),

	telephone: z
		.string()
		.min(15, "Formato de telefone inválido!")
		.max(15, "Formato de telefone inválido!"),

	date: z
		.string()
		.min(10, "Formato de data inválido!")
		.max(10, "Formato de data inválido!"),
});

type FormErrors = {
	name?: string;
	email?: string;
	telephone?: string;
	date?: string;
};

type PasswordErrors = {
	hasUppercase: boolean;
	hasLowercase: boolean;
	hasNumber: boolean;
	hasSpecial: boolean;
	hasSpace: boolean;
};

const initialPasswordErrors: PasswordErrors = {
	hasUppercase: false,
	hasLowercase: false,
	hasNumber: false,
	hasSpecial: false,
	hasSpace: false,
};

export default function Register() {
	const [page, setPage] = useState(1);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [date, setDate] = useState("");
	const [telephone, setTelephone] = useState("");

	const [password, setPassword] = useState("");

	const [status, setStatus] = useState("");

	const [passwordVerify, setPasswordVerify] = useState("");

	const [errors, setErrors] = useState<FormErrors>({});
	const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>(
		initialPasswordErrors,
	);

	const { mutate, isPending } = useMutation({
		mutationFn: createUser,

		onSuccess: (data) => {
			setStatus("Usuário criado com sucesso, redirecionando..");
			setTimeout(() => {
				router.push("/auth/login");
			}, 1000);
		},

		onError: (error: any) => {
			setStatus(`Erro ao cadastrar usuário: ${error}`);
		},
	});

	const passwordsMatch =
		passwordVerify.length > 0 && password === passwordVerify;

	function sendForm() {
		if (
			!password ||
			!passwordVerify ||
			password !== passwordVerify ||
			!passwordErrors.hasUppercase ||
			!passwordErrors.hasLowercase ||
			!passwordErrors.hasNumber ||
			!passwordErrors.hasSpecial ||
			passwordErrors.hasSpace
		) {
			return;
		}

		mutate({
			name,
			email,
			birth_date: date,
			password,
			role: "membro",
			telephone,
		});
	}

	function verifyErrors(
		values = {
			name,
			email,
			telephone,
			date,
		},
	) {
		const result = formSchema.safeParse(values);

		if (!result.success) {
			const newErrors: FormErrors = {};

			for (const issue of result.error.issues) {
				const field = issue.path[0];

				if (
					field === "name" ||
					field === "email" ||
					field === "telephone" ||
					field === "date"
				) {
					newErrors[field] = issue.message;
				}
			}

			setErrors(newErrors);
			return false;
		}

		setErrors({});
		return true;
	}

	function verifyPassword(value: string) {
		setPasswordErrors({
			hasUppercase: /[A-Z]/.test(value),
			hasLowercase: /[a-z]/.test(value),
			hasNumber: /[0-9]/.test(value),
			hasSpecial: /[^A-Za-z0-9\s]/.test(value),
			hasSpace: /\s/.test(value),
		});
	}

	function setSecondPage() {
		if (verifyErrors()) {
			setPage(2);
		}
	}

	function updateField(field: keyof FormErrors, value: string) {
		const values = {
			name,
			email,
			telephone,
			date,
			[field]: value,
		};

		switch (field) {
			case "name":
				setName(value);
				break;
			case "email":
				setEmail(value);
				break;
			case "telephone":
				setTelephone(value);
				break;
			case "date":
				setDate(value);
				break;
		}

		verifyErrors(values);
	}

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

					{page === 1 ? (
						<View style={styles.form}>
							<View style={styles.field}>
								<Text style={styles.label}>Nome</Text>

								<TextInput
									placeholder="Insira seu nome"
									onChange={(value: string) => updateField("name", value)}
									type="text"
								/>

								{errors.name && <Text style={styles.error}>{errors.name}</Text>}
							</View>

							<View style={styles.field}>
								<Text style={styles.label}>Email</Text>

								<TextInput
									placeholder="Insira seu melhor email"
									onChange={(value: string) => updateField("email", value)}
									type="email"
								/>

								{errors.email && (
									<Text style={styles.error}>{errors.email}</Text>
								)}
							</View>

							<View style={styles.field}>
								<Text style={styles.label}>Data de nascimento</Text>

								<TextInput
									type="date"
									placeholder="DD/MM/AAAA"
									onChange={(value: string) => updateField("date", value)}
								/>

								{errors.date && <Text style={styles.error}>{errors.date}</Text>}
							</View>

							<View style={styles.field}>
								<Text style={styles.label}>Telefone</Text>

								<TextInput
									type="phone"
									placeholder="(00) 00000-0000"
									onChange={(value: string) => updateField("telephone", value)}
								/>

								{errors.telephone && (
									<Text style={styles.error}>{errors.telephone}</Text>
								)}
							</View>

							<View style={styles.button}>
								<SendBtn func={setSecondPage} text="Continuar" />
							</View>
						</View>
					) : (
						<View style={styles.form}>
							<View style={styles.field}>
								<Text style={styles.label}>Senha</Text>

								<TextInput
									placeholder="Insira sua senha"
									onChange={(value: string) => {
										setPassword(value);
										verifyPassword(value);
									}}
									type="password"
								/>

								<Text style={styles.error}>
									{!passwordErrors.hasLowercase && "• Uma letra minúscula\n"}
									{!passwordErrors.hasUppercase && "• Uma letra maiúscula\n"}
									{!passwordErrors.hasNumber && "• Um número\n"}
									{!passwordErrors.hasSpecial && "• Um caractere especial\n"}
									{passwordErrors.hasSpace && "• Não pode conter espaços"}
								</Text>
							</View>

							<View style={styles.field}>
								<Text style={styles.label}>Confirmar senha</Text>

								<TextInput
									placeholder="Confirme sua senha"
									onChange={(value: string) => {
										setPasswordVerify(value);
									}}
									type="password"
								/>

								{passwordVerify.length > 0 && !passwordsMatch && (
									<Text style={styles.error}>As senhas não coincidem.</Text>
								)}
							</View>

							<View style={styles.button}>
								<SendBtn
									func={sendForm}
									text={isPending ? "Cadastrando..." : "Cadastrar"}
								/>
							</View>

							<Text
								style={[
									styles.status,
									{ color: isPending ? "green" : style.c5 },
								]}
							>
								{isPending ? "Carregando..." : status}
							</Text>
						</View>
					)}

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
		width: "100%",
	},

	header: {
		marginBottom: 30,
	},

	error: {
		color: style.c10,
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
		gap: 20,
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

	status: {
		fontSize: 18,
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
