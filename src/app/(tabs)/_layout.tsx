import IconBtn from "@/components/iconBtn";
import style from "@/constants/styles";
import { router, Tabs } from "expo-router";
import Header from "../../components/header";
/* import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";*/
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser";


export default function root() {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: style.c7,
					borderTopWidth: 0,
					elevation: 0,
					shadowOpacity: 0,
					/* paddingBottom: 50,	
					paddingTop: 10, */
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
					header: () => {
						return <Header title="Início"></Header>;
					},
					tabBarIcon: ({ color, size }) => (
						<FontAwesomeIcon icon={faHouse} size={size} color={color} strokeWidth={2.2} />
					),
				}}
			/>
			<Tabs.Screen
				name="warnings"
				options={{
					header: () => {
						return (
							<Header title="Avisos">
							</Header>
						);
					},
					tabBarIcon: ({ color, size }) => (
						<FontAwesomeIcon icon={faBell} size={size} color={color} strokeWidth={2.2} />
					),
				}}
			/>
			<Tabs.Screen
				name="user"
				options={{
					header: () => {
						return (
							<Header title="Usuário">
							</Header>
						);
					},
					tabBarIcon: ({ color, size }) => (
						<FontAwesomeIcon icon={faCircleUser} size={size} color={color} strokeWidth={2.2} />
					),
				}}
			/>
		</Tabs>
	);
}
