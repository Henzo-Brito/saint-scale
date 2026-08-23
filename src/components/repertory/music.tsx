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
	img: ImageSourcePropType;
	title: string;
	authors: string[];
	tom: string;
};

export default function Music({ img, title, authors, tom }: Props) {
	function setAuthors() {
		return authors.map((author, i) => {
			if (i == authors.length - 1) {
				return author;
			}
			return author + ", ";
		});
	}

	return (
		<TouchableOpacity style={style.container}>
			<Image source={img} style={style.img} />
			<View style={style.desc}>
				<Text numberOfLines={1} style={style.title}>
					{title}
				</Text>
				<Text numberOfLines={1} style={style.authors}>
					{setAuthors()}
				</Text>
				<Text numberOfLines={1} style={style.tom}>
					Tom: {tom}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 10,
	},
	desc: {
		flex: 1,
	},
	img: {
		width: 60,
		height: 60,
		borderRadius: 7,
	},
	title: {
		color: sty.c4,
		fontSize: 16,
		overflow: "hidden",
		width: "100%",
	},
	authors: {
		color: sty.c5,
		overflow: "hidden",
	},
	tom: {
		color: sty.c2,
		overflow: "hidden",
	},
});
