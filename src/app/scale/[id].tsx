import {
	faInfoCircle,
	faLocationDot,
	faMusic,
	faThumbsUp,
	faUser,
	faUserMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import ReturnHeader from "@/components/allPages/returnHeader";
import sty from "@/constants/styles";
import {
	getScale,
	getScaleInfo,
	getScaleMembers,
	getScaleMusics,
	sairDaEscala,
	substituirMembro,
} from "@/services/scales";
import type { ScaleMemberItem } from "@/types/api.types";

type TabType = "info" | "musics" | "members";

type SubstituteData = {
	idMembroEscala: string;
	name: string;
	role: string;
};

export default function Scale() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const queryClient = useQueryClient();

	const [activeTab, setActiveTab] = useState<TabType>("info");
	const [leaveModalVisible, setLeaveModalVisible] = useState(false);
	const [substituteData, setSubstituteData] = useState<SubstituteData | null>(
		null,
	);

	// Dados básicos da escala (cabeçalho)
	const { data: scale, isLoading: scaleLoading } = useQuery({
		queryKey: ["scale", id],
		queryFn: () => getScale(id || ""),
		enabled: !!id,
	});

	// Informações gerais (aba Info)
	const { data: scaleInfo, isLoading: infoLoading } = useQuery({
		queryKey: ["scale", id, "info"],
		queryFn: () => getScaleInfo(id || ""),
		enabled: !!id && activeTab === "info",
	});

	// Músicas da escala (aba Músicas)
	const { data: scaleMusics, isLoading: musicsLoading } = useQuery({
		queryKey: ["scale", id, "musics"],
		queryFn: () => getScaleMusics(id || ""),
		enabled: !!id && activeTab === "musics",
	});

	// Membros da escala (aba Membros)
	const { data: scaleMembers, isLoading: membersLoading } = useQuery({
		queryKey: ["scale", id, "members"],
		queryFn: () => getScaleMembers(id || ""),
		enabled: !!id && activeTab === "members",
	});

	async function handleLeaveScale() {
		try {
			await sairDaEscala({ id_escala: id || "" });
			setLeaveModalVisible(false);
			queryClient.invalidateQueries({ queryKey: ["scale", id, "info"] });
			queryClient.invalidateQueries({ queryKey: ["scale", id, "members"] });
			Alert.alert("Sucesso", "Você saiu da escala.");
		} catch (_error) {
			Alert.alert("Erro", "Não foi possível sair da escala.");
		}
	}

	async function handleSubstitute() {
		if (!substituteData) return;
		try {
			await substituirMembro({ id_membro_escala: substituteData.idMembroEscala });
			setSubstituteData(null);
			queryClient.invalidateQueries({ queryKey: ["scale", id, "members"] });
			Alert.alert("Sucesso", "Solicitação de substituição enviada.");
		} catch (_error) {
			Alert.alert("Erro", "Não foi possível solicitar substituição.");
		}
	}

	// Loading inicial
	if (scaleLoading || !scale) {
		return (
			<View style={styles.container}>
				<ReturnHeader title="Escalas" />
				<View style={styles.loading}>
					<ActivityIndicator size="large" color={sty.c1} />
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ReturnHeader title="Escalas" />

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Cabeçalho com dados reais */}
				<View style={styles.header}>
					<Text style={styles.title}>{scale.nome}</Text>
					<Text style={styles.subtitle}>
						{scale.dia_da_semana} - {scale.data}
					</Text>
				</View>

				{/* Navegação por Abas */}
				<View style={styles.tabContainer}>
					<TouchableOpacity
						style={[
							styles.tabButton,
							activeTab === "info" && styles.tabButtonActive,
						]}
						onPress={() => setActiveTab("info")}
						activeOpacity={0.8}
					>
						<FontAwesomeIcon
							icon={faInfoCircle}
							size={16}
							color={activeTab === "info" ? sty.c14 : sty.c16}
						/>
						<Text
							style={[
								styles.tabText,
								activeTab === "info" && styles.tabTextActive,
							]}
						>
							informações
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.tabButton,
							activeTab === "musics" && styles.tabButtonActive,
						]}
						onPress={() => setActiveTab("musics")}
						activeOpacity={0.8}
					>
						<FontAwesomeIcon
							icon={faMusic}
							size={16}
							color={activeTab === "musics" ? sty.c14 : sty.c16}
						/>
						<Text
							style={[
								styles.tabText,
								activeTab === "musics" && styles.tabTextActive,
							]}
						>
							músicas
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.tabButton,
							activeTab === "members" && styles.tabButtonActive,
						]}
						onPress={() => setActiveTab("members")}
						activeOpacity={0.8}
					>
						<FontAwesomeIcon
							icon={faUser}
							size={16}
							color={activeTab === "members" ? sty.c14 : sty.c16}
						/>
						<Text
							style={[
								styles.tabText,
								activeTab === "members" && styles.tabTextActive,
							]}
						>
							membros
						</Text>
					</TouchableOpacity>
				</View>

				{/* Aba: Informações */}
				{activeTab === "info" && (
					<InfoTab
						scaleInfo={scaleInfo}
						isLoading={infoLoading}
						onLeavePress={() => setLeaveModalVisible(true)}
						onUnavailablePress={(idMembroEscala, name, role) =>
							setSubstituteData({ idMembroEscala, name, role })
						}
					/>
				)}

				{/* Aba: Músicas */}
				{activeTab === "musics" && (
					<MusicsTab
						musics={scaleMusics}
						isLoading={musicsLoading}
					/>
				)}

				{/* Aba: Membros */}
				{activeTab === "members" && (
					<MembersTab
						members={scaleMembers}
						isLoading={membersLoading}
						onUnavailablePress={(idMembroEscala, name, role) =>
							setSubstituteData({ idMembroEscala, name, role })
						}
					/>
				)}
			</ScrollView>

			{/* Modal: Sair da Escala */}
			<Modal visible={leaveModalVisible} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitleBig}>Deseja Sair da Escala?</Text>

						<View style={styles.modalButtonsRow}>
							<TouchableOpacity
								style={styles.modalBtnCancel}
								onPress={() => setLeaveModalVisible(false)}
							>
								<Text style={styles.modalBtnCancelText}>cancelar</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.modalBtnConfirm}
								onPress={handleLeaveScale}
							>
								<Text style={styles.modalBtnConfirmText}>Sim</Text>
							</TouchableOpacity>
						</View>

						<Text style={styles.modalObs}>
							Obs.: O seu líder será notificado, para a substituição.
						</Text>
					</View>
				</View>
			</Modal>

			{/* Modal: Substituir Membro */}
			<Modal visible={!!substituteData} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTextNormal}>
							Deseja substituir:{" "}
							<Text style={styles.boldText}>{substituteData?.name}</Text>?
						</Text>

						<View style={styles.modalAvatarPlaceholder} />
						<Text style={styles.modalRoleText}>
							{substituteData?.role?.toLowerCase()}
						</Text>

						<View style={styles.modalButtonsRow}>
							<TouchableOpacity
								style={styles.modalBtnCancel}
								onPress={() => setSubstituteData(null)}
							>
								<Text style={styles.modalBtnCancelText}>cancelar</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.modalBtnConfirm}
								onPress={handleSubstitute}
							>
								<Text style={styles.modalBtnConfirmText}>Sim</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

/* =========================================================
   COMPONENTES DAS ABAS
========================================================= */

type InfoTabProps = {
	scaleInfo: {
		membros_confirmados: number;
		local: string | null;
		indisponibilidades: { image_id: string; name: string; funcao: string }[];
	} | undefined;
	isLoading: boolean;
	onLeavePress: () => void;
	onUnavailablePress: (idMembroEscala: string, name: string, role: string) => void;
};

const InfoTab = ({
	scaleInfo,
	isLoading,
	onLeavePress,
	onUnavailablePress,
}: InfoTabProps) => {
	if (isLoading) {
		return (
			<View style={styles.tabSection}>
				<ActivityIndicator size="small" color={sty.c1} />
			</View>
		);
	}

	if (!scaleInfo) {
		return (
			<View style={styles.tabSection}>
				<Text style={styles.emptyText}>Informações não disponíveis</Text>
			</View>
		);
	}

	return (
		<View style={styles.tabSection}>
			<View style={styles.infoCard}>
				<View style={styles.infoRow}>
					<View style={styles.infoRowLeft}>
						<FontAwesomeIcon icon={faThumbsUp} size={18} color={sty.c17} />
						<Text style={styles.infoCardText}>Membros confirmados</Text>
					</View>
					<Text style={styles.infoCardCount}>
						({scaleInfo.membros_confirmados})
					</Text>
				</View>

				<View style={styles.divider} />

				<View style={styles.infoRow}>
					<View style={styles.infoRowLeft}>
						<FontAwesomeIcon icon={faLocationDot} size={18} color={sty.c17} />
						<Text style={styles.infoCardText} numberOfLines={1}>
							{scaleInfo.local || "Local não definido"}
						</Text>
					</View>
				</View>

				<View style={styles.divider} />

				<TouchableOpacity
					style={styles.infoRow}
					onPress={onLeavePress}
					activeOpacity={0.7}
				>
					<View style={styles.infoRowLeft}>
						<FontAwesomeIcon icon={faUserMinus} size={18} color={sty.c1} />
						<Text
							style={[styles.infoCardText, { color: sty.c1, fontWeight: "bold" }]}
						>
							Sair da Escala
						</Text>
					</View>
				</TouchableOpacity>
			</View>

			{scaleInfo.indisponibilidades.length > 0 && (
				<>
					<View style={styles.listHeaderRow}>
						<Text style={styles.listSectionTitle}>Indisponibilidades</Text>
						<Text style={styles.listSectionCount}>
							({scaleInfo.indisponibilidades.length})
						</Text>
					</View>

					{scaleInfo.indisponibilidades.map((item) => (
						<MemberItem
							key={`unavail-${item.name}-${item.funcao}`}
							name={item.name}
							role={item.funcao}
							isUnavailable={true}
							onPress={() => onUnavailablePress("", item.name, item.funcao)}
						/>
					))}
				</>
			)}

			{scaleInfo.indisponibilidades.length === 0 && (
				<Text style={styles.emptyText}>Sem indisponibilidades registradas</Text>
			)}
		</View>
	);
};

type MusicsTabProps = {
	musics: {
		id_music_escalas: string;
		nome: string;
		banda: string;
		ordem: number;
		tom: string;
	}[] | undefined;
	isLoading: boolean;
};

const MusicsTab = ({ musics, isLoading }: MusicsTabProps) => {
	if (isLoading) {
		return (
			<View style={styles.tabSection}>
				<ActivityIndicator size="small" color={sty.c1} />
			</View>
		);
	}

	if (!musics || musics.length === 0) {
		return (
			<View style={styles.tabSection}>
				<Text style={styles.emptyText}>Nenhuma música cadastrada</Text>
			</View>
		);
	}

	return (
		<View style={styles.tabSection}>
			{musics.map((music) => (
				<TouchableOpacity
					key={music.id_music_escalas}
					style={styles.musicItem}
					activeOpacity={0.7}
					onPress={() =>
						router.push({
							pathname: "/music/[id]",
							params: { id: music.id_music_escalas },
						})
					}
				>
					<View style={styles.musicItemLeft}>
						<View style={styles.avatarPlaceholderSm} />
						<View>
							<Text style={styles.musicTitle}>{music.nome}</Text>
							<Text style={styles.musicSubtitle}>{music.banda}</Text>
						</View>
					</View>
					<View style={styles.musicItemRight}>
						<Text style={styles.musicOrder}>{music.ordem}ª</Text>
						<Text style={styles.musicKey}>Tom: {music.tom}</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
};

type MembersTabProps = {
	members: ScaleMemberItem[] | undefined;
	isLoading: boolean;
	onUnavailablePress: (idMembroEscala: string, name: string, role: string) => void;
};

const MembersTab = ({ members, isLoading, onUnavailablePress }: MembersTabProps) => {
	if (isLoading) {
		return (
			<View style={styles.tabSection}>
				<ActivityIndicator size="small" color={sty.c1} />
			</View>
		);
	}

	if (!members || members.length === 0) {
		return (
			<View style={styles.tabSection}>
				<Text style={styles.emptyText}>Nenhum membro cadastrado</Text>
			</View>
		);
	}

	const indisponiveis = members.filter((m) => m.disponibilidade === "indisponível");
	const confirmados = members.filter((m) => m.disponibilidade === "confirmado");
	const pendentes = members.filter((m) => m.disponibilidade === "pendente");

	return (
		<View style={styles.tabSection}>
			{indisponiveis.length > 0 && (
				<>
					<View style={styles.listHeaderRow}>
						<Text style={styles.listSectionTitle}>Indisponibilidades</Text>
						<Text style={styles.listSectionCount}>({indisponiveis.length})</Text>
					</View>
					{indisponiveis.map((member) => (
						<MemberItem
							key={member.id_membro_escala}
							name={member.nome}
							role={member.funcao}
							isUnavailable={true}
							onPress={() =>
								onUnavailablePress(
									member.id_membro_escala,
									member.nome,
									member.funcao,
								)
							}
						/>
					))}
				</>
			)}

			{confirmados.length > 0 && (
				<>
					<View style={styles.listHeaderRow}>
						<Text style={styles.listSectionTitle}>Confirmados</Text>
						<Text style={styles.listSectionCount}>({confirmados.length})</Text>
					</View>
					{confirmados.map((member) => (
						<MemberItem
							key={member.id_membro_escala}
							name={member.nome}
							role={member.funcao}
						/>
					))}
				</>
			)}

			{pendentes.length > 0 && (
				<>
					<View style={styles.listHeaderRow}>
						<Text style={styles.listSectionTitle}>Pendentes</Text>
						<Text style={styles.listSectionCount}>({pendentes.length})</Text>
					</View>
					{pendentes.map((member) => (
						<MemberItem
							key={member.id_membro_escala}
							name={member.nome}
							role={member.funcao}
						/>
					))}
				</>
			)}
		</View>
	);
};

const MemberItem = ({
	name,
	role,
	isUnavailable = false,
	onPress,
}: {
	name: string;
	role?: string;
	isUnavailable?: boolean;
	onPress?: () => void;
}) => (
	<TouchableOpacity
		style={styles.memberItem}
		onPress={onPress}
		disabled={!isUnavailable}
		activeOpacity={0.7}
	>
		<View style={styles.avatarPlaceholderSm} />
		<View>
			<Text style={styles.memberName}>{name}</Text>
			{role ? <Text style={styles.memberRole}>{role}</Text> : null}
		</View>
	</TouchableOpacity>
);

/* =========================================================
   ESTILOS
========================================================= */

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: sty.c12 },
	loading: { flex: 1, justifyContent: "center", alignItems: "center" },
	scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
	header: { marginTop: 20, marginBottom: 24 },
	title: { fontSize: 24, color: sty.c4, fontWeight: "bold", marginBottom: 4 },
	subtitle: { fontSize: 12, color: sty.c16, marginBottom: 2 },
	emptyText: {
		color: sty.c5,
		fontSize: 14,
		textAlign: "center",
		padding: 20,
	},

	tabContainer: {
		flexDirection: "row",
		backgroundColor: sty.c13,
		borderRadius: 30,
		padding: 4,
		marginBottom: 24,
	},
	tabButton: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		borderRadius: 25,
	},
	tabButtonActive: { backgroundColor: sty.c1 },
	tabText: { fontSize: 12, color: sty.c16, marginTop: 4, fontWeight: "600" },
	tabTextActive: { color: sty.c14, fontWeight: "bold" },
	tabSection: { flex: 1 },

	infoCard: {
		backgroundColor: sty.c13,
		borderRadius: 16,
		padding: 16,
		marginBottom: 24,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 10,
	},
	infoRowLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		paddingRight: 10,
	},
	infoCardText: {
		color: sty.c4,
		fontSize: 14,
		marginLeft: 12,
		fontWeight: "500",
	},
	infoCardCount: { color: sty.c16, fontSize: 14 },
	divider: { height: 1, backgroundColor: sty.c15 },

	listHeaderRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 16,
		marginBottom: 16,
	},
	listSectionTitle: { color: sty.c4, fontSize: 14, fontWeight: "bold" },
	listSectionCount: { color: sty.c4, fontSize: 14, fontWeight: "bold" },

	memberItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
	avatarPlaceholderSm: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: sty.c19,
		marginRight: 16,
	},
	memberName: { color: sty.c4, fontSize: 15, fontWeight: "bold" },
	memberRole: { color: sty.c16, fontSize: 13, marginTop: 2 },

	musicItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
	},
	musicItemLeft: { flexDirection: "row", alignItems: "center" },
	musicTitle: { color: sty.c4, fontSize: 15, fontWeight: "bold" },
	musicSubtitle: { color: sty.c16, fontSize: 13, marginTop: 2 },
	musicItemRight: { alignItems: "flex-end" },
	musicOrder: { color: sty.c4, fontSize: 16, fontWeight: "bold" },
	musicKey: { color: sty.c16, fontSize: 12, marginTop: 2 },

	// Modais
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	modalContent: {
		backgroundColor: sty.c13,
		width: "100%",
		borderRadius: 20,
		padding: 24,
		alignItems: "center",
	},
	modalTitleBig: {
		fontSize: 22,
		fontWeight: "bold",
		color: sty.c4,
		textAlign: "center",
		marginBottom: 24,
	},
	modalTextNormal: {
		fontSize: 16,
		color: sty.c4,
		textAlign: "center",
		marginBottom: 20,
	},
	boldText: { fontWeight: "bold" },
	modalObs: {
		fontSize: 12,
		color: sty.c16,
		textAlign: "center",
		marginTop: 16,
	},
	modalAvatarPlaceholder: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: sty.c19,
		marginBottom: 8,
	},
	modalRoleText: { color: sty.c4, fontSize: 16, marginBottom: 24 },
	modalButtonsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		gap: 12,
	},
	modalBtnCancel: {
		flex: 1,
		backgroundColor: sty.c12,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	modalBtnCancelText: { color: sty.c4, fontSize: 16, fontWeight: "600" },
	modalBtnConfirm: {
		flex: 1,
		backgroundColor: sty.c1,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	modalBtnConfirmText: { color: sty.c14, fontSize: 16, fontWeight: "bold" },
});
