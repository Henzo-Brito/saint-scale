import { ScrollView, StyleSheet } from "react-native";
import Music from "@/components/repertory/music";
import Select from "@/components/select";
import sty from "@/constants/styles";

export default function index() {
	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: sty.c7 }}
			contentContainerStyle={style.container}
		>
			<Select selects={["Músicas", "Artistas"]} />
			<Music
				authors={["Nívea Soares", "aaaaaaaaaaaaaaaa"]}
				img={require("@/assets/1.jpg")}
				title="A resposta"
				tom="Bm"
			/>
			<Music
				authors={["Nívea Soares", "aaaaaaaaaaaaaaaa"]}
				img={require("@/assets/1.jpg")}
				title="A resposta"
				tom="Bm"
			/>
			<Music
				authors={["Nívea Soares", "aaaaaaaaaaaaaaaa"]}
				img={require("@/assets/1.jpg")}
				title="A resposta"
				tom="Bm"
			/>
			<Music
				authors={["Nívea Soares", "aaaaaaaaaaaaaaaa"]}
				img={require("@/assets/1.jpg")}
				title="A resposta"
				tom="Bm"
			/>
			<Music
				authors={["Nívea Soares", "aaaaaaaaaaaaaaaa"]}
				img={require("@/assets/1.jpg")}
				title="A resposta"
				tom="Bm"
			/>
			<Music
				authors={["Nívea Soares", "aaaaaaaaaaaaaaaa"]}
				img={require("@/assets/1.jpg")}
				title="A resposta"
				tom="Bm"
			/>
			<Music
				authors={["Nívea Soares", "aaaaaaaaaaaaaaaa"]}
				img={require("@/assets/1.jpg")}
				title="A resposta"
				tom="Bm"
			/>
			<Music
				authors={["Nívea Soares", "aaaaaaaaaaaaaaaa"]}
				img={require("@/assets/1.jpg")}
				title="A resposta"
				tom="Bm"
			/>
			<Music
				authors={["Nívea Soares", "aaaaaaaaaaaaaaaa"]}
				img={require("@/assets/1.jpg")}
				title="A resposta"
				tom="Bm"
			/>
		</ScrollView>
	);
}

const style = StyleSheet.create({
	container: {
		gap: 20,
		padding: 15,
		width: "100%",
	},
});
