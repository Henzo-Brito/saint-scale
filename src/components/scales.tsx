import { Music, UserRound, UserRoundCheck } from "lucide-react-native";
import {
	Image,
	type ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	type ViewStyle,
} from "react-native";
import sty from "@/constants/styles";
import type { ScaleDate, Status } from "@/types/scales.type";
import StatBadge from "./home/StatBadge";

export type Props = {
	scaleDate: ScaleDate;
	Persons: ImageSourcePropType[];
	title: string;
	status: Status;
	onPress: () => void;
	styles?: ViewStyle;
};

export default function Scales({
	scaleDate,
	Persons,
	title,
	status,
	onPress,
	styles,
}: Props) {
	// Garante que o dia fique dentro do intervalo válido (1–31).
	// Necessário enquanto os dados são mockados sem validação prévia.
	if (scaleDate.Day < 1 || scaleDate.Day > 31) {
		scaleDate.Day = 1;
	}

	function renderPersonAvatars() {
		// Exibe no máximo 5 avatares sobrepostos para não ultrapassar a largura do card.
		return Persons.slice(0, 5).map((personImg, i) => (
			<Image
				source={personImg}
				// biome-ignore lint/suspicious/noArrayIndexKey: Persons é um array de imagens sem IDs únicos; a ordem é estável e determinada externamente.
				key={`person-${i}`}
				style={[style.img, { zIndex: -i }]}
			/>
		));
	}

	return (
		<TouchableOpacity style={[style.container, styles]} onPress={onPress}>
			<View style={style.header}>
				<Text style={style.left}>
					{scaleDate.WeekDay}, {scaleDate.hour}
				</Text>
				<Text style={style.right}>
					{scaleDate.Day} de {scaleDate.Month}
				</Text>
			</View>

			<Text style={style.title}>{title}</Text>

			<View style={style.persons}>{renderPersonAvatars()}</View>
			<View style={style.status}>
				<StatBadge
					color={sty.c6}
					icon={UserRound}
					width={50}
					title={status.persons.toString()}
				/>
				<StatBadge
					color={sty.c6}
					icon={UserRoundCheck}
					width={50}
					title={status.confirmed.toString()}
				/>
				<StatBadge
					color={sty.c6}
					icon={Music}
					width={50}
					title={status.songs.toString()}
				/>
			</View>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	container: {
		backgroundColor: sty.c3,
		borderRadius: 10,
		padding: 10,
		width: 250,
		gap: 5,
	},
	header: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
	},
	left: {
		color: sty.c7,
		fontWeight: "500",
		fontSize: 14,
	},
	right: {
		color: sty.c7,
		fontWeight: "500",
		fontSize: 14,
	},
	title: {
		color: sty.c6,
		fontWeight: "900",
		fontSize: 23,
	},
	persons: {
		paddingHorizontal: 5,
		flexDirection: "row",
	},
	img: {
		width: 40,
		height: 40,
		borderRadius: 40,
		marginLeft: -10,
		borderWidth: 3,
		borderColor: sty.c3,
	},
	status: {
		paddingTop: 10,
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
});
