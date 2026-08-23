import { Music, UserRound, UserRoundCheck } from "lucide-react-native";
import {
	Image,
	type ImageSourcePropType,
	StyleSheet,
	StyleSheetProperties,
	Text,
	TouchableOpacity,
	View,
	type ViewStyle,
} from "react-native";
import sty from "@/constants/styles";
import type { Date, Status } from "@/types/scales.type";
import Infos from "./home/infos";

export type Props = {
	Date: Date;
	Persons: ImageSourcePropType[];
	title: string;
	status: Status;
	func: () => void;
	styles?: ViewStyle;
};

export default function Scales({
	Date,
	Persons,
	title,
	status,
	func,
	styles,
}: Props) {
	if (Date.Day < 1 && Date.Day > 31) {
		Date.Day = 1;
	}

	function setPersons() {
		return Persons.map((personImg, i) => {
			if (i < 5) {
				return (
					<Image
						source={personImg}
						key={i}
						style={[style.img, { zIndex: -i }]}
					/>
				);
			}
		});
	}

	return (
		<TouchableOpacity style={[style.container, styles]} onPress={func}>
			<View style={style.header}>
				<Text style={style.left}>
					{Date.WeekDay}, {Date.hour}
				</Text>
				<Text style={style.right}>
					{Date.Day} de {Date.Mounth}
				</Text>
			</View>

			<Text style={style.title}>{title}</Text>

			<View style={style.persons}>{setPersons()}</View>
			<View style={style.status}>
				<Infos
					color={sty.c7}
					icon={UserRound}
					width={50}
					title={status.persons.toString()}
				></Infos>
				<Infos
					color={sty.c7}
					icon={UserRoundCheck}
					width={50}
					title={status.confirmed.toString()}
				></Infos>
				<Infos
					color={sty.c7}
					icon={Music}
					width={50}
					title={status.songs.toString()}
				></Infos>
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
		maxWidth: 350,
	},
	header: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
	},
	left: {
		color: sty.c7,
		fontWeight: 600,
		fontSize: 14,
	},
	right: {
		color: sty.c7,
		fontWeight: 600,
		fontSize: 14,
	},
	title: {
		color: sty.c6,
		fontWeight: 600,
		fontSize: 23,
	},
	persons: {
		paddingInline: 5,
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
