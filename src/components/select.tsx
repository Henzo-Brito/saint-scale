import { useRef, useState } from "react";
import {
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import style from "@/constants/styles";

type Props = {
	selects: string[];
};

export default function Select({ selects }: Props) {
	const [width, setWidth] = useState(0);
	const [selected, setSelected] = useState(0);

	const translateX = useRef(new Animated.Value(0)).current;

	const itemWidth = width / selects.length;

	function onClick(index: number) {
		setSelected(index);

		Animated.spring(translateX, {
			toValue: index * itemWidth,
			useNativeDriver: true,
		}).start();
	}

	return (
		<View
			style={styles.container}
			onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
		>
			{width > 0 && (
				<Animated.View
					style={[
						styles.indicator,
						{
							width: itemWidth,
							transform: [{ translateX }],
						},
					]}
				/>
			)}

			{selects.map((item, index) => (
				<TouchableOpacity
					key={index}
					style={styles.select}
					onPress={() => onClick(index)}
				>
					<Text
						style={[styles.text, selected === index && styles.selectedText]}
					>
						{item}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		backgroundColor: style.c6,
		borderRadius: 10,
		overflow: "hidden",
		position: "relative",
		width: "100%",
	},

	indicator: {
		position: "absolute",
		height: "100%",
		backgroundColor: style.c1,
		borderRadius: 10,
	},

	select: {
		flex: 1,
		paddingVertical: 8,
		alignItems: "center",
		zIndex: 1,
	},

	text: {
		color: "white",
	},

	selectedText: {
		fontWeight: "bold",
	},
});
