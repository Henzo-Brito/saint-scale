import type { ReactNode } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import sty from "@/constants/styles";

type Props = {
	title: string;
	btnTitle?: string;
	func: () => void;
	children: ReactNode;
};

export default function Section({
	title,
	btnTitle = "ver todos >",
	func,
	children,
}: Props) {
	return (
		<View style={style.container}>
			<View style={style.topper}>
				<Text style={style.title} numberOfLines={1}>
					{title}
				</Text>
				<TouchableOpacity onPress={func}>
					<Text style={style.btnText} numberOfLines={1}>
						{btnTitle}
					</Text>
				</TouchableOpacity>
			</View>
			<ScrollView
				contentContainerStyle={style.children}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
			>
				{children}
			</ScrollView>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		width: "100%",
		columnGap: 15,
		rowGap: 10,
	},
	title: {
		color: sty.c4,
		fontWeight: 600,
		fontSize: 18,
		flex: 1,
		overflow: "hidden",
	},
	topper: {
		paddingInline: 15,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		width: "100%",
	},
	btnText: {
		width: "100%",
		color: sty.c3,
		overflow: "hidden",
		fontFamily: sty.font1,
		fontWeight: 900,
		textAlign: "right",
		fontSize: 16,
	},
	children: {
		paddingInline: 15,
		flexDirection: "row",
		gap: 10,
	},
});
