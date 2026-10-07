# SaintScale

## Descrição

SaintScale é um aplicativo mobile para gerenciamento de escalas de músicos em grupos e bandas de igrejas. Permite visualizar escalas de cultos, consultar o repertório de músicas, acompanhar avisos e gerenciar informações do perfil de cada membro.

## Objetivo

Centralizar a organização das escalas musicais de uma equipe de louvor: quem toca, quando, qual repertório, quais membros estão indisponíveis e quais avisos precisam ser comunicados ao grupo.

## Tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| React Native | 0.85.3 | Framework mobile |
| Expo | ~56.0.20 | Plataforma e toolchain |
| Expo Router | ~56.2.20 | Navegação baseada em filesystem |
| TypeScript | ~6.0.3 | Tipagem estática |
| TanStack Query | ^5.102.5 | Gerenciamento de requisições assíncronas |
| Axios | ^1.20.0 | Cliente HTTP |
| Zod | ^4.4.3 | Validação de schemas e dados da API |
| expo-linear-gradient | ~56.0.4 | Gradientes nas telas de autenticação |
| react-native-calendars | ^1.1314.0 | Componente de calendário na Home |
| lucide-react-native | ^1.17.0 | Ícones (ChevronLeft, Eye, EyeOff, Music, etc.) |
| @fortawesome/react-native-fontawesome | ^1.0.0 | Ícones FontAwesome (tabs, cards, modais) |
| react-native-svg | ^15.15.4 | Suporte a SVG (necessário para Lucide e FontAwesome) |
| Biome | ^2.5.10 | Linter e formatter (substitui ESLint + Prettier) |

**API base:** `https://saint-scale-api-1.onrender.com/api`  
Documentação da API disponível em: `https://saint-scale-api-1.onrender.com/scalar`

## Estrutura do projeto

```
src/
├── app/                  # Rotas do Expo Router (filesystem routing)
│   ├── _layout.tsx       # Layout raiz: QueryClientProvider + Stack
│   ├── (tabs)/           # Grupo de tabs (navegação principal)
│   │   ├── _layout.tsx   # Configuração das tabs (ícones, header)
│   │   ├── index.tsx     # Tela Home (calendário + escalas + indisponibilidades)
│   │   ├── warnings.tsx  # Tela Avisos (alertas + notificações)
│   │   └── user.tsx      # Tela Perfil do usuário
│   ├── auth/             # Fluxo de autenticação
│   │   ├── index.tsx     # Onboarding (4 slides)
│   │   ├── login.tsx     # Login
│   │   ├── signUp.tsx    # Cadastro (2 etapas)
│   │   └── forgotPassword.tsx  # Placeholder (não implementado)
│   ├── scale/[id].tsx    # Detalhes de uma escala (abas: info, músicas, membros)
│   ├── music/[id].tsx    # Detalhes de uma música (BPM, tom, links)
│   └── avisos/[id].tsx   # Detalhes de um aviso
│
├── components/           # Componentes reutilizáveis
│   ├── Section.tsx       # Seção com título, botão e scroll horizontal
│   ├── scales.tsx        # Card de escala (data, membros, status)
│   ├── calendar.tsx      # Calendário com marcações de compromissos
│   ├── header.tsx        # Header das tabs (título + SafeAreaView)
│   ├── iconBtn.tsx       # Botão genérico com ícone Lucide
│   ├── allPages/         # Componentes usados em múltiplas telas
│   │   └── returnHeader.tsx  # Header com botão voltar
│   ├── auth/             # Componentes exclusivos do fluxo de auth
│   │   ├── textInput.tsx # Input com suporte a texto, senha, telefone e data
│   │   ├── sendBtn.tsx   # Botão de envio de formulário
│   │   └── continueBtn.tsx   # Botão com seta (onboarding)
│   ├── home/             # Componentes da tela Home
│   │   ├── outages.tsx   # Card de indisponibilidade de membro
│   │   └── StatBadge.tsx # Mini-badge com ícone e contagem (membros, músicas)
│   ├── avisos/           # Componentes da tela Avisos
│   │   ├── AlertCard.tsx # Card de alerta/aviso com ícone bullhorn
│   │   └── notice.tsx    # Item de notificação simples
│   └── user/             # Componentes da tela Perfil
│       ├── info.tsx      # Card de informações pessoais (email, senha, endereço)
│       ├── team.tsx      # Card de equipe do usuário
│       └── function.tsx  # Badge de função/instrumento (ex.: Guitarrista)
│
├── services/             # Camada de comunicação com a API
│   ├── api.ts            # Instância Axios com baseURL
│   ├── auth.ts           # login()
│   └── users.ts          # createUser()
│
├── schemas/              # Schemas Zod para validação de dados
│   ├── auth.schemas.ts   # LoginSchema, LoginResponseSchema
│   └── user.schemas.ts   # CreateUserSchema
│
├── types/                # Tipos TypeScript compartilhados
│   ├── scales.type.tsx   # Enums Month/WeekDay, tipos ScaleDate e Status
│   ├── person.type.tsx   # Tipo Person
│   └── avisos.type.tsx   # Tipo Aviso
│
├── utils/                # Funções utilitárias
│   └── date.ts           # Constantes de datas em português + parseDateString()
│
├── constants/
│   └── styles.ts         # Design tokens: cores (c1–c19) e fonte padrão
│
└── assets/               # Imagens e recursos estáticos
    ├── 1.jpg             # Placeholder de foto (usado em dados mockados)
    ├── hz.jpg            # Foto de perfil do usuário de exemplo
    ├── av.jpg, apj.jpg   # Fotos de equipes de exemplo
    ├── img_splash.png    # Splash screen
    └── auth/             # Imagens do onboarding (1.png, 2.png, 3.png)
```

## Como executar

### Pré-requisitos

- Node.js (versão LTS recomendada)
- npm
- Expo CLI (instalado automaticamente com as dependências)
- Para dispositivo físico: app **Expo Go** (iOS ou Android)

### Instalação

```bash
npm install
```

### Executar

```bash
# Iniciar servidor de desenvolvimento (escolha a plataforma no terminal)
npm start

# Abrir diretamente no Android
npm run android

# Abrir diretamente no iOS
npm run ios

# Abrir no navegador (web)
npm run web
```

Para testar no navegador, acesse manualmente:

```
http://localhost:8081/auth
```

### Linting e formatação

O projeto usa [Biome](https://biomejs.dev/) no lugar de ESLint + Prettier.

```bash
# Verificar erros de lint e formatação
npx biome check src/

# Corrigir automaticamente o que for possível
npx biome check src/ --write
```

## Arquitetura

O projeto segue a estrutura padrão do **Expo Router com filesystem routing**:

- Cada arquivo em `src/app/` corresponde a uma rota.
- O arquivo `_layout.tsx` define o comportamento do grupo de rotas ao redor.
- O grupo `(tabs)` agrupa as três telas principais em uma navegação por abas.
- Rotas dinâmicas (`[id].tsx`) recebem parâmetros via `useLocalSearchParams`.

**Fluxo de dados:**

```
[Expo Router Entry]
        │
        ▼
[_layout.tsx] ← QueryClientProvider (TanStack Query)
        │
   ┌────┴──────┐
   │           │
[auth/*]   [(tabs)]
              │
   ┌──────────┼──────────┐
   │          │          │
[index]  [warnings]   [user]
              │
   ┌──────────┼──────────┐
   │          │          │
[scale/[id]] [music/[id]] [avisos/[id]]
```

## Navegação

| Rota | Tela | Acesso |
|---|---|---|
| `/auth` | Onboarding (4 slides) | Entrada manual |
| `/auth/login` | Login | Link do onboarding |
| `/auth/signUp` | Cadastro (2 etapas) | Link do onboarding |
| `/auth/forgotPassword` | Recuperação de senha | Link do login (stub) |
| `/(tabs)/` | Home | Tab bar |
| `/(tabs)/warnings` | Avisos | Tab bar |
| `/(tabs)/user` | Perfil | Tab bar |
| `/scale/[id]` | Detalhes de escala | Cards na Home |
| `/music/[id]` | Detalhes de música | Lista de músicas na escala |
| `/avisos/[id]` | Detalhes de aviso | Cards em Avisos |

> **Nota:** não há guarda de rota implementada. Ao abrir o app, o Expo Router resolve a rota inicial como `/(tabs)`, pulando o fluxo de autenticação.

## Componentes principais

| Componente | Arquivo | Descrição |
|---|---|---|
| `Section` | `components/Section.tsx` | Seção reutilizável com título, botão "ver todos" e scroll horizontal. Aceita `mes?` (sufixo do título), `titleSize?` e `btnTitle?`. |
| `Scales` | `components/scales.tsx` | Card de escala com data, avatares de membros sobrepostos e contadores de status (StatBadge). |
| `StatBadge` | `components/home/StatBadge.tsx` | Mini-badge com ícone Lucide e texto. Usado nos cards de escala para exibir contagens. |
| `AlertCard` | `components/avisos/AlertCard.tsx` | Card de alerta com ícone bullhorn, título, data e grupo alvo. |
| `ReturnHeader` | `components/allPages/returnHeader.tsx` | Header com botão voltar (ChevronLeft) para telas dinâmicas. |
| `TextInput` | `components/auth/textInput.tsx` | Input com formatação automática de telefone (`(xx) xxxxx-xxxx`) e data (`DD/MM/AAAA`), além de toggle de visibilidade para senhas. |
| `CustomCalendar` | `components/calendar.tsx` | Calendário em português com marcação de compromissos (pontos) e seleção de data. |

## Comunicação com API

Toda comunicação usa uma instância Axios centralizada em `src/services/api.ts`:

```
baseURL: https://saint-scale-api-1.onrender.com/api
Content-Type: application/json
```

Os serviços disponíveis:

| Serviço | Função | Endpoint |
|---|---|---|
| `auth.ts` | `login(data)` | `POST /auth/login` |
| `users.ts` | `createUser(user)` | `POST /user` |

As requisições são validadas com Zod após receberem a resposta (`LoginResponseSchema.parse()`).

> **Limitação atual:** não há interceptor de autenticação. O token retornado pelo login não é injetado automaticamente nos headers das requisições seguintes.

## Autenticação

O fluxo atual de autenticação:

1. Usuário preenche email e senha na tela `/auth/login`.
2. A função `login()` faz `POST /auth/login` e recebe `{ accessToken, tokenType: "Bearer" }`.
3. O router navega para `/(tabs)` via `router.replace("/(tabs)")`.

**Pendências:**
- O `accessToken` não é armazenado (nem em `expo-secure-store`, nem em `AsyncStorage`).
- Não há guarda de rota: qualquer usuário pode acessar `/(tabs)` sem estar autenticado.
- A tela `/auth/forgotPassword` existe mas está vazia.

## Variáveis de ambiente

O projeto não usa arquivo `.env`. A URL da API está definida diretamente em `src/services/api.ts`:

```ts
baseURL: "https://saint-scale-api-1.onrender.com/api"
```

Para trocar de ambiente (ex.: desenvolvimento local), edite esse arquivo diretamente.

## Design system

Todas as cores e a fonte padrão estão centralizadas em `src/constants/styles.ts`.

| Token | Valor | Uso principal |
|---|---|---|
| `c1` | `rgba(255, 151, 32, 1)` | Laranja accent — botões, destaques |
| `c2–c3` | roxo vivo / roxo principal | Calendário, gradientes de auth |
| `c4` | `rgb(248, 244, 255)` | Texto claro (quase branco) |
| `c5` | `rgb(145, 123, 255)` | Texto/ícone secundário |
| `c6–c7` | fundos escuros | Fundo muito escuro / fundo das tabs |
| `c8` | `#342971` | Fundo de cards (avisos, user) |
| `c10` | `rgb(255, 43, 71)` | Erro/alerta vermelho |
| `c12–c19` | variantes de fundo e texto | Exclusivos das telas de detalhe (scale, music, avisos) |

## Desenvolvimento

### Dados mockados

Atualmente **todos os dados das telas são mockados inline** (arrays e objetos estáticos dentro dos componentes). Nenhuma tela usa `useQuery` do TanStack Query para buscar dados da API. O próximo passo natural é conectar cada tela às rotas reais da API.

### Para implementar autenticação completa

1. Após o login bem-sucedido, armazenar o `accessToken` com `expo-secure-store` (já instalado).
2. Criar um interceptor Axios em `services/api.ts` que injeta o token no header `Authorization`.
3. Adicionar verificação de sessão no `_layout.tsx` raiz para redirecionar para `/auth` se não houver token.

### Formatação e lint

Sempre rode antes de commitar:

```bash
npx biome check src/ --write
```

### Convenções

- Props de callback: sempre `onPress` (não `func`, `funct` ou variações).
- Estilos: sempre usar tokens de `constants/styles.ts` (nunca cores hexadecimais hardcoded).
- Tipos de dados: sempre usar os tipos definidos em `src/types/`.
- Datas em português: usar as constantes e a função `parseDateString()` de `src/utils/date.ts`.

## Estado atual

O projeto está em desenvolvimento ativo como TCC. O que está funcionando:

- Navegação completa entre todas as telas.
- Fluxo de cadastro de usuário com validação (Zod + feedback visual).
- Fluxo de login com chamada real à API.
- Calendário interativo na Home com marcação de compromissos.
- Telas de detalhe de escala (com abas de informação, músicas e membros) e modal de confirmação.
- Tela de detalhes de música com abertura de links externos.

O que está pendente:

- Persistência de sessão (token não armazenado).
- Guarda de rotas autenticadas.
- Busca de dados reais da API (todas as telas usam dados mockados).
- Tela de recuperação de senha (`/auth/forgotPassword`).
- Repertório de músicas (rotas e componentes preparados, mas não conectados).
