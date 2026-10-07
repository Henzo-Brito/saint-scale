# ROUTES_AND_API_IMPLEMENTATION.md

> Documento de análise gerado em 2026-10-05.  
> Finalidade: permitir que outra IA implemente navegação e integração com a API a partir desta leitura, sem precisar redescobrir o projeto.  
> Leia também: `README.md` e `docs/REFACTOR_CONTEXT.md`.

---

## Sumário

1. [Visão geral do estado atual](#visão-geral-do-estado-atual)
2. [Spec OpenAPI confirmado](#spec-openapi-confirmado)
3. [Análise das páginas](#análise-das-páginas)
4. [Sugestões de navegação](#sugestões-de-navegação)
5. [Mapa da API](#mapa-da-api)
6. [Mapa de páginas](#mapa-de-páginas)
7. [Plano de implementação](#plano-de-implementação)
8. [Instruções para a próxima IA](#instruções-para-a-próxima-ia)

---

## Visão geral do estado atual

| Item | Situação |
|---|---|
| Navegação entre telas | ✅ Funcional |
| Fluxo de cadastro | ✅ Implementado com chamada real à API |
| Fluxo de login | ✅ Implementado com chamada real à API |
| Persistência de token | ❌ Token não armazenado após login |
| Guarda de rotas autenticadas | ❌ Não implementada |
| Interceptor de autenticação (Axios) | ❌ Não implementado |
| Dados reais nas telas | ❌ Todos os dados são mockados inline |
| Uso de `useQuery` | ❌ Nenhum `useQuery` implementado |
| Tela forgotPassword | ❌ Stub vazio |

**Base URL da API:** `https://saint-scale-api-1.onrender.com/api`  
**Spec OpenAPI:** `https://saint-scale-api-1.onrender.com/doc`  
**UI Scalar:** `https://saint-scale-api-1.onrender.com/scalar`

---

## Spec OpenAPI confirmado

> Todos os endpoints, schemas, métodos HTTP e campos abaixo foram obtidos diretamente de `GET https://saint-scale-api-1.onrender.com/doc` em 2026-10-05.  
> **Não adicione endpoints, campos ou comportamentos que não estejam aqui.**

### Autenticação

Todos os endpoints marcados com `bearerAuth` exigem o header:
```
Authorization: Bearer <accessToken>
```

Os únicos endpoints **sem** autenticação são:
- `POST /api/auth/login`
- `POST /api/user`

---

### Schemas confirmados

#### `SignIn` (body do login)
```json
{
  "email": "string (max 100, format: email)",
  "password": "string (min 8, max 255)"
}
```

#### `JWT` (resposta do login)
```json
{
  "accessToken": "string",
  "tokenType": "Bearer"
}
```

#### `CreateUser` (body do cadastro)
```json
{
  "name": "string (max 150)",
  "birth_date": "string (pattern: MM-DD-YYYY)",
  "telephone": "string (max 11, apenas dígitos)",
  "email": "string (max 255, format: email)",
  "password": "string (min 8, max 60)",
  "role": "string (max 60)"
}
```

#### `User` (resposta do POST /user e GET /user)
```json
{
  "id_member": "integer",
  "name": "string (max 150)",
  "register_date": "string (format: date-time)",
  "birth_date": "string|null (pattern: MM-DD-YYYY)",
  "telephone": "string|null (max 11)",
  "email": "string (max 255)",
  "password": "string",
  "role": "string (max 60)",
  "id_function": "integer|null",
  "id_logradouro": "integer|null"
}
```

#### `Me` (resposta do GET /user/me)
```json
{
  "id_membro": "integer",
  "nome": "string",
  "email": "string",
  "img_id": "string|null",
  "cargo": "string",
  "funcoes": ["string"],
  "data_nascimento": "string|null (pattern: MM-DD-YYYY)",
  "telefone": "string|null (max 11)",
  "logradouro": {
    "rua": "string",
    "numero": "integer"
  } | null,
  "equipes": [
    {
      "img_id": "string|null",
      "title": "string",
      "quant_part": "integer"
    }
  ],
  "data_registro": "string (format: date-time)"
}
```

#### `AlterEmail` (body do PATCH /user/alterEmail)
```json
{
  "id_member": "integer",
  "email": "string (max 255, format: email)"
}
```

#### `ForgotPassword` (body do PATCH /user/forgotPassword)
```json
{
  "id_member": "integer",
  "password": "string (min 8, max 60)"
}
```

#### `AlterLogradouro` (body do PATCH /user/alterLogradouro)
```json
{
  "id_member": "integer",
  "id_logradouro": "integer"
}
```

#### `AlterBirthday` (body do PATCH /user/alterBirthday)
```json
{
  "id_member": "integer",
  "birth_date": "string (pattern: MM-DD-YYYY)"
}
```

#### `AlterTelephone` (body do PATCH /user/alterTelephone)
```json
{
  "id_member": "integer",
  "telephone": "string (max 11)"
}
```

#### `PatchResponse` (resposta comum dos PATCHes)
```json
{
  "message": "string"
}
```

#### `Month` (resposta do GET /home/month/{mes})
```json
[
  {
    "id_escala": "string",
    "dia": "string (ex: 14/11/2026)"
  }
]
```

#### `Unavailability` (resposta do GET /home/unavailability/{mes})
```json
[
  {
    "id_escala": "string",
    "nome": "string",
    "funcao": "string",
    "img_id": "string",
    "dia": "string (ex: 14/11/2026)"
  }
]
```

#### `Scale` (resposta do GET /home/scale/{my_id})
```json
[
  {
    "id_escala": "string",
    "confirmados": "integer",
    "title_scale": "string",
    "funcao": "string",
    "img_id": ["string"],
    "quant_music": "integer",
    "data_hora": "string (ex: 14/12/2026 22:29:23)",
    "dia": "string (ex: 14/11/2026)"
  }
]
```

#### `ScaleDay` (resposta do GET /home/scale/day/{day})
```json
[
  {
    "id_escala": "string",
    "confirmados": "integer",
    "nome_escala": "string",
    "funcao": "string",
    "img_id": ["string"],
    "quant_music": "integer",
    "data_hora": "string (ex: 14/12/2026 22:29:23)",
    "dia": "string (ex: 14/11/2026)"
  }
]
```

#### `ReminderList` (resposta do GET /alert/reminder)
```json
{
  "alert": [
    {
      "id_escala": "string",
      "name": "string",
      "date": "string (ex: 02/12/2026)",
      "functions": ["string"]
    }
  ],
  "notifications": [
    {
      "id_notification": "string",
      "title": "string",
      "date": "string (ex: 14/11/2008)"
    }
  ]
}
```

#### `ReminderDetail` (resposta do GET /alert/reminder/{id_reminder})
```json
{
  "id_escala": "string",
  "name": "string",
  "date": "string (ex: 02/12/2026)",
  "tempo": "string (ex: 10:20)",
  "description": "string",
  "functions": ["string"]
}
```

#### `ScaleDetail` (resposta do GET /scale/{id})
```json
{
  "id_escala": "string",
  "nome": "string",
  "dia": "string (ex: 14)",
  "dia_da_semana": "string (ex: sexta-feira)",
  "data": "string (ex: 14/11/2026)"
}
```

#### `ScaleMusics` (resposta do GET /scale/{id}/musics)
```json
[
  {
    "id_music_escalas": "string",
    "nome": "string",
    "banda": "string",
    "ordem": "integer",
    "tom": "string",
    "image_id": "string"
  }
]
```

#### `ScaleMusicDetail` (resposta do GET /scale/{id}/music/{id_music_escalas})
```json
{
  "id_musica": "string",
  "nome": "string",
  "autor": "string",
  "tom_atual": "string",
  "tom_original": "string",
  "bpm": "string",
  "ordem": "integer",
  "link_spotify": "string",
  "link_youtube": "string",
  "link_cifra": "string",
  "link_letra": "string",
  "duracao": "string",
  "img_id": "string"
}
```

#### `ScaleInfo` (resposta do GET /scale/{id}/info)
```json
{
  "id_escala": "string",
  "membros_confirmados": "integer",
  "local": "string",
  "indisponibilidades": [
    {
      "image_id": "string",
      "name": "string",
      "funcao": "string"
    }
  ]
}
```

#### `ScaleMembers` (resposta do GET /scale/{id}/members)
```json
[
  {
    "id_membro_escala": "string",
    "nome": "string",
    "funcao": "string",
    "disponibilidade": "string (ex: confirmado)",
    "image_id": "string"
  }
]
```

#### `SairBody` (body do POST /scale/sair)
```json
{
  "id_escala": "string"
}
```

#### `SubstituirBody` (body do POST /scale/substituir)
```json
{
  "id_membro_escala": "string"
}
```

---

## Análise das páginas

---

## Onboarding

### Arquivo
`src/app/auth/index.tsx`

### Rota atual
`/auth`

### Objetivo
Apresentar o aplicativo ao usuário em 4 slides com imagens, textos descritivos e botões de navegação. No último slide, oferece botões de "Entrar" e "Cadastrar".

### Dados necessários
Nenhum dado de API necessário. Conteúdo estático definido inline no arquivo.

### APIs utilizadas
Nenhuma.

### Navegação de entrada
- Entrada direta (URL `/auth`)
- Não há link das tabs para cá (sem logout implementado)

### Navegação de saída
- → `/auth/login` via botão "Entrar" (slide 4) ou `router.push("/auth/login")`
- → `/auth/signUp` via botão "Cadastrar" (slide 4) ou `router.push("/auth/signUp")`

### Ações do usuário
- Avançar entre slides (botão "Continuar")
- Ir para Login (slide 4)
- Ir para Cadastro (slide 4)

### Estados da página
- Slide atual (estado `idPage: 0–3` via `useState`)
- Não há estados de loading, erro ou vazio

### Componentes
- `ContinueBtn` (`components/auth/continueBtn.tsx`) — botão com seta, slides 0–2
- `SendBtn` (`components/auth/sendBtn.tsx`) — botões "Entrar" e "Cadastrar", slide 3

### Hooks / services
Nenhum.

### Implementação recomendada
A tela está implementada e funcional. Nenhuma integração com API necessária. A única pendência é adicionar verificação de sessão: se o usuário já estiver autenticado (token armazenado), redirecionar diretamente para `/(tabs)` sem passar pelo onboarding.

---

## Login

### Arquivo
`src/app/auth/login.tsx`

### Rota atual
`/auth/login`

### Objetivo
Autenticar o usuário com email e senha. Em caso de sucesso, navega para `/(tabs)`.

### Dados necessários
- Email (string)
- Senha (string)

### APIs utilizadas

#### POST /api/auth/login
- **Método:** POST
- **Endpoint:** `/api/auth/login`
- **Autenticação:** Não requer
- **Request body:**
  ```json
  {
    "email": "string (max 100, format: email)",
    "password": "string (min 8, max 255)"
  }
  ```
- **Response (200):**
  ```json
  {
    "accessToken": "string",
    "tokenType": "Bearer"
  }
  ```
- **Response (401):**
  ```json
  { "message": "string" }
  ```
- **Quando ocorre:** ao pressionar o botão "Entrar"

### Navegação de entrada
- `/auth` (slide 4, botão "Entrar")
- `/auth/signUp` (link "Já possui uma conta?")
- `/auth/forgotPassword` (link de retorno — não implementado)

### Navegação de saída
- → `/(tabs)` via `router.replace("/(tabs)")` em caso de sucesso
- → `/auth/forgotPassword` via link "Esqueceu a senha?"
- → `/auth/signUp` via link "Cadastre-se"

### Ações do usuário
- Preencher email
- Preencher senha
- Enviar formulário (botão "Entrar")
- Navegar para recuperação de senha
- Navegar para cadastro

### Estados da página
- **Normal:** formulário vazio
- **Loading:** `loginMutation.isPending === true` → botão mostra "Entrando..."
- **Erro de validação:** campo vazio ou email inválido → `setError("Coloque valores válidos")`
- **Erro de API (401):** credenciais inválidas → `setError("Email ou Senha Inválidos")`
- **Sucesso:** navegação para `/(tabs)`

### Componentes
- `TextInput` (`components/auth/textInput.tsx`) — campos email e senha
- `SendBtn` (`components/auth/sendBtn.tsx`) — botão de envio

### Hooks / services
- `useMutation` (TanStack Query) — já implementado
- `login` de `services/auth.ts` — já implementado
- `LoginSchema` de `schemas/auth.schemas.ts` — já implementado

### Implementação recomendada
A tela está **quase completa**. As pendências são:

1. **Após sucesso, armazenar o `accessToken`** com `expo-secure-store` antes de navegar:
   ```ts
   import * as SecureStore from "expo-secure-store";
   // no onSuccess:
   await SecureStore.setItemAsync("accessToken", data.accessToken);
   router.replace("/(tabs)");
   ```
2. **Injetar token no interceptor Axios** em `services/api.ts` após armazenamento.
3. A validação com `LoginSchema.safeParse()` já funciona corretamente — não alterar.

---

## Cadastro

### Arquivo
`src/app/auth/signUp.tsx`

### Rota atual
`/auth/signUp`

### Objetivo
Criar uma nova conta em 2 etapas: (1) dados pessoais (nome, email, data de nascimento, telefone) e (2) senha.

### Dados necessários
- Nome
- Email
- Data de nascimento (formato `DD/MM/YYYY` no formulário → `MM-DD-YYYY` enviado à API)
- Telefone (formatado como `(xx) xxxxx-xxxx` no formulário → somente dígitos enviado à API)
- Senha
- Confirmação de senha

### APIs utilizadas

#### POST /api/user
- **Método:** POST
- **Endpoint:** `/api/user`
- **Autenticação:** Não requer
- **Request body:**
  ```json
  {
    "name": "string (max 150)",
    "birth_date": "string (pattern: MM-DD-YYYY)",
    "telephone": "string (max 11, apenas dígitos)",
    "email": "string (max 255, format: email)",
    "password": "string (min 8, max 60)",
    "role": "string (max 60)"
  }
  ```
  > Nota: o formulário envia `role: "membro"` de forma fixa. A conversão de data e remoção de máscara de telefone ocorre em `services/users.ts`.
- **Response (200):** schema `User` completo
- **Quando ocorre:** ao pressionar "Cadastrar" na etapa 2, após validação de senha

### Navegação de entrada
- `/auth` (slide 4, botão "Cadastrar")
- `/auth/login` (link "Já possui uma conta?")

### Navegação de saída
- → `/auth/login` via `router.push("/auth/login")` após sucesso (com delay de 1 segundo)

### Ações do usuário
- Preencher dados pessoais (etapa 1)
- Avançar para etapa 2 (botão "Continuar" — valida antes de avançar)
- Preencher senha e confirmação (etapa 2)
- Enviar cadastro (botão "Cadastrar")
- Navegar para login

### Estados da página
- **Etapa 1:** formulário de dados pessoais
- **Etapa 2:** formulário de senha
- **Loading:** `isPending === true` → botão mostra "Cadastrando..." e texto de status verde
- **Erro de validação (etapa 1):** mensagens inline por campo
- **Erro de validação (senha):** checklist inline com critérios (maiúscula, minúscula, número, especial, sem espaço)
- **Erro de API:** `setStatus("Erro ao cadastrar usuário: ...")` em cor `c5`
- **Sucesso:** `setStatus("Usuário criado com sucesso, redirecionando..")` → navegação para login

### Componentes
- `TextInput` (`components/auth/textInput.tsx`) — todos os campos
- `SendBtn` (`components/auth/sendBtn.tsx`) — botões "Continuar" e "Cadastrar"

### Hooks / services
- `useMutation` (TanStack Query) — já implementado
- `createUser` de `services/users.ts` — já implementado

### Implementação recomendada
A tela está **implementada e funcional**. Não requer alterações para a integração básica. Melhorias futuras:
1. Permitir o usuário escolher `role` (atualmente fixo em `"membro"`).
2. Adicionar verificação de email já cadastrado antes do envio (atualmente o erro da API é exibido genericamente).

---

## Recuperação de Senha

### Arquivo
`src/app/auth/forgotPassword.tsx`

### Rota atual
`/auth/forgotPassword`

### Objetivo
Permitir ao usuário alterar sua senha (fluxo de recuperação). **Atualmente é um stub vazio.**

### Dados necessários
- `id_member` (integer) — necessário para chamar a API
- Nova senha

### APIs utilizadas

#### PATCH /api/user/forgotPassword
- **Método:** PATCH
- **Endpoint:** `/api/user/forgotPassword`
- **Autenticação:** Requer `Bearer <accessToken>`
- **Request body:**
  ```json
  {
    "id_member": "integer",
    "password": "string (min 8, max 60)"
  }
  ```
- **Response (200):**
  ```json
  { "message": "string" }
  ```
- **Response (404):**
  ```json
  { "message": "string" }
  ```
- **Quando ocorre:** ao confirmar a nova senha

> **Problema de design:** a API exige `id_member` no body, mas o usuário que acessa essa tela pelo link "Esqueceu a senha?" no login **não está autenticado** e não possui o `id_member`. Isso cria uma inconsistência: ou o endpoint deveria aceitar apenas email + nova senha, ou o fluxo precisa de uma etapa de verificação prévia.  
> **Não confirmado — precisa ser discutido com o backend** como resolver esse fluxo sem o `id_member`.

### Navegação de entrada
- `/auth/login` via link "Esqueceu a senha?"

### Navegação de saída
- → `/auth/login` após sucesso (sugerido)

### Ações do usuário
- Inserir nova senha
- Confirmar nova senha
- Enviar formulário

### Estados da página
- **Loading:** mutation pendente
- **Sucesso:** exibir mensagem e redirecionar para login
- **Erro:** campo inválido ou membro não encontrado
- **Formulário inválido:** senha não atende critérios

### Componentes
- `TextInput` (`components/auth/textInput.tsx`) — campo de senha
- `SendBtn` (`components/auth/sendBtn.tsx`) — botão de envio

### Hooks / services
- `useMutation` — a implementar
- Novo serviço `forgotPassword` em `services/users.ts` — a implementar

### Implementação recomendada
**Esta tela precisa ser implementada do zero** — o arquivo atual é um stub (`<Text>Henzo é Legal</Text>`).

Passos:
1. Criar formulário com campos de nova senha e confirmação.
2. Adicionar validação de senha igual à de `signUp.tsx` (critérios de força).
3. Criar função de serviço `forgotPassword(data: { id_member, password })` em `services/users.ts`.
4. Chamar via `useMutation`.
5. **Resolver a questão do `id_member`** com o backend antes de implementar — ver nota acima.

---

## Home

### Arquivo
`src/app/(tabs)/index.tsx`

### Rota atual
`/(tabs)/` (tab "Início", ícone casa)

### Objetivo
Tela principal do app. Exibe:
- Calendário interativo com marcação das datas de escalas do mês
- Seção de indisponibilidades do mês selecionado
- Escalas do dia selecionado
- Escalas do usuário autenticado ("Minhas Escalas")

### Dados necessários
1. **Escalas do mês** — para marcar pontos no calendário (datas com escala)
2. **Indisponibilidades do mês** — membros indisponíveis no mês selecionado
3. **Escalas do dia** — escalas que ocorrem no dia selecionado no calendário
4. **Minhas escalas** — escalas do usuário autenticado (`my_id` = id do usuário logado)

### APIs utilizadas

#### GET /api/home/month/{mes}
- **Método:** GET
- **Endpoint:** `/api/home/month/{mes}`
- **Autenticação:** Requer Bearer
- **Path param `mes`:** string, enum obrigatório:
  `janeiro | fevereiro | marco | abril | maio | junho | julho | agosto | setembro | outubro | novembro | dezembro`
  > Atenção: `março` é enviado como `marco` (sem cedilha) na URL.
- **Response (200):** array `Month`
  ```json
  [{ "id_escala": "string", "dia": "14/11/2026" }]
  ```
- **Quando ocorre:** ao carregar a tela e ao trocar de mês no calendário

#### GET /api/home/unavailability/{mes}
- **Método:** GET
- **Endpoint:** `/api/home/unavailability/{mes}`
- **Autenticação:** Requer Bearer
- **Path param `mes`:** mesmo enum de meses acima
- **Response (200):** array `Unavailability`
  ```json
  [{ "id_escala": "string", "nome": "string", "funcao": "string", "img_id": "string", "dia": "14/11/2026" }]
  ```
- **Quando ocorre:** ao carregar a tela e ao trocar de mês no calendário

#### GET /api/home/scale/day/{day}
- **Método:** GET
- **Endpoint:** `/api/home/scale/day/{day}`
- **Autenticação:** Requer Bearer
- **Path param `day`:** string com 8 dígitos, formato `DDMMYYYY` (ex: `14112026`)
- **Response (200):** array `ScaleDay`
  ```json
  [{ "id_escala": "string", "confirmados": 3, "nome_escala": "string", "funcao": "string", "img_id": ["string"], "quant_music": 3, "data_hora": "14/12/2026 22:29:23", "dia": "14/11/2026" }]
  ```
- **Quando ocorre:** ao selecionar uma data no calendário e ao carregar a tela (data inicial)

#### GET /api/home/scale/{my_id}
- **Método:** GET
- **Endpoint:** `/api/home/scale/{my_id}`
- **Autenticação:** Requer Bearer
- **Path param `my_id`:** string — ID do usuário autenticado (obtido do token ou do endpoint `/user/me`)
- **Response (200):** array `Scale`
  ```json
  [{ "id_escala": "string", "confirmados": 3, "title_scale": "string", "funcao": "string", "img_id": ["string"], "quant_music": 3, "data_hora": "14/12/2026 22:29:23", "dia": "14/11/2026" }]
  ```
- **Quando ocorre:** ao carregar a tela

### Navegação de entrada
- Tab bar (ícone casa) — rota padrão das tabs

### Navegação de saída
- → `/scale/[id]` ao pressionar um card de escala (via `router.push({ pathname: "/scale/[id]", params: { id } })`)
- → `/scale/[id]` ao pressionar um card de indisponibilidade (o card mostra o id da escala relacionada)

### Ações do usuário
- Selecionar data no calendário
- Pressionar card de escala → navega para detalhes da escala
- Pressionar card de indisponibilidade → navega para detalhes da escala relacionada

### Estados da página
- **Loading:** exibir skeleton ou indicador enquanto as 4 queries carregam
- **Sucesso:** renderizar calendário com pontos e seções de cards
- **Vazio (escalas do dia):** exibir "Nenhuma escala para este dia"
- **Vazio (indisponibilidades):** exibir seção vazia ou ocultar
- **Vazio (minhas escalas):** exibir "Você não está em nenhuma escala"
- **Erro:** exibir mensagem de erro e botão de retry
- **Sessão expirada:** redirecionar para `/auth/login`

### Componentes
- `CustomCalendar` (`components/calendar.tsx`) — calendário com props `initialDate`, `compromissos` e `onDateChange`
- `Section` (`components/Section.tsx`) — container das seções de indisponibilidades
- `Outages` (`components/home/outages.tsx`) — card de indisponibilidade de membro
- `Scales` (`components/scales.tsx`) — card de escala com data, membros e status

### Hooks / services
- Criar `useQuery` para cada endpoint:
  - `useQuery({ queryKey: ["home-month", mes], queryFn: () => getHomeMonth(mes) })`
  - `useQuery({ queryKey: ["home-unavailability", mes], queryFn: () => getHomeUnavailability(mes) })`
  - `useQuery({ queryKey: ["home-scale-day", day], queryFn: () => getHomeScaleDay(day) })`
  - `useQuery({ queryKey: ["home-scale-mine", myId], queryFn: () => getHomeScaleMine(myId) })`
- Criar serviços correspondentes em `services/home.ts` (arquivo ainda não existe)
- O `mes` precisa ser convertido do mês atual para o enum da API (ex.: `"Outubro"` → `"outubro"`, `"Março"` → `"marco"`)
- O `day` precisa ser formatado como `DDMMYYYY` a partir da data selecionada no calendário
- O `my_id` precisa ser obtido do contexto de autenticação (ID do usuário logado)

### Implementação recomendada
1. Criar `services/home.ts` com as 4 funções de fetch.
2. Criar hook de autenticação (ou context) que expõe `my_id` e o token.
3. Implementar os 4 `useQuery` na tela.
4. Converter `compromissos` do calendário: mapear o array `Month` para o formato `{ date: "YYYY-MM-DD", scaleId: id }`.
5. Mapear `Unavailability` para as props do componente `Outages`.
6. Mapear `ScaleDay` e `Scale` para as props do componente `Scales`.
7. Adicionar estados de loading e erro.

---

## Avisos

### Arquivo
`src/app/(tabs)/warnings.tsx`

### Rota atual
`/(tabs)/warnings` (tab "Avisos", ícone sino)

### Objetivo
Exibir alertas (cards com ícone bullhorn) e notificações simples do usuário autenticado.

### Dados necessários
- Lista de alertas (`alert[]`)
- Lista de notificações (`notifications[]`)

### APIs utilizadas

#### GET /api/alert/reminder
- **Método:** GET
- **Endpoint:** `/api/alert/reminder`
- **Autenticação:** Requer Bearer
- **Response (200):** schema `ReminderList`
  ```json
  {
    "alert": [
      {
        "id_escala": "string",
        "name": "string",
        "date": "string",
        "functions": ["string"]
      }
    ],
    "notifications": [
      {
        "id_notification": "string",
        "title": "string",
        "date": "string"
      }
    ]
  }
  ```
- **Quando ocorre:** ao montar a tela

### Navegação de entrada
- Tab bar (ícone sino)

### Navegação de saída
- → `/avisos/[id]` ao pressionar um `AlertCard` (o `id` deve ser `id_escala` do alerta)

### Ações do usuário
- Pressionar um alerta → navega para detalhes do aviso
- (Notificações atualmente não têm navegação de saída implementada)

### Estados da página
- **Loading:** indicador de carregamento
- **Sucesso:** listas de alertas e notificações
- **Vazio (alertas):** ocultar seção ou exibir mensagem
- **Vazio (notificações):** ocultar lista ou exibir mensagem
- **Erro:** mensagem de erro com botão de retry
- **Sessão expirada:** redirecionar para `/auth/login`

### Componentes
- `Section` (`components/Section.tsx`) — container dos alertas
- `AlertCard` (`components/avisos/AlertCard.tsx`) — card de alerta com bullhorn, title, subTitle e targetGroup
- `Notice` (`components/avisos/notice.tsx`) — item de notificação com sino, title e subTitle

### Hooks / services
- `useQuery({ queryKey: ["reminders"], queryFn: getReminders })`
- Criar `services/alert.ts` com função `getReminders()`
- Mapear `alert[].functions` (array de strings) para a prop `targetGroup` do `AlertCard` (string — concatenar ou usar primeiro elemento)

### Implementação recomendada
1. Criar `services/alert.ts` com `getReminders()`.
2. Implementar `useQuery` na tela.
3. Mapear `alert[]` → `AlertCard`: `name → title`, `date → subTitle`, `functions.join(", ") → targetGroup`, `id_escala → id` para navegação.
4. Mapear `notifications[]` → `Notice`: `title → title`, `date → subTitle`.
5. A navegação no `AlertCard` deve usar `id_escala` como parâmetro de rota.

> **Atenção:** a rota `/avisos/[id]` usa `id_escala` como parâmetro. O endpoint `GET /alert/reminder/{id_reminder}` recebe um `id_reminder` (string), mas o schema `AlertItem` tem o campo `id_escala`. Verificar se `id_escala` e `id_reminder` são o mesmo valor ou se são identificadores diferentes.  
> **Não confirmado — precisa ser verificado com o backend.**

---

## Perfil do Usuário

### Arquivo
`src/app/(tabs)/user.tsx`

### Rota atual
`/(tabs)/user` (tab "Usuário", ícone círculo com pessoa)

### Objetivo
Exibir o perfil do usuário autenticado: foto, nome, data de cadastro, funções/instrumentos, equipes e informações pessoais (email, senha, endereço, aniversário, telefone) com opções de edição.

### Dados necessários
- Dados do usuário autenticado (nome, email, foto, cargo, funções, equipes, logradouro, data de nascimento, telefone, data de cadastro)

### APIs utilizadas

#### GET /api/user/me
- **Método:** GET
- **Endpoint:** `/api/user/me`
- **Autenticação:** Requer Bearer
- **Response (200):** schema `Me`
  ```json
  {
    "id_membro": "integer",
    "nome": "string",
    "email": "string",
    "img_id": "string|null",
    "cargo": "string",
    "funcoes": ["string"],
    "data_nascimento": "string|null",
    "telefone": "string|null",
    "logradouro": { "rua": "string", "numero": "integer" } | null,
    "equipes": [{ "img_id": "string|null", "title": "string", "quant_part": "integer" }],
    "data_registro": "string (date-time)"
  }
  ```
- **Quando ocorre:** ao montar a tela

#### PATCH /api/user/alterEmail (ao editar email)
- **Método:** PATCH
- **Endpoint:** `/api/user/alterEmail`
- **Autenticação:** Requer Bearer
- **Request body:** `{ "id_member": integer, "email": "string" }`
- **Response (200):** `{ "message": "string" }`
- **Response (404):** `{ "message": "string" }`
- **Quando ocorre:** ao confirmar edição de email

#### PATCH /api/user/forgotPassword (ao editar senha)
- **Método:** PATCH
- **Endpoint:** `/api/user/forgotPassword`
- **Autenticação:** Requer Bearer
- **Request body:** `{ "id_member": integer, "password": "string (min 8, max 60)" }`
- **Response (200):** `{ "message": "string" }`
- **Quando ocorre:** ao confirmar edição de senha (usuário autenticado, não recuperação)

#### PATCH /api/user/alterLogradouro (ao editar endereço)
- **Método:** PATCH
- **Endpoint:** `/api/user/alterLogradouro`
- **Autenticação:** Requer Bearer
- **Request body:** `{ "id_member": integer, "id_logradouro": integer }`
- **Response (200):** `{ "message": "string" }`
- **Quando ocorre:** ao confirmar edição de endereço
- > **Atenção:** o endpoint recebe `id_logradouro` (integer), não a string do endereço. O fluxo de como obter ou criar um `id_logradouro` **não está documentado na API**. Não confirmado — precisa ser verificado com o backend.

#### PATCH /api/user/alterBirthday (ao editar aniversário)
- **Método:** PATCH
- **Endpoint:** `/api/user/alterBirthday`
- **Autenticação:** Requer Bearer
- **Request body:** `{ "id_member": integer, "birth_date": "string (MM-DD-YYYY)" }`
- **Response (200):** `{ "message": "string" }`
- **Quando ocorre:** ao confirmar edição de data de nascimento

#### PATCH /api/user/alterTelephone (ao editar telefone)
- **Método:** PATCH
- **Endpoint:** `/api/user/alterTelephone`
- **Autenticação:** Requer Bearer
- **Request body:** `{ "id_member": integer, "telephone": "string (max 11, apenas dígitos)" }`
- **Response (200):** `{ "message": "string" }`
- **Quando ocorre:** ao confirmar edição de telefone

### Navegação de entrada
- Tab bar (ícone usuário)

### Navegação de saída
- Nenhuma navegação de saída implementada atualmente (botões de edição existem visualmente, mas sem ação)

### Ações do usuário
- Visualizar dados do perfil
- Editar foto de perfil (botão lápis sobre a foto — sem API mapeada)
- Editar email (ícone lápis no `Info`)
- Editar senha (ícone lápis no `Info`)
- Editar endereço (ícone lápis no `Info`)
- Editar aniversário (ícone lápis no `Info`)
- Editar telefone (ícone lápis no `Info`)
- Visualizar equipes (cards `Team`)
- Ver funções/instrumentos (badges `RoleTag`)
- Adicionar função (botão `+` — sem API mapeada)

### Estados da página
- **Loading:** skeleton ou indicador enquanto `GET /user/me` carrega
- **Sucesso:** exibir perfil completo
- **Erro:** mensagem de erro
- **Sessão expirada:** redirecionar para `/auth/login`
- **Operação em andamento:** ao salvar edição, botão de confirmação mostra loading

### Componentes
- `Section` (`components/Section.tsx`) — container das equipes
- `RoleTag` (`components/user/function.tsx`) — badge de função/instrumento
- `Info` (`components/user/info.tsx`) — card de informações pessoais com ícones de edição
- `Team` (`components/user/team.tsx`) — card de equipe

### Hooks / services
- `useQuery({ queryKey: ["user-me"], queryFn: getUserMe })`
- `useMutation` para cada PATCH (email, senha, endereço, aniversário, telefone)
- Criar `services/users.ts` com `getUserMe()` e funções de alteração
- O componente `Info` recebe dados via props — a tela precisa mapear o response do `GET /user/me` para as props do `Info`

### Implementação recomendada
1. Criar `getUserMe()` em `services/users.ts`.
2. Implementar `useQuery` na tela para buscar o perfil.
3. Mapear response `Me` → props do `Info`: `nome`, `email`, `logradouro.rua + logradouro.numero → address`, `data_nascimento`, `telefone`.
4. Mapear `funcoes[]` → array de `RoleTag`.
5. Mapear `equipes[]` → array de `Team`.
6. Implementar modais de edição inline (ou navegar para sub-tela de edição) com `useMutation` para cada PATCH.
7. O `id_member` necessário nos PATCHes deve vir do contexto de autenticação (decodificar JWT ou guardar junto com o token após login).
8. Edição de endereço (`alterLogradouro`) precisa de esclarecimento com o backend sobre como obter/criar `id_logradouro`.

---

## Detalhes de Escala

### Arquivo
`src/app/scale/[id].tsx`

### Rota atual
`/scale/[id]` (parâmetro dinâmico `id` = `id_escala`)

### Objetivo
Exibir todos os detalhes de uma escala específica. Organizado em 3 abas:
- **Informações:** membros confirmados, local, indisponibilidades e opção de sair da escala
- **Músicas:** lista de músicas na ordem de execução, com navegação para detalhes
- **Membros:** lista completa de membros por status (indisponíveis, confirmados, pendentes) com opção de solicitar substituição

### Dados necessários
- `id` da escala (via `useLocalSearchParams`) — **nota: o código atual não usa `useLocalSearchParams`, usa dados estáticos**
- Detalhes básicos da escala (nome, data, dia da semana)
- Informações (membros confirmados, local, indisponibilidades)
- Lista de músicas
- Lista de membros com status de disponibilidade

### APIs utilizadas

#### GET /api/scale/{id}
- **Método:** GET
- **Endpoint:** `/api/scale/{id}`
- **Autenticação:** Requer Bearer
- **Path param `id`:** string — id da escala
- **Response (200):** schema `ScaleDetail`
  ```json
  {
    "id_escala": "string",
    "nome": "string",
    "dia": "string",
    "dia_da_semana": "string",
    "data": "string"
  }
  ```
- **Response (404):** `{ "message": "string" }`
- **Quando ocorre:** ao montar a tela (antes de renderizar qualquer aba)

#### GET /api/scale/{id}/info
- **Método:** GET
- **Endpoint:** `/api/scale/{id}/info`
- **Autenticação:** Requer Bearer
- **Path param `id`:** string
- **Response (200):** schema `ScaleInfo`
  ```json
  {
    "id_escala": "string",
    "membros_confirmados": "integer",
    "local": "string",
    "indisponibilidades": [
      { "image_id": "string", "name": "string", "funcao": "string" }
    ]
  }
  ```
- **Response (404):** `{ "message": "string" }`
- **Quando ocorre:** ao selecionar a aba "informações" (ou ao montar a tela)

#### GET /api/scale/{id}/musics
- **Método:** GET
- **Endpoint:** `/api/scale/{id}/musics`
- **Autenticação:** Requer Bearer
- **Path param `id`:** string
- **Response (200):** array `ScaleMusics`
  ```json
  [
    {
      "id_music_escalas": "string",
      "nome": "string",
      "banda": "string",
      "ordem": "integer",
      "tom": "string",
      "image_id": "string"
    }
  ]
  ```
- **Quando ocorre:** ao selecionar a aba "músicas"

#### GET /api/scale/{id}/members
- **Método:** GET
- **Endpoint:** `/api/scale/{id}/members`
- **Autenticação:** Requer Bearer
- **Path param `id`:** string
- **Response (200):** array `ScaleMembers`
  ```json
  [
    {
      "id_membro_escala": "string",
      "nome": "string",
      "funcao": "string",
      "disponibilidade": "string",
      "image_id": "string"
    }
  ]
  ```
- **Quando ocorre:** ao selecionar a aba "membros"

#### POST /api/scale/sair
- **Método:** POST
- **Endpoint:** `/api/scale/sair`
- **Autenticação:** Requer Bearer
- **Request body:** `{ "id_escala": "string" }`
- **Response (200):** array `ScaleMusics`
- **Quando ocorre:** ao confirmar o modal "Deseja Sair da Escala?"

#### POST /api/scale/substituir
- **Método:** POST
- **Endpoint:** `/api/scale/substituir`
- **Autenticação:** Requer Bearer
- **Request body:** `{ "id_membro_escala": "string" }`
- **Response (200):** array `ScaleMembers`
- **Response (404):** `{ "message": "string" }`
- **Quando ocorre:** ao confirmar o modal de substituição de membro (botão "Sim" no modal)

### Navegação de entrada
- `/(tabs)/` ao pressionar um card `Scales`
- `/(tabs)/` ao pressionar um card `Outages` (indisponibilidade)

### Navegação de saída
- → `/music/[id_music_escalas]` ao pressionar um item de música na aba "músicas"
  - **Parâmetro:** `id_music_escalas` (id da relação música-escala, não o id da música diretamente)
  - Atualmente o código navega para `/music/123` com ID hardcoded
- ← Voltar via `ReturnHeader` (botão ChevronLeft → `router.back()`)

### Ações do usuário
- Alternar entre abas (informações / músicas / membros)
- Pressionar música → navega para detalhes da música
- Sair da escala (modal de confirmação)
- Solicitar substituição de membro indisponível (modal de confirmação)
- Voltar

### Estados da página
- **Loading:** enquanto `GET /scale/{id}` carrega (dados do header)
- **Loading por aba:** loading separado para info / músicas / membros
- **Sucesso:** renderizar aba ativa
- **Erro (escala não encontrada):** exibir "Escala não encontrada" e botão de voltar
- **Sessão expirada:** redirecionar para login
- **Modal de saída:** visível/oculto
- **Modal de substituição:** visível com dados do membro selecionado / null

### Componentes
- `ReturnHeader` (`components/allPages/returnHeader.tsx`) — header com botão voltar

### Hooks / services
- `useQuery({ queryKey: ["scale", id], queryFn: () => getScale(id) })` — detalhes básicos
- `useQuery({ queryKey: ["scale-info", id], queryFn: () => getScaleInfo(id) })` — aba informações
- `useQuery({ queryKey: ["scale-musics", id], queryFn: () => getScaleMusics(id) })` — aba músicas
- `useQuery({ queryKey: ["scale-members", id], queryFn: () => getScaleMembers(id) })` — aba membros
- `useMutation` para `POST /scale/sair`
- `useMutation` para `POST /scale/substituir`
- Criar `services/scale.ts` com todas as funções acima
- Adicionar `useLocalSearchParams<{ id: string }>()` para ler o `id` da rota

### Implementação recomendada
1. Adicionar `const { id } = useLocalSearchParams<{ id: string }>()` no topo do componente.
2. Criar `services/scale.ts` com `getScale`, `getScaleInfo`, `getScaleMusics`, `getScaleMembers`, `sairEscala`, `substituirMembro`.
3. Carregar `GET /scale/{id}` ao montar (header da tela).
4. Carregar dados de cada aba via `useQuery` com `enabled: activeTab === "info"` etc. (lazy loading por aba).
5. Mapear `ScaleInfo.indisponibilidades` para os `MemberItem` com `isUnavailable=true`.
6. Mapear `ScaleMembers` para os grupos de membros por `disponibilidade`.
7. Ao navegar para `/music/[id]`, usar `id_music_escalas` como parâmetro — mas atenção: a tela `music/[id]` usa esse ID para chamar `GET /scale/{id}/music/{id_music_escalas}`, que requer tanto `id` (da escala) quanto `id_music_escalas`. Avaliar se o `id` da escala precisa ser passado como segundo parâmetro ou se ele é inferível.
8. Conectar modais às mutations: ao confirmar "Sair", chamar `sairEscala({ id_escala: id })`; ao confirmar "Substituir", chamar `substituirMembro({ id_membro_escala })`.

---

## Detalhes de Música

### Arquivo
`src/app/music/[id].tsx`

### Rota atual
`/music/[id]` (parâmetro dinâmico `id` = `id_music_escalas`)

### Objetivo
Exibir detalhes de uma música na escala: nome, artista, BPM, tom atual e tom original, e links externos (Spotify, YouTube, cifra, letra). Permitir abertura dos links no navegador.

### Dados necessários
- `id_music_escalas` (via `useLocalSearchParams`) — ID da relação música-escala
- `id_escala` — ID da escala pai (necessário para o endpoint, mas **não está sendo passado atualmente**)
- Detalhes da música: nome, autor, BPM, tons, links, duração, imagem

### APIs utilizadas

#### GET /api/scale/{id}/music/{id_music_escalas}
- **Método:** GET
- **Endpoint:** `/api/scale/{id}/music/{id_music_escalas}`
- **Autenticação:** Requer Bearer
- **Path param `id`:** string — id da escala pai
- **Path param `id_music_escalas`:** string — id da relação música-escala
- **Response (200):** schema `ScaleMusicDetail`
  ```json
  {
    "id_musica": "string",
    "nome": "string",
    "autor": "string",
    "tom_atual": "string",
    "tom_original": "string",
    "bpm": "string",
    "ordem": "integer",
    "link_spotify": "string",
    "link_youtube": "string",
    "link_cifra": "string",
    "link_letra": "string",
    "duracao": "string",
    "img_id": "string"
  }
  ```
- **Response (404):** `{ "message": "string" }`
- **Quando ocorre:** ao montar a tela

> **Problema estrutural:** o endpoint requer dois IDs (`id_escala` e `id_music_escalas`), mas a rota atual `/music/[id]` só tem um parâmetro. A navegação de `scale/[id].tsx` precisa passar o `id_escala` como segundo parâmetro de query string ou repensar a estrutura da rota.  
> Opção 1: Usar `/music/[id]?escalaId=123` e ler `escalaId` via `useLocalSearchParams`.  
> Opção 2: Mudar a rota para `/scale/[scaleId]/music/[musicId]`.  
> Ver seção "Sugestões de navegação" abaixo.

### Navegação de entrada
- `/scale/[id]` aba "músicas" ao pressionar um item de música

### Navegação de saída
- ← Voltar via `ReturnHeader`

### Ações do usuário
- Visualizar detalhes da música
- Abrir links externos (Spotify, YouTube, cifra, letra) via `Linking.openURL`
- Voltar

### Estados da página
- **Loading:** enquanto a query carrega
- **Sucesso:** exibir dados da música
- **Erro (404):** exibir "Música não encontrada" com botão de voltar
- **Sessão expirada:** redirecionar para login

### Componentes
- `ReturnHeader` (`components/allPages/returnHeader.tsx`)

### Hooks / services
- `useLocalSearchParams<{ id: string, escalaId?: string }>()` — a implementar
- `useQuery({ queryKey: ["music-detail", escalaId, id], queryFn: () => getScaleMusicDetail(escalaId, id) })`
- Criar `getScaleMusicDetail` em `services/scale.ts`

### Implementação recomendada
1. Adicionar `const { id, escalaId } = useLocalSearchParams<{ id: string, escalaId: string }>()`.
2. Atualizar a navegação em `scale/[id].tsx` para passar `escalaId` junto com `id_music_escalas`.
3. Criar `getScaleMusicDetail(scaleId, musicId)` em `services/scale.ts`.
4. Implementar `useQuery` na tela.
5. Mapear `ScaleMusicDetail` → UI:
   - `link_spotify`, `link_youtube`, `link_cifra`, `link_letra` → lista de links (com ícones FA correspondentes)
   - `tom_atual` → botão ativo; `tom_original` → botão inativo com riscado
   - `bpm` → texto de BPM
   - `nome`, `autor` → header da tela

---

## Detalhes de Aviso

### Arquivo
`src/app/avisos/[id].tsx`

### Rota atual
`/avisos/[id]` (parâmetro dinâmico `id`)

### Objetivo
Exibir o detalhe completo de um aviso/alerta: nome, data, horário, descrição e funções/grupos alvo.

### Dados necessários
- `id` do reminder (via `useLocalSearchParams`)
- Detalhes do reminder: nome, data, horário, descrição, funções alvo

### APIs utilizadas

#### GET /api/alert/reminder/{id_reminder}
- **Método:** GET
- **Endpoint:** `/api/alert/reminder/{id_reminder}`
- **Autenticação:** Requer Bearer
- **Path param `id_reminder`:** string
- **Response (200):** schema `ReminderDetail`
  ```json
  {
    "id_escala": "string",
    "name": "string",
    "date": "string",
    "tempo": "string",
    "description": "string",
    "functions": ["string"]
  }
  ```
- **Quando ocorre:** ao montar a tela

> **Ambiguidade de ID:** a rota usa `id` como parâmetro, mas o endpoint usa `id_reminder`. O schema `AlertItem` (retornado por `GET /alert/reminder`) tem o campo `id_escala`. Não está claro se `id_reminder === id_escala`. A navegação em `warnings.tsx` envia `router.push("/avisos/1")` com ID hardcoded.  
> **Não confirmado — precisa ser verificado com o backend** qual campo usar como `id_reminder`.

### Navegação de entrada
- `/(tabs)/warnings` ao pressionar um `AlertCard`

### Navegação de saída
- ← Voltar via `ReturnHeader`

### Ações do usuário
- Visualizar detalhes do aviso
- Voltar

### Estados da página
- **Loading:** enquanto a query carrega
- **Sucesso:** exibir aviso
- **Erro (não encontrado):** exibir "Aviso não encontrado" — já implementado com dados mockados
- **Sessão expirada:** redirecionar para login

### Componentes
- `ReturnHeader` (`components/allPages/returnHeader.tsx`)

### Hooks / services
- `useLocalSearchParams<{ id: string }>()` — já sendo usado (mas com array mockado)
- `useQuery({ queryKey: ["reminder", id], queryFn: () => getReminderDetail(id) })`
- Criar `services/alert.ts` com `getReminderDetail(id: string)`

### Implementação recomendada
1. Criar `services/alert.ts` com `getReminders()` e `getReminderDetail(id)`.
2. Substituir o array `avisos` mockado por `useQuery`.
3. Mapear `ReminderDetail` → UI:
   - `name` → `title` no header
   - `functions.join(", ")` → `subtitle` no header (grupo alvo)
   - `date` e `tempo` → dateRow
   - `description` → texto principal

---

## Análise de páginas sem rota própria

As seguintes funcionalidades estão previstas pela API mas **não têm telas implementadas**:

| Funcionalidade | Endpoints disponíveis | Situação |
|---|---|---|
| Repertório completo de músicas | Não há endpoint de listagem global de músicas | Não se aplica |
| Logout / encerramento de sessão | Não há endpoint de logout na API | Não implementado — pode ser feito apenas limpando o token local |
| Gestão de funções do usuário | Não há endpoint de CRUD de funções | Não confirmado — botão `+` em `user.tsx` não tem destino |
| Imagens de usuário/equipe | `img_id` retornado pela API, mas endpoint de imagem não documentado | Não confirmado — precisa ser verificado |

---

# Sugestões de navegação

---

## 1. Ausência de guarda de rotas autenticadas

- **Situação atual:** qualquer usuário pode acessar `/(tabs)` diretamente sem estar autenticado. O layout raiz `_layout.tsx` não verifica se há token.
- **Problema:** usuário sem sessão acessa dados protegidos (as queries retornariam 401). Risco de UX e segurança.
- **Sugestão:** adicionar verificação de token no `_layout.tsx` ou em `(tabs)/_layout.tsx`. Se não houver token, redirecionar para `/auth`.
- **Justificativa:** todas as rotas das tabs e rotas dinâmicas consomem endpoints autenticados.
- **Impacto:** bloqueia usuários não autenticados e garante que o token esteja disponível para as queries.
- **Prioridade:** Alta

---

## 2. Rota `/music/[id]` precisa de dois parâmetros

- **Situação atual:** a rota `/music/[id]` recebe apenas `id_music_escalas`, mas o endpoint `GET /scale/{id}/music/{id_music_escalas}` também exige `id_escala`.
- **Problema:** impossível chamar a API de detalhes de música sem o ID da escala pai.
- **Sugestão (opção A):** usar query string — `/music/[id]?escalaId=X` e ler via `useLocalSearchParams`.
- **Sugestão (opção B — mais semântica):** criar rota aninhada `/scale/[scaleId]/music/[musicId]` para refletir a hierarquia real.
- **Justificativa:** a API é clara: `GET /scale/{id}/music/{id_music_escalas}` — a música pertence a uma escala.
- **Impacto:** requer atualização da navegação em `scale/[id].tsx` e da estrutura de rota em `app/`.
- **Prioridade:** Alta

---

## 3. Rota `/avisos/[id]` — ambiguidade entre `id_escala` e `id_reminder`

- **Situação atual:** o endpoint de detalhe usa `id_reminder`, mas o schema `AlertItem` (da listagem) tem `id_escala`. Não está documentado se são o mesmo valor.
- **Problema:** ao navegar de `warnings.tsx` para `/avisos/[id]`, não está claro qual ID usar.
- **Sugestão:** verificar com o backend se `id_escala === id_reminder` no contexto de alertas. Se não forem iguais, a API precisa retornar um `id_reminder` explícito na listagem de alertas.
- **Justificativa:** sem essa confirmação, a integração do `avisos/[id]` não pode ser feita corretamente.
- **Impacto:** bloqueia implementação da tela de detalhe de aviso.
- **Prioridade:** Alta

---

## 4. Ausência de rota de logout

- **Situação atual:** não há como o usuário encerrar a sessão. Não há botão de logout e não há endpoint de logout na API.
- **Problema:** o usuário não consegue trocar de conta ou encerrar a sessão de forma explícita.
- **Sugestão:** adicionar botão de logout na tela `/(tabs)/user` que limpa o token do `expo-secure-store` e redireciona para `/auth`.
- **Justificativa:** operação essencial para apps com autenticação. Pode ser feito sem endpoint de API — basta limpar o armazenamento local.
- **Impacto:** baixo — apenas remoção do token local e redirecionamento.
- **Prioridade:** Média

---

## 5. `/auth/forgotPassword` deveria ser um modal ou stack diferente

- **Situação atual:** `forgotPassword` está como rota dentro do grupo `auth/`, no mesmo nível que `login` e `signUp`.
- **Problema:** conceitualmente, recuperar senha é uma ação acessória ao login, não uma tela principal.
- **Sugestão:** apresentar como modal overlay sobre a tela de login (`<Modal>` nativo) ou como rota dentro de uma Stack filha de `/auth/login`.
- **Justificativa:** melhora o fluxo: o usuário não "sai" da tela de login para ir à recuperação de senha.
- **Impacto:** requer mudança no arquivo de rota e na transição de tela.
- **Prioridade:** Baixa

---

## 6. Modais de "Sair da Escala" e "Substituir Membro" estão inline

- **Situação atual:** os dois modais em `scale/[id].tsx` são `<Modal>` nativos controlados por `useState` locais.
- **Problema:** não há problema técnico, mas a lógica de confirmação e a chamada de API estão misturadas com a UI da tela.
- **Sugestão:** extrair cada modal para um componente separado em `components/scale/` para melhorar a manutenibilidade.
- **Justificativa:** quando a integração com a API for implementada, os modais precisarão de estados de loading e erro — extrair facilita isso.
- **Impacto:** apenas organização de código, sem impacto em UX.
- **Prioridade:** Baixa

---

## 7. Sem rota para edição de informações do usuário

- **Situação atual:** os ícones de lápis no componente `Info` (`user/info.tsx`) não têm ação implementada — são `TouchableOpacity` sem `onPress`.
- **Problema:** a API tem 5 endpoints de alteração de dados do usuário, mas nenhum fluxo de edição está implementado.
- **Sugestão (opção A):** abrir modais inline em `/(tabs)/user` para cada campo editável.
- **Sugestão (opção B):** criar rota `/user/edit` ou `/user/edit/[field]` para formulários de edição.
- **Justificativa:** funcionalidade essencial para completar a tela de perfil.
- **Impacto:** requer implementar fluxo de formulário e mutations.
- **Prioridade:** Média

---

## 8. Aba de Músicas em `scale/[id]` navega para rota com ID hardcoded

- **Situação atual:** `router.push("/music/123")` — ID fixo em desenvolvimento.
- **Problema:** ao integrar com dados reais, o ID deve ser dinâmico (`id_music_escalas` do item).
- **Sugestão:** corrigir imediatamente para `router.push({ pathname: "/music/[id]", params: { id: item.id_music_escalas, escalaId: id } })`.
- **Justificativa:** bug que impediria visualizar músicas corretas ao integrar com a API.
- **Impacto:** nenhuma mudança de estrutura — apenas corrigir o valor do parâmetro.
- **Prioridade:** Alta

---

## 9. Tela Home não usa `useLocalSearchParams` para o `mes` do calendário

- **Situação atual:** a tela home não tem mecanismo para detectar a troca de mês no calendário e rebuscar os dados do mês correto.
- **Problema:** ao trocar para fevereiro no calendário, os dados de mês continuariam sendo de outubro (o mês inicial).
- **Sugestão:** controlar o mês atual com `useState` e usar como chave da query para invalidar e rebuscar automaticamente.
- **Justificativa:** o componente `Calendar` de `react-native-calendars` expõe callbacks de mudança de mês.
- **Impacto:** melhoria funcional importante para a UX.
- **Prioridade:** Média

---

# Mapa da API

| Endpoint | Método | Autenticação | Página(s) | Finalidade | Implementado? | Observações |
|---|---|---|---|---|---|---|
| `/api/auth/login` | POST | Não | `/auth/login` | Autenticar usuário, obter JWT | ✅ Sim | Token não armazenado após login |
| `/api/user` | POST | Não | `/auth/signUp` | Criar novo usuário | ✅ Sim | Conversão de data/telefone em `services/users.ts` |
| `/api/user` | GET | Bearer | Não utilizada | Listar todos os usuários | ❌ Não | Endpoint admin — pode não ser relevante para o app |
| `/api/user/me` | GET | Bearer | `/(tabs)/user` | Obter perfil do usuário autenticado | ❌ Não | Dados mockados na tela |
| `/api/user/alterEmail` | PATCH | Bearer | `/(tabs)/user` | Alterar email do usuário | ❌ Não | Botão de edição sem ação |
| `/api/user/forgotPassword` | PATCH | Bearer | `/auth/forgotPassword`, `/(tabs)/user` | Alterar senha | ❌ Não | Tela é stub vazio; fluxo sem `id_member` é problemático |
| `/api/user/alterLogradouro` | PATCH | Bearer | `/(tabs)/user` | Alterar endereço | ❌ Não | `id_logradouro` não documentado como obtê-lo |
| `/api/user/alterBirthday` | PATCH | Bearer | `/(tabs)/user` | Alterar data de nascimento | ❌ Não | Botão de edição sem ação |
| `/api/user/alterTelephone` | PATCH | Bearer | `/(tabs)/user` | Alterar telefone | ❌ Não | Botão de edição sem ação |
| `/api/home/month/{mes}` | GET | Bearer | `/(tabs)/` | Escalas do mês para calendário | ❌ Não | Dados mockados na tela |
| `/api/home/unavailability/{mes}` | GET | Bearer | `/(tabs)/` | Indisponibilidades do mês | ❌ Não | Dados mockados |
| `/api/home/scale/{my_id}` | GET | Bearer | `/(tabs)/` | Escalas do usuário ("Minhas Escalas") | ❌ Não | `my_id` não disponível (sem contexto de auth) |
| `/api/home/scale/day/{day}` | GET | Bearer | `/(tabs)/` | Escalas do dia selecionado | ❌ Não | Dados mockados |
| `/api/alert/reminder` | GET | Bearer | `/(tabs)/warnings` | Listar alertas e notificações | ❌ Não | Dados mockados |
| `/api/alert/reminder/{id_reminder}` | GET | Bearer | `/avisos/[id]` | Detalhe de um aviso | ❌ Não | Dados mockados; ambiguidade de ID |
| `/api/scale/{id}` | GET | Bearer | `/scale/[id]` | Dados básicos da escala | ❌ Não | Dados hardcoded |
| `/api/scale/{id}/info` | GET | Bearer | `/scale/[id]` (aba info) | Informações, local e indisponibilidades | ❌ Não | Dados hardcoded |
| `/api/scale/{id}/musics` | GET | Bearer | `/scale/[id]` (aba músicas) | Lista de músicas da escala | ❌ Não | Dados hardcoded |
| `/api/scale/{id}/music/{id_music_escalas}` | GET | Bearer | `/music/[id]` | Detalhe de uma música | ❌ Não | Rota não tem `id_escala`; dados hardcoded |
| `/api/scale/{id}/members` | GET | Bearer | `/scale/[id]` (aba membros) | Membros da escala com status | ❌ Não | Dados hardcoded |
| `/api/scale/sair` | POST | Bearer | `/scale/[id]` | Sair de uma escala | ❌ Não | Modal implementado mas sem chamada real |
| `/api/scale/substituir` | POST | Bearer | `/scale/[id]` | Solicitar substituição de membro | ❌ Não | Modal implementado mas sem chamada real |

---

# Mapa de páginas

| Página | Rota | APIs necessárias | API implementada? | Navegação necessária | Estado atual |
|---|---|---|---|---|---|
| Onboarding | `/auth` | Nenhuma | — | → Login, → Cadastro | ✅ Completo |
| Login | `/auth/login` | POST /auth/login | ✅ Sim | → `/(tabs)`, → forgotPassword, → signUp | ✅ Funcional — falta armazenar token |
| Cadastro | `/auth/signUp` | POST /user | ✅ Sim | → Login | ✅ Funcional |
| Recuperação de Senha | `/auth/forgotPassword` | PATCH /user/forgotPassword | ❌ Não | → Login | ❌ Stub vazio |
| Home | `/(tabs)/` | GET /home/month, /home/unavailability, /home/scale/{my_id}, /home/scale/day/{day} | ❌ Não | → `/scale/[id]` | ❌ Dados mockados |
| Avisos | `/(tabs)/warnings` | GET /alert/reminder | ❌ Não | → `/avisos/[id]` | ❌ Dados mockados |
| Perfil | `/(tabs)/user` | GET /user/me + 5 PATCHes | ❌ Não | Nenhuma | ❌ Dados mockados |
| Detalhes de Escala | `/scale/[id]` | GET /scale/{id}, /info, /musics, /members + POST /scale/sair, /substituir | ❌ Não | → `/music/[id]`, ← Voltar | ❌ Dados hardcoded, `id` não lido |
| Detalhes de Música | `/music/[id]` | GET /scale/{id}/music/{id_music_escalas} | ❌ Não | ← Voltar | ❌ Dados hardcoded, `id_escala` ausente |
| Detalhes de Aviso | `/avisos/[id]` | GET /alert/reminder/{id_reminder} | ❌ Não | ← Voltar | ❌ Dados mockados |

---

# Plano de implementação

A ordem a seguir respeita as dependências técnicas: auth → contexto de usuário → pages principais → detalhes.

---

## Etapa 1 — Persistência de sessão e interceptor de autenticação

**Prioridade:** Alta — pré-requisito para todas as outras etapas.

| Item | Detalhe |
|---|---|
| **Arquivos** | `src/services/api.ts`, `src/app/auth/login.tsx`, `src/app/_layout.tsx` |
| **APIs** | Nenhuma nova — usa token do `POST /auth/login` (já implementado) |
| **Componentes** | Nenhum |
| **Pré-requisitos** | Login funcionando (já está) |

**O que fazer:**
1. Após login bem-sucedido, salvar `accessToken` com:
   ```ts
   import * as SecureStore from "expo-secure-store";
   await SecureStore.setItemAsync("accessToken", data.accessToken);
   ```
2. Criar interceptor Axios em `services/api.ts` que lê o token e injeta no header:
   ```ts
   api.interceptors.request.use(async (config) => {
     const token = await SecureStore.getItemAsync("accessToken");
     if (token) config.headers.Authorization = `Bearer ${token}`;
     return config;
   });
   ```
3. No `_layout.tsx` ou `(tabs)/_layout.tsx`, verificar se há token ao inicializar. Se não houver, redirecionar para `/auth`.
4. Implementar função de logout (remover token + `router.replace("/auth")`).

---

## Etapa 2 — Contexto / hook de autenticação

**Prioridade:** Alta — `my_id` e `id_member` são necessários em várias telas.

| Item | Detalhe |
|---|---|
| **Arquivos** | Novo: `src/context/auth.tsx` ou `src/hooks/useAuth.ts` |
| **APIs** | GET /user/me (para obter `id_membro` logo após login) |
| **Componentes** | Nenhum |
| **Pré-requisitos** | Etapa 1 concluída |

**O que fazer:**
1. Criar hook `useAuth` que lê o token do `SecureStore` e expõe: `{ token, isAuthenticated, user, logout }`.
2. Opcionalmente, ao autenticar, chamar `GET /user/me` para obter e armazenar o `id_membro` — necessário para `GET /home/scale/{my_id}` e todos os PATCHes de usuário.
3. Expor `id_membro` via contexto ou hook.

---

## Etapa 3 — Tela Home (integração com API)

**Prioridade:** Alta — tela principal do app.

| Item | Detalhe |
|---|---|
| **Arquivos** | `src/app/(tabs)/index.tsx`, novo `src/services/home.ts` |
| **APIs** | GET /home/month/{mes}, GET /home/unavailability/{mes}, GET /home/scale/{my_id}, GET /home/scale/day/{day} |
| **Componentes** | `Scales`, `Outages`, `Section`, `CustomCalendar` |
| **Pré-requisitos** | Etapas 1 e 2 concluídas |

**O que fazer:**
1. Criar `services/home.ts` com as 4 funções de fetch.
2. Implementar 4 `useQuery` na tela.
3. Converter mês atual para o enum da API: remover acento de `março` → `marco`, colocar em minúsculas.
4. Converter data do calendário para formato `DDMMYYYY`.
5. Mapear responses para props dos componentes.
6. Adicionar estados de loading e erro.

---

## Etapa 4 — Tela Avisos e Detalhes de Aviso

**Prioridade:** Alta — segunda tab do app.

| Item | Detalhe |
|---|---|
| **Arquivos** | `src/app/(tabs)/warnings.tsx`, `src/app/avisos/[id].tsx`, novo `src/services/alert.ts` |
| **APIs** | GET /alert/reminder, GET /alert/reminder/{id_reminder} |
| **Componentes** | `AlertCard`, `Notice` |
| **Pré-requisitos** | Etapa 1. Resolver ambiguidade `id_escala` vs `id_reminder` antes de implementar |

**O que fazer:**
1. Verificar com backend qual campo usar como `id_reminder`.
2. Criar `services/alert.ts` com `getReminders()` e `getReminderDetail(id)`.
3. Implementar `useQuery` em `warnings.tsx` e `avisos/[id].tsx`.
4. Mapear `functions[]` para `targetGroup` no `AlertCard`.
5. Remover dados mockados de `avisos/[id].tsx`.

---

## Etapa 5 — Perfil do Usuário

**Prioridade:** Média.

| Item | Detalhe |
|---|---|
| **Arquivos** | `src/app/(tabs)/user.tsx`, `src/services/users.ts` |
| **APIs** | GET /user/me + PATCH /user/alterEmail, alterBirthday, alterTelephone, forgotPassword |
| **Componentes** | `Info`, `Team`, `RoleTag` |
| **Pré-requisitos** | Etapas 1 e 2 concluídas |

**O que fazer:**
1. Adicionar `getUserMe()` em `services/users.ts`.
2. Implementar `useQuery` na tela.
3. Implementar edição inline (modais ou sub-telas) para email, senha, aniversário, telefone.
4. Adiar edição de endereço (`alterLogradouro`) até esclarecimento sobre `id_logradouro`.

---

## Etapa 6 — Detalhes de Escala

**Prioridade:** Alta — rota muito acessada a partir da Home.

| Item | Detalhe |
|---|---|
| **Arquivos** | `src/app/scale/[id].tsx`, novo `src/services/scale.ts` |
| **APIs** | GET /scale/{id}, /info, /musics, /members + POST /scale/sair, /substituir |
| **Componentes** | `ReturnHeader` |
| **Pré-requisitos** | Etapa 1. Resolver questão do `id_escala` para navegação para músicas |

**O que fazer:**
1. Adicionar `useLocalSearchParams<{ id: string }>()`.
2. Criar `services/scale.ts` com todas as funções.
3. Implementar 4 `useQuery` (lazy por aba).
4. Conectar modais às mutations.
5. Corrigir navegação para `/music/[id]` passando `escalaId`.

---

## Etapa 7 — Detalhes de Música

**Prioridade:** Média — depende da Etapa 6.

| Item | Detalhe |
|---|---|
| **Arquivos** | `src/app/music/[id].tsx` |
| **APIs** | GET /scale/{id}/music/{id_music_escalas} |
| **Componentes** | `ReturnHeader` |
| **Pré-requisitos** | Etapa 6 concluída e `escalaId` sendo passado na navegação |

**O que fazer:**
1. Adicionar `useLocalSearchParams<{ id: string, escalaId: string }>()`.
2. Implementar `useQuery` com `getScaleMusicDetail(escalaId, id)`.
3. Mapear response para os elementos de UI já existentes.

---

## Etapa 8 — Tela de Recuperação de Senha

**Prioridade:** Baixa — stub vazio, mas rota existe e há link para ela.

| Item | Detalhe |
|---|---|
| **Arquivos** | `src/app/auth/forgotPassword.tsx`, `src/services/users.ts` |
| **APIs** | PATCH /user/forgotPassword |
| **Componentes** | `TextInput`, `SendBtn` |
| **Pré-requisitos** | Resolver problema do `id_member` sem autenticação com o backend |

---

## Etapa 9 — Estados globais de loading, erro e sessão expirada

**Prioridade:** Média.

| Item | Detalhe |
|---|---|
| **Arquivos** | Todos os arquivos das etapas anteriores |
| **APIs** | Todas |
| **Componentes** | Potencialmente novos: `ErrorState`, `LoadingState`, `EmptyState` |
| **Pré-requisitos** | Etapas 1–7 concluídas |

**O que fazer:**
1. Criar componentes de estado reutilizáveis para loading, erro e vazio.
2. Tratar resposta 401 (sessão expirada) no interceptor Axios: limpar token e redirecionar para `/auth`.
3. Garantir que todas as telas exibam estados de loading e erro coerentes.

---

# Instruções para a próxima IA

## Antes de começar

1. **Leia este documento completo** antes de alterar qualquer arquivo do projeto.
2. **Leia também `README.md` e `docs/REFACTOR_CONTEXT.md`** para entender o contexto completo.
3. **Não invente endpoints.** Use somente os listados na seção "Spec OpenAPI confirmado" deste documento.
4. **Não invente campos de request ou response.** Todos os schemas estão documentados acima.
5. **Não invente regras de autenticação.** Apenas `POST /api/auth/login` e `POST /api/user` dispensam Bearer token.

## Ao implementar

6. **Implemente na ordem do Plano de Implementação.** As etapas têm dependências entre si — pular etapas pode gerar código sem funcionar.
7. **Nunca preencha lacunas com dados mockados novos.** Se um dado não estiver disponível, exiba estado de loading ou erro.
8. **Reutilize os componentes existentes.** A lista completa está no `README.md` e no `REFACTOR_CONTEXT.md`. Não crie componentes duplicados.
9. **Reutilize os serviços existentes.** `services/auth.ts`, `services/users.ts` e `services/api.ts` já existem. Crie novos arquivos de serviço apenas quando necessário (`services/home.ts`, `services/scale.ts`, `services/alert.ts`).
10. **Respeite os schemas Zod.** Os schemas de criação de usuário e login já existem em `src/schemas/`. Ao criar novos serviços com respostas complexas, considere adicionar schemas Zod para validação.
11. **Mantenha os tokens de cor.** Todas as cores devem ser de `src/constants/styles.ts` (`sty.c1`–`sty.c19`). Não use valores hexadecimais hardcoded.
12. **Mantenha a convenção `onPress`.** Callbacks de ação devem sempre se chamar `onPress` nos componentes.

## Estados obrigatórios

13. **Trate loading** em todas as telas que consomem API. Enquanto `isLoading === true`, exiba um indicador visual.
14. **Trate erro** em todas as telas que consomem API. Se `isError === true`, exiba mensagem e ofereça retry quando possível.
15. **Trate estado vazio.** Se uma lista retornar vazia da API, exiba mensagem contextual (ex.: "Nenhuma escala para este dia").
16. **Trate sessão expirada (401).** Implemente interceptor Axios que detecta 401 e redireciona para `/auth`.

## Autenticação

17. **Armazene o token com `expo-secure-store`** (pacote já instalado).
18. **Injete o token via interceptor Axios** em `services/api.ts` — não passe manualmente em cada requisição.
19. **Obtenha `id_membro` via `GET /user/me`** logo após o login e guarde-o no contexto. Esse ID é necessário para `GET /home/scale/{my_id}` e todos os PATCHes.
20. **Implemente guarda de rota** no `_layout.tsx` ou `(tabs)/_layout.tsx`.

## Questões pendentes (não implementar sem confirmar)

21. **`id_logradouro`** — o endpoint `PATCH /user/alterLogradouro` exige um `id_logradouro` (integer). Como obtê-lo ou criá-lo não está documentado. Não implemente a edição de endereço sem esclarecer isso com o backend.
22. **`id_reminder` vs `id_escala`** — verificar se são o mesmo valor antes de implementar navegação `warnings.tsx → avisos/[id].tsx`.
23. **`forgotPassword` sem autenticação** — o endpoint `PATCH /user/forgotPassword` requer `id_member`, mas o usuário que acessa a tela pelo fluxo de "Esqueceu a senha?" não está autenticado. Esclarecer com o backend antes de implementar.
24. **Imagens** — a API retorna `img_id` em vários endpoints, mas o endpoint para obter a imagem a partir do `img_id` não está documentado. Não confirme a exibição de imagens remotas sem verificar o endpoint correto.

## Ao terminar cada etapa

25. **Atualize este documento** — marque o campo "Implementado?" no Mapa da API e no Mapa de Páginas como ✅ ao concluir cada integração.
26. **Execute `npx tsc --noEmit`** para verificar erros de TypeScript.
27. **Execute `npx biome check src/`** para verificar erros de lint e formatação.
28. **Não altere a UI sem necessidade.** O objetivo das próximas etapas é integrar com a API — não redesenhar componentes.
29. **Não altere a estrutura de rotas sem documentar.** Se precisar criar ou renomear uma rota, atualize este documento na seção "Análise das páginas" e no Mapa de Páginas.
