import ReturnHeader from "@/components/allPages/returnHeader";
import style from "@/constants/styles"; // Centralizado em uma única importação
import type { Aviso } from "@/types/avisos.type";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons/faBullhorn";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, StyleSheet, View } from "react-native";

const avisos: Aviso[] = [
    {
        idAviso: "1",
        date: "25 de setembro de 2026",
        desc: `Minecraft é um jogo eletrônico de mundo aberto criado originalmente por Markus Persson e desenvolvido pela Mojang Studios. Lançado oficialmente em 2011, o jogo permite que os jogadores explorem mundos gerados proceduralmente, coletem recursos, construam estruturas e enfrentem desafios em diferentes modos de jogo.

Seu principal destaque é a liberdade criativa: utilizando blocos de diversos materiais, os jogadores podem construir desde simples casas até cidades inteiras e mecanismos complexos. Além do modo Criativo, existe o modo Sobrevivência, no qual é necessário obter recursos, fabricar ferramentas e se proteger de criaturas hostis.

Com milhões de jogadores ao redor do mundo, Minecraft tornou-se um dos jogos mais vendidos da história e é amplamente utilizado tanto para entretenimento quanto para fins educacionais, estimulando criatividade, planejamento e resolução de problemas.`,
        persons: [
            {
                idPerson: "1",
                img: require("@/assets/1.jpg"),
                name: "Henzo Brito dos Santos",
                funcao: "Guitarristas e tecladistas",
            },
        ],
        title: "Título do Alerta",
    },
];

export default function Avisos() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const aviso = avisos.find((aviso) => aviso.idAviso === id) || avisos[0]; // Fallback para o primeiro exemplo caso não ache id

    const funcaoPessoa = aviso?.persons?.[0]?.funcao || "";

    return (
        <View style={styles.container}>
            <ReturnHeader title="Alerta" />

            {aviso ? (
                <View style={styles.mainContent}>
                    {/* Seção Superior - Ícone, Título e Categoria/Função */}
                    <View style={styles.headerSection}>
                        <View style={styles.iconCircle}>
                            <FontAwesomeIcon icon={faBullhorn} size={36} color="#1C1B2F" />
                        </View>
                        <Text style={styles.title}>{aviso.title}</Text>
                        {funcaoPessoa ? (
                            <Text style={styles.subtitle}>{funcaoPessoa}</Text>
                        ) : null}
                    </View>

                    {/* Card Inferior - Conteúdo do Alerta */}
                    <View style={styles.cardContainer}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Linha com Data e Hora */}
                            <View style={styles.dateRow}>
                                <Text style={styles.dateText}>{aviso.date}</Text>
                                <Text style={styles.dateText}>20:00</Text>
                            </View>

                            <Text style={styles.descriptionTitle}>Descrição</Text>
                            <Text style={styles.descriptionText}>{aviso.desc}</Text>
                        </ScrollView>
                    </View>
                </View>
            ) : (
                <View style={styles.notFoundContainer}>
                    <Text style={styles.notFound}>Aviso não encontrado.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#201B42", // Cor escura do fundo da tela
    },
    mainContent: {
        flex: 1,
    },
    headerSection: {
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FF9800", // Cor laranja do círculo
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 6,
    },
    subtitle: {
        color: "#A29DB8",
        fontSize: 14,
        textAlign: "center",
    },
    cardContainer: {
        flex: 1,
        backgroundColor: "#110E1B", // Cor de fundo do card interno
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    dateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    dateText: {
        color: "#8E8A9F",
        fontSize: 14,
    },
    descriptionTitle: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
    },
    descriptionText: {
        color: "#D1CFCF",
        fontSize: 16,
        lineHeight: 24,
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notFound: {
        color: "#FFFFFF",
        fontSize: 16,
    },
});