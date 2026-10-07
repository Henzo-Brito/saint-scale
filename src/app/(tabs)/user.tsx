import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons/faRightFromBracket";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
	ActivityIndicator,
	Alert,
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Section from "@/components/Section";
import RoleTag from "@/components/user/function";
import Info from "@/components/user/info";
import Team from "@/components/user/team";
import sty from "@/constants/styles";
import { logout } from "@/services/auth";
import { getMe } from "@/services/users";

export default function UserProfile() {
	const queryClient = useQueryClient();
	const {
		data: me,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["user", "me"],
		queryFn: getMe,
	});

	function handleEditSuccess() {
		queryClient.invalidateQueries({ queryKey: ["user", "me"] });
	}

	async function handleLogout() {
		// Alert.alert não funciona no web — usa window.confirm como fallback
		if (Platform.OS === "web") {
			if (!window.confirm("Deseja realmente sair da sua conta?")) return;
			await logout();
			router.replace("/auth");
			return;
		}

		Alert.alert(
			"Sair",
			"Deseja realmente sair da sua conta?",
			[
				{
					text: "Cancelar",
					style: "cancel",
				},
				{
					text: "Sair",
					style: "destructive",
					onPress: async () => {
						await logout();
						router.replace("/auth");
					},
				},
			],
			{ cancelable: true },
		);
	}

	function formatDate(isoDate: string): string {
		const [year, month, day] = isoDate.split("T")[0].split("-");
		return `${day}/${month}/${year}`;
	}

	function formatPhone(phone: string | null): string {
		if (!phone) return "Não cadastrado";
		// Formata de "11987051565" para "(11) 98705-1565"
		if (phone.length === 11) {
			return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
		}
		return phone;
	}

	function formatAddress(
		logradouro: { rua: string; numero: number } | null,
	): string {
		if (!logradouro) return "Não cadastrado";
		return `${logradouro.rua}, ${logradouro.numero}`;
	}

	function formatBirthDate(date: string | null): string {
		if (!date) return "Não cadastrado";
		const [year, month, day] = date.split("-");
		return `${day}/${month}/${year}`;
	}

	if (isLoading) {
		return (
			<View
				style={[
					style.container,
					{ justifyContent: "center", alignItems: "center", flex: 1 },
				]}
			>
				<ActivityIndicator size="large" color={sty.c1} />
			</View>
		);
	}

	if (isError || !me) {
		return (
			<View
				style={[
					style.container,
					{ justifyContent: "center", alignItems: "center", flex: 1 },
				]}
			>
				<Text style={style.errorText}>Erro ao carregar perfil</Text>
			</View>
		);
	}

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: sty.c7 }}
			contentContainerStyle={style.container}
		>
			<View style={style.boxUser}>
				<View>
					<TouchableOpacity style={style.editImage}>
						<FontAwesomeIcon icon={faPencil} size={14} color={sty.c4} />
					</TouchableOpacity>
					{me.img_id ? (
						<Image source={{ uri: me.img_id }} style={style.photo} />
					) : (
						<Image source={require("@/assets/hz.jpg")} style={style.photo} />
					)}
				</View>
				<View style={{ flex: 1, gap: 6, overflow: "hidden" }}>
					<Text style={style.name} numberOfLines={2}>
						{me.nome}
					</Text>
					<Text style={style.register}>
						Registro: {formatDate(me.data_registro)}
					</Text>
				</View>
				<TouchableOpacity style={style.logoutBtn} onPress={handleLogout}>
					<FontAwesomeIcon
						icon={faRightFromBracket}
						size={20}
						color={sty.c10}
					/>
				</TouchableOpacity>
			</View>

			<View style={style.function}>
				{me.funcoes.map((funcao) => (
					<RoleTag key={funcao} title={funcao} />
				))}
				<TouchableOpacity style={style.plus}>
					<FontAwesomeIcon icon={faPlus} size={18} color={sty.c7} />
				</TouchableOpacity>
			</View>

			{me.equipes.length > 0 && (
				<Section title="Equipes" titleSize={20} onPress={() => {}}>
					{me.equipes.map((equipe) => (
						<Team
							key={equipe.title}
							img={
								equipe.img_id
									? { uri: equipe.img_id }
									: require("@/assets/av.jpg")
							}
							name={equipe.title}
							valPart={equipe.quant_part}
						/>
					))}
				</Section>
			)}

			<Text style={style.title}>Infos</Text>

			<Info
				email={me.email}
				address={formatAddress(me.logradouro)}
				birth={formatBirthDate(me.data_nascimento)}
				phone={formatPhone(me.telefone)}
				onEditSuccess={handleEditSuccess}
			/>
		</ScrollView>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 15,
		gap: 18,
	},
	title: {
		color: sty.c4,
		fontSize: 20,
		width: "100%",
	},
	boxUser: {
		flexDirection: "row",
		gap: 17,
		alignItems: "flex-start",
	},
	photo: {
		width: 110,
		height: 110,
		borderRadius: 14,
	},
	editImage: {
		backgroundColor: sty.c11,
		padding: 4,
		borderRadius: 20,
		position: "absolute",
		zIndex: 1,
		right: 3,
		top: 3,
	},
	logoutBtn: {
		backgroundColor: sty.c8,
		padding: 10,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	name: {
		color: sty.c4,
		fontSize: 27,
		fontWeight: "700" as const,
	},
	register: {
		color: sty.c4,
		fontSize: 12,
	},
	function: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
	},
	plus: {
		backgroundColor: sty.c8,
		padding: 6,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
	},
	errorText: {
		color: sty.c10,
		fontSize: 18,
		textAlign: "center",
	},
});
