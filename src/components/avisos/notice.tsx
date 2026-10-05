/* import { UserRoundMinus } from "lucide-react-native"; */

import sty from "@/constants/styles";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
	/* Image,
	type ImageSourcePropType, */
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type Props = {
	title: string;
	subTitle: string;
};

export default function Notice({ title, subTitle }: Props) {
	return (
		<TouchableOpacity style={style.container}>
			<View style={style.size}>
				{/* <Image style={style.img} source={img} /> */}
				<View style={{ flexDirection: "row", gap: 18, flex: 1, alignItems: "center" }}>
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
	},
	size: {
		alignItems: "center",
		flexDirection: "row",
		gap: 1,
		width: "100%",
		justifyContent: "space-between",
	},
	title: {
		flex: 1,
		fontWeight: 600,
		fontSize: 20,
		overflow: "hidden",
		color: sty.c4,
	},
	subTitle: {
		fontWeight: 700,
		fontSize: 13,
		flexShrink: 0,
		overflow: "hidden",
		color: sty.c1,
		textAlign: "right",
	},
});
