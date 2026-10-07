import { faUserMinus } from "@fortawesome/free-solid-svg-icons/faUserMinus";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
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
	/** Função/instrumento do membro indisponível (ex.: "Guitarra"). */
	memberRole: string;
	subTitle: string;
	onPress: () => void;
};

/** Card de indisponibilidade de membro exibido na seção Home. */
export default function Outages({
	title,
	subTitle,
	img,
	memberRole,
	onPress,
}: Props) {
	return (
		<TouchableOpacity style={style.container} onPress={onPress}>
			<View style={style.row}>
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
			<View style={style.row}>
				<FontAwesomeIcon icon={faUserMinus} size={15} color={sty.c6} />
				<Text style={[style.subTitle, { color: sty.c6, fontWeight: "800" }]}>
					{memberRole}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 10,
		backgroundColor: sty.c1,
		borderRadius: 10,
		width: 200,
		maxWidth: 200,
		gap: 7,
	},
	img: {
		width: 40,
		height: 40,
		borderRadius: 5,
	},
	row: {
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	title: {
		fontWeight: "900",
		fontSize: 17,
		overflow: "hidden",
		color: sty.c6,
	},
	subTitle: {
		fontWeight: "800",
		fontSize: 12,
		overflow: "hidden",
		color: sty.c6,
	},
});
