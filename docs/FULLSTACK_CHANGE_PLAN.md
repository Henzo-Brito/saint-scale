# FULLSTACK_CHANGE_PLAN.md
> Plano de mudanças para o sistema SaintScale — baseado na análise de FULLSTACK_CONTEXT.md  
> Gerado em: 2026-10-07

---

## Convenções deste documento

- **Prioridade:** CRÍTICA > ALTA > MÉDIA > BAIXA
- **Risco:** ALTO (pode quebrar funcionalidades existentes) | MÉDIO | BAIXO
- **Referência:** `INC-xxx`, `PA-xxx`, `PB-xxx`, `DR-xxx` conforme FULLSTACK_CONTEXT.md

---

## Sumário executivo

O sistema está em estado de protótipo com **apenas 2 endpoints integrados** (login e cadastro) de 21 disponíveis. Antes de qualquer integração de telas, é necessário resolver a fundação de autenticação — sem ela, 100% das chamadas autenticadas falharão. Em seguida, corrigir falhas de segurança no backend. Depois, integrar telas na ordem de valor para o usuário.

**Número total de mudanças planejadas:** 32  
**Fases:** 9

---

## FASE 1 — FUNDAÇÃO DE AUTENTICAÇÃO

> Pré-requisito absoluto para todas as fases seguintes.

---

### MUDANÇA-01 — Persistência do token JWT

| Atributo | Valor |
|----------|-------|
| **Problema** | O token retornado pelo login não é salvo em nenhum local. Ao fechar e reabrir o app, a sessão é perdida. |
| **Causa** | `expo-secure-store` está instalado mas não é utilizado. O serviço `auth.ts` apenas retorna o token mas não o armazena. |
| **Referência** | INC-001, PA-001 |
| **Prioridade** | CRÍTICA |
| **Risco** | BAIXO |

**Solução:**

Criar um módulo `src/services/session.ts` responsável por salvar, carregar e limpar o token usando `expo-secure-store`.

```typescript
// src/services/session.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'saint_scale_access_token';

export const session = {
  async save(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async load(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
```

Após o login bem-sucedido em `login.tsx`, chamar `session.save(data.accessToken)`.

**Arquivos afetados:**
- `src/services/session.ts` — criar
- `src/services/auth.ts` — chamar `session.save()` após login bem-sucedido
- `src/app/auth/login.tsx` — ou delegar para `auth.ts` (preferível manter tela limpa)

**Dependências:** Nenhuma.

---

### MUDANÇA-02 — Interceptor Axios para injetar token nas requisições

| Atributo | Valor |
|----------|-------|
| **Problema** | Todas as requisições às rotas protegidas falham com 401 porque o header `Authorization` nunca é enviado. |
| **Causa** | A instância Axios em `api.ts` não tem interceptor de request. |
| **Referência** | INC-002, PA-002 |
| **Prioridade** | CRÍTICA |
| **Risco** | BAIXO |

**Solução:**

Adicionar interceptor de request na instância Axios que carrega o token do `expo-secure-store` e injeta no header. Adicionar interceptor de response para tratar 401 (limpar sessão e redirecionar para login).

```typescript
// src/services/api.ts (adicionar após criação da instância)
api.interceptors.request.use(async (config) => {
  const token = await session.load();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await session.clear();
      router.replace('/auth/login');
    }
    return Promise.reject(error);
  }
);
```

**Arquivos afetados:**
- `src/services/api.ts` — adicionar interceptors
- `src/services/session.ts` — deve existir (MUDANÇA-01)

**Dependências:** MUDANÇA-01.

---

### MUDANÇA-03 — Correção do mínimo de senha no LoginSchema do frontend

| Atributo | Valor |
|----------|-------|
| **Problema** | Frontend valida senha com `min(6)`, backend exige `min(8)`. Usuário com senha de 6 ou 7 chars vê erro confuso vindo do servidor. |
| **Causa** | Schemas criados de forma independente sem sincronização. |
| **Referência** | INC-003, PA-003 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

Alterar `LoginSchema` em `src/schemas/auth.schemas.ts`:

```typescript
// Antes
password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),

// Depois
password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
```

**Arquivos afetados:**
- `src/schemas/auth.schemas.ts` (frontend)

**Dependências:** Nenhuma.

---

### MUDANÇA-04 — Implementar logout

| Atributo | Valor |
|----------|-------|
| **Problema** | Não existe botão ou fluxo de logout em nenhuma tela. O usuário não consegue trocar de conta. |
| **Causa** | Funcionalidade não implementada. |
| **Referência** | INC-001 (consequência) |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

Adicionar função `logout()` em `src/services/auth.ts`:

```typescript
export async function logout() {
  await session.clear();
  router.replace('/auth/login');
}
```

Adicionar botão de logout na tela `user.tsx` (ex.: ícone de saída no header ou no final da tela).

**Arquivos afetados:**
- `src/services/auth.ts` — adicionar `logout()`
- `src/app/(tabs)/user.tsx` — adicionar botão de logout

**Dependências:** MUDANÇA-01.

---

## FASE 2 — SEGURANÇA E CONTRATO DA API

> Corrigir falhas de segurança e inconsistências de contrato antes de integrar as telas.

---

### MUDANÇA-05 — Remover campo `password` das respostas de user

| Atributo | Valor |
|----------|-------|
| **Problema** | `GET /api/user` e `POST /api/user` retornam a senha hasheada na resposta. Mesmo sendo hash, é dado sensível desnecessário. |
| **Causa** | `UserSchema` inclui `password`. O `mapRow()` não filtra o campo. |
| **Referência** | INC-006, INC-007 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO (frontend não usa o campo) |

**Solução:**

1. Criar `UserPublicSchema` sem o campo `password` em `user.schemas.ts`:

```typescript
export const UserPublicSchema = UserSchema.omit({ password: true }).openapi("UserPublic");
```

2. Substituir `UserSchema` por `UserPublicSchema` nas rotas `createUser` e `getUser`.
3. Remover `senha AS password` das queries `createUser` e `getUsers` no DAO.

**Arquivos afetados (backend):**
- `src/schemas/user.schemas.ts` — adicionar `UserPublicSchema`
- `src/routes/user/user.route.ts` — usar `UserPublicSchema` nas respostas
- `src/routes/user/user.dao.ts` — remover campo `senha AS password` das queries de leitura

**Dependências:** Nenhuma.

---

### MUDANÇA-06 — Corrigir `GET /home/scale/{my_id}` para usar JWT

| Atributo | Valor |
|----------|-------|
| **Problema** | Qualquer usuário autenticado pode ver as escalas de outro membro apenas alterando o `my_id` na URL (IDOR). |
| **Causa** | O endpoint foi projetado recebendo o ID do membro pela URL em vez de extraí-lo do JWT já disponível. |
| **Referência** | INC-008, INC-018, PA-006 |
| **Prioridade** | ALTA |
| **Risco** | MÉDIO — quebra o contrato da rota (URL muda) |

**Solução:**

Renomear a rota de `GET /home/scale/{my_id}` para `GET /home/scale/me` e extrair o `idMembro` do JWT no handler.

```typescript
// home.route.ts — nova rota
export const getScale = createRoute({
  method: "get",
  path: "/home/scale/me",
  // sem params
  ...
});

// home.handler.ts — novo handler
export const getScaleHandler = async (c) => {
  const payload = c.get("jwtPayload");
  const idMembro = Number(payload.sub);
  const data = await homeDao.getScale(idMembro);
  return c.json(data, HttpStatusCode.OK);
};
```

**Arquivos afetados (backend):**
- `src/routes/home/home.route.ts` — mudar path e remover `MyIdParamSchema`
- `src/routes/home/home.handler.ts` — extrair `my_id` do JWT
- `src/routes/home/home.index.ts` — remover middleware de param (se houver)
- `src/schemas/home.schemas.ts` — `MyIdParamSchema` pode ser removido se não usado em outro lugar

**Dependências:** Nenhuma.

**Nota:** Esta mudança também resolve INC-017 (conflito de rota entre `{my_id}` e `day`), pois `day` já não concorreria com `me`.

---

### MUDANÇA-07 — Filtrar notificações por membro no `getReminder()`

| Atributo | Valor |
|----------|-------|
| **Problema** | `GET /alert/reminder` retorna todas as notificações do banco sem filtrar pelo usuário logado. |
| **Causa** | Query em `alert.dao.ts` não usa `WHERE id_membro_fk = $1`. |
| **Referência** | INC-026 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

1. Passar `idMembro` como parâmetro para `alertDao.getReminder(idMembro)`.
2. Atualizar a query para filtrar `WHERE id_membro_fk = $1`.
3. Extrair `idMembro` do JWT no handler.

```typescript
// alert.handler.ts
export const getReminderHandler = async (c) => {
  const payload = c.get("jwtPayload");
  const idMembro = Number(payload.sub);
  const data = await alertDao.getReminder(idMembro);
  return c.json(data, HttpStatusCode.OK);
};

// alert.dao.ts — query de notificações
pool.query(
  `SELECT id_notificacao::TEXT AS id_notification, titulo AS title, data AS date
   FROM notificacoes
   WHERE id_membro_fk = $1
   ORDER BY data`,
  [idMembro]
)
```

**Arquivos afetados (backend):**
- `src/routes/alert/alert.handler.ts`
- `src/routes/alert/alert.dao.ts`

**Dependências:** Nenhuma.

---

### MUDANÇA-08 — Renomear `id_escala` para `id_lembrete` nos schemas de alerta

| Atributo | Valor |
|----------|-------|
| **Problema** | `AlertItemSchema` e `ReminderDetailSchema` usam o campo `id_escala` para retornar o ID de um **lembrete**. O nome é semanticamente incorreto e confunde a integração. |
| **Causa** | Nome copiado de outro schema sem renomear. |
| **Referência** | INC-012 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO (frontend ainda não integrou este endpoint) |

**Solução:**

1. Renomear `id_escala` para `id_lembrete` em `AlertItemSchema` e `ReminderDetailSchema`.
2. Atualizar o DAO para retornar `id_lembrete` no alias SQL.

```typescript
// home.schemas.ts
export const AlertItemSchema = z.object({
  id_lembrete: z.string(), // era id_escala
  name: z.string(),
  date: z.string(),
  functions: z.array(z.string()),
});

// alert.dao.ts
pool.query(`SELECT l.id_lembrete::TEXT AS id_lembrete, ...`)
```

**Arquivos afetados (backend):**
- `src/schemas/home.schemas.ts`
- `src/routes/alert/alert.dao.ts`

**Dependências:** Nenhuma.

---

### MUDANÇA-09 — Corrigir `forgotPassword` para ser endpoint público

| Atributo | Valor |
|----------|-------|
| **Problema** | `/user/forgotPassword` está protegido por `authMiddleware`. O usuário não pode trocar senha sem estar logado, o que é inviável no fluxo de "esqueci minha senha". |
| **Causa** | Endpoint foi projetado para uso autenticado, mas o nome implica uso público. |
| **Referência** | INC-019, PA-004 |
| **Prioridade** | ALTA |
| **Risco** | MÉDIO — mudança de política de segurança |

**Solução:**

Esta mudança depende da decisão DR-003 (fluxo de recuperação de senha). Até a decisão ser tomada, a correção mínima é:

**Opção mínima (sem fluxo completo):**
- Remover `authMiddleware` do endpoint `forgotPassword` no `user.index.ts`.
- O endpoint passa a identificar o usuário pelo `email` (substituir `id_member` por `email` no schema).

```typescript
// ForgotPasswordSchema — opção mínima
export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(60),
});
```

**Arquivos afetados (backend):**
- `src/routes/user/user.index.ts` — remover `authMiddleware` do `forgotPassword`
- `src/schemas/user.schemas.ts` — alterar `ForgotPasswordSchema`
- `src/routes/user/user.dao.ts` — alterar query para usar `email` em vez de `id_member`
- `src/routes/user/user.handler.ts` — ajustar

**Dependências:** DR-003 (decisão sobre fluxo completo).

---

### MUDANÇA-10 — Consolidar geração de JWT (remover `auth.jwt.ts` duplicado)

| Atributo | Valor |
|----------|-------|
| **Problema** | `auth.jwt.ts` define `createAccessToken()` com expiração de 15min, nunca importado. `auth.service.ts` gera JWT diretamente com 1h. Duas implementações conflitantes. |
| **Causa** | Arquivo criado mas nunca integrado ao serviço. |
| **Referência** | INC-010, PA-005 |
| **Prioridade** | MÉDIA |
| **Risco** | BAIXO |

**Solução:**

1. Mover a lógica de geração de JWT de `auth.service.ts` para `auth.jwt.ts`.
2. Definir expiração como variável de ambiente ou constante.
3. Importar `createAccessToken` em `auth.service.ts`.

```typescript
// auth.jwt.ts (unificado)
export async function createAccessToken(payload: {
  sub: string;
  email: string;
  role: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}
```

**Arquivos afetados (backend):**
- `src/routes/auth/auth.jwt.ts` — reescrever para ser a única fonte de criação de JWT
- `src/routes/auth/auth.service.ts` — usar `createAccessToken()` do `auth.jwt.ts`

**Dependências:** Nenhuma.

---

## FASE 3 — TELA PERFIL (user.tsx)

---

### MUDANÇA-11 — Integrar `GET /user/me` na tela de perfil

| Atributo | Valor |
|----------|-------|
| **Problema** | A tela `user.tsx` exibe dados hardcoded (nome, foto, funções, equipes, info). O endpoint `GET /user/me` existe e retorna todos esses dados. |
| **Causa** | Tela nunca foi integrada — está em estado de protótipo visual. |
| **Referência** | INC-021 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

1. Criar `src/services/user.ts` (ou expandir `users.ts`) com função `getMe()`.
2. Usar `useQuery` do TanStack Query para buscar dados.
3. Substituir dados hardcoded pelos dados da API.
4. Tratar estados de loading e erro.

```typescript
// src/services/user.ts
export async function getMe() {
  const response = await api.get('/user/me');
  return response.data; // MeSchema
}
```

**Campos a conectar:**
- `nome` → `<Text>{me.nome}</Text>`
- `data_registro` → formatar para `DD/MM/AAAA`
- `funcoes[]` → renderizar `RoleTag` para cada função
- `equipes[]` → renderizar componente `Team`
- `email`, `telefone`, `data_nascimento`, `logradouro` → componente `Info`

**Arquivos afetados (frontend):**
- `src/services/user.ts` — criar/expandir com `getMe()`
- `src/app/(tabs)/user.tsx` — integrar com useQuery
- `src/components/user/info.tsx` — adaptar props para dados da API

**Dependências:** MUDANÇA-01, MUDANÇA-02.

---

### MUDANÇA-12 — Conectar botões de edição aos endpoints PATCH

| Atributo | Valor |
|----------|-------|
| **Problema** | Os botões de editar (email, senha, endereço, data de nascimento, telefone) no componente `Info` são TouchableOpacity sem ação. |
| **Causa** | Componentes visuais criados sem lógica de edição. |
| **Referência** | INC-021 |
| **Prioridade** | MÉDIA |
| **Risco** | BAIXO |

**Solução:**

Para cada campo editável, implementar um modal ou navegação para uma tela de edição que:
1. Mostra o valor atual
2. Permite editar
3. Chama o endpoint PATCH correspondente
4. Invalida o cache do `useQuery` de `getMe()` após sucesso

Endpoints a conectar:
- `PATCH /user/alterEmail` — `{ id_member, email }`
- `PATCH /user/forgotPassword` — após MUDANÇA-09
- `PATCH /user/alterLogradouro` — depende de MUDANÇA-20 (criar logradouro)
- `PATCH /user/alterBirthday` — `{ id_member, birth_date }` em MM-DD-YYYY
- `PATCH /user/alterTelephone` — `{ id_member, telephone }`

**Nota sobre `id_member`:** Os endpoints PATCH recebem `id_member` no body. O frontend precisará saber o `id_membro` do usuário logado — isso virá da resposta de `GET /user/me`.

**Arquivos afetados (frontend):**
- `src/components/user/info.tsx` — adicionar handlers de edição
- `src/services/user.ts` — adicionar funções para cada PATCH
- `src/app/(tabs)/user.tsx` — gerenciar estados de edição

**Dependências:** MUDANÇA-11.

---

## FASE 4 — TELA HOME (index.tsx)

---

### MUDANÇA-13 — Integrar calendário com escalas do mês

| Atributo | Valor |
|----------|-------|
| **Problema** | O calendário em `index.tsx` tem `compromissos` hardcoded com uma data fixa. Deveria buscar as datas com escalas do mês via API. |
| **Causa** | Tela não integrada. |
| **Referência** | INC-025 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

1. Criar `src/services/home.ts` com função `getMonth(mes: string)`.
2. Mapear o mês atual (e mês selecionado no calendário) para o formato `"novembro"`.
3. Usar `useQuery` para buscar as datas.
4. Converter `dia: "DD/MM/YYYY"` para formato `"YYYY-MM-DD"` para o calendário.
5. Passar as datas como `compromissos` para o `<Calendar />`.

```typescript
// src/services/home.ts
export async function getMonth(mes: string) {
  const response = await api.get(`/home/month/${mes}`);
  return response.data; // MonthSchema: { id_escala, dia }[]
}
```

**Arquivos afetados (frontend):**
- `src/services/home.ts` — criar com `getMonth()`
- `src/app/(tabs)/index.tsx` — integrar com useQuery
- `src/components/calendar.tsx` — verificar se `compromissos.scaleId` é usado (atualmente é `number`, API retorna `string`)

**Dependências:** MUDANÇA-01, MUDANÇA-02.

**Nota adicional:** O tipo `Compromissos.scaleId` no componente `calendar.tsx` é `number`, mas a API retorna `id_escala: string`. Precisará de ajuste de tipo.

---

### MUDANÇA-14 — Integrar escalas do dia selecionado

| Atributo | Valor |
|----------|-------|
| **Problema** | Ao clicar em um dia no calendário, a seção de escalas deveria mostrar as escalas daquele dia, mas usa dados mockados. |
| **Causa** | Tela não integrada. |
| **Referência** | INC-025 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

1. Adicionar `getScaleDay(day: string)` em `src/services/home.ts`.
2. O parâmetro `day` da API é `DDMMYYYY` — converter de `YYYY-MM-DD` (formato do calendário).
3. Usar `useQuery` com a data selecionada como chave.
4. Mapear `ScaleDayItemSchema` para props do componente `<Scales />`.

**Mapeamento de campos:**
- `nome_escala` → `title`
- `data_hora` → parse para `ScaleDate { Day, Month, WeekDay, hour }`
- `img_id[]` → `Persons` (URLs ou placeholders)
- `confirmados` → `status.confirmed`
- `quant_music` → `status.songs`

**Arquivos afetados (frontend):**
- `src/services/home.ts` — adicionar `getScaleDay()`
- `src/app/(tabs)/index.tsx` — substituir mock de escalas do dia
- `src/types/scales.type.tsx` — possivelmente expandir tipos

**Dependências:** MUDANÇA-13.

---

### MUDANÇA-15 — Integrar "Minhas Escalas"

| Atributo | Valor |
|----------|-------|
| **Problema** | Seção "Minhas Escalas" na Home usa dados mockados. |
| **Causa** | Tela não integrada. |
| **Referência** | INC-025 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

1. Adicionar `getMyScales()` em `src/services/home.ts` — chamará `GET /home/scale/me` (após MUDANÇA-06).
2. Mapear `ScaleItemSchema` para props do componente `<Scales />`.

**Mapeamento de campos:**
- `title_scale` → `title`
- `data_hora` → `ScaleDate`
- `img_id[]` → `Persons`
- `confirmados` → `status.confirmed`
- `quant_music` → `status.songs`
- `funcao` → exibir no card como papel do membro logado

**Arquivos afetados (frontend):**
- `src/services/home.ts` — adicionar `getMyScales()`
- `src/app/(tabs)/index.tsx` — integrar

**Dependências:** MUDANÇA-06, MUDANÇA-13.

---

### MUDANÇA-16 — Integrar seção de indisponibilidades

| Atributo | Valor |
|----------|-------|
| **Problema** | A seção "Indisponibilidades" na Home usa dados hardcoded de um membro fictício. |
| **Causa** | Tela não integrada. |
| **Referência** | INC-025 |
| **Prioridade** | MÉDIA |
| **Risco** | BAIXO |

**Solução:**

1. Adicionar `getUnavailability(mes: string)` em `src/services/home.ts`.
2. Mapear `UnavailabilityItemSchema` para props do componente `<Outages />`.

**Mapeamento de campos:**
- `nome` → `title`
- `dia` → `subTitle`
- `funcao` → `memberRole`
- `img_id` → `img` (URL ou placeholder)
- `id_escala` → para navegar para `/scale/{id}`

**Arquivos afetados (frontend):**
- `src/services/home.ts` — adicionar `getUnavailability()`
- `src/app/(tabs)/index.tsx` — integrar
- `src/components/home/outages.tsx` — avaliar se precisar de ajuste de props

**Dependências:** MUDANÇA-13.

---

## FASE 5 — TELA AVISOS (warnings.tsx + avisos/[id].tsx)

---

### MUDANÇA-17 — Integrar lista de avisos

| Atributo | Valor |
|----------|-------|
| **Problema** | A tela `warnings.tsx` usa `AlertCard` e `Notice` com dados hardcoded. |
| **Causa** | Tela não integrada. |
| **Referência** | INC-027 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

1. Criar `src/services/alerts.ts` com função `getReminder()`.
2. Usar `useQuery` para buscar dados.
3. Mapear `AlertItemSchema` para props de `<AlertCard />`:
   - `name` → `title`
   - `date` → `subTitle`
   - `functions.join(", ")` → `targetGroup`
   - `id_lembrete` → para navegação (após MUDANÇA-08)
4. Mapear `NotificationItemSchema` para props de `<Notice />`:
   - `title` → `title`
   - `date` → `subTitle`

**Arquivos afetados (frontend):**
- `src/services/alerts.ts` — criar
- `src/app/(tabs)/warnings.tsx` — integrar com useQuery

**Dependências:** MUDANÇA-01, MUDANÇA-02, MUDANÇA-07, MUDANÇA-08.

---

### MUDANÇA-18 — Integrar detalhe de aviso e corrigir tipo `Aviso`

| Atributo | Valor |
|----------|-------|
| **Problema** | A tela `avisos/[id].tsx` usa tipo local `Aviso` com estrutura completamente diferente da API (`ReminderDetailSchema`). |
| **Causa** | Tipo criado para mock, nunca atualizado para refletir a API. |
| **Referência** | INC-013 |
| **Prioridade** | ALTA |
| **Risco** | MÉDIO — refatoração completa da tela |

**Solução:**

1. Criar função `getReminderDetail(id: string)` em `src/services/alerts.ts`.
2. Refatorar a tela `avisos/[id].tsx`:
   - Ler `id` com `useLocalSearchParams`
   - Usar `useQuery` para buscar dados
   - Adaptar o JSX para `ReminderDetailSchema`:
     - `name` → título do alerta
     - `date` → data formatada
     - `tempo` → hora (estava sendo hardcoded como "20:00")
     - `description` → corpo do aviso
     - `functions[]` → grupo alvo (substituir `persons`)
3. Atualizar ou remover o tipo `Aviso` em `src/types/avisos.type.tsx`.

**Campos que a API NÃO retorna e a tela exibia (com mock):**
- `persons[]` com foto e nome → não existe na API; a tela mostrará apenas o grupo de funções

**Arquivos afetados (frontend):**
- `src/services/alerts.ts` — adicionar `getReminderDetail()`
- `src/app/avisos/[id].tsx` — refatorar completamente
- `src/types/avisos.type.tsx` — atualizar/substituir tipo

**Dependências:** MUDANÇA-17.

---

## FASE 6 — TELA ESCALA (scale/[id].tsx)

---

### MUDANÇA-19 — Integrar cabeçalho e abas da escala

| Atributo | Valor |
|----------|-------|
| **Problema** | A tela `scale/[id].tsx` não lê o parâmetro `id` da rota. Todos os dados (título, data, abas) são hardcoded. |
| **Causa** | Tela em estado de protótipo visual. |
| **Referência** | INC-014 |
| **Prioridade** | ALTA |
| **Risco** | MÉDIO — múltiplas queries paralelas |

**Solução:**

1. Adicionar `useLocalSearchParams<{ id: string }>()` para ler o ID.
2. Criar `src/services/scales.ts` com funções:
   - `getScale(id: string)` → `GET /scale/{id}`
   - `getScaleInfo(id: string)` → `GET /scale/{id}/info`
   - `getScaleMusics(id: string)` → `GET /scale/{id}/musics`
   - `getScaleMembers(id: string)` → `GET /scale/{id}/members`
3. Usar `useQuery` em cada aba.
4. Substituir dados hardcoded pelos dados da API.

**Mapeamento do cabeçalho:**
- `ScaleDetailSchema.nome` → `styles.title`
- `ScaleDetailSchema.data` + `dia_da_semana` → `styles.subtitle`
- Comparar com data atual para exibir "Hoje"

**Mapeamento da aba Info (`ScaleInfoSchema`):**
- `membros_confirmados` → contagem no card
- `local` → endereço (resultado de MUDANÇA-22 ou placeholder)
- `indisponibilidades[]` → lista de `IndisponibilidadeItem`

**Mapeamento da aba Músicas (`ScaleMusicItemSchema[]`):**
- `nome`, `banda` → título e subtítulo
- `ordem` → "1ª", "2ª" etc.
- `tom` → "Tom: X"
- `id_music_escalas` + `id` da escala → para navegar para detalhe da música

**Mapeamento da aba Membros (`ScaleMemberItemSchema[]`):**
- `disponibilidade` → dividir em grupos "Confirmados", "Pendentes", "Indisponibilidades"
- `nome`, `funcao`, `image_id` → dados do item
- `id_membro_escala` → para o modal de substituição

**Arquivos afetados (frontend):**
- `src/services/scales.ts` — criar
- `src/app/scale/[id].tsx` — integrar completamente

**Dependências:** MUDANÇA-01, MUDANÇA-02.

---

### MUDANÇA-20 — Conectar modal "Sair da Escala" ao endpoint

| Atributo | Valor |
|----------|-------|
| **Problema** | O modal "Sair da Escala" em `scale/[id].tsx` fecha sem fazer nenhuma chamada à API. |
| **Causa** | Modal implementado visualmente sem lógica. |
| **Referência** | INC-014 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

Ao confirmar no modal, chamar `POST /scale/sair` com `{ id_escala: string }`:

```typescript
async function handleLeaveScale() {
  await api.post('/scale/sair', { id_escala: id });
  queryClient.invalidateQueries({ queryKey: ['scale', id, 'info'] });
  setLeaveModalVisible(false);
}
```

**Arquivos afetados (frontend):**
- `src/app/scale/[id].tsx` — conectar modal
- `src/services/scales.ts` — adicionar `sairDaEscala()`

**Dependências:** MUDANÇA-19.

---

### MUDANÇA-21 — Conectar modal "Substituir Membro" ao endpoint

| Atributo | Valor |
|----------|-------|
| **Problema** | O modal de substituição fecha sem fazer nenhuma chamada à API. |
| **Causa** | Modal implementado visualmente sem lógica. |
| **Referência** | INC-014 |
| **Prioridade** | ALTA |
| **Risco** | BAIXO |

**Solução:**

Ao confirmar, chamar `POST /scale/substituir` com `{ id_membro_escala: string }`:

```typescript
async function handleSubstituir(idMembroEscala: string) {
  await api.post('/scale/substituir', { id_membro_escala: idMembroEscala });
  queryClient.invalidateQueries({ queryKey: ['scale', id, 'members'] });
  setSubstituteData(null);
}
```

O `id_membro_escala` precisa vir do item da lista de membros (campo `id_membro_escala` de `ScaleMemberItemSchema`). O modal atual recebe apenas `name` e `role` — precisará receber também o `id_membro_escala`.

**Arquivos afetados (frontend):**
- `src/app/scale/[id].tsx` — conectar modal, expandir dados passados para o modal
- `src/services/scales.ts` — adicionar `substituirMembro()`

**Dependências:** MUDANÇA-19.

---

## FASE 7 — TELA MÚSICA (music/[id].tsx)

---

### MUDANÇA-22 — Corrigir roteamento da tela de música e integrar

| Atributo | Valor |
|----------|-------|
| **Problema** | A rota `/music/[id]` usa apenas um parâmetro, mas o endpoint `GET /scale/{id}/music/{id_music_escalas}` precisa de dois. A tela não lê nenhum parâmetro e usa dados hardcoded. |
| **Causa** | Inconsistência de design entre frontend e backend. |
| **Referência** | INC-015, INC-016, DR-001 |
| **Prioridade** | ALTA |
| **Risco** | ALTO — mudança de estrutura de rota |

**Solução (recomendada — opção B do DR-001):**

Criar um novo endpoint no backend `GET /music/{id_music_escalas}` que não depende do `scale_id`:

```typescript
// scale.route.ts — novo endpoint
export const getMusicByEscalaId = createRoute({
  method: "get",
  path: "/music/{id_music_escalas}",
  ...
});

// scale.dao.ts — nova query
async getMusicByEscalaId(idMusicEscalas: string) {
  const result = await pool.query(
    `SELECT ... FROM musicas_escalas me JOIN musicas m ON ...
     WHERE me.id_musica_escala = $1`,
    [idMusicEscalas]
  );
  ...
}
```

Isso mantém a rota do frontend `/music/[id]` onde `id` é o `id_music_escalas`.

A navegação em `scale/[id].tsx` já passa `router.push("/music/123")` — bastará usar o `id_music_escalas` real em vez de `123`.

**Arquivos afetados (backend):**
- `src/routes/scale/scale.route.ts` — adicionar nova rota
- `src/routes/scale/scale.handler.ts` — adicionar handler
- `src/routes/scale/scale.dao.ts` — adicionar query
- `src/routes/scale/scale.index.ts` — registrar nova rota

**Arquivos afetados (frontend):**
- `src/app/music/[id].tsx` — integrar com `useLocalSearchParams` + `useQuery`
- `src/services/scales.ts` — adicionar `getMusicDetail(id_music_escalas)`

**Dependências:** MUDANÇA-19.

---

## FASE 8 — BANCO DE DADOS

> Mudanças no banco requerem migrations e são irreversíveis sem backup.

---

### MUDANÇA-23 — Adicionar campo `local` na tabela `escalas`

| Atributo | Valor |
|----------|-------|
| **Problema** | Escalas não têm campo para registrar o local do evento. O backend usa workaround com endereço de membro. |
| **Causa** | Ausência do campo no modelo. |
| **Referência** | PB-001, PB-007, DR-005 |
| **Prioridade** | MÉDIA |
| **Risco** | BAIXO (ADD COLUMN com NULL permitido é não-destrutivo) |

**Solução (opção A do DR-005):**

```sql
ALTER TABLE escalas
ADD COLUMN local VARCHAR(255);
```

Após: atualizar `scale.dao.ts → getScaleInfo()` para usar `e.local` em vez de concatenar logradouro de membro.

**Arquivos afetados:**
- `saint-scale-api/src/db/tcc.sql` — adicionar coluna à definição da tabela
- `src/routes/scale/scale.dao.ts` — atualizar `getScaleInfo()`
- `src/schemas/scale.schemas.ts` — `ScaleInfoSchema.local` já existe, apenas muda a fonte

**Dependências:** Nenhuma.

---

### MUDANÇA-24 — Corrigir tipos de `musicas_escalas.ordem` e `musicas_escalas.tom`

| Atributo | Valor |
|----------|-------|
| **Problema** | `ordem` é `CHAR(4)` mas usado como inteiro. `tom` é `CHAR(4)` mas notações como `C#m` têm mais de 4 chars. |
| **Causa** | Tipos escolhidos de forma imprecisa no design inicial. |
| **Referência** | INC-023, PB-002, PB-003 |
| **Prioridade** | BAIXA |
| **Risco** | MÉDIO — ALTER COLUMN pode falhar se houver dados incompatíveis |

**Solução:**

```sql
ALTER TABLE musicas_escalas
  ALTER COLUMN ordem TYPE INTEGER USING ordem::INTEGER,
  ALTER COLUMN tom TYPE VARCHAR(10);

ALTER TABLE musicas
  ALTER COLUMN tom TYPE VARCHAR(10);
```

Após: remover os casts `::INT` nas queries do DAO (já que a coluna será INTEGER).

**Arquivos afetados:**
- `saint-scale-api/src/db/tcc.sql`
- `src/routes/scale/scale.dao.ts` — remover cast `COALESCE(me.ordem, '0')::INT`
- `src/routes/home/home.dao.ts` — verificar se usa `ordem`

**Dependências:** Nenhuma.

---

### MUDANÇA-25 — Corrigir tipo de `musicas.bpm`

| Atributo | Valor |
|----------|-------|
| **Problema** | `bpm` armazenado como `CHAR(3)` em vez de `SMALLINT`. |
| **Causa** | Tipo impreciso no design inicial. |
| **Referência** | INC-024, PB-004 |
| **Prioridade** | BAIXA |
| **Risco** | MÉDIO |

**Solução:**

```sql
ALTER TABLE musicas
  ALTER COLUMN bpm TYPE SMALLINT USING bpm::SMALLINT;
```

Após: ajustar o schema da API (`bpm: z.string()` → `z.number().int()`) e o DAO.

**Arquivos afetados:**
- `saint-scale-api/src/db/tcc.sql`
- `src/schemas/scale.schemas.ts` — alterar tipo de `bpm`
- `src/routes/scale/scale.dao.ts` — remover cast se necessário

**Dependências:** Nenhuma.

---

### MUDANÇA-26 — Adicionar campo `conteudo` em `notificacoes`

| Atributo | Valor |
|----------|-------|
| **Problema** | A tabela `notificacoes` tem apenas `titulo` e `data`. Não tem corpo/conteúdo da notificação. |
| **Causa** | Modelo incompleto. |
| **Referência** | PB-006 |
| **Prioridade** | BAIXA |
| **Risco** | BAIXO (ADD COLUMN nullable) |

**Solução:**

```sql
ALTER TABLE notificacoes
ADD COLUMN conteudo TEXT;
```

Após: atualizar `alert.dao.ts` e schemas para incluir o campo na resposta.

**Arquivos afetados:**
- `saint-scale-api/src/db/tcc.sql`
- `src/routes/alert/alert.dao.ts`
- `src/schemas/home.schemas.ts` — adicionar `conteudo` em `NotificationItemSchema`

**Dependências:** Nenhuma.

---

## FASE 9 — FUNCIONALIDADES AUSENTES

---

### MUDANÇA-27 — Implementar tela `forgotPassword.tsx`

| Atributo | Valor |
|----------|-------|
| **Problema** | A tela é um stub com apenas um `<Text>`. |
| **Causa** | Não implementada. |
| **Referência** | INC-019 |
| **Prioridade** | MÉDIA |
| **Risco** | BAIXO |

**Solução:**

Após decisão do DR-003 e implementação da MUDANÇA-09, criar tela com:
1. Campo de email
2. Campo de nova senha
3. Campo de confirmar senha
4. Botão que chama `PATCH /user/forgotPassword`

**Arquivos afetados (frontend):**
- `src/app/auth/forgotPassword.tsx` — implementar

**Dependências:** MUDANÇA-09 (DR-003).

---

### MUDANÇA-28 — Implementar criação/edição de logradouro

| Atributo | Valor |
|----------|-------|
| **Problema** | O endpoint `PATCH /user/alterLogradouro` recebe um `id_logradouro` existente, mas não existe endpoint para criar um novo logradouro. |
| **Causa** | Funcionalidade incompleta no backend. |
| **Referência** | INC-020 |
| **Prioridade** | MÉDIA |
| **Risco** | BAIXO |

**Solução (backend):**

Criar endpoint `POST /logradouro` com schema `{ rua: string, numero: number }`:
1. Insere novo logradouro
2. Atualiza automaticamente `id_logradouro_fk` do membro logado
3. Retorna o logradouro criado

Ou simplificar: transformar `alterLogradouro` para receber `{ rua, numero }` em vez de `id_logradouro`, gerenciando o upsert internamente.

**Arquivos afetados (backend):**
- `src/routes/user/user.route.ts` — novo endpoint ou refatorar `alterLogradouro`
- `src/routes/user/user.handler.ts`
- `src/routes/user/user.dao.ts`
- `src/schemas/user.schemas.ts`

**Dependências:** Nenhuma.

---

### MUDANÇA-29 — Corrigir formato de data de nascimento na API (DR-002)

| Atributo | Valor |
|----------|-------|
| **Problema** | Formato `MM-DD-YYYY` é americano e não intuitivo. Toda a cadeia frontend → API → banco usa transformações implícitas frágeis. |
| **Causa** | Decisão de formato não revisada. |
| **Referência** | INC-009, DR-002 |
| **Prioridade** | MÉDIA |
| **Risco** | ALTO — impacta toda a cadeia de datas |

**Solução recomendada (ISO `YYYY-MM-DD`):**

1. Alterar `birthDateSchema` no backend para aceitar `YYYY-MM-DD`.
2. Remover transformação de `MM-DD-YYYY` para `YYYY-MM-DD` no DAO.
3. Manter conversão de `Date` → string apenas uma vez no DAO usando `.toISOString().split('T')[0]`.
4. Atualizar frontend: `services/users.ts` para converter `DD/MM/YYYY` → `YYYY-MM-DD`.
5. Na tela de exibição, converter `YYYY-MM-DD` → `DD/MM/YYYY` para o usuário.

**Arquivos afetados (backend):**
- `src/schemas/user.schemas.ts` — alterar `birthDateSchema`
- `src/routes/user/user.dao.ts` — simplificar `formatBirthDate()` e conversões de input

**Arquivos afetados (frontend):**
- `src/services/users.ts` — alterar conversão de data
- `src/app/(tabs)/user.tsx` — exibição formatada

**Dependências:** MUDANÇA-11, MUDANÇA-12.

---

### MUDANÇA-30 — Adicionar endpoint `POST /logradouro` para criar logradouro

> Ver MUDANÇA-28. Listado separadamente para clareza de escopo.

---

### MUDANÇA-31 — Criar serviço de notificações push (futuro)

| Atributo | Valor |
|----------|-------|
| **Problema** | As notificações são armazenadas no banco mas não há mecanismo de push notification. |
| **Causa** | Funcionalidade não planejada no escopo atual. |
| **Referência** | PB-006 |
| **Prioridade** | BAIXA |
| **Risco** | ALTO |

**Nota:** Esta mudança requer integração com Expo Push Notifications ou Firebase Cloud Messaging. Fora do escopo atual, mas registrada para planejamento futuro.

---

### MUDANÇA-32 — Revisar e documentar decisões pendentes (DR-001 a DR-005)

| Atributo | Valor |
|----------|-------|
| **Problema** | 5 decisões de design precisam ser tomadas antes que certas mudanças sejam implementadas. |
| **Causa** | Ambiguidades identificadas na análise. |
| **Referência** | DR-001 a DR-005 |
| **Prioridade** | ALTA |
| **Risco** | N/A |

**Ações:**
- DR-001: Decidir roteamento da música → recomenda-se opção B (novo endpoint)
- DR-002: Decidir formato de data → recomenda-se ISO `YYYY-MM-DD`
- DR-003: Decidir fluxo de recuperação de senha → recomenda-se verificação por email
- DR-004: Decidir sobre `GET /api/user` → recomenda-se manter para uso administrativo futuro
- DR-005: Decidir local da escala → recomenda-se adicionar coluna `local` em `escalas`

---

## Tabela consolidada de mudanças

| # | Mudança | Fase | Prioridade | Risco | Depende de |
|---|---------|------|-----------|-------|-----------|
| 01 | Persistência de token | 1 | CRÍTICA | BAIXO | — |
| 02 | Interceptor Axios | 1 | CRÍTICA | BAIXO | 01 |
| 03 | Senha mínima no frontend | 1 | ALTA | BAIXO | — |
| 04 | Logout | 1 | ALTA | BAIXO | 01 |
| 05 | Remover password das respostas | 2 | ALTA | BAIXO | — |
| 06 | /home/scale/{my_id} → /me | 2 | ALTA | MÉDIO | — |
| 07 | Filtrar notificações por membro | 2 | ALTA | BAIXO | — |
| 08 | Renomear id_escala → id_lembrete | 2 | ALTA | BAIXO | — |
| 09 | forgotPassword público | 2 | ALTA | MÉDIO | DR-003 |
| 10 | Consolidar JWT em auth.jwt.ts | 2 | MÉDIA | BAIXO | — |
| 11 | Integrar GET /user/me | 3 | ALTA | BAIXO | 01, 02 |
| 12 | Conectar PATCHes de edição | 3 | MÉDIA | BAIXO | 11 |
| 13 | Calendário com dados reais | 4 | ALTA | BAIXO | 01, 02 |
| 14 | Escalas do dia | 4 | ALTA | BAIXO | 13 |
| 15 | Minhas Escalas | 4 | ALTA | BAIXO | 06, 13 |
| 16 | Indisponibilidades | 4 | MÉDIA | BAIXO | 13 |
| 17 | Lista de avisos | 5 | ALTA | BAIXO | 01, 02, 07, 08 |
| 18 | Detalhe de aviso (refatorar) | 5 | ALTA | MÉDIO | 17 |
| 19 | Integrar escala (todas as abas) | 6 | ALTA | MÉDIO | 01, 02 |
| 20 | Modal "Sair da Escala" | 6 | ALTA | BAIXO | 19 |
| 21 | Modal "Substituir Membro" | 6 | ALTA | BAIXO | 19 |
| 22 | Rota e integração de música | 7 | ALTA | ALTO | 19 |
| 23 | Coluna `local` em `escalas` | 8 | MÉDIA | BAIXO | DR-005 |
| 24 | Tipos de `ordem` e `tom` | 8 | BAIXA | MÉDIO | — |
| 25 | Tipo de `bpm` | 8 | BAIXA | MÉDIO | — |
| 26 | Coluna `conteudo` em notificações | 8 | BAIXA | BAIXO | — |
| 27 | Tela forgotPassword | 9 | MÉDIA | BAIXO | 09 |
| 28 | Criar logradouro | 9 | MÉDIA | BAIXO | — |
| 29 | Formato de data ISO | 9 | MÉDIA | ALTO | 11, 12 |
| 30 | Endpoint POST /logradouro | 9 | MÉDIA | BAIXO | — |
| 31 | Notificações push | 9 | BAIXA | ALTO | — |
| 32 | Revisão das decisões DR | — | ALTA | N/A | — |
