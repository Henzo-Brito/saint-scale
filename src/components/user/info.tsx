import { faCakeCandles } from "@fortawesome/free-solid-svg-icons/faCakeCandles";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import sty from "@/constants/styles";
import {
	alterBirthday,
	alterEmail,
	alterLogradouro,
	alterTelephone,
	forgotPassword,
} from "@/services/users";

type Props = {
	email: string;
	address: string;
	birth: string;
	phone: string;
	/** Chamado após qualquer edição bem-sucedida para invalidar o cache */
	onEditSuccess: () => void;
};

// ── Máscaras ────────────────────────────────────────────────────

const maskEmail = (email: string) => {
	const [name, domain] = email.split("@");
	if (!domain) return email;
	const visibleStart = name.slice(0, 2);
	const visibleEnd = domain.slice(-3);
	return `${visibleStart}${"*".repeat(Math.max(name.length + domain.length - 5, 3))}${visibleEnd}`;
};

// ── Modal genérico ───────────────────────────────────────────────

type EditModalProps = {
	visible: boolean;
	title: string;
	onClose: () => void;
	onConfirm: () => void;
	isPending: boolean;
	error: string;
	children: React.ReactNode;
};

function EditModal({
	visible,
	title,
	onClose,
	onConfirm,
	isPending,
	error,
	children,
}: EditModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={modal.overlay}
			>
				<View style={modal.box}>
					<Text style={modal.title}>{title}</Text>

					{children}

					{error ? <Text style={modal.error}>{error}</Text> : null}

					<View style={modal.actions}>
						<TouchableOpacity
							style={[modal.btn, modal.btnCancel]}
							onPress={onClose}
							disabled={isPending}
						>
							<Text style={modal.btnCancelText}>Cancelar</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[modal.btn, modal.btnConfirm]}
							onPress={onConfirm}
							disabled={isPending}
						>
							{isPending ? (
								<ActivityIndicator size="small" color={sty.c4} />
							) : (
								<Text style={modal.btnConfirmText}>Salvar</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

// ── Componente principal ─────────────────────────────────────────

export default function Info({ email, address, birth, phone, onEditSuccess }: Props) {
	// Visibilidade do email completo
	const [showEmail, setShowEmail] = useState(false);

	// Qual modal está aberto
	type ModalType = "email" | "password" | "address" | "birth" | "phone" | null;
	const [openModal, setOpenModal] = useState<ModalType>(null);

	// Campos dos modais
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [newRua, setNewRua] = useState("");
	const [newNumero, setNewNumero] = useState("");
	const [newBirth, setNewBirth] = useState("");
	const [newPhone, setNewPhone] = useState("");
	const [modalError, setModalError] = useState("");

	function openWith(type: ModalType) {
		setModalError("");
		setNewEmail("");
		setNewPassword("");
		setConfirmPassword("");
		setNewRua("");
		setNewNumero("");
		setNewBirth("");
		setNewPhone("");
		setOpenModal(type);
	}

	function closeModal() {
		setOpenModal(null);
		setModalError("");
	}

	function onSuccess(msg: string) {
		closeModal();
		onEditSuccess();
		Alert.alert("Sucesso", msg);
	}

	// ── Mutations ──────────────────────────────────────────────────

	const emailMutation = useMutation({
		mutationFn: alterEmail,
		onSuccess: () => onSuccess("Email atualizado com sucesso!"),
		onError: () => setModalError("Erro ao atualizar email. Tente novamente."),
	});

	const passwordMutation = useMutation({
		mutationFn: forgotPassword,
		onSuccess: () => onSuccess("Senha atualizada com sucesso!"),
		onError: () => setModalError("Erro ao atualizar senha. Tente novamente."),
	});

	const addressMutation = useMutation({
		mutationFn: alterLogradouro,
		onSuccess: () => onSuccess("Endereço atualizado com sucesso!"),
		onError: () => setModalError("Erro ao atualizar endereço. Tente novamente."),
	});

	const birthMutation = useMutation({
		mutationFn: alterBirthday,
		onSuccess: () => onSuccess("Data de nascimento atualizada!"),
		onError: () => setModalError("Erro ao atualizar data. Tente novamente."),
	});

	const phoneMutation = useMutation({
		mutationFn: alterTelephone,
		onSuccess: () => onSuccess("Telefone atualizado com sucesso!"),
		onError: () => setModalError("Erro ao atualizar telefone. Tente novamente."),
	});

	// ── Handlers de confirmação ────────────────────────────────────

	function handleEmailConfirm() {
		setModalError("");
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
			setModalError("Email inválido.");
			return;
		}
		emailMutation.mutate({ email: newEmail.trim() });
	}

	function handlePasswordConfirm() {
		setModalError("");
		if (newPassword.length < 8) {
			setModalError("A senha deve ter pelo menos 8 caracteres.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setModalError("As senhas não coincidem.");
			return;
		}
		// Usa o email atual (já conhecido) — forgotPassword é público e identifica por email
		passwordMutation.mutate({ email, password: newPassword });
	}

	function handleAddressConfirm() {
		setModalError("");
		const num = Number.parseInt(newNumero, 10);
		if (!newRua.trim()) {
			setModalError("Informe a rua.");
			return;
		}
		if (!newNumero.trim() || Number.isNaN(num) || num <= 0) {
			setModalError("Informe um número válido.");
			return;
		}
		addressMutation.mutate({ rua: newRua.trim(), numero: num });
	}

	function handleBirthConfirm() {
		setModalError("");
		// Aceita DD/MM/YYYY e converte para YYYY-MM-DD (formato da API)
		const match = newBirth.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
		if (!match) {
			setModalError("Use o formato DD/MM/AAAA.");
			return;
		}
		const [, day, month, year] = match;
		birthMutation.mutate({ birth_date: `${year}-${month}-${day}` });
	}

	function handlePhoneConfirm() {
		setModalError("");
		const digits = newPhone.replace(/\D/g, "");
		if (digits.length < 10 || digits.length > 11) {
			setModalError("Telefone deve ter 10 ou 11 dígitos.");
			return;
		}
		phoneMutation.mutate({ telephone: digits });
	}

	// ── Render ─────────────────────────────────────────────────────

	const isPending =
		emailMutation.isPending ||
		passwordMutation.isPending ||
		addressMutation.isPending ||
		birthMutation.isPending ||
		phoneMutation.isPending;

	return (
		<View style={style.container}>
			{/* Email */}
			<View style={style.row}>
				<View style={style.rowLeft}>
					<FontAwesomeIcon icon={faEnvelope} size={24} color={sty.c5} />
					<Text style={style.value} numberOfLines={1}>
						{showEmail ? email : maskEmail(email)}
					</Text>
				</View>
				<View style={style.rowActions}>
					<TouchableOpacity onPress={() => setShowEmail((v) => !v)}>
						<FontAwesomeIcon
							icon={showEmail ? faEyeSlash : faEye}
							size={20}
							color={sty.c5}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => openWith("email")}>
						<FontAwesomeIcon icon={faPencil} size={20} color={sty.c5} />
					</TouchableOpacity>
				</View>
			</View>

			<View style={style.line} />

			{/* Senha */}
			<View style={style.row}>
				<View style={style.rowLeft}>
					<FontAwesomeIcon icon={faLock} size={24} color={sty.c5} />
					<Text style={style.value}>••••••••</Text>
				</View>
				<TouchableOpacity onPress={() => openWith("password")}>
					<FontAwesomeIcon icon={faPencil} size={20} color={sty.c5} />
				</TouchableOpacity>
			</View>

			<View style={style.line} />

			{/* Endereço */}
			<View style={style.row}>
				<View style={style.rowLeft}>
					<FontAwesomeIcon icon={faLocationDot} size={24} color={sty.c5} />
					<Text style={style.value} numberOfLines={1} ellipsizeMode="tail">
						{address}
					</Text>
				</View>
				<TouchableOpacity onPress={() => openWith("address")}>
					<FontAwesomeIcon icon={faPencil} size={20} color={sty.c5} />
				</TouchableOpacity>
			</View>

			<View style={style.line} />

			{/* Data de nascimento */}
			<View style={style.row}>
				<View style={style.rowLeft}>
					<FontAwesomeIcon icon={faCakeCandles} size={24} color={sty.c5} />
					<Text style={style.value}>{birth}</Text>
				</View>
				<TouchableOpacity onPress={() => openWith("birth")}>
					<FontAwesomeIcon icon={faPencil} size={20} color={sty.c5} />
				</TouchableOpacity>
			</View>

			<View style={style.line} />

			{/* Telefone */}
			<View style={style.row}>
				<View style={style.rowLeft}>
					<FontAwesomeIcon icon={faPhone} size={24} color={sty.c5} />
					<Text style={style.value}>{phone}</Text>
				</View>
				<TouchableOpacity onPress={() => openWith("phone")}>
					<FontAwesomeIcon icon={faPencil} size={20} color={sty.c5} />
				</TouchableOpacity>
			</View>

			{/* ── Modais ──────────────────────────────────────────────── */}

			{/* Email */}
			<EditModal
				visible={openModal === "email"}
				title="Alterar Email"
				onClose={closeModal}
				onConfirm={handleEmailConfirm}
				isPending={emailMutation.isPending}
				error={modalError}
			>
				<TextInput
					style={input.field}
					placeholder="Novo email"
					placeholderTextColor={sty.c5}
					keyboardType="email-address"
					autoCapitalize="none"
					value={newEmail}
					onChangeText={setNewEmail}
				/>
			</EditModal>

			{/* Senha */}
			<EditModal
				visible={openModal === "password"}
				title="Alterar Senha"
				onClose={closeModal}
				onConfirm={handlePasswordConfirm}
				isPending={passwordMutation.isPending}
				error={modalError}
			>
				<TextInput
					style={input.field}
					placeholder="Nova senha (mín. 8 caracteres)"
					placeholderTextColor={sty.c5}
					secureTextEntry
					value={newPassword}
					onChangeText={setNewPassword}
				/>
				<TextInput
					style={input.field}
					placeholder="Confirmar nova senha"
					placeholderTextColor={sty.c5}
					secureTextEntry
					value={confirmPassword}
					onChangeText={setConfirmPassword}
				/>
			</EditModal>

			{/* Endereço */}
			<EditModal
				visible={openModal === "address"}
				title="Alterar Endereço"
				onClose={closeModal}
				onConfirm={handleAddressConfirm}
				isPending={addressMutation.isPending}
				error={modalError}
			>
				<TextInput
					style={input.field}
					placeholder="Rua"
					placeholderTextColor={sty.c5}
					value={newRua}
					onChangeText={setNewRua}
				/>
				<TextInput
					style={input.field}
					placeholder="Número"
					placeholderTextColor={sty.c5}
					keyboardType="numeric"
					value={newNumero}
					onChangeText={setNewNumero}
				/>
			</EditModal>

			{/* Data de nascimento */}
			<EditModal
				visible={openModal === "birth"}
				title="Alterar Data de Nascimento"
				onClose={closeModal}
				onConfirm={handleBirthConfirm}
				isPending={birthMutation.isPending}
				error={modalError}
			>
				<TextInput
					style={input.field}
					placeholder="DD/MM/AAAA"
					placeholderTextColor={sty.c5}
					keyboardType="numeric"
					maxLength={10}
					value={newBirth}
					onChangeText={setNewBirth}
				/>
			</EditModal>

			{/* Telefone */}
			<EditModal
				visible={openModal === "phone"}
				title="Alterar Telefone"
				onClose={closeModal}
				onConfirm={handlePhoneConfirm}
				isPending={phoneMutation.isPending}
				error={modalError}
			>
				<TextInput
					style={input.field}
					placeholder="(00) 00000-0000"
					placeholderTextColor={sty.c5}
					keyboardType="phone-pad"
					value={newPhone}
					onChangeText={setNewPhone}
				/>
			</EditModal>
		</View>
	);
}

// ── Estilos ──────────────────────────────────────────────────────

const style = StyleSheet.create({
	container: {
		padding: 14,
		backgroundColor: sty.c8,
		borderRadius: 10,
		width: "100%",
		gap: 12,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	rowLeft: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		overflow: "hidden",
		marginRight: 10,
	},
	rowActions: {
		flexDirection: "row",
		gap: 14,
		alignItems: "center",
	},
	value: {
		flex: 1,
		fontSize: 15,
		fontWeight: "600",
		color: sty.c5,
		overflow: "hidden",
	},
	line: {
		width: "100%",
		height: 1,
		backgroundColor: sty.c11,
	},
});

const modal = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	box: {
		width: "100%",
		maxWidth: 400,
		backgroundColor: sty.c11,
		borderRadius: 16,
		padding: 22,
		gap: 14,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		color: sty.c4,
		marginBottom: 4,
	},
	error: {
		fontSize: 13,
		color: sty.c10,
		textAlign: "center",
	},
	actions: {
		flexDirection: "row",
		gap: 10,
		marginTop: 4,
	},
	btn: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	btnCancel: {
		backgroundColor: sty.c8,
	},
	btnCancelText: {
		color: sty.c5,
		fontWeight: "600",
	},
	btnConfirm: {
		backgroundColor: sty.c3,
	},
	btnConfirmText: {
		color: sty.c4,
		fontWeight: "700",
	},
});

const input = StyleSheet.create({
	field: {
		backgroundColor: sty.c8,
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 15,
		color: sty.c4,
		borderWidth: 1,
		borderColor: sty.c9,
	},
});
