import {
	ScrollView,
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import sty from "@/constants/styles";
import Section from "@/components/user/sections";
import Team from "@/components/user/team";
import Info from "@/components/user/info";
import Function from "@/components/user/function";

export default function Index() {
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
					<Image source={require("@/assets/hz.jpg")} style={style.photo} />
				</View>
				<View style={{ flex: 1, gap: 6, overflow: "hidden" }}>
					<Text style={style.name} numberOfLines={2}>Henzo Brito dos Santos</Text>
					<Text style={style.register}>Registro: 13/10/2026</Text>
				</View>
			</View>

			<View style={style.function}>
				<Function title="Guitarrista" />
				<Function title="Guitarrista" />
				<Function title="Guitarrista" />
				<Function title="Guitarrista" />
				<TouchableOpacity style={style.plus}>
					<FontAwesomeIcon icon={faPlus} size={18} color={sty.c7} />
				</TouchableOpacity>
			</View>

			<Section title="Equipes" func={() => { }}>
				<Team
					img={require("@/assets/apj.jpg")}
					name="Apostulado Jovem"
					valPart={60}
				/>
				<Team
					img={require("@/assets/av.jpg")}
					name="André Valadão"
					valPart={60}
				/>
				<Team
					img={require("@/assets/av.jpg")}
					name="André Valadão"
					valPart={60}
				/>
			</Section>

			<Text style={style.title}>Infos</Text>

			<Info
				email="henzobrito67@gmail.com"
				password="HbS.6767"
				address="Rua Louro José, 230, Vila São Paulo - Poá, São Paulo - SP"
				birth="14/11/2008"
				phone="(11) 98705-1565"
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
	name: {
		color: sty.c4,
		fontSize: 27,
		fontWeight: 700,
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
});
