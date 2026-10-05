import {
	Image,
	type ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import sty from "@/constants/styles";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons/faUserMinus";

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
					<Text style={style.subTitle} numberOfLines={1}>
						{subTitle}
					</Text>
					<Text style={style.title} numberOfLines={1}>
						{title}
					</Text>
				</View>
			</View>
			<View style={style.size}>
				<FontAwesomeIcon icon={faUserMinus} size={15} color={sty.c1} />
				<Text style={[style.subTitle, { color: sty.c1, fontWeight: 500 }]}>{yourFunc}</Text>
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
		gap: 10,
		alignItems: "center",
	},
	title: {
		fontWeight: 600,
		fontSize: 16,
		overflow: "hidden",
		color: sty.c4,
	},
	subTitle: {
		fontWeight: 300,
		fontSize: 12,
		overflow: "hidden",
		color: sty.c4,
	},
});
