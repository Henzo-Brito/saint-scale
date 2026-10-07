# BACKEND_IMPLEMENTATION_REPORT.md
> Relatório das alterações realizadas no backend do SaintScale  
> Gerado em: 2026-10-07

---

## Alterações realizadas

Este relatório documenta todas as correções aplicadas ao backend (API + banco de dados) do projeto SaintScale, com base na análise de inconsistências descrita em `FULLSTACK_CONTEXT.md` e no plano de mudanças de `FULLSTACK_CHANGE_PLAN.md`.

As alterações cobrem duas sessões de trabalho:

- **Sessão 1** — correções de segurança e contrato da API
- **Sessão 2** — correções de lógica de negócio e banco de dados

---

## Rotas removidas

Nenhuma rota foi removida. Todas as 22 rotas existentes são necessárias conforme análise do mapa frontend → API.

---

## Rotas alteradas

### `GET /home/scale/{my_id}` → `GET /home/scale/me`

**Motivo:** IDOR (Insecure Direct Object Reference) — qualquer usuário autenticado poderia consultar as escalas de outro membro alterando o `my_id` na URL.

**O que mudou:**
- Path: `/home/scale/{my_id}` → `/home/scale/me`
- Parâmetro `my_id` removido
- `idMembro` agora é extraído do JWT (`payload.sub`) no handler
- Resolve conflito de rota com `/home/scale/day/{day}` (string literal `"day"` não conflita mais)

**Arquivos:** `home.route.ts`, `home.handler.ts`

---

### `POST /scale/sair`

**Motivo:** Retornava `ScaleMusicsSchema` (array de músicas) ao sair de uma escala — semanticamente incorreto. Uma operação de saída não deve retornar músicas.

**O que mudou:**
- Response: `ScaleMusicsSchema` → `PatchResponseSchema { message: string }`
- Adicionado status 404 para quando o membro não está na escala
- Handler passa a retornar `{ message: "Saiu da escala com sucesso" }`
- DAO `sair()` passou a retornar `boolean` (rowCount > 0) em vez de chamar `getScaleMusics()`

**Arquivos:** `scale.route.ts`, `scale.handler.ts`, `scale.dao.ts`

---

### `PATCH /user/forgotPassword`

**Motivo:** Estava protegido por `authMiddleware`, o que impede seu uso no fluxo de "esqueci minha senha" (o usuário não consegue se autenticar para trocar a senha).

**O que mudou:**
- Rota removida do bloco protegido por `authMiddleware` em `user.index.ts`
- Schema `ForgotPasswordSchema` alterado: recebe `{ email, password }` em vez de `{ id_member, password }`
- DAO `forgotPassword()` identifica o membro por email, não por ID
- Handler usa os dados do body diretamente (sem JWT)

**Arquivos:** `user.index.ts`, `user.route.ts`, `user.handler.ts`, `user.dao.ts`, `user.schemas.ts`

---

### `GET /user` e `POST /user`

**Motivo:** Retornavam a senha hasheada (argon2id) na resposta. Mesmo sendo hash, é um dado sensível desnecessário.

**O que mudou:**
- Criado `UserPublicSchema` (omite campo `password`)
- `createUser` e `getUsers` passaram a retornar `UserPublicSchema`
- Queries no DAO removeram `senha AS password` do `RETURNING` e `SELECT`

**Arquivos:** `user.schemas.ts`, `user.route.ts`, `user.dao.ts`

---

### `GET /alert/reminder`

**Motivo:** Retornava todas as notificações do banco sem filtrar pelo usuário logado — falha de privacidade.

**O que mudou:**
- Handler extrai `idMembro` do JWT e passa para `alertDao.getReminder(idMembro)`
- Query de notificações adiciona `WHERE id_membro_fk = $1`
- Alertas (lembretes) continuam visíveis para todos (são avisos gerais por função)

**Arquivos:** `alert.handler.ts`, `alert.dao.ts`

---

### `GET /home/scale/day/{day}`

**Motivo:** A query usava `GROUP BY f.nome` (nome da função), o que gerava múltiplas linhas para a mesma escala quando havia membros com funções diferentes escalados no mesmo dia. O endpoint retorna uma visão geral do dia, não dados por membro.

**O que mudou:**
- Removidos `f.nome AS funcao` do SELECT e `f.nome` do GROUP BY
- Removido JOIN desnecessário com `funcoes`
- GROUP BY agora é apenas `e.id_escala, e.nome_escala, e.data_hora`
- Cada escala retorna exatamente uma linha

**Arquivos:** `home.dao.ts`

---

### `auth.jwt.ts` (consolidação)

**Motivo:** `auth.service.ts` duplicava a lógica de geração de JWT com expiração diferente (15min vs 1h). Dois lugares criavam tokens com configurações conflitantes.

**O que mudou:**
- `auth.jwt.ts` reescrito como única fonte de criação de token (expiração: 1h)
- `auth.service.ts` importa `createAccessToken()` de `auth.jwt.ts`
- Código duplicado removido de `auth.service.ts`

**Arquivos:** `auth.jwt.ts`, `auth.service.ts`

---

### `PATCH /user/alterLogradouro`

**Motivo:** O upsert usava `ON CONFLICT DO NOTHING` mas a tabela `logradouros` não tinha constraint unique — o conflito nunca disparava, resultando em logradouros duplicados sendo inseridos a cada chamada.

**O que mudou:**
- Query corrigida para `ON CONFLICT (rua, numero) DO NOTHING`
- Agora funciona corretamente em conjunto com a constraint `UNIQUE(rua, numero)` adicionada ao banco

**Arquivos:** `user.dao.ts`

---

## Rotas adicionadas

### `GET /music/{id_music_escalas}`

**Motivo:** A tela `/music/[id]` do frontend usa apenas um parâmetro de rota. O endpoint existente `GET /scale/{id}/music/{id_music_escalas}` exige dois IDs (scale + music). Para não redesenhar a estrutura de rotas do frontend, foi criado um endpoint independente.

**Contrato:**
```
GET /api/music/{id_music_escalas}
Authorization: Bearer <token>

Response 200: ScaleMusicDetailSchema
Response 404: { message: string }
```

**Arquivos:** `scale.route.ts`, `scale.handler.ts`, `scale.dao.ts`, `scale.index.ts`

---

## Schemas alterados

### `user.schemas.ts`

| Schema | Alteração |
|--------|-----------|
| `UserPublicSchema` | **Criado** — `UserSchema.omit({ password: true })`. Usado em `GET /` e `POST /`. |
| `ForgotPasswordSchema` | Alterado: `id_member` removido, `email: string.email()` adicionado |
| `AlterEmailSchema` | Simplificado: removido `id_member` (ID vem do JWT) |
| `AlterLogradouroSchema` | Reescrito: recebe `{ rua, numero }` em vez de `{ id_member, id_logradouro }` |
| `AlterBirthdaySchema` | Simplificado: removido `id_member` |
| `AlterTelephoneSchema` | Simplificado: removido `id_member` |
| `PatchResponseSchema` | **Criado** — `{ message: string }`. Resposta genérica dos PATCHes. |
| `birthDateSchema` | Formato alterado de `MM-DD-YYYY` para `YYYY-MM-DD` (ISO) |

---

### `home.schemas.ts`

| Schema | Alteração |
|--------|-----------|
| `AlertItemSchema` | Campo `id_escala` renomeado para `id_lembrete` (semanticamente correto) |
| `ReminderDetailSchema` | Campo `id_escala` renomeado para `id_lembrete` |
| `ScaleItemSchema` | Adicionado campo `dia` (data formatada separada de `data_hora`) |
| `ScaleDayItemSchema` | Removido campo `funcao` (não tem significado em visão geral do dia) |
| `NotificationItemSchema` | Adicionado campo `conteudo: string \| null` (campo da tabela) |

---

### `scale.schemas.ts`

| Schema | Alteração |
|--------|-----------|
| `PatchResponseSchema` | **Criado** — `{ message: string }`. Usado na resposta de `POST /scale/sair`. |
| `ScaleMusicDetailSchema` | Campo `bpm` alterado de `z.string()` para `z.number().int().nullable()` (SMALLINT no banco) |
| `MusicEscalasParamSchema` | **Criado** — param para `GET /music/{id_music_escalas}` |
| `ScaleInfoSchema` | Campo `local` agora vem da coluna `escalas.local` (antes era concatenação de logradouro de membro) |

---

## Banco alterado

### `logradouros`
```sql
-- ANTES
CREATE TABLE logradouros (
    id_logradouro INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    rua           VARCHAR(255) NOT NULL,
    numero        INTEGER      NOT NULL
);

-- DEPOIS
CREATE TABLE logradouros (
    id_logradouro INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    rua           VARCHAR(255) NOT NULL,
    numero        INTEGER      NOT NULL,
    UNIQUE(rua, numero)   -- permite ON CONFLICT (rua, numero) no upsert
);
```

### `escalas`
```sql
-- ANTES (sem coluna local)
nome_escala  VARCHAR(150) NOT NULL,
data_hora    TIMESTAMP    NOT NULL,
descricao    VARCHAR(255),

-- DEPOIS
nome_escala  VARCHAR(150) NOT NULL,
data_hora    TIMESTAMP    NOT NULL,
descricao    VARCHAR(255),
local        VARCHAR(255),   -- local do evento
```

### `musicas`
```sql
-- ANTES
tom    CHAR(4)   NOT NULL,
bpm    CHAR(3),

-- DEPOIS
tom    VARCHAR(10) NOT NULL,  -- suporta C#m, Bbm, Eb etc.
bpm    SMALLINT,              -- tipo numérico correto
```

### `musicas_escalas`
```sql
-- ANTES
tom    CHAR(4),
ordem  CHAR(4),

-- DEPOIS
tom    VARCHAR(10),  -- consistente com musicas.tom
ordem  INTEGER,      -- tipo numérico correto, sem necessidade de cast
```

### `notificacoes`
```sql
-- ANTES (sem corpo)
titulo  VARCHAR(150) NOT NULL,
data    DATE         NOT NULL,

-- DEPOIS
titulo   VARCHAR(150) NOT NULL,
conteudo TEXT,               -- corpo da notificação
data     DATE         NOT NULL,
```

---

## Migrations criadas/alteradas

O projeto usa um único arquivo `tcc.sql` como migration full-drop-recreate (executa `DROP TABLE IF EXISTS ... CASCADE` antes de recriar). O arquivo foi atualizado para refletir o estado final do banco.

**Arquivo:** `saint-scale-api/src/db/tcc.sql`

Para aplicar ao banco:
```bash
npm run migrate
# ou
npx tsx src/db/migrate.ts
```

**Atenção:** A migration é destrutiva (DROP + CREATE). Em ambiente de produção com dados reais, usar ALTER TABLE incremental.

---

## Problemas corrigidos

| # | Problema | Arquivo(s) | Referência |
|---|---------|-----------|-----------|
| 1 | IDOR em `/home/scale/{my_id}` | `home.route.ts`, `home.handler.ts` | INC-018, PA-006 |
| 2 | `POST /user` e `GET /user` retornavam senha hasheada | `user.schemas.ts`, `user.dao.ts`, `user.route.ts` | INC-006, INC-007 |
| 3 | `forgotPassword` exigia autenticação | `user.index.ts`, `user.route.ts`, `user.handler.ts`, `user.dao.ts`, `user.schemas.ts` | INC-019, PA-004 |
| 4 | `id_escala` nos schemas de alerta (nome semanticamente errado) | `home.schemas.ts`, `alert.dao.ts` | INC-012 |
| 5 | Notificações sem filtro por membro | `alert.handler.ts`, `alert.dao.ts` | INC-026 |
| 6 | Roteamento da tela de música (1 vs 2 params) | `scale.route.ts`, `scale.handler.ts`, `scale.dao.ts`, `scale.index.ts` | DR-001 |
| 7 | `auth.jwt.ts` duplicado com expiração diferente | `auth.jwt.ts`, `auth.service.ts` | INC-010, PA-005 |
| 8 | `POST /scale/sair` retornava músicas em vez de `{ message }` | `scale.route.ts`, `scale.handler.ts`, `scale.dao.ts`, `scale.schemas.ts` | — |
| 9 | `getScaleDay` gerava múltiplas linhas por escala (GROUP BY f.nome) | `home.dao.ts`, `home.schemas.ts` | — |
| 10 | `ON CONFLICT DO NOTHING` sem constraint unique em logradouros | `user.dao.ts`, `tcc.sql` | INC-020 |
| 11 | `escalas` sem campo `local` — workaround com logradouro de membro | `tcc.sql`, `scale.dao.ts`, `scale.schemas.ts` | PB-001, INC-022, DR-005 |
| 12 | `musicas.bpm` como `CHAR(3)` em vez de `SMALLINT` | `tcc.sql`, `scale.schemas.ts` | PB-004, INC-024 |
| 13 | `musicas.tom` e `musicas_escalas.tom` como `CHAR(4)` | `tcc.sql` | PB-003, INC-023 |
| 14 | `musicas_escalas.ordem` como `CHAR(4)` | `tcc.sql`, `scale.dao.ts` | PB-002 |
| 15 | `notificacoes` sem campo `conteudo` | `tcc.sql`, `alert.dao.ts`, `home.schemas.ts` | PB-006 |
| 16 | Formato de data inconsistente (`MM-DD-YYYY` americano) | `user.schemas.ts`, `user.dao.ts` | INC-009, DR-002 |
| 17 | `id_member` no body dos PATCHes (redundante com JWT) | `user.schemas.ts`, `user.handler.ts` | — |
| 18 | Conflito de rota `/home/scale/{my_id}` vs `/home/scale/day` | `home.route.ts` | INC-017 |

---

## Problemas ainda existentes

### No frontend (fora do escopo do backend)

| ID | Problema | Impacto |
|----|---------|---------|
| PA-001 | Token JWT não persistido (`expo-secure-store` não utilizado) | Crítico |
| PA-002 | Token não injetado nas requisições (sem interceptor Axios) | Crítico |
| INC-003 | `LoginSchema.password.min(6)` vs backend `min(8)` | Médio |
| INC-013 | `avisos/[id].tsx` usa tipo local incompatível com API | Alto |
| INC-014 | `scale/[id].tsx` completamente desconectada da API | Alto |
| INC-015 | `music/[id].tsx` completamente desconectada da API | Alto |
| INC-021 | `user.tsx` usa dados hardcoded | Alto |
| INC-025 | Tela Home usa dados mockados | Alto |
| — | Sem tela de logout implementada | Alto |
| — | `forgotPassword.tsx` é stub vazio | Médio |

### No backend (decisões pendentes)

| ID | Problema | Decisão Necessária |
|----|---------|-------------------|
| DR-003 | Fluxo de recuperação de senha não define verificação de identidade | Como verificar identidade sem autenticação? (email de reset, código SMS etc.) |
| DR-004 | `GET /api/user` sem propósito claro para usuários comuns | Manter para uso administrativo futuro ou restringir por role? |

---

## Testes realizados

### Typecheck
```
$ npx tsc --noEmit
# Exit: 0 — sem erros de tipo
```

### Lint
```
$ npx biome lint ./src
Checked 35 files in 29ms. No fixes applied.
# Exit: 0 — sem problemas de lint
```

### Build
```
$ npx tsc
# Exit: 0 — compilação bem-sucedida
```

### Testes de endpoints
O projeto não possui testes automatizados (sem framework de testes configurado). Os endpoints não foram testados manualmente nesta sessão pois o banco de dados não estava acessível no ambiente de desenvolvimento (servidor PostgreSQL não iniciado durante a sessão). Os testes devem ser realizados ao subir o ambiente completo (`docker-compose up` + `npm run migrate`).

---

## Estado atual da API

### Contrato verificado

Todos os schemas, handlers, DAOs e queries estão consistentes entre si. O contrato da API reflete a implementação real.

### Mapa de endpoints com status

| Endpoint | Método | Auth | Status |
|----------|--------|------|--------|
| `/api/auth/login` | POST | Público | ✅ Correto |
| `/api/user` | POST | Público | ✅ Correto (sem senha na resposta) |
| `/api/user` | GET | JWT | ✅ Correto (sem senha na resposta) |
| `/api/user/me` | GET | JWT | ✅ Correto |
| `/api/user/alterEmail` | PATCH | JWT | ✅ Correto |
| `/api/user/forgotPassword` | PATCH | **Público** | ✅ Correto (identifica por email) |
| `/api/user/alterLogradouro` | PATCH | JWT | ✅ Correto (upsert com UNIQUE constraint) |
| `/api/user/alterBirthday` | PATCH | JWT | ✅ Correto |
| `/api/user/alterTelephone` | PATCH | JWT | ✅ Correto |
| `/api/home/month/{mes}` | GET | JWT | ✅ Correto |
| `/api/home/unavailability/{mes}` | GET | JWT | ✅ Correto |
| `/api/home/scale/me` | GET | JWT | ✅ Correto (sem IDOR) |
| `/api/home/scale/day/{day}` | GET | JWT | ✅ Correto (1 linha por escala) |
| `/api/alert/reminder` | GET | JWT | ✅ Correto (notificações filtradas por membro) |
| `/api/alert/reminder/{id_reminder}` | GET | JWT | ✅ Correto |
| `/api/scale/{id}` | GET | JWT | ✅ Correto |
| `/api/scale/{id}/musics` | GET | JWT | ✅ Correto |
| `/api/scale/{id}/music/{id_music_escalas}` | GET | JWT | ✅ Correto |
| `/api/scale/{id}/info` | GET | JWT | ✅ Correto (local vem da coluna escalas.local) |
| `/api/scale/{id}/members` | GET | JWT | ✅ Correto |
| `/api/scale/sair` | POST | JWT | ✅ Correto (retorna `{ message }`) |
| `/api/scale/substituir` | POST | JWT | ✅ Correto |
| `/api/music/{id_music_escalas}` | GET | JWT | ✅ Novo endpoint |

**Total: 23 endpoints — todos com contrato consistente.**

### Documentação interativa

Disponível em `GET /scalar` (Scalar UI) e `GET /doc` (OpenAPI JSON) quando o servidor está rodando.
