import { faGuitar } from "@fortawesome/free-solid-svg-icons/faGuitar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import sty from "@/constants/styles";

type Props = {
	title: string;
};

export default function RoleTag({ title }: Props) {
	return (
		<TouchableOpacity style={style.container}>
			<FontAwesomeIcon icon={faGuitar} size={18} color={sty.c1} />
			<Text style={style.title}>{title}</Text>
		</TouchableOpacity>
	);
}

const style = StyleSheet.create({
	container: {
		backgroundColor: sty.c8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
		paddingHorizontal: 15,
		paddingVertical: 6,
		gap: 10,
	},
	title: {
		fontSize: 14,
		color: sty.c4,
	},
});
