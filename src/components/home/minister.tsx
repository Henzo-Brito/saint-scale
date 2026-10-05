import type { ReactNode } from "react";
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
	children: ReactNode;
	title: string;
	Img: ImageSourcePropType;
	func?: () => void;
};

export default function Minister({
	children,
	title = "Título",
	Img,
	func,
}: Props) {
	const style = StyleSheet.create({
		left: {
			width: 60,
			height: 60,
			borderRadius: 5,
			backgroundColor: sty.c4,
		},
		right: {
			flex: 1,
			justifyContent: "center",
			gap: 5,
			height: 60,
		},
		title: {
			fontSize: 20,
			width: "100%",
			overflow: "hidden",
			fontFamily: sty.font1,
			fontWeight: 700,
			color: sty.c4,
		},
		container: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: sty.c1,
			width: "100%",
			maxWidth: 420,
			borderRadius: 10,
			padding: 10,
			height: 100,
			gap: 10,
		},
		childrens: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
	});
	return (
		<TouchableOpacity onPress={func} style={style.container}>
			<Image source={Img} style={style.left}></Image>

			<View style={style.right}>
				<Text style={style.title} numberOfLines={1}>
					{title}
				</Text>
				<View style={style.childrens}>{children}</View>
			</View>
		</TouchableOpacity>
	);
}
