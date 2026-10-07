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
	/** Sufixo opcional exibido após o título (ex.: nome do mês). */
	mes?: string;
	btnTitle?: string;
	/** Tamanho da fonte do título. Padrão: 18. */
	titleSize?: number;
	onPress: () => void;
	children: ReactNode;
};

export default function Section({
	title,
	mes,
	btnTitle = "ver todos >",
	titleSize = 18,
	onPress,
	children,
}: Props) {
	return (
		<View style={styles.container}>
			<View style={styles.topper}>
				<Text style={[styles.title, { fontSize: titleSize }]} numberOfLines={1}>
					{title}
					{mes}
				</Text>
				<TouchableOpacity onPress={onPress}>
					<Text style={styles.btnText} numberOfLines={1}>
						{btnTitle}
					</Text>
				</TouchableOpacity>
			</View>
			<ScrollView
				contentContainerStyle={styles.children}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
			>
				{children}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		columnGap: 15,
		rowGap: 10,
	},
	title: {
		color: sty.c4,
		fontWeight: "600",
		flex: 1,
		overflow: "hidden",
	},
	topper: {
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		width: "100%",
	},
	btnText: {
		width: "100%",
		color: sty.c5,
		overflow: "hidden",
		fontFamily: sty.font1,
		fontWeight: "900",
		textAlign: "right",
		fontSize: 16,
	},
	children: {
		flexDirection: "row",
		gap: 10,
	},
});
