import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { session } from "@/services/session";
import { getMonth, getScaleDay, getUnavailability } from "@/services/home";

const queryClient = new QueryClient();

/** Retorna o nome do mês atual em português minúsculo, no formato esperado pela API. */
function getMesAtual(): string {
	const meses = [
		"janeiro", "fevereiro", "marco", "abril", "maio", "junho",
		"julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
	];
	return meses[new Date().getMonth()];
}

/** Retorna a data de hoje no formato DDMMYYYY esperado por getScaleDay. */
function getHojeFormatted(): string {
	const hoje = new Date();
	const dd = String(hoje.getDate()).padStart(2, "0");
	const mm = String(hoje.getMonth() + 1).padStart(2, "0");
	const yyyy = String(hoje.getFullYear());
	return `${dd}${mm}${yyyy}`;
}

/**
 * Dispara prefetch das queries da tela inicial para que os dados já estejam
 * em cache quando o usuário chegar na aba home.
 */
async function prefetchHomeData() {
	const mes = getMesAtual();
	const hoje = getHojeFormatted();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["home", "month", mes],
			queryFn: () => getMonth(mes as Parameters<typeof getMonth>[0]),
		}),
		queryClient.prefetchQuery({
			queryKey: ["home", "unavailability", mes],
			queryFn: () => getUnavailability(mes as Parameters<typeof getUnavailability>[0]),
		}),
		queryClient.prefetchQuery({
			queryKey: ["home", "scaleDay", hoje],
			queryFn: () => getScaleDay(hoje),
		}),
	]);
}

/**
 * Tela de carregamento exibida enquanto o token é verificado no SecureStore.
 * Evita tela branca (flash de conteúdo) durante a inicialização do app.
 */
function LoadingScreen() {
	return (
		<View style={styles.loading}>
			<ActivityIndicator size="large" color="#7C3AED" />
		</View>
	);
}

/**
 * Layout raiz com proteção de rotas.
 *
 * Rotas públicas (sem token necessário):
 * - /auth/* (onboarding, login, signUp, forgotPassword)
 *
 * Rotas protegidas (requerem token válido):
 * - /(tabs)/* (home, warnings, user)
 * - /scale/[id]
 * - /music/[id]
 * - /avisos/[id]
 *
 * Mecanismo reativo:
 * - Ao montar, registra session.onSessionCleared() para ser notificado quando
 *   o interceptor de 401 em api.ts limpar o token durante uso ativo do app.
 *   Isso garante que o usuário seja redirecionado imediatamente sem precisar
 *   fechar e reabrir o aplicativo.
 */
export default function RootLayout() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const segments = useSegments();
	const router = useRouter();

	// Ref para evitar navegação redundante em loops de efeito
	const isNavigating = useRef(false);

	useEffect(() => {
		// Verifica token ao inicializar o app
		async function checkAuth() {
			const token = await session.load();
			const authenticated = !!token;
			setIsAuthenticated(authenticated);

			// Se já autenticado, dispara prefetch imediatamente em background
			if (authenticated) {
				prefetchHomeData();
			}
		}

		checkAuth();

		// Registra callback para quando o interceptor de 401 limpar a sessão.
		// Isso permite reatividade sem polling: se o token expirar durante o uso,
		// o _layout reage imediatamente.
		session.onSessionCleared(() => {
			setIsAuthenticated(false);
		});

		// Cleanup: remove a callback ao desmontar o layout raiz.
		return () => {
			session.offSessionCleared();
		};
	}, []);

	useEffect(() => {
		// Aguarda verificação inicial antes de redirecionar
		if (isAuthenticated === null) return;
		if (isNavigating.current) return;

		const inAuthGroup = segments[0] === "auth";

		if (!isAuthenticated && !inAuthGroup) {
			// Sessão inexistente ou expirada — redireciona para onboarding
			isNavigating.current = true;
			router.replace("/auth");
			setTimeout(() => {
				isNavigating.current = false;
			}, 500);
		} else if (isAuthenticated && inAuthGroup) {
			// Usuário autenticado tentando acessar rota pública — redireciona para home
			// Dispara prefetch para que os dados já estejam prontos ao chegar na aba
			prefetchHomeData();
			isNavigating.current = true;
			router.replace("/(tabs)");
			setTimeout(() => {
				isNavigating.current = false;
			}, 500);
		}
		// biome-ignore lint/correctness/useExhaustiveDependencies: router.replace é uma referência estável do expo-router e não precisa entrar no array
	}, [isAuthenticated, segments, router.replace]);

	// Exibe tela de carregamento enquanto verifica o token no SecureStore.
	// Isso evita o flash de conteúdo protegido antes do redirect.
	if (isAuthenticated === null) {
		return <LoadingScreen />;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Stack screenOptions={{ headerShown: false }} />
		</QueryClientProvider>
	);
}

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#0F0F0F",
	},
});
