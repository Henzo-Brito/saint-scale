# REFACTOR_CONTEXT.md

> Documento de auditoria gerado antes de qualquer refatoração.  
> Nenhuma alteração estrutural foi feita nesta etapa.  
> Data: 2026-10-05

---

## Visão geral

**SaintScale** é um aplicativo mobile para gerenciamento de escalas de músicos em grupos/bandas de igrejas. Permite visualizar escalas, avisos, informações de membros e músicas do repertório. O projeto está em fase de desenvolvimento ativo: a maioria dos dados ainda é mockada, não há persistência de sessão implementada e algumas funcionalidades estão incompletas (ex: recuperação de senha). O app foi desenvolvido como TCC (o nome no `package.json` é `"tcc"`).

---

## Stack

| Tecnologia / Biblioteca | Versão | Função |
|---|---|---|
| React Native | 0.85.3 | Framework mobile |
| Expo | ~56.0.20 | Plataforma e toolchain |
| Expo Router | ~56.2.20 | Navegação baseada em filesystem |
| React | 19.2.3 | UI |
| TypeScript | ~6.0.3 | Tipagem estática |
| @tanstack/react-query | ^5.102.5 | Gerenciamento de dados assíncronos |
| Axios | ^1.20.0 | Cliente HTTP |
| Zod | ^4.4.3 | Validação de schemas |
| expo-linear-gradient | ~56.0.4 | Gradientes nas telas de auth |
| expo-secure-store | ~56.0.4 | Armazenamento seguro (instalado, **não usado**) |
| react-native-calendars | ^1.1314.0 | Componente de calendário |
| react-native-reanimated | 4.3.1 | Animações (usado indiretamente via calendars) |
| lucide-react-native | ^1.17.0 | Ícones (ChevronLeft, Eye, EyeOff, Music, UserRound, etc.) |
| @fortawesome/react-native-fontawesome | ^1.0.0 | Ícones FA (faHouse, faBell, faCircleUser, etc.) |
| @fortawesome/free-solid-svg-icons | ^7.3.1 | Pack de ícones sólidos |
| @fortawesome/free-brands-svg-icons | ^7.3.1 | Ícones de marcas (Spotify, YouTube) |
| react-native-svg | ^15.15.4 | Suporte a SVG (necessário para FA e Lucide) |
| react-native-safe-area-context | ~5.7.0 | SafeAreaView |
| react-native-screens | ~4.26.0 | Otimização de screens |
| expo-splash-screen | ~56.0.15 | Splash screen |
| expo-font | ~56.0.7 | Carregamento de fontes |
| expo-web-browser | ~56.0.6 | Abertura de URLs |
| @react-native-community/datetimepicker | 9.1.0 | Seletor de data (instalado via plugin, **não usado diretamente no código**) |
| Biome | ^2.5.10 | Linter + Formatter (substitui ESLint + Prettier) |
| **expo-symbols** | ~56.0.7 | Ícones SF Symbols — **instalado, não importado em nenhum arquivo** |
| **react-native-worklets** | 0.8.3 | Worklets JS — **instalado, não importado em nenhum arquivo** |
| **sonner-native** | ^0.27.0 | Toast notifications — **instalado, não importado em nenhum arquivo** |
| **react-toastify** | ^11.1.0 | Toast para web — **instalado, não importado em nenhum arquivo** |

**API base:** `https://saint-scale-api-1.onrender.com/api`  
**Alias de path configurado:** `@/*` → `./src/*`

---

## Estrutura atual

```
saint-scale/
├── app.json                  # Configuração Expo (nome, ícones, plugins, scheme)
├── eas.json                  # Configuração EAS Build
├── biome.json                # Linter/Formatter
├── package.json              # Dependências e scripts
├── tsconfig.json             # TypeScript com paths @/*
├── expo-env.d.ts             # Tipos gerados pelo Expo (não editar)
├── LEIAME.txt                # URL da API (https://saint-scale-api-1.onrender.com/scalar)
├── README.md                 # Instruções de instalação
└── src/
    ├── app/                  # Rotas do Expo Router (filesystem-based routing)
    │   ├── _layout.tsx       # Layout raiz: QueryClientProvider + Stack
    │   ├── (tabs)/           # Grupo de tabs (navegação principal)
    │   │   ├── _layout.tsx   # Configuração das tabs (icons, header)
    │   │   ├── index.tsx     # Tela Home
    │   │   ├── warnings.tsx  # Tela Avisos
    │   │   └── user.tsx      # Tela Perfil do usuário
    │   ├── auth/             # Fluxo de autenticação
    │   │   ├── index.tsx     # Onboarding (4 slides)
    │   │   ├── login.tsx     # Login
    │   │   ├── signUp.tsx    # Cadastro (2 etapas)
    │   │   └── forgotPassword.tsx  # Stub vazio
    │   ├── scale/
    │   │   └── [id].tsx      # Detalhes de uma escala (tabs: info, músicas, membros)
    │   ├── music/
    │   │   └── [id].tsx      # Detalhes de uma música (BPM, tom, links)
    │   └── avisos/
    │       └── [id].tsx      # Detalhes de um aviso
    ├── components/
    │   ├── header.tsx         # Header das tabs (título + SafeAreaView)
    │   ├── iconBtn.tsx        # Botão com ícone Lucide
    │   ├── select.tsx         # Seletor animado (tab-style) — NÃO USADO
    │   ├── calendar.tsx       # Calendário customizado (react-native-calendars)
    │   ├── scales.tsx         # Card de escala com foto de membros e status
    │   ├── allPages/
    │   │   └── returnHeader.tsx  # Header com botão voltar (usado nas telas dinâmicas)
    │   ├── auth/
    │   │   ├── textInput.tsx  # Input com suporte a senha, telefone, data, email
    │   │   ├── sendBtn.tsx    # Botão de envio (usado em login, signUp, onboarding)
    │   │   └── continueBtn.tsx # Botão com seta (usado apenas no onboarding)
    │   ├── home/
    │   │   ├── sections.tsx   # Container de seção com scroll horizontal (tem prop `mes`)
    │   │   ├── outages.tsx    # Card de indisponibilidade (com imagem e função)
    │   │   ├── infos.tsx      # Mini-stat com ícone e texto (usado internamente em scales.tsx)
    │   │   ├── minister.tsx   # Card de ministro — NÃO USADO
    │   │   └── equipes.tsx    # Card de equipes — NÃO USADO
    │   ├── avisos/
    │   │   ├── sections.tsx   # Container de seção com scroll horizontal (sem prop `mes`)
    │   │   ├── outages.tsx    # Card de alerta/aviso com ícone bullhorn
    │   │   ├── notice.tsx     # Item de notificação simples
    │   │   └── alert.tsx      # Card de alerta com ícone Lucide — NÃO USADO
    │   ├── user/
    │   │   ├── sections.tsx   # Container de seção com scroll horizontal (sem prop `mes`)
    │   │   ├── info.tsx       # Card de informações pessoais (email, senha, endereço...)
    │   │   ├── team.tsx       # Card de equipe do usuário
    │   │   └── function.tsx   # Badge de função (ex: Guitarrista)
    │   └── repertory/
    │       ├── searchHeader.tsx  # Header com busca de músicas — NÃO USADO
    │       └── music.tsx         # Item de música no repertório — NÃO USADO
    ├── services/
    │   ├── api.ts             # Instância Axios com baseURL
    │   ├── auth.ts            # login() → POST /auth/login
    │   └── users.ts           # getUsers() (não usado), createUser()
    ├── schemas/
    │   ├── auth.schemas.ts    # LoginSchema, LoginResponseSchema, tipos inferidos
    │   └── user.schemas.ts    # UserSchema (não usado externamente), CreateUserSchema
    ├── types/
    │   ├── scales.type.tsx    # Enums Mounth/WeekDay, tipos Date e Status
    │   ├── person.type.tsx    # Tipo Person
    │   └── avisos.type.tsx    # Tipo Aviso (usa Person)
    ├── constants/
    │   └── styles.ts          # Design tokens: c1–c11 (cores) + font1
    └── assets/
        ├── 1.jpg              # Foto genérica usada como placeholder em múltiplos lugares
        ├── hz.jpg             # Foto do usuário (Henzo)
        ├── av.jpg             # Foto (André Valadão)
        ├── apj.jpg            # Foto (Apostulado Jovem)
        ├── img_splash.png     # Splash screen
        ├── icon.png           # Ícone (referenciado no app.json mas não encontrado no listing — pode ser icon.png ausente)
        └── auth/
            ├── 1.png          # Imagem onboarding slide 1
            ├── 2.png          # Imagem onboarding slide 2
            └── 3.png          # Imagem onboarding slides 3 e 4 (mesma imagem reutilizada)
```

---

## Navegação

O Expo Router usa filesystem-based routing. A entrada da aplicação é `expo-router/entry` (definido no `"main"` do `package.json`).

### Hierarquia de rotas

```
/                          → Expo Router root (src/app/_layout.tsx)
│
├── /auth                  → Onboarding (4 slides) — src/app/auth/index.tsx
├── /auth/login            → Tela de login
├── /auth/signUp           → Tela de cadastro (2 etapas)
├── /auth/forgotPassword   → STUB VAZIO (apenas "Henzo é Legal")
│
├── /(tabs)                → Grupo de tabs
│   ├── /(tabs)/           → Home (index.tsx)
│   ├── /(tabs)/warnings   → Avisos
│   └── /(tabs)/user       → Perfil do usuário
│
├── /scale/[id]            → Detalhes de escala (param: id)
├── /music/[id]            → Detalhes de música (param: id)
└── /avisos/[id]           → Detalhes de aviso (param: id)
```

### Observações de navegação

- Não há rota raiz `/` que redirecione para `/auth` ou `/(tabs)`. A tela inicial depende do que o Expo Router resolver como index. Com esse setup, ao abrir o app, ele pode ir para a tela de tabs diretamente (sem guarda de autenticação).
- O login faz `router.replace("/(tabs)")` mas não há guarda de rota protegendo as tabs.
- O README menciona `open http://localhost:3000/auth` para web, sugerindo que manualmente navega para `/auth` para testar.
- Não existe uma rota `/repertory`. O `SearchHeader` navega para `/repertory` mas essa rota não existe no projeto.

---

## Arquitetura

```
[Expo Router Entry]
        │
        ▼
[_layout.tsx (raiz)]
  QueryClientProvider
        │
   ┌────┴─────┐
   │          │
[auth/*]   [(tabs) grupo]
              │
    ┌─────────┼──────────┐
    │         │          │
[index]  [warnings]   [user]
              │
    ┌─────────┼──────────┐
    │         │          │
[scale/[id]] [music/[id]] [avisos/[id]]
```

**Fluxo de dados:**
- TanStack Query é configurado globalmente no layout raiz com `new QueryClient()`.
- Mutations são usadas em `login.tsx` (via `useMutation`) e `signUp.tsx` (via `useMutation`).
- Nenhuma query (`useQuery`) está sendo usada — todos os dados das telas são mockados inline.
- A instância Axios (`api.ts`) tem `baseURL` configurada, mas **sem interceptors de autenticação** (nenhum token é anexado às requisições).

**Autenticação:**
- Login faz POST `/auth/login` → recebe `{ accessToken, tokenType }`.
- O token retornado **não é armazenado em nenhum lugar** (nem `expo-secure-store`, nem `AsyncStorage`, nem Context, nem Zustand).
- Após login, o router navega para `/(tabs)` mas qualquer recarga volta para o estado não autenticado.

---

## Componentes reutilizáveis

### Globais (usados em múltiplas telas)

| Componente | Arquivo | Onde é usado | Finalidade |
|---|---|---|---|
| `Header` | `components/header.tsx` | `(tabs)/_layout.tsx` | Header das tabs com título e SafeAreaView |
| `IconBtn` | `components/iconBtn.tsx` | `allPages/returnHeader.tsx`, `repertory/searchHeader.tsx` | Botão com ícone Lucide genérico |
| `ReturnHeader` | `components/allPages/returnHeader.tsx` | `scale/[id]`, `music/[id]`, `avisos/[id]` | Header com botão voltar |
| `Calendar` | `components/calendar.tsx` | `(tabs)/index.tsx` | Calendário customizado com marcações |
| `Scales` | `components/scales.tsx` | `(tabs)/index.tsx` (3x) | Card de escala |
| `Select` | `components/select.tsx` | **Não importado em nenhuma tela** | Seletor animado tipo tab |

### Auth

| Componente | Arquivo | Onde é usado |
|---|---|---|
| `TextInput` | `components/auth/textInput.tsx` | `auth/login.tsx`, `auth/signUp.tsx` |
| `SendBtn` | `components/auth/sendBtn.tsx` | `auth/index.tsx`, `auth/login.tsx`, `auth/signUp.tsx` |
| `ContinueBtn` | `components/auth/continueBtn.tsx` | `auth/index.tsx` apenas |

### Home

| Componente | Arquivo | Onde é usado |
|---|---|---|
| `Section` (home) | `components/home/sections.tsx` | `(tabs)/index.tsx` |
| `Outages` (home) | `components/home/outages.tsx` | `(tabs)/index.tsx` |
| `Infos` | `components/home/infos.tsx` | `components/scales.tsx` |
| `Minister` | `components/home/minister.tsx` | **Não importado em nenhuma tela** |
| `Equipes` | `components/home/equipes.tsx` | **Não importado em nenhuma tela** |

### Avisos

| Componente | Arquivo | Onde é usado |
|---|---|---|
| `Section` (avisos) | `components/avisos/sections.tsx` | `(tabs)/warnings.tsx` |
| `Outages` (avisos) | `components/avisos/outages.tsx` | `(tabs)/warnings.tsx` |
| `Notice` | `components/avisos/notice.tsx` | `(tabs)/warnings.tsx` |
| `Alert` | `components/avisos/alert.tsx` | **Não importado em nenhuma tela** |

### User

| Componente | Arquivo | Onde é usado |
|---|---|---|
| `Section` (user) | `components/user/sections.tsx` | `(tabs)/user.tsx` |
| `Info` | `components/user/info.tsx` | `(tabs)/user.tsx` |
| `Team` | `components/user/team.tsx` | `(tabs)/user.tsx` |
| `Function` | `components/user/function.tsx` | `(tabs)/user.tsx` |

### Repertory

| Componente | Arquivo | Onde é usado |
|---|---|---|
| `SearchHeader` | `components/repertory/searchHeader.tsx` | **Não importado em nenhuma tela** |
| `Music` (item) | `components/repertory/music.tsx` | **Não importado em nenhuma tela** |

---

## Código possivelmente não utilizado

> Legenda: 🔴 Problema confirmado | 🟡 Provável problema | 🟢 Oportunidade de melhoria

### Componentes sem uso confirmado

| Severidade | Arquivo | Evidência |
|---|---|---|
| 🔴 | `src/components/home/equipes.tsx` | Nenhum `import` encontrado em nenhuma tela ou componente |
| 🔴 | `src/components/home/minister.tsx` | Nenhum `import` encontrado em nenhuma tela ou componente |
| 🔴 | `src/components/avisos/alert.tsx` | Nenhum `import` encontrado em nenhuma tela ou componente |
| 🔴 | `src/components/repertory/searchHeader.tsx` | Nenhum `import` encontrado em nenhuma tela; navega para `/repertory` que não existe |
| 🔴 | `src/components/repertory/music.tsx` | Nenhum `import` encontrado em nenhuma tela ou componente |
| 🔴 | `src/components/select.tsx` | Nenhum `import` encontrado em nenhuma tela ou componente |

### Imports mortos (import sem uso no JSX)

| Severidade | Arquivo | Import morto | Observação |
|---|---|---|---|
| 🔴 | `src/app/(tabs)/_layout.tsx` | `import IconBtn` | IconBtn importado mas não aparece no JSX do layout (não há botões customizados nas tabs) |
| 🔴 | `src/app/(tabs)/warnings.tsx` | `import Scales` | Scales importado mas não renderizado no JSX da tela |
| 🔴 | `src/components/header.tsx` | `import { Menu }` | Menu do Lucide importado mas não utilizado no JSX |

### Funções/serviços sem uso confirmado

| Severidade | Arquivo | Símbolo | Evidência |
|---|---|---|---|
| 🔴 | `src/services/users.ts` | `getUsers()` | Nenhum arquivo importa ou chama `getUsers` |
| 🔴 | `src/schemas/user.schemas.ts` | `UserSchema`, tipo `User` | Exportados mas não importados em nenhum arquivo externo ao próprio schema |

### Dependências instaladas sem uso

| Severidade | Pacote | Evidência |
|---|---|---|
| 🔴 | `expo-secure-store` | Nenhum arquivo `src` importa `expo-secure-store` |
| 🔴 | `expo-symbols` | Nenhum arquivo `src` importa `expo-symbols` |
| 🔴 | `react-native-worklets` | Nenhum arquivo `src` importa `react-native-worklets` |
| 🔴 | `sonner-native` | Nenhum arquivo `src` importa `sonner-native` |
| 🔴 | `react-toastify` | Nenhum arquivo `src` importa `react-toastify` |

### Funcionalidade incompleta/stub

| Severidade | Arquivo | Problema |
|---|---|---|
| 🔴 | `src/app/auth/forgotPassword.tsx` | Stub vazio — apenas renderiza `<Text>Henzo é Legal</Text>`. Não há lógica, formulário ou navegação. |
| 🔴 | Autenticação geral | Token de login retornado pela API não é armazenado. Sem persistência de sessão. |
| 🟡 | `src/app/(tabs)/warnings.tsx` | O estado `useState` importado com `{ useState }` não é utilizado no código atual da tela (foi deixado sem uso) |

---

## Código duplicado

### 1. Três componentes `Section` quase idênticos

Os três componentes abaixo implementam a mesma estrutura visual (título + botão "ver todos >" + ScrollView horizontal com filhos):

| Arquivo | Diferença |
|---|---|
| `components/home/sections.tsx` | Tem prop obrigatória `mes: string` concatenada ao título |
| `components/avisos/sections.tsx` | Sem prop `mes`; `title` com `fontWeight: 600` e `fontSize: 18` |
| `components/user/sections.tsx` | Sem prop `mes`; `title` com `fontSize: 20` (sem `fontWeight`) |

As versões de `avisos/sections` e `user/sections` são **praticamente idênticas** — a única diferença é `fontSize: 18` vs `fontSize: 20` no título. Poderiam ser unificadas em um único componente `Section` com props opcionais.

### 2. Dois componentes `Outages` com propósitos semelhantes mas props diferentes

| Arquivo | Props | Visual |
|---|---|---|
| `components/home/outages.tsx` | `title, img, yourFunc, subTitle, func` | Card roxo (`c1`), com imagem circular e ícone `faUserMinus` |
| `components/avisos/outages.tsx` | `title, functions, subTitle, funct` | Card escuro (`c8`), com ícone `faBullhorn` (sem imagem) |

São semanticamente distintos (indisponibilidade de membro vs. alerta geral), mas o nome `Outages` para ambos é confuso. A nomenclatura deveria ser mais específica.

### 3. Lógica de datas duplicada inline

A tela `(tabs)/index.tsx` define inline a função `dateConverser` com arrays de nomes de dias e meses em português. O componente `calendar.tsx` já define o `LocaleConfig` com os mesmos nomes de meses e dias para o calendário. Essa lógica poderia ser centralizada em um utilitário.

### 4. StyleSheet hardcoded nas telas dinâmicas

As telas `scale/[id].tsx`, `music/[id].tsx` e `avisos/[id].tsx` usam cores hardcoded (`"#161324"`, `"#25203D"`, `"#FFFFFF"`, `"#A29DB8"`, `"#FF9800"`, `"#110E1B"`) sem usar o arquivo `constants/styles.ts`. As demais telas usam os tokens `sty.c1`–`sty.c11`. Isso cria inconsistência: se a paleta mudar, essas telas não serão afetadas.

### 5. Imagem placeholder reutilizada excessivamente

O arquivo `src/assets/1.jpg` é usado como placeholder em dezenas de lugares (fotos de membros, ícone do app, etc.). Não é um problema de código, mas vale documentar para que seja substituído por dados reais ou por um componente de avatar.

---

## Oportunidades de refatoração

1. **Unificar os 3 componentes `Section`** em um único `Section` com props opcionais (`mes?`, `titleSize?`). Reduz duplicação e facilita manutenção.

2. **Renomear `Outages` de avisos** para algo mais semântico (`AlertCard`, `AvisoCard`) para evitar confusão com `Outages` de home (`UnavailabilityCard`).

3. **Implementar persistência de sessão** com `expo-secure-store` (já instalado) — armazenar o `accessToken` após login e criar um interceptor Axios que o injeta automaticamente nos headers.

4. **Criar guarda de rota** — uma lógica no layout raiz ou em `(tabs)/_layout.tsx` que verifique se há token válido; caso contrário redireciona para `/auth`.

5. **Implementar `forgotPassword.tsx`** — a tela existe e há link para ela na tela de login; atualmente retorna stub.

6. **Centralizar a lógica de formatação de datas** em `src/utils/date.ts` — a função `dateConverser` em `index.tsx` e o `LocaleConfig` em `calendar.tsx` compartilham os mesmos arrays de nomes.

7. **Criar um componente de avatar/placeholder de imagem** — substituir os múltiplos usos de `require("@/assets/1.jpg")` por um componente que aceite a imagem real ou exiba um fallback padronizado.

8. **Migrar cores das telas dinâmicas para o sistema de design** — `scale/[id].tsx`, `music/[id].tsx` e `avisos/[id].tsx` usam cores hardcoded; devem usar `constants/styles.ts`.

9. **Remover dependências não utilizadas** (`expo-symbols`, `react-native-worklets`, `sonner-native`, `react-toastify`) para reduzir o tamanho do bundle.

10. **Substituir `@react-native-community/datetimepicker`** — está listado como plugin no `app.json` e no `package.json` mas não há uso direto no código. Deve ser avaliado se ainda é necessário ou se pode ser removido.

11. **Implementar `useQuery` para buscar dados reais da API** — nenhuma tela usa `useQuery`; todos os dados são mockados inline. O passo lógico é conectar às rotas da API.

12. **Adicionar o ícone do app** — `app.json` referencia `./src/assets/icon.png` mas o arquivo não estava presente no listing do diretório `assets` (os arquivos encontrados foram `1.jpg`, `hz.jpg`, `av.jpg`, `apj.jpg`, `img_splash.png`). Verificar se existe ou precisa ser criado.

---

## Riscos

> Itens que **NÃO devem ser removidos ou alterados sem verificação cuidadosa**:

1. **`src/app/(tabs)/_layout.tsx`** — Arquivo de rota do Expo Router. O import de `IconBtn` está morto, mas o arquivo em si é crítico para a navegação por tabs. Altere apenas os imports desnecessários.

2. **`src/services/api.ts`** — A instância Axios é a base de todos os serviços. Qualquer mudança (interceptors, baseURL) afeta toda a camada de dados.

3. **`src/constants/styles.ts`** — Tokens de design utilizados em praticamente todos os componentes. Uma mudança de cor aqui tem efeito cascata em toda a UI.

4. **`src/schemas/auth.schemas.ts`** — `LoginSchema` é usado ativamente em `auth/login.tsx`. `LoginResponseSchema` é usado em `services/auth.ts`. Não remover sem verificar dependências.

5. **`src/schemas/user.schemas.ts`** — `CreateUserSchema` e o tipo `CreateUser` são usados em `services/users.ts` e `auth/signUp.tsx`. Apenas `UserSchema` e o tipo `User` estão sem uso externo.

6. **`expo-secure-store`** — Está listado como plugin no `app.json` além de estar em `package.json`. Remover exige remoção do plugin no `app.json` também, caso contrário pode causar erro no build.

7. **`@react-native-community/datetimepicker`** — Idem: listado como plugin no `app.json`. Remover exige atualizar ambos.

8. **`src/types/person.type.tsx` e `src/types/avisos.type.tsx`** — `Aviso` usa `Person`. Ambos são usados na tela `avisos/[id].tsx` para os dados mockados. Não remover.

9. **Rotas dinâmicas `scale/[id]`, `music/[id]`, `avisos/[id]`** — São rotas reais acessadas via `router.push`. Não são "componentes mortos" mesmo que não haja link direto via tab.

10. **`src/components/home/infos.tsx`** — Não é importado diretamente por nenhuma tela, mas é importado dentro de `components/scales.tsx`. Seria removido indevidamente se a busca fosse feita apenas nas telas.

---

## Dependências

### Mapa de uso das principais dependências

| Pacote | Usado em |
|---|---|
| `expo-router` | Toda a navegação (`_layout.tsx`, telas, `router.push/replace/back`) |
| `@tanstack/react-query` | `_layout.tsx` (QueryClientProvider), `auth/login.tsx` (useMutation), `auth/signUp.tsx` (useMutation) |
| `axios` | `services/api.ts` |
| `zod` | `schemas/auth.schemas.ts`, `schemas/user.schemas.ts`, `app/auth/signUp.tsx` (schema local inline) |
| `expo-linear-gradient` | `auth/index.tsx`, `auth/login.tsx` |
| `react-native-calendars` | `components/calendar.tsx` |
| `lucide-react-native` | `components/header.tsx` (Menu — não usado no JSX), `components/iconBtn.tsx`, `components/auth/textInput.tsx` (Eye/EyeOff), `components/scales.tsx` (Music, UserRound, UserRoundCheck), `components/allPages/returnHeader.tsx` (ChevronLeft), `components/repertory/searchHeader.tsx` (ArrowLeft), `components/auth/continueBtn.tsx` (ArrowRight) |
| `@fortawesome/react-native-fontawesome` | `(tabs)/_layout.tsx`, `scale/[id].tsx`, `music/[id].tsx`, `avisos/[id].tsx`, múltiplos componentes |
| `react-native-safe-area-context` | `components/header.tsx`, `components/allPages/returnHeader.tsx`, `components/repertory/searchHeader.tsx`, `app/auth/signUp.tsx` |
| `expo-secure-store` | **Nenhum arquivo src importa** (apenas plugin app.json) |
| `expo-symbols` | **Nenhum arquivo src importa** |
| `react-native-worklets` | **Nenhum arquivo src importa** |
| `sonner-native` | **Nenhum arquivo src importa** |
| `react-toastify` | **Nenhum arquivo src importa** |

---

## Comandos do projeto

```json
"scripts": {
  "start":   "expo start",          // Inicia o servidor de desenvolvimento
  "android": "expo start --android", // Abre no emulador/dispositivo Android
  "ios":     "expo start --ios",     // Abre no simulador iOS
  "web":     "expo start --web"      // Abre no navegador (Metro bundler)
}
```

**Para validar o projeto:**
- `npm run web` ou `npx expo start --web` — Roda no navegador (mais fácil para testar sem dispositivo físico)
- O README indica `open http://localhost:3000/auth` para acessar o fluxo de autenticação no web

**Linting/Formatação:**
- Biome está configurado. Para rodar: `npx biome check src/` ou `npx biome format src/ --write`

**Build:**
- EAS Build configurado com perfis `development`, `preview` e `production` (todos distribuição interna, Android APK)

---

## Estado da auditoria

**Nenhuma alteração estrutural foi feita nesta etapa.**

Esta auditoria é puramente de leitura e análise. Todos os arquivos foram lidos em seu estado original. O objetivo desta etapa foi compreender completamente o projeto antes de qualquer modificação.

**Resumo quantitativo:**
- Arquivos de rota lidos: 10
- Componentes lidos: 24
- Services lidos: 3
- Schemas lidos: 2
- Types lidos: 3
- Constantes lidas: 1
- Dependências analisadas: 30+
- Componentes sem uso confirmado: 6
- Imports mortos confirmados: 3
- Dependências sem uso confirmado: 5
- Funções/schemas sem uso confirmado: 2
- Grupos de duplicação identificados: 5



---

## Alterações realizadas

> Data: 2026-10-06

Esta seção documenta todas as mudanças efetivamente aplicadas ao projeto após a auditoria inicial.

### Imports mortos removidos

- `src/app/(tabs)/_layout.tsx` — removido import `IconBtn` (importado mas não utilizado no JSX)
- `src/components/header.tsx` — removido import `{ Menu }` do Lucide (não utilizado no JSX)
- `src/app/(tabs)/warnings.tsx` — removido import `Scales` e `useState` (não utilizados)
- `src/app/auth/index.tsx` — removido import `useWindowDimensions` e declaração `const { width }` (variável não utilizada no JSX)

### Código morto removido (funções e tipos)

- `src/services/users.ts` — removida função `getUsers()` (não importada em nenhuma tela)
- `src/schemas/user.schemas.ts` — removidos `UserSchema` e tipo `User` (não importados externamente; apenas `CreateUserSchema` e `CreateUser` eram usados)

### Componentes removidos

- `src/components/select.tsx` — seletor animado tipo tab; sem nenhum uso no projeto
- `src/components/home/minister.tsx` — card de ministro; sem nenhum uso
- `src/components/home/equipes.tsx` — card de equipes; sem nenhum uso
- `src/components/avisos/alert.tsx` — card de alerta com ícone Lucide; sem nenhum uso (substituído semânticamente por `AlertCard.tsx`)
- `src/components/repertory/searchHeader.tsx` — header de busca de repertório; sem nenhum uso; navegava para rota `/repertory` inexistente
- `src/components/repertory/music.tsx` — item de música do repertório; sem nenhum uso

### Componentes Section unificados

Os três componentes `sections.tsx` (em `home/`, `avisos/` e `user/`) eram praticamente idênticos, diferindo apenas em `fontSize` e uma prop opcional `mes`. Foram removidos e substituídos por um único componente:

- **Removidos:**
  - `src/components/home/sections.tsx`
  - `src/components/avisos/sections.tsx`
  - `src/components/user/sections.tsx`

- **Criado:**
  - `src/components/Section.tsx` — componente unificado com props opcionais `mes?: string`, `titleSize?: number` e `btnTitle?: string`

- **Telas atualizadas para usar `Section`:**
  - `src/app/(tabs)/index.tsx`
  - `src/app/(tabs)/warnings.tsx`
  - `src/app/(tabs)/user.tsx`

### Renomeação semântica de componentes

- `src/components/avisos/outages.tsx` → `src/components/avisos/AlertCard.tsx`
  - Motivo: o nome `Outages` era ambíguo (existia também em `home/outages.tsx` com propósito diferente). `AlertCard` é mais descritivo para um card de alerta genérico.
  - `warnings.tsx` atualizado para importar `AlertCard`.

- `src/components/user/function.tsx` — função exportada renomeada de `Function` para `RoleTag`
  - Motivo: `Function` é um nome reservado/global do JavaScript. O biome reportava `noShadowRestrictedNames`.
  - Arquivo mantido no mesmo caminho (nome do arquivo não alterado para evitar impacto no filesystem routing e imports).
  - `src/app/(tabs)/user.tsx` atualizado para importar e usar `RoleTag`.

### Correção de tipos conflitantes com globals

- `src/types/scales.type.tsx` — tipo `Date` renomeado para `ScaleDate`
  - Motivo: `Date` é um global do JavaScript. O biome reportava `noShadowRestrictedNames`.
  - `src/components/scales.tsx` atualizado: import e prop `Date` → `scaleDate`
  - `src/app/(tabs)/index.tsx` atualizado: prop `Date={}` → `scaleDate={}` nas 3 instâncias de `<Scales>`

### Correção de tipos explicitamente `any`

- `src/app/auth/signUp.tsx` — `onError: (error: any)` → `onError: (error: Error)`, usando `error.message` na mensagem
- `src/app/music/[id].tsx` — tipo `icon: any` no `LinkItem` → `icon: IconDefinition` (importado de `@fortawesome/fontawesome-svg-core`)

### Centralização de lógica de datas

- `src/utils/date.ts` — criado com constantes centralizadas:
  - `MONTH_NAMES`, `MONTH_NAMES_SHORT`, `WEEKDAY_NAMES`, `WEEKDAY_NAMES_SHORT`
  - Função `parseDateString(dateString: string)` que converte `"YYYY-MM-DD"` em `{ diaSemana, dia, mes }`

- `src/components/calendar.tsx` — `LocaleConfig` atualizado para usar as constantes de `date.ts` (anteriormente tinha os arrays duplicados inline)

- `src/app/(tabs)/index.tsx` — função `dateConverser` inline substituída por `parseDateString` de `date.ts`

### Migração de cores hardcoded para tokens de design

- `src/constants/styles.ts` — expandido com tokens `c12`–`c19` para as telas de detalhe:
  - `c12`: fundo geral das telas de detalhe (`#161324`)
  - `c13`: fundo de cards (`#25203D`)
  - `c14`: fundo de card interno (`#110E1B`)
  - `c15`: linha divisória (`#3A3455`)
  - `c16`: texto muted (`#A29DB8`)
  - `c17`: ícone roxo médio (`#7F67BE`)
  - `c18`: roxo neon / destaque (`#9A73FF`)
  - `c19`: placeholder de avatar (`#D9D9D9`)

- `src/app/scale/[id].tsx`, `src/app/music/[id].tsx`, `src/app/avisos/[id].tsx` — migrados de cores hardcoded para tokens `sty.c*`

### Correção de bugs de lint/qualidade

- `src/components/scales.tsx`:
  - Função `setPersons()` corrigida: agora retorna `null` explicitamente nos casos em que `i >= 5` (o biome reportava `useIterableCallbackReturn`)
  - `biome-ignore lint/suspicious/noArrayIndexKey` adicionado com justificativa: o array `Persons` é `ImageSourcePropType[]` sem IDs únicos disponíveis; a ordem é determinada externamente e estável

---

## Arquivos removidos

| Arquivo | Motivo |
|---|---|
| `src/components/select.tsx` | Nenhum uso no projeto |
| `src/components/home/minister.tsx` | Nenhum uso no projeto |
| `src/components/home/equipes.tsx` | Nenhum uso no projeto |
| `src/components/avisos/alert.tsx` | Nenhum uso (substituído por `AlertCard.tsx`) |
| `src/components/repertory/searchHeader.tsx` | Nenhum uso; rota `/repertory` inexistente |
| `src/components/repertory/music.tsx` | Nenhum uso no projeto |
| `src/components/home/sections.tsx` | Unificado em `Section.tsx` |
| `src/components/avisos/sections.tsx` | Unificado em `Section.tsx` |
| `src/components/user/sections.tsx` | Unificado em `Section.tsx` |

---

## Arquivos movidos

Nenhum arquivo foi movido de localização. A renomeação `outages.tsx → AlertCard.tsx` foi feita no mesmo diretório (`src/components/avisos/`).

---

## Novos componentes

| Arquivo | Responsabilidade |
|---|---|
| `src/components/Section.tsx` | Container de seção reutilizável: título + botão "ver todos" + ScrollView horizontal. Props: `title`, `mes?`, `btnTitle?`, `titleSize?`, `func`, `children`. Substitui os três `sections.tsx` anteriores. |

---

## Novos utilitários

| Arquivo | Responsabilidade |
|---|---|
| `src/utils/date.ts` | Constantes de localização em português (`MONTH_NAMES`, `WEEKDAY_NAMES`, variantes short) + função `parseDateString()` para converter `"YYYY-MM-DD"` em partes localizadas. Elimina duplicação entre `calendar.tsx` e `index.tsx`. |

---

## Componentes reutilizados

- **`Section`** (antes 3 componentes, agora 1): utilizado em `index.tsx` (com prop `mes`), `warnings.tsx` e `user.tsx` (com `titleSize=20`)
- **`ReturnHeader`**: utilizado nas três telas dinâmicas (`scale/[id]`, `music/[id]`, `avisos/[id]`)
- **`AlertCard`**: utilizado em `warnings.tsx` para exibir alertas/avisos com ícone bullhorn

---

## Decisões arquiteturais

1. **`Section` unificado em vez de herança por pasta**: os três componentes `sections.tsx` eram praticamente idênticos. Criar um único componente com props opcionais é mais sustentável do que manter três cópias quase iguais. A diferença de `fontSize` foi resolvida com a prop `titleSize`.

2. **`AlertCard` em vez de `Outages` em avisos/**: o nome `Outages` era ambíguo — existia também em `home/outages.tsx` com propósito diferente (indisponibilidade de membro vs. alerta geral). `AlertCard` é mais descritivo e semântico para o contexto de avisos.

3. **`RoleTag` em vez de `Function`**: `Function` é um nome reservado/global do JavaScript. Renomear para `RoleTag` é mais semântico (é uma badge que indica a função/papel de um membro) e elimina o conflito com o global.

4. **`ScaleDate` em vez de `Date`**: `Date` é um global do JavaScript. Renomear para `ScaleDate` é mais preciso (é a data de uma escala) e elimina o conflito.

5. **`biome-ignore` em `scales.tsx` para `noArrayIndexKey`**: o array `Persons` é `ImageSourcePropType[]` sem identificadores únicos. Não existe alternativa de chave única nesse contexto. O uso do índice é justificado com comentário explicativo, e o `biome-ignore` é preferível a silenciar o lint globalmente.

6. **Tokens de cor c12–c19 em `constants/styles.ts`**: as telas dinâmicas usavam cores hardcoded que não faziam parte do sistema de design. Adicioná-las ao arquivo de constantes garante consistência e centraliza a paleta — qualquer mudança de tema afetará todas as telas de forma uniforme.

7. **`error: Error` em vez de `error: any` em `signUp.tsx`**: TanStack Query v5 informa que `onError` recebe o erro como `Error` por padrão. Tipagem correta elimina a necessidade de `any` e preserva o comportamento esperado.

---

## Pendências (conscientemente não alteradas)

1. **`expo-secure-store` não utilizado no código**: está listado como plugin no `app.json`. Para remover com segurança, seria necessário remover também a entrada do plugin — isso pode afetar o build nativo e foi deixado para uma decisão consciente do time.

2. **`@react-native-community/datetimepicker` não utilizado no código**: idem — listado como plugin no `app.json`. Potencialmente necessário para funcionalidades futuras.

3. **`expo-symbols`, `react-native-worklets`, `sonner-native`, `react-toastify`**: dependências instaladas sem uso. A remoção exige `npm uninstall` + verificação de `package.json` — pode ser feita em um step separado com atenção ao `app.json` (apenas `expo-secure-store` e `datetimepicker` têm entradas como plugin).

4. **`src/app/auth/forgotPassword.tsx`**: stub vazio ("Henzo é Legal"). A rota existe e há link para ela na tela de login. Não foi implementada por estar fora do escopo de refatoração (seria uma feature nova).

5. **Autenticação sem persistência**: o token retornado pelo login não é armazenado. Não foi implementado por ser uma funcionalidade nova, não uma refatoração.

6. **Dados mockados inline**: nenhuma tela usa `useQuery` para buscar dados reais. O TanStack Query está configurado globalmente mas sem uso de `useQuery`. Isso é uma limitação da fase atual do projeto, não um problema de refatoração.

7. **`src/app/scale/[id].tsx` — `MemberItem` sem prop `role` obrigatória**: o tipo declara `role: string` mas várias chamadas não passam a prop. Não foi alterado para não modificar lógica de negócio. Candidato a revisão quando os dados reais forem integrados.

8. **`home/outages.tsx` vs `avisos/AlertCard.tsx`**: os dois componentes têm propósitos semânticos distintos (indisponibilidade de membro vs. alerta geral). Foram mantidos separados intencionalmente. O nome `outages.tsx` em `home/` poderia ser renomeado para algo mais específico (`UnavailabilityCard`), mas foi deixado para não introduzir mudanças além do escopo confirmado da auditoria.


---

## Revisão final

> Data: 2026-10-06

Esta seção documenta a revisão de qualidade realizada após a refatoração estrutural.

### Comentários adicionados

- `src/services/api.ts` — comentário explicando ausência de interceptor de autenticação e o que isso significa para o fluxo atual.
- `src/services/auth.ts` — comentário explicando o propósito do `LoginResponseSchema.parse()` (validação da resposta antes de usar o token).
- `src/services/users.ts` — dois comentários explicando: (1) a conversão de formato de data `DD/MM/YYYY → MM-DD-YYYY` exigida pela API; (2) a remoção de caracteres não numéricos do telefone antes do envio.
- `src/schemas/auth.schemas.ts` — comentário no `LoginResponseSchema` explicando o uso do token Bearer e a pendência de persistência.
- `src/schemas/user.schemas.ts` — comentário no `CreateUserSchema` documentando os formatos esperados para `birth_date` e `telephone`.
- `src/components/home/StatBadge.tsx` — comentário JSDoc descrevendo o propósito do componente.
- `src/components/home/outages.tsx` — comentário JSDoc descrevendo o componente; comentário na prop `memberRole` explicando o tipo de valor esperado.
- `src/components/avisos/AlertCard.tsx` — comentário JSDoc descrevendo o componente; comentário na prop `targetGroup`.
- `src/components/avisos/notice.tsx` — comentário JSDoc descrevendo o componente.
- `src/components/user/info.tsx` — comentários nas funções `maskEmail` e `maskPassword` explicando o comportamento de ofuscação.
- `src/components/scales.tsx` — comentário explicando a guarda de `scaleDate.Day` (necessária enquanto dados são mockados).
- `src/app/scale/[id].tsx` — comentário na prop `role?` de `MemberItem` explicando por que é opcional.
- `src/types/scales.type.tsx` — comentários JSDoc em cada enum e tipo.

### Nomes corrigidos

| Antes | Depois | Arquivo(s) | Motivo |
|---|---|---|---|
| `Mounth` | `Month` | `scales.type.tsx`, `scales.tsx`, `index.tsx` | Typo — escrita incorreta de "Month" |
| `Infos` (componente) | `StatBadge` | `home/StatBadge.tsx`, `scales.tsx` | Nome genérico e no plural; `StatBadge` descreve o propósito |
| `func` | `onPress` | `Section.tsx`, `home/outages.tsx`, `scales.tsx`, `index.tsx`, `user.tsx` | Convenção de callback — `onPress` é o padrão em React Native |
| `funct` | `onPress` | `avisos/AlertCard.tsx`, `warnings.tsx` | Idem — abreviação inconsistente |
| `yourFunc` | `memberRole` | `home/outages.tsx`, `index.tsx` | Nome confuso para uma string de cargo/instrumento |
| `functions` | `targetGroup` | `avisos/AlertCard.tsx`, `warnings.tsx` | "functions" é plural genérico; `targetGroup` descreve o que é exibido |
| `root` (função) | `TabLayout` | `(tabs)/_layout.tsx` | Nome genérico — `TabLayout` descreve o que o componente representa |
| `setPersons` | `renderPersonAvatars` | `scales.tsx` | Nome de setter para uma função de renderização — `render*` é mais preciso |
| `Index` (componente de warnings) | `Warnings` | `warnings.tsx` | Nomenclatura inconsistente com a rota |
| `Index` (componente de user) | `UserProfile` | `user.tsx` | Idem |

### Estrutura corrigida

- `src/components/home/infos.tsx` — removido; substituído por `src/components/home/StatBadge.tsx`
  - `StyleSheet.create` estava sendo chamado dentro do corpo do componente, recriando o objeto de estilos a cada render. Movido para fora com `StyleSheet.create` estático.
- `src/components/avisos/notice.tsx` — código morto comentado removido (import `UserRoundMinus` e bloco `Image` comentados no JSX).
- `src/components/user/info.tsx` — dois blocos de imports comentados removidos.
- `src/app/(tabs)/_layout.tsx` — import comentado `FontAwesome/FontAwesome6` e bloco de CSS comentado (`paddingBottom`, `paddingTop`) removidos.

### Documentação criada

- `README.md` — criado do zero com as seções: Descrição, Objetivo, Tecnologias, Estrutura do projeto, Como executar, Arquitetura, Navegação, Componentes principais, Comunicação com API, Autenticação, Variáveis de ambiente, Design system, Desenvolvimento e Estado atual.

### Validações executadas

| Validação | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ 0 erros |
| `npx biome check src/` | ✅ 0 erros, 38 arquivos |

### Problemas encontrados e corrigidos durante a validação

| Arquivo | Problema | Correção |
|---|---|---|
| `(tabs)/_layout.tsx` | `color: ColorValue` não atribuível a `string` nos ícones FontAwesome | Adicionado `color as string` no cast |
| `(tabs)/_layout.tsx` | `strokeWidth` não é prop válida do `FontAwesomeIcon` (é prop do Lucide) | Removido das 3 tabs |
| `app/scale/[id].tsx` | Prop `role: string` obrigatória em `MemberItem` mas não passada em 5 instâncias | Tornada opcional (`role?: string`) com comentário explicativo |

### Pendências (não alteradas nesta etapa)

- `src/app/auth/forgotPassword.tsx` — ainda é um stub vazio. Fora do escopo de refatoração (seria feature nova).
- Autenticação sem persistência — token não armazenado após login. Pendência de desenvolvimento.
- Dados mockados inline em todas as telas — nenhuma tela usa `useQuery`. Pendência de integração com a API real.
- Dependências instaladas sem uso (`expo-symbols`, `react-native-worklets`, `sonner-native`, `react-toastify`) — remoção não foi feita por envolver `npm uninstall` + possível impacto no `app.json`.
