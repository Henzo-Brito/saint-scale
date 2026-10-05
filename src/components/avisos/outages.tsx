/* import { UserRoundMinus } from "lucide-react-native"; */
import {
	/* Image,
	type ImageSourcePropType, */
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import sty from "@/constants/styles";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons/faBullhorn";

type Props = {
	title: string;
	/* img: ImageSourcePropType; */
	functions: string;
	subTitle: string;
};

export default function Outages({ title, subTitle, functions }: Props) {
	return (
		<TouchableOpacity style={style.container}>
			<View style={style.size}>
				{/* <Image style={style.img} source={img} /> */}
				<FontAwesomeIcon icon={faBullhorn} size={48} color={sty.c1} />
				<View style={{ flex: 1, gap: 6 }}>
					<Text style={style.subTitle} numberOfLines={1}>
						{subTitle}
					</Text>
					<Text style={style.title} numberOfLines={1}>
						{title}
					</Text>
					<View style={style.size}>
						<Text style={{ color: sty.c4, fontSize: 12 }}>{functions}</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 12,
		backgroundColor: sty.c8,
		borderRadius: 10,
		width: 319,
		gap: 7,
	},
	/* 
	img: {
		width: 40,
		height: 40,
		borderRadius: 5,
	}, */
	size: {
		flexDirection: "row",
		gap: 18,
		alignItems: "center",
	},
	title: {
		fontWeight: 600,
		fontSize: 24,
		overflow: "hidden",
		color: sty.c4,
	},
	subTitle: {
		fontWeight: 500,
		fontSize: 14,
		overflow: "hidden",
		color: sty.c5,
	},
});
