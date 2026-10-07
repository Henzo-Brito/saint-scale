import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Tabs } from "expo-router";
import Header from "@/components/header";
import style from "@/constants/styles";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: style.c7,
					borderTopWidth: 0,
					elevation: 0,
					shadowOpacity: 0,
				},
				tabBarActiveTintColor: style.c4 as string,
				tabBarInactiveTintColor: style.c5 as string,
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
					header: () => {
						return <Header title="Início"></Header>;
					},
					tabBarIcon: ({ color, size }) => (
						<FontAwesomeIcon
							icon={faHouse}
							size={size}
							color={color as string}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="warnings"
				options={{
					header: () => {
						return <Header title="Avisos"></Header>;
					},
					tabBarIcon: ({ color, size }) => (
						<FontAwesomeIcon
							icon={faBell}
							size={size}
							color={color as string}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="user"
				options={{
					header: () => {
						return <Header title="Usuário"></Header>;
					},
					tabBarIcon: ({ color, size }) => (
						<FontAwesomeIcon
							icon={faCircleUser}
							size={size}
							color={color as string}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
