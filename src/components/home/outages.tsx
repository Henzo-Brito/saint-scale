import { UserRoundMinus } from "lucide-react-native";
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
	title: string;
	img: ImageSourcePropType;
	yourFunc: string;
	subTitle: string;
};

export default function Outages({ title, subTitle, img, yourFunc }: Props) {
	return (
		<TouchableOpacity style={style.container}>
			<View style={style.size}>
				<Image style={style.img} source={img} />
				<View style={{ flex: 1 }}>
					<Text style={style.title} numberOfLines={1}>
						{title}
					</Text>
					<Text style={style.subTitle} numberOfLines={1}>
						{subTitle}
					</Text>
				</View>
			</View>
			<View style={style.size}>
				<UserRoundMinus size={15} color={sty.c3} />
				<Text style={{ color: sty.c3 }}>{yourFunc}</Text>
			</View>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 10,
		backgroundColor: sty.c8,
		borderRadius: 10,
		width: 200,
		gap: 7,
	},
	img: {
		width: 40,
		height: 40,
		borderRadius: 5,
	},
	size: {
		flexDirection: "row",
		gap: 5,
		alignItems: "center",
	},
	title: {
		fontWeight: 600,
		fontSize: 16,
		overflow: "hidden",
		color: sty.c4,
	},
	subTitle: {
		fontWeight: 400,
		fontSize: 14,
		overflow: "hidden",
		color: sty.c5,
	},
});
