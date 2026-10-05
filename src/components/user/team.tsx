import {
	Image,
	type ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import sty from "@/constants/styles";

type Props = {
	name: string;
	img: ImageSourcePropType;
	valPart: number;
};

export default function Team({ name, valPart, img }: Props) {
	return (
		<TouchableOpacity style={style.container}>
			<View style={style.size}>
				<Image style={style.img} source={img} />
				<View style={{ flex: 1 }}>
					<Text style={style.title} numberOfLines={1}>
						{name}
					</Text>
					<Text style={style.subTitle} numberOfLines={1}>
						{valPart} participantes
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 14,
		backgroundColor: sty.c1,
		borderRadius: 10,
		width: 242,
		gap: 7,
	},
	img: {
        width: 52,
		height: 52,
		borderRadius: 5,
	},
	size: {
        flexDirection: "row",
		gap: 12,
		alignItems: "center",
        justifyContent: "center",
	},
	title: {
		fontWeight: 600,
		fontSize: 20,
		overflow: "hidden",
		color: sty.c6,
	},
	subTitle: {
		fontWeight: 400,
		fontSize: 11,
		overflow: "hidden",
		color: sty.c6,
	},
});
