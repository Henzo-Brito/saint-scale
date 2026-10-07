import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Módulo responsável pela gestão da sessão do usuário.
 *
 * Em dispositivos nativos (iOS/Android): usa expo-secure-store (armazenamento seguro).
 * Em ambiente web (desenvolvimento/browser): usa localStorage como fallback,
 * pois expo-secure-store não está disponível fora de dispositivos nativos.
 *
 * Também expõe um mecanismo de notificação (onSessionCleared) para que
 * o interceptor de 401 em api.ts possa sinalizar ao _layout raiz que a sessão
 * expirou, sem criar dependência circular com expo-router.
 */

const TOKEN_KEY = "saint_scale_access_token";

/** Callback registrada pelo _layout para reagir à limpeza de sessão. */
let _onSessionClearedCallback: (() => void) | null = null;

/** Callback registrada pelo _layout para reagir ao login. */
let _onSessionSavedCallback: (() => void) | null = null;

/** Adapta o armazenamento conforme a plataforma. */
const storage = {
	async set(key: string, value: string): Promise<void> {
		if (Platform.OS === "web") {
			localStorage.setItem(key, value);
		} else {
			await SecureStore.setItemAsync(key, value);
		}
	},

	async get(key: string): Promise<string | null> {
		if (Platform.OS === "web") {
			return localStorage.getItem(key);
		}
		return SecureStore.getItemAsync(key);
	},

	async remove(key: string): Promise<void> {
		if (Platform.OS === "web") {
			localStorage.removeItem(key);
		} else {
			await SecureStore.deleteItemAsync(key);
		}
	},
};

export const session = {
	/**
	 * Salva o token de acesso e notifica o _layout.
	 * Nativo: SecureStore | Web: localStorage
	 */
	async save(token: string): Promise<void> {
		await storage.set(TOKEN_KEY, token);
		_onSessionSavedCallback?.();
	},

	/**
	 * Carrega o token de acesso.
	 * @returns Token JWT ou null se não houver sessão ativa
	 */
	async load(): Promise<string | null> {
		return storage.get(TOKEN_KEY);
	},

	/**
	 * Remove o token e notifica o _layout.
	 * Usado no logout explícito ou quando o interceptor recebe 401.
	 */
	async clear(): Promise<void> {
		await storage.remove(TOKEN_KEY);
		_onSessionClearedCallback?.();
	},

	/**
	 * Registra uma callback a ser chamada quando a sessão for limpa.
	 * Permite reatividade no _layout sem polling.
	 */
	onSessionCleared(callback: () => void): void {
		_onSessionClearedCallback = callback;
	},

	/** Remove a callback registrada (cleanup do useEffect). */
	offSessionCleared(): void {
		_onSessionClearedCallback = null;
	},
};
