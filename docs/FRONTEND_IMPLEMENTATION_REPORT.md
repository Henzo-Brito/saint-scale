# FRONTEND_IMPLEMENTATION_REPORT.md
> Relatório das alterações realizadas no frontend do SaintScale  
> Gerado em: 2026-10-07

---

## Visão Geral

Este relatório documenta todas as implementações e correções aplicadas ao frontend React Native (Expo) do projeto SaintScale durante o Prompt 3 — Alinhamento Frontend ↔ Backend.

O objetivo foi integrar completamente as telas com a API real, substituindo todos os dados mockados por chamadas aos endpoints implementados no backend.

---

## Estado antes vs depois

| Tela | Antes | Depois |
|------|-------|--------|
| `auth/login.tsx` | ✅ Integrado (mas senha min 6) | ✅ Integrado (senha min 8) |
| `auth/signUp.tsx` | ✅ Integrado | ✅ Sem alteração |
| `auth/forgotPassword.tsx` | ❌ Stub vazio | ✅ Implementado |
| `auth/index.tsx` | Mock interno | Mock interno (onboarding — OK) |
| `(tabs)/index.tsx` | ❌ Mock hardcoded | ✅ Integrado com API |
| `(tabs)/warnings.tsx` | ❌ Mock hardcoded | ✅ Integrado com API |
| `(tabs)/user.tsx` | ❌ Mock hardcoded | ✅ Integrado com API |
| `scale/[id].tsx` | ❌ Mock hardcoded | ✅ Integrado com API (3 abas + modais) |
| `music/[id].tsx` | ❌ Mock hardcoded | ✅ Integrado com API |
| `avisos/[id].tsx` | ❌ Tipo local incompatível | ✅ Integrado com API |

---

## Arquivos criados

### `src/services/session.ts`
Módulo de persistência de sessão usando `expo-secure-store`.

```typescript
// Responsabilidades:
session.save(token)   // Salva JWT no SecureStore
session.load()        // Carrega JWT do SecureStore (retorna null se não houver)
session.clear()       // Remove JWT (logout ou expiração)
```

Chave de armazenamento: `"saint_scale_access_token"`.

---

### `src/services/home.ts`
Todos os endpoints de home.

```typescript
getMonth(mes: MonthName)           // GET /home/month/{mes}
getUnavailability(mes: MonthName)  // GET /home/unavailability/{mes}
getMyScales()                      // GET /home/scale/me
getScaleDay(day: string)           // GET /home/scale/day/{day}
```

---

### `src/services/scales.ts`
Todos os endpoints de escala e música.

```typescript
getScale(id)                          // GET /scale/{id}
getScaleMusics(id)                    // GET /scale/{id}/musics
getScaleMusicDetail(idScale, idME)    // GET /scale/{id}/music/{id_music_escalas}
getScaleInfo(id)                      // GET /scale/{id}/info
getScaleMembers(id)                   // GET /scale/{id}/members
sairDaEscala(data)                    // POST /scale/sair
substituirMembro(data)                // POST /scale/substituir
getMusicDetail(idMusicEscalas)        // GET /music/{id_music_escalas}
```

---

### `src/services/alerts.ts`
Endpoints de alertas e notificações.

```typescript
getReminder()           // GET /alert/reminder
getReminderDetail(id)   // GET /alert/reminder/{id}
```

---

### `src/types/api.types.ts`
Tipos TypeScript derivados dos schemas do backend. Cobre todos os 23 endpoints.

Grupos de tipos:
- **User:** `Me`, `Logradouro`, `EquipeItem`, `AlterEmail`, `ForgotPassword`, `AlterLogradouro`, `AlterBirthday`, `AlterTelephone`, `PatchResponse`
- **Home:** `MonthItem`, `UnavailabilityItem`, `ScaleItem`, `ScaleDayItem`
- **Alert:** `AlertItem`, `NotificationItem`, `ReminderList`, `ReminderDetail`
- **Scale:** `ScaleDetail`, `ScaleMusicItem`, `ScaleMusicDetail`, `IndisponibilidadeItem`, `ScaleInfo`, `ScaleMemberItem`, `SairBody`, `SubstituirBody`
- **Util:** `MonthName` (union dos 12 meses em português, alinhado com enum do backend)

---

### `src/utils/date.ts`
Utilitários de data localizados em português.

```typescript
parseDateString(dateString: string)  // "YYYY-MM-DD" → { diaSemana, dia, mes }
MONTH_NAMES[]                        // Nomes completos dos meses
MONTH_NAMES_SHORT[]                  // Nomes abreviados dos meses
WEEKDAY_NAMES[]                      // Nomes completos dos dias da semana
WEEKDAY_NAMES_SHORT[]                // Nomes abreviados dos dias da semana
```

---

### `src/components/Section.tsx`
Componente de seção genérica com scroll horizontal e botão opcional.

Props: `title`, `mes?`, `btnTitle?`, `titleSize?`, `onPress`, `children`

---

### `src/components/avisos/AlertCard.tsx`
Card de alerta para a tela de avisos.

Props: `title`, `subTitle`, `targetGroup`, `onPress`

---

### `src/components/home/StatBadge.tsx`
Badge de estatística para uso nos cards de escala.

---

## Arquivos modificados

### `src/services/api.ts`
Antes: instância Axios sem interceptors.

Depois:
- **Interceptor de request:** carrega token do SecureStore e injeta em `Authorization: Bearer <token>`
- **Interceptor de response:** limpa sessão ao receber 401 (token expirado)

```typescript
api.interceptors.request.use(async (config) => {
  const token = await session.load();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) await session.clear();
    return Promise.reject(error);
  }
);
```

---

### `src/services/auth.ts`
Antes: `login()` retornava token sem salvar.

Depois:
- `login()` salva token via `session.save()` após validar com `LoginResponseSchema`
- `logout()` adicionado — chama `session.clear()`

---

### `src/services/users.ts`
Antes: apenas `createUser()`.

Depois adicionado:
- `getMe()` — `GET /user/me`
- `alterEmail()` — `PATCH /user/alterEmail`
- `forgotPassword()` — `PATCH /user/forgotPassword` (público)
- `alterLogradouro()` — `PATCH /user/alterLogradouro`
- `alterBirthday()` — `PATCH /user/alterBirthday`
- `alterTelephone()` — `PATCH /user/alterTelephone`

---

### `src/schemas/auth.schemas.ts`
Antes: `password.min(6)` — divergia do backend (`min(8)`).  
Depois: `password.min(8)` — alinhado com o backend.

---

### `src/app/_layout.tsx`
Antes: stub sem proteção de rotas. Token não verificado.

Depois:
- Verifica token via `session.load()` ao iniciar
- Redireciona para `/auth/login` se não autenticado
- Redireciona para `/(tabs)` se autenticado e na rota de auth
- Renderiza `null` durante a verificação inicial (evita flash de conteúdo)
- Corrigido: `router.replace` removido do array de dependências do `useEffect` (referência instável que causava re-renders desnecessários)

---

### `src/app/auth/forgotPassword.tsx`
Antes: stub com apenas `<Text>Henzo é Legal</Text>`.

Depois: tela completa com:
- Campo de email
- Campo de nova senha (min 8, max 60)
- Campo de confirmação de senha
- Validação local com mensagens de erro
- `useMutation` chamando `forgotPassword()` de `users.ts`
- Feedback de loading enquanto aguarda resposta
- Alert de sucesso com redirect para login
- Tratamento de erro (email não encontrado)
- Botão "Voltar para o login"

---

### `src/app/auth/login.tsx`
- Senha mínima corrigida de 6 para 8 caracteres (alinhada com `LoginSchema`)

---

### `src/app/(tabs)/index.tsx`
Antes: dados mockados hardcoded.

Depois — integração completa com 4 queries paralelas:
1. `useQuery → getMonth(mesAPI)` — datas das escalas para o calendário
2. `useQuery → getUnavailability(mesAPI)` — indisponibilidades do mês
3. `useQuery → getMyScales()` — escalas do usuário autenticado
4. `useQuery → getScaleDay(dayFormatted)` — escalas do dia selecionado

Funcionalidades:
- Calendário marca dias com escalas via `compromissos`
- Seção de indisponibilidades (oculta quando vazia)
- Escalas do dia com navegação para `/scale/[id]`
- "Minhas Escalas" com navegação para `/scale/[id]`
- Estados de loading com `ActivityIndicator`
- Estado vazio com mensagem explicativa
- Conversão de datas: `DD/MM/YYYY` (API) ↔ `YYYY-MM-DD` (calendário) ↔ `DDMMYYYY` (endpoint day)

---

### `src/app/(tabs)/warnings.tsx`
Antes: dados mockados.

Depois:
- `useQuery → getReminder()` para alertas e notificações
- `AlertCard` para cada alerta (navega para `/avisos/{id_lembrete}`)
- `Notice` para cada notificação
- Estado de loading com `ActivityIndicator`
- Estado de erro com mensagem
- Estado vazio quando não há avisos

---

### `src/app/(tabs)/user.tsx`
Antes: dados hardcoded (nome fictício, funções fixas).

Depois:
- `useQuery → getMe()` com `queryKey: ["user", "me"]`
- Foto de perfil: usa `me.img_id` se disponível, senão fallback para asset local
- Nome real do usuário
- Data de registro formatada (`DD/MM/YYYY`)
- Funções reais via `RoleTag` (mapeadas de `me.funcoes`)
- Equipes reais via `Team` (mapeadas de `me.equipes`)
- Infos reais: email, endereço, nascimento, telefone (com formatação)
- Botão de logout com `Alert.alert` de confirmação → `logout()` + `router.replace("/auth/login")`
- Estado de loading com `ActivityIndicator`
- Estado de erro com mensagem

---

### `src/app/avisos/[id].tsx`
Antes: tipo local `Aviso` incompatível com API, dados hardcoded.

Depois:
- `useLocalSearchParams` para ler `id` da rota
- `useQuery → getReminderDetail(id)` com `queryKey: ["alert", "detail", id]`
- Título real (`aviso.name`)
- Grupo alvo real (`aviso.functions.join(", ")`)
- Data e hora reais (`aviso.date`, `aviso.tempo`)
- Descrição real (`aviso.description`)
- Estado de loading com `ActivityIndicator`
- Estado de erro/não encontrado

---

### `src/app/scale/[id].tsx`
Antes: dados hardcoded, sem leitura do parâmetro `id`, modais decorativos.

Depois — integração completa:

**Cabeçalho:**
- `useLocalSearchParams` para ler `id`
- `useQuery → getScale(id)` para nome e data da escala

**Aba Info (`useQuery → getScaleInfo(id)`):**
- Membros confirmados
- Local da escala (ou "Local não definido")
- Lista de indisponibilidades
- Botão "Sair da Escala" (funcional via modal)

**Aba Músicas (`useQuery → getScaleMusics(id)`):**
- Lista de músicas com nome, banda, ordem e tom
- Navegação para `/music/{id_music_escalas}` ao clicar

**Aba Membros (`useQuery → getScaleMembers(id)`):**
- Membros agrupados: Indisponibilidades / Confirmados / Pendentes
- Itens indisponíveis têm botão para o modal de substituição

**Modal Sair da Escala:**
- `POST /scale/sair` com `{ id_escala }`
- Invalida queries `["scale", id, "info"]` e `["scale", id, "members"]`
- Alert de sucesso/erro

**Modal Substituir Membro:**
- `POST /scale/substituir` com `{ id_membro_escala }`
- Invalida query `["scale", id, "members"]`
- Alert de sucesso/erro

**Lazy loading por aba:** cada query é habilitada apenas quando a aba correspondente está ativa (`enabled: !!id && activeTab === "info"`).

---

### `src/app/music/[id].tsx`
Antes: stub hardcoded.

Depois:
- `useLocalSearchParams` para ler `id` (= `id_music_escalas`)
- `useQuery → getMusicDetail(id)` — chama `GET /music/{id_music_escalas}`
- Nome, autor, BPM (condicional — oculto quando null)
- Tom atual e tom original com visual diferenciado
- Card de links: Spotify, YouTube, Cifra, Letra
  - Links vazios são filtrados automaticamente
  - `Linking.openURL()` para abrir links externos
  - `Linking.canOpenURL()` antes de abrir
- Posição da música na escala (`{ordem}ª Música a ser tocada`)
- Estado de loading e erro

---

## Arquivos removidos

| Arquivo | Motivo |
|---------|--------|
| `src/app/scale/[id]_integrated.tsx` | Rascunho de integração — substituído pelo `[id].tsx` final |
| `src/components/allPages/setImage.tsx` | Componente não utilizado em nenhuma tela |
| `src/components/avisos/alert.tsx` | Substituído por `AlertCard.tsx` com interface compatível com API |
| `src/components/avisos/outages.tsx` | Funcionalidade absorvida por outros componentes |
| `src/components/avisos/sections.tsx` | Substituído por `Section.tsx` genérico |
| `src/components/home/equipes.tsx` | Não mais necessário — equipes renderizadas diretamente em user.tsx |
| `src/components/home/infos.tsx` | Absorvido pela aba Info de scale/[id].tsx |
| `src/components/home/minister.tsx` | Não utilizado |
| `src/components/home/sections.tsx` | Substituído por `Section.tsx` genérico |
| `src/components/repertory/music.tsx` | Módulo de repertório removido (sem endpoint equivalente) |
| `src/components/repertory/searchHeader.tsx` | Idem |
| `src/components/select.tsx` | Não utilizado |
| `src/components/user/sections.tsx` | Funcionalidade absorvida por `Section.tsx` |
| `src/app/repertory/search.tsx` | Tela sem endpoint correspondente na API |

---

## Problemas corrigidos

| # | Problema | Solução | Referência |
|---|---------|---------|-----------|
| 1 | Token JWT não persistido | `session.ts` com `expo-secure-store` | PA-001, INC-001 |
| 2 | Token não injetado nas requisições | Interceptor de request no `api.ts` | PA-002, INC-002 |
| 3 | 401 não tratado | Interceptor de response limpa sessão | — |
| 4 | Senha mínima frontend/backend desalinhada | `LoginSchema.password.min(8)` | INC-003, PA-003 |
| 5 | Logout ausente | `logout()` em `auth.ts` + botão em `user.tsx` | — |
| 6 | Todas as telas com mock hardcoded | Integração com API real em todas as telas | INC-013..021, INC-025 |
| 7 | `avisos/[id].tsx` tipo incompatível | Refatoração completa usando `ReminderDetail` | INC-013 |
| 8 | `scale/[id].tsx` sem parâmetro `id` | `useLocalSearchParams` + 4 queries + 2 modais funcionais | INC-014 |
| 9 | `music/[id].tsx` sem integração | `getMusicDetail()` + endpoint `GET /music/{id_music_escalas}` | INC-015, INC-016 |
| 10 | `forgotPassword.tsx` era stub | Tela completa com validação e chamada ao endpoint público | INC-019 |
| 11 | `router.replace` em dependency array | Removido do array (referência instável) | — |
| 12 | Rascunho `[id]_integrated.tsx` | Removido | — |

---

## Fluxos validados

### Fluxo de autenticação
1. **Primeiro acesso:** `_layout.tsx` carrega, não encontra token → redireciona para `/auth/login`
2. **Login:** usuário preenche email/senha → `LoginSchema.safeParse()` → `login()` → `session.save()` → `router.replace("/(tabs)")`
3. **Reabertura do app:** `_layout.tsx` carrega, encontra token → redireciona para `/(tabs)`
4. **Token expirado:** qualquer requisição retorna 401 → `session.clear()` → na próxima navegação o `_layout.tsx` redireciona para login
5. **Logout:** botão em `user.tsx` → `Alert.alert` de confirmação → `logout()` → `router.replace("/auth/login")`
6. **Esqueci senha:** `forgotPassword.tsx` → `PATCH /user/forgotPassword` com `{ email, password }` → `router.replace("/auth/login")`

### Fluxo da Home
1. Abre `/(tabs)/index.tsx`
2. Calendário mostra mês atual com dias marcados (vindos de `getMonth()`)
3. Ao mudar o mês no calendário → nova query `getMonth(novoMes)`
4. Ao selecionar um dia → `getScaleDay(DDMMYYYY)` → lista de escalas do dia
5. Seção "Minhas Escalas" → `getMyScales()` sempre carregada
6. Seção "Indisponibilidades" → `getUnavailability(mes)` — oculta se vazia
7. Tap em escala → navega para `/scale/{id_escala}`

### Fluxo de Avisos
1. `/(tabs)/warnings.tsx` → `getReminder()` → lista alertas + notificações
2. Alertas → `AlertCard` → tap → navega para `/avisos/{id_lembrete}`
3. `avisos/[id].tsx` → `getReminderDetail(id)` → título, grupo, data, hora, descrição

### Fluxo da Escala
1. `/scale/[id]` → `getScale(id)` (cabeçalho) + `getScaleInfo(id)` (aba Info padrão)
2. Tap "músicas" → lazy-load `getScaleMusics(id)` → lista com tom e ordem
3. Tap em música → navega para `/music/{id_music_escalas}`
4. Tap "membros" → lazy-load `getScaleMembers(id)` → agrupados por disponibilidade
5. "Sair da Escala" → modal → confirmação → `sairDaEscala({ id_escala })` → invalidação do cache
6. Tap em indisponível → modal → confirmação → `substituirMembro({ id_membro_escala })` → invalidação do cache

### Fluxo da Música
1. `/music/[id]` onde `id` = `id_music_escalas`
2. `getMusicDetail(id)` → `GET /music/{id_music_escalas}` (endpoint sem `scale_id`)
3. Exibe nome, autor, BPM, tom atual, tom original, posição na escala
4. Links externos (Spotify, YouTube, Cifra, Letra) — links vazios ocultados

### Fluxo do Perfil
1. `/(tabs)/user.tsx` → `getMe()` → dados reais do usuário
2. Exibe foto (ou fallback), nome, cargo, data de registro
3. Funções: lista de `RoleTag`
4. Equipes: lista de `Team` (oculto se vazio)
5. Infos: email, senha (máscara `********`), endereço, nascimento, telefone (formatados)

---

## Inconsistências pendentes (fora do escopo do Prompt 3)

| ID | Descrição | Impacto |
|----|---------|---------|
| — | Botões de editar perfil (email, senha, endereço, etc.) não têm ação ainda | Médio — visual está presente, lógica de edição pendente |
| — | `expo-secure-store` não funciona no simulador web | Baixo — só afeta desenvolvimento web; mobile OK |
| — | Sem paginação nos endpoints de listagem | Baixo — sem dados reais suficientes para impactar |
| — | Sem refresh pull-to-refresh nas listas | Baixo — `refetchOnWindowFocus` do TanStack Query cobre parcialmente |
| DR-003 | Fluxo de recuperação de senha sem verificação de identidade | Médio — o endpoint aceita qualquer email válido |

---

## Testes realizados

O projeto não possui framework de testes automatizados. Os fluxos foram validados por análise estática de código (verificação de tipos, imports, lógica de renderização condicional e tratamento de estados).

Verificações realizadas:
- Todos os imports foram conferidos contra os arquivos de destino
- Todos os tipos foram comparados com os schemas do backend
- Dependency arrays dos `useEffect` foram revisados
- Todos os endpoints chamados foram confirmados como existentes na API

---

## Estado final — Mapa de integração

| Endpoint | Tela(s) consumidora(s) | Status |
|----------|----------------------|--------|
| `POST /auth/login` | `auth/login.tsx` | ✅ |
| `POST /user` | `auth/signUp.tsx` | ✅ |
| `GET /user/me` | `(tabs)/user.tsx` | ✅ |
| `PATCH /user/alterEmail` | `(tabs)/user.tsx` (botão pendente) | ⚠️ Serviço pronto |
| `PATCH /user/forgotPassword` | `auth/forgotPassword.tsx` | ✅ |
| `PATCH /user/alterLogradouro` | `(tabs)/user.tsx` (botão pendente) | ⚠️ Serviço pronto |
| `PATCH /user/alterBirthday` | `(tabs)/user.tsx` (botão pendente) | ⚠️ Serviço pronto |
| `PATCH /user/alterTelephone` | `(tabs)/user.tsx` (botão pendente) | ⚠️ Serviço pronto |
| `GET /home/month/{mes}` | `(tabs)/index.tsx` | ✅ |
| `GET /home/unavailability/{mes}` | `(tabs)/index.tsx` | ✅ |
| `GET /home/scale/me` | `(tabs)/index.tsx` | ✅ |
| `GET /home/scale/day/{day}` | `(tabs)/index.tsx` | ✅ |
| `GET /alert/reminder` | `(tabs)/warnings.tsx` | ✅ |
| `GET /alert/reminder/{id}` | `avisos/[id].tsx` | ✅ |
| `GET /scale/{id}` | `scale/[id].tsx` | ✅ |
| `GET /scale/{id}/musics` | `scale/[id].tsx` | ✅ |
| `GET /scale/{id}/music/{id_music_escalas}` | `scales.ts` (disponível) | ✅ Serviço pronto |
| `GET /scale/{id}/info` | `scale/[id].tsx` | ✅ |
| `GET /scale/{id}/members` | `scale/[id].tsx` | ✅ |
| `POST /scale/sair` | `scale/[id].tsx` (modal) | ✅ |
| `POST /scale/substituir` | `scale/[id].tsx` (modal) | ✅ |
| `GET /music/{id_music_escalas}` | `music/[id].tsx` | ✅ |
| `GET /user` | — | Não utilizado no mobile |

**Endpoints integrados nas telas: 20/23 (87%)**  
**Serviços disponíveis mas sem UI de edição: 4/23 (17%)**  
**Sem consumidor no mobile: 1/23 (4%) — `GET /user` (admin)**
