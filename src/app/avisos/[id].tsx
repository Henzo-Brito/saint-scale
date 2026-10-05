import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ReturnHeader from "@/components/allPages/returnHeader";
import sty from "@/constants/styles";
import type { Aviso } from "@/types/avisos.type";

const avisos: Aviso[] = [
	{
		idAviso: "2",
		date: "10/04/2021",
		desc: `Minecraft é um jogo eletrônico de mundo aberto criado originalmente por Markus Persson e desenvolvido pela [Mojang Studios](https://www.minecraft.net?utm_source=chatgpt.com). Lançado oficialmente em 2011, o jogo permite que os jogadores explorem mundos gerados proceduralmente, coletem recursos, construam estruturas e enfrentem desafios em diferentes modos de jogo.
        Seu principal destaque é a liberdade criativa: utilizando blocos de diversos materiais, os jogadores podem construir desde simples casas até cidades inteiras e mecanismos complexos. Além do modo Criativo, existe o modo Sobrevivência, no qual é necessário obter recursos, fabricar ferramentas e se proteger de criaturas hostis.
        Com milhões de jogadores ao redor do mundo, Minecraft tornou-se um dos jogos mais vendidos da história e é amplamente utilizado tanto para entretenimento quanto para fins educacionais, estimulando criatividade, planejamento e resolução de problemas.
    `,
		persons: [
			{
				idPerson: "1",
				img: require("@/assets/1.jpg"),
				name: "Henzo Brito dos Santos",
				funcao: "Guitarrista Profissional o melhor, the best",
			},
		],
		title: "Minecraft The Best Game of The World",
	},
];

export default function Avisos() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const aviso = avisos.find((aviso) => aviso.idAviso === id);

	return (
		<View>
			<ReturnHeader />

			<ScrollView
				style={{ flex: 1, backgroundColor: sty.c7 }}
				contentContainerStyle={style.container}
			>
				<Text>{aviso?.title}</Text>
			</ScrollView>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		width: "100%",
		flex: 1,
		backgroundColor: sty.c7,
	},
});
