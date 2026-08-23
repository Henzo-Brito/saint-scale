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
	imgs: ImageSourcePropType[];
};

export default function Equipes({ title, imgs }: Props) {
	function setImages() {
		return imgs.map((img, i) => {
			if (i == 5) {
				return (
					<View style={[style.lastImage, { zIndex: -6 }]} key={i}>
						<Image source={img} style={style.img} />
						<Text style={style.plus}>{imgs.length - i}+</Text>
					</View>
				);
			} else if (i < 5) {
				return (
					<Image source={img} style={[style.img, { zIndex: -i }]} key={i} />
				);
			}
		});
	}

	return (
		<TouchableOpacity style={style.container}>
			<Text style={style.title}>{title}</Text>
			<View style={style.images}>{setImages()}</View>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	plus: {
		fontWeight: 500,
		fontSize: 15,
	},
	lastImage: {
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	container: {
		backgroundColor: sty.c1,
		padding: 10,
		borderRadius: 10,
		gap: 5,
		width: 260,
	},
	images: {
		flexDirection: "row",
	},
	title: {
		fontWeight: 600,
		fontSize: 18,
	},
	img: {
		width: 40,
		height: 40,
		borderRadius: 30,
		marginRight: -10,
		borderWidth: 3,
		borderColor: sty.c2,
		alignItems: "center",
	},
});
