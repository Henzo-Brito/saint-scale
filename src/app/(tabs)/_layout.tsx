import { router, Tabs } from "expo-router";
import { CalendarDays, Home, Music, Search } from "lucide-react-native";
import IconBtn from "@/components/iconBtn";
import style from "@/constants/styles";
import Header from "../../components/header";

export default function root() {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					backgroundColor: style.c6,
					borderTopWidth: 0,
					elevation: 0,
					shadowOpacity: 0,
				},
				tabBarActiveTintColor: style.c4,
				tabBarInactiveTintColor: style.c5,
				tabBarLabelStyle: {
					fontFamily: style.font1,
					fontSize: 12,
					fontWeight: 700,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Início",
					header: () => {
						return <Header title="SaintScale"></Header>;
					},
					tabBarIcon: ({ color, size }) => (
						<Home size={size} color={color} strokeWidth={2.2} />
					),
				}}
			/>
			<Tabs.Screen
				name="scale"
				options={{
					title: "Escala",
					header: () => {
						return <Header title="Minha Escala"></Header>;
					},
					tabBarIcon: ({ color, size }) => (
						<CalendarDays size={size} color={color} strokeWidth={2.2} />
					),
				}}
			/>
			<Tabs.Screen
				name="repertory"
				options={{
					title: "Repertório",
					header: () => {
						return (
							<Header title="Repertório">
								<IconBtn
									func={() => {
										router.push("/repertory/search");
									}}
									icon={Search}
									stroke={3}
								></IconBtn>
							</Header>
						);
					},
					tabBarIcon: ({ color, size }) => (
						<Music size={size} color={color} strokeWidth={2.2} />
					),
				}}
			/>
		</Tabs>
	);
}
