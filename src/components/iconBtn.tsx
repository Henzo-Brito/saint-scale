import type { LucideIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import style from "@/constants/styles";

type Props = {
	func: () => void;
	icon: LucideIcon;
	stroke?: number;
	color?: string;
	size?: number;
};

export default function IconBtn({
	color = style.c5,
	size = 23,
	icon: Icon,
	func,
	stroke = 2,
}: Props) {
	return (
		<TouchableOpacity onPress={func}>
			<Icon strokeWidth={stroke} color={color} size={size}></Icon>
		</TouchableOpacity>
	);
}
