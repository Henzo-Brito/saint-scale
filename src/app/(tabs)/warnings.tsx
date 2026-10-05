import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import Scales from "@/components/scales";
import sty from "@/constants/styles";
import Section from "@/components/avisos/sections";
import Outages from "@/components/avisos/outages";
import Notice from "@/components/avisos/notice";

export default function Index() {

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: sty.c7 }}
			contentContainerStyle={style.container}
		>

			<Section title="Alertas" func={() => { }}>
				<Outages
					/* img={require("@/assets/1.jpg")} */
					title="Título do Alerta"
					subTitle="2 setembro"
					functions="Guitaristas e tecladistas"
				/>
				<Outages
					/* img={require("@/assets/1.jpg")} */
					title="Título do Alerta"
					subTitle="2 setembro"
					functions="Guitaristas e tecladistas"
				/>
				<Outages
					/* img={require("@/assets/1.jpg")} */
					title="Título do Alerta"
					subTitle="2 setembro"
					functions="Guitaristas e tecladistas"
				/>
			</Section>

			<Text style={style.title}>Notificações</Text>

			<Notice
				title="Título do Alerta"
				subTitle="14/11/2008"
			/>
			<Notice
				title="Título do Alerta"
				subTitle="14/11/2008"
			/>
			<Notice
				title="Título do Alerta"
				subTitle="14/11/2008"
			/>
			
		</ScrollView>
	);
}

const style = StyleSheet.create({
	container: {
		padding: 15,
		gap: 15,
	},
	title: {
		color: sty.c4,
		fontWeight: 600,
		fontSize: 18,
		width: "100%",
	},
});