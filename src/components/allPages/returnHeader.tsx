import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { StyleSheet, Text } from "react-native";
import IconBtn from "../iconBtn";

type Props = {
	title?: string;
	children?: React.ReactNode;
};

import { SafeAreaView } from "react-native-safe-area-context";
import sty from "@/constants/styles";

export default function ReturnHeader({ title, children }: Props) {
	return (
		<SafeAreaView style={style.container} edges={["top"]}>
			<IconBtn
				func={() => {
					router.back();
				}}
				icon={ChevronLeft}
				color={sty.c4}
				stroke={3}
				size={25}
			/>

			<Text style={style.title}>{title}</Text>

			{children}
		</SafeAreaView>
	);
}

const style = StyleSheet.create({
	container: {
		flexDirection: "row",
		padding: 15,
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: sty.c6,
		position: "fixed",
		width: "100%",
		top: 0,
	},
	title: {
		fontSize: 18,
		fontWeight: 600,
		color: sty.c4,
	},
});
