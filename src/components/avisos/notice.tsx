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
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";

type Props = {
	title: string;
	subTitle: string;
};

export default function Notice({ title, subTitle }: Props) {
	return (
		<TouchableOpacity style={style.container}>
			<View style={style.size}>
				{/* <Image style={style.img} source={img} /> */}
				<View style={{flexDirection: "row", gap: 18}}>
					<FontAwesomeIcon icon={faBell} size={30} color={sty.c5} />
					<Text style={style.title} numberOfLines={1}>
						{title}
					</Text>
				</View>
				<Text style={style.subTitle} numberOfLines={1}>
					{subTitle}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 14,
		backgroundColor: sty.c8,
		borderRadius: 10,
		width: "100%",
		gap: 7,
	},
	size: {
		alignItems: "center",
		flexDirection: "row",
		gap: 62,
		justifyContent: "space-around"
	},
	title: {
		fontWeight: 600,
		fontSize: 21,
		overflow: "hidden",
		color: sty.c4,
	},
	subTitle: {
		fontWeight: 400,
		fontSize: 12,
		overflow: "hidden",
		color: sty.c1,
	},
});
