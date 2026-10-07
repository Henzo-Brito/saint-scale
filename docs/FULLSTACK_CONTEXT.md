# FULLSTACK_CONTEXT.md
> Análise completa do sistema SaintScale — Frontend ↔ API ↔ Banco de Dados  
> Gerado em: 2026-10-07 | Atualizado em: 2026-10-07 (backend totalmente corrigido)

---

## Visão Geral

**SaintScale** é um aplicativo mobile (React Native / Expo) para gerenciamento de escalas de ministério de louvor em igrejas. Permite que membros visualizem suas escalas, músicas das escalas, informações de disponibilidade, recebam alertas e gerenciem seu perfil.

**Status geral:** O backend está completamente corrigido com contrato consistente. O banco de dados está alinhado com o backend. O frontend ainda usa dados mockados na maioria das telas — a integração real é a próxima fase de trabalho.

---

## Arquitetura

```
Frontend (React Native / Expo)
  expo-router (file-based routing)
  TanStack Query (cache/estados de servidor)
  Axios (HTTP)
  Zod (validação de schemas no cliente)
  expo-secure-store (armazenado, não utilizado)

        ↕ HTTP/JSON (REST)

Backend (Hono + Node.js via tsx)
  @hono/zod-openapi (roteamento tipado + OpenAPI)
  @scalar/hono-api-reference (documentação interativa)
  jose (JWT HS256)
  argon2 (hash de senhas)
  pg (PostgreSQL driver)
  stoker (helpers HTTP)

        ↕ SQL

Banco (PostgreSQL)
  14 tabelas
  1 enum (DISPONIBILIDADE)
  Relacionamentos via foreign keys
```

**Base URL da API (produção):** `https://saint-scale-api-1.onrender.com/api`  
**Porta local:** `3000`  
**Prefixo de todas as rotas:** `/api/`

---

## Frontend

### Tecnologias
- React Native 0.85.3 / React 19.2.3
- Expo SDK 56
- expo-router 56.2 (file-based routing com Typed Routes)
- TanStack Query v5 (instalado, usado apenas em auth/user)
- Axios v1.20
- Zod v4.4.3
- expo-secure-store (instalado, **não utilizado** — token não é persistido)

### Estrutura de Rotas (expo-router)

```
src/app/
  _layout.tsx           → Root layout (QueryClientProvider + Stack)
  (tabs)/
    _layout.tsx         → Tab bar com 3 abas (Início, Avisos, Usuário)
    index.tsx           → Tela Home
    warnings.tsx        → Tela Avisos
    user.tsx            → Tela Perfil do Usuário
  auth/
    index.tsx           → Onboarding (4 páginas de apresentação)
    login.tsx           → Tela de Login
    signUp.tsx          → Tela de Cadastro (2 páginas)
    forgotPassword.tsx  → Tela Esqueci Senha (STUB — apenas texto)
  scale/
    [id].tsx            → Detalhe de Escala (3 abas: info, músicas, membros)
  music/
    [id].tsx            → Detalhe de Música
  avisos/
    [id].tsx            → Detalhe de Aviso/Alerta
```

### Estado de integração por tela

| Tela | Chama API? | Dados reais? |
|------|-----------|--------------|
| `auth/index.tsx` | Não | Mock interno |
| `auth/login.tsx` | ✅ Sim | ✅ Real |
| `auth/signUp.tsx` | ✅ Sim | ✅ Real |
| `auth/forgotPassword.tsx` | Não | Stub vazio |
| `(tabs)/index.tsx` | Não | Mock hardcoded |
| `(tabs)/warnings.tsx` | Não | Mock hardcoded |
| `(tabs)/user.tsx` | Não | Mock hardcoded |
| `scale/[id].tsx` | Não | Mock hardcoded |
| `music/[id].tsx` | Não | Mock hardcoded |
| `avisos/[id].tsx` | Não | Mock hardcoded (array local) |

### Serviços implementados

```
src/services/
  api.ts      → Instância Axios. baseURL configurada. SEM interceptor de autenticação.
  auth.ts     → login() → POST /auth/login
  users.ts    → createUser() → POST /user
```

Apenas dois endpoints são realmente chamados pelo frontend hoje.

### Schemas Zod do frontend

```
src/schemas/
  auth.schemas.ts  → LoginSchema (senha min 6 — diverge do backend), LoginResponseSchema
  user.schemas.ts  → CreateUserSchema
```

### Tipos do frontend

```
src/types/
  scales.type.tsx  → Month (enum), WeekDay (enum), ScaleDate, Status
  person.type.tsx  → Person { idPerson, img, name, funcao }
  avisos.type.tsx  → Aviso { idAviso, title, desc, date, persons }
```

### Autenticação no frontend

- Login chama `POST /api/auth/login` e recebe `{ accessToken, tokenType }`.
- O token **não é armazenado** em nenhum lugar (nem `expo-secure-store`, nem `AsyncStorage`).
- O token **não é injetado** nos headers das requisições (sem interceptor Axios).
- Após login, o router faz `replace("/(tabs)")` — a sessão existe apenas enquanto o app está aberto e sem nenhum dado do usuário persistido.
- Todas as telas protegidas são acessíveis sem token porque nenhuma delas faz chamadas autenticadas ainda.

---

## Backend

### Tecnologias
- Hono 4.13 sobre Node.js (via tsx em desenvolvimento)
- @hono/zod-openapi — rotas tipadas com validação automática e geração de spec OpenAPI
- jose 6.2 — JWT HS256, expiração de 1 hora
- argon2id — hash de senhas
- pg 8.23 — driver PostgreSQL puro (pool de conexões)
- stoker — helpers de status HTTP e middlewares
- CORS configurável via variável `CORS_ORIGIN` (padrão: `http://localhost:8081`)

### Estrutura de rotas

```
/api/
  /auth/
    POST /login                            → Login, retorna JWT

  /user/
    POST /                                 → Criar usuário (público)
    GET /                                  → Listar todos os usuários (autenticado)
    GET /me                                → Perfil do usuário autenticado (JWT)
    PATCH /alterEmail                      → Alterar email (JWT)
    PATCH /forgotPassword                  → Alterar senha (PÚBLICO — identifica por email)
    PATCH /alterLogradouro                 → Alterar endereço (JWT, recebe rua+numero, faz upsert)
    PATCH /alterBirthday                   → Alterar data de nascimento (JWT)
    PATCH /alterTelephone                  → Alterar telefone (JWT)

  /home/month/{mes}                        → Escalas do mês (autenticado)
  /home/unavailability/{mes}               → Membros indisponíveis no mês (autenticado)
  /home/scale/me                           → Minhas escalas (autenticado, ID do JWT)
  /home/scale/day/{day}                    → Escalas de um dia (autenticado)

  /alert/reminder                          → Lista alertas + notificações do membro (autenticado)
  /alert/reminder/{id_reminder}            → Detalhe de um alerta (autenticado)

  /scale/{id}                              → Detalhes de uma escala (autenticado)
  /scale/{id}/musics                       → Músicas de uma escala (autenticado)
  /scale/{id}/music/{id_music_escalas}     → Detalhe de uma música (autenticado)
  /scale/{id}/info                         → Info resumida de escala (autenticado)
  /scale/{id}/members                      → Membros de uma escala (autenticado)
  POST /scale/sair                         → Sair da escala (marca como indisponível, JWT)
  POST /scale/substituir                   → Substituir membro na escala (JWT)
  GET /music/{id_music_escalas}            → Detalhe de música sem scale_id (autenticado)
```

Total: **22 endpoints**

### Scripts disponíveis

```json
"dev":       "tsx watch src/index.ts"
"build":     "tsc"
"typecheck": "tsc --noEmit"
"lint":      "biome lint --write ./src"
"format":    "biome format --write ./src"
"migrate":   "tsx src/db/migrate.ts"
"start":     "node dist/index.js"
```

### Autenticação no backend

- Middleware `authMiddleware` verifica header `Authorization: Bearer <token>`.
- Valida o JWT com `jose.jwtVerify()` usando `JWT_SECRET` do `.env`.
- Em caso de sucesso, injeta `jwtPayload` no contexto Hono.
- O `sub` do JWT contém o `id_membro` como string.
- Expiração: **1 hora**.
- `auth.jwt.ts` é a única fonte de geração de tokens — `auth.service.ts` importa `createAccessToken()` de lá.

---

## Banco de Dados

### Diagrama de tabelas

```
funcoes              (id_funcao, nome)
logradouros          (id_logradouro, rua, numero) — UNIQUE(rua, numero)
equipes              (id_equipes, img_id, title)
membros              (id_membro, nome, email, senha, img_id, cargo, data_nascimento,
                      telefone, id_logradouro_fk → logradouros, data_registro)
equipes_membros      (id_equipes_membros, id_membros_fk → membros, id_equipes_fk → equipes)
membros_funcoes      (id_membros_funcoes, id_membros_fk → membros, id_funcoes_fk → funcoes)
escalas              (id_escala, nome_escala, data_hora, descricao, local, data_registro)
musicas              (id_musica, nome, autor, tom VARCHAR(10), bpm SMALLINT,
                      link_spotify, link_youtube, link_cifra, link_letra, duracao, img_id)
musicas_escalas      (id_musica_escala, tom VARCHAR(10), ordem INTEGER,
                      id_escala_fk → escalas, id_musica_fk → musicas)
ENUM DISPONIBILIDADE ('indisponível', 'confirmado', 'pendente')
membros_escalas      (id_membro_escala, id_escala_fk → escalas, id_membro_fk → membros,
                      id_funcao_fk → funcoes, disponibilidade DISPONIBILIDADE, data_registro)
lembretes            (id_lembrete, nome, data DATE, tempo TIME, descricao, data_registro)
lembrete_funcoes     (id, id_lembrete_fk → lembretes, id_funcao_fk → funcoes)
notificacoes         (id_notificacao, id_membro_fk → membros, titulo, conteudo TEXT,
                      data DATE, data_registro)
```

### Tipos das colunas relevantes

| Coluna | Tipo SQL | Observação |
|--------|----------|------------|
| `musicas.tom` | `VARCHAR(10)` | Tom original da música — suporta notações como `C#m`, `Bbm` |
| `musicas.bpm` | `SMALLINT` | BPM numérico |
| `musicas.duracao` | `CHAR(8)` | Formato esperado: "MM:SS" |
| `musicas_escalas.tom` | `VARCHAR(10)` | Tom específico para a escala |
| `musicas_escalas.ordem` | `INTEGER` | Ordem numérica |
| `membros.telefone` | `VARCHAR(11)` | Apenas dígitos, sem máscara |
| `membros.cargo` | `VARCHAR(60)` | Default: `'membro'` |
| `escalas.data_hora` | `TIMESTAMP` | Sem timezone |
| `escalas.local` | `VARCHAR(255)` | Local do evento |
| `notificacoes.conteudo` | `TEXT` | Corpo da notificação |
| `lembretes.data` | `DATE` | Sem hora |
| `lembretes.tempo` | `TIME` | Separado da data |
| `logradouros` | — | UNIQUE(rua, numero) — evita duplicatas no upsert |

---

## Autenticação

### Fluxo completo atual

```
1. Usuário preenche email + senha na tela login.tsx
2. Frontend valida com LoginSchema (Zod) — mínimo 6 chars para senha  ← CONFLITO COM BACKEND
3. POST /api/auth/login com { email, password }
4. Backend valida com SignInSchema (Zod) — mínimo 8 chars para senha
5. Backend busca membro por email (auth.dao.ts)
6. Backend verifica senha com argon2.verify()
7. Backend gera JWT (sub = id_membro, email, role; exp = 1h)
8. Frontend recebe { accessToken, tokenType: "Bearer" }
9. Frontend valida resposta com LoginResponseSchema (Zod) ✅
10. Frontend faz router.replace("/(tabs)")
11. Token NÃO é armazenado ← PROBLEMA CRÍTICO
12. Token NÃO é enviado nas requisições seguintes ← PROBLEMA CRÍTICO
```

### Fluxo de Cadastro

```
1. Usuário preenche formulário em signUp.tsx
2. Frontend valida internamente com formSchema (Zod)
3. services/users.ts converte date "DD/MM/AAAA" → "YYYY-MM-DD"
4. services/users.ts remove não-numéricos do telefone → "11987051565" (11 dígitos)
5. POST /api/user com { name, birth_date: "YYYY-MM-DD", telephone: "11987051565", email, password }
6. Backend valida com CreateUserSchema:
   - birth_date: regex YYYY-MM-DD
   - telephone: max(11)
   - password: min(8) max(60)
7. Backend insere com role = "membro" (hardcoded)
8. Backend retorna UserPublicSchema (SEM senha)
```

---

## Mapa Frontend → API

| Tela | Ação | Endpoint chamado | Status |
|------|------|-----------------|--------|
| `login.tsx` | Submit login | `POST /api/auth/login` | ✅ Funcional |
| `signUp.tsx` | Submit cadastro | `POST /api/user` | ✅ Funcional |
| `(tabs)/index.tsx` | Carregar home | **Nenhum** | ❌ Sem integração |
| `(tabs)/warnings.tsx` | Carregar avisos | **Nenhum** | ❌ Sem integração |
| `(tabs)/user.tsx` | Carregar perfil | **Nenhum** | ❌ Sem integração |
| `scale/[id].tsx` | Carregar escala | **Nenhum** | ❌ Sem integração |
| `music/[id].tsx` | Carregar música | **Nenhum** | ❌ Sem integração |
| `avisos/[id].tsx` | Carregar aviso | **Nenhum** | ❌ Sem integração |
| `forgotPassword.tsx` | Alterar senha | **Nenhum** | ❌ Stub vazio |

---

## Mapa API → Banco

| Endpoint | Tabelas envolvidas |
|----------|-------------------|
| `POST /auth/login` | `membros` |
| `POST /user` | `membros` |
| `GET /user` | `membros` |
| `GET /user/me` | `membros`, `logradouros`, `membros_funcoes`, `funcoes`, `equipes_membros`, `equipes` |
| `PATCH /user/alterEmail` | `membros` |
| `PATCH /user/forgotPassword` | `membros` |
| `PATCH /user/alterLogradouro` | `membros`, `logradouros` (upsert) |
| `PATCH /user/alterBirthday` | `membros` |
| `PATCH /user/alterTelephone` | `membros` |
| `GET /home/month/{mes}` | `escalas` |
| `GET /home/unavailability/{mes}` | `membros_escalas`, `escalas`, `membros`, `funcoes` |
| `GET /home/scale/me` | `membros_escalas`, `escalas`, `funcoes`, `musicas_escalas` |
| `GET /home/scale/day/{day}` | `escalas`, `membros_escalas`, `musicas_escalas` |
| `GET /alert/reminder` | `lembretes`, `lembrete_funcoes`, `funcoes`, `notificacoes` |
| `GET /alert/reminder/{id}` | `lembretes`, `lembrete_funcoes`, `funcoes` |
| `GET /scale/{id}` | `escalas` |
| `GET /scale/{id}/musics` | `musicas_escalas`, `musicas` |
| `GET /scale/{id}/music/{id_me}` | `musicas_escalas`, `musicas` |
| `GET /scale/{id}/info` | `escalas`, `membros_escalas`, `membros`, `funcoes` |
| `GET /scale/{id}/members` | `membros_escalas`, `membros`, `funcoes` |
| `POST /scale/sair` | `membros_escalas` |
| `POST /scale/substituir` | `membros_escalas` |
| `GET /music/{id_music_escalas}` | `musicas_escalas`, `musicas` |

---

## Inconsistências Pendentes (frontend)

As seguintes inconsistências foram **resolvidas no backend**. O que resta é no lado frontend:

### INC-001 — Token JWT não persiste entre sessões
**Localização:** `src/services/api.ts`, `src/app/auth/login.tsx`  
**Impacto:** Crítico — sem persistência de sessão, a autenticação é funcional apenas na memória RAM.

### INC-002 — Token JWT não é injetado nas requisições
**Localização:** `src/services/api.ts`  
**Impacto:** Crítico — bloqueia toda a integração das telas que ainda estão mockadas.

### INC-003 — Validação de senha inconsistente
**Localização:** `src/schemas/auth.schemas.ts` (frontend) — `min(6)` vs backend `min(8)`  
**Impacto:** Médio.

### INC-013 — Tela `avisos/[id].tsx` usa tipo local incompatível com a API
**Localização:** `src/app/avisos/[id].tsx`  
**Impacto:** Alto — integração requer refatoração completa.

### INC-014 — Tela `scale/[id].tsx` completamente desconectada da API
**Localização:** `src/app/scale/[id].tsx`  
**Impacto:** Alto.

### INC-015 — Tela `music/[id].tsx` completamente desconectada da API
**Localização:** `src/app/music/[id].tsx`  
**Impacto:** Alto.

### INC-021 — Tela `(tabs)/user.tsx` usa dados hardcoded
**Localização:** `src/app/(tabs)/user.tsx`  
**Impacto:** Alto.

### INC-025 — Tela Home usa dados mockados
**Localização:** `src/app/(tabs)/index.tsx`  
**Impacto:** Alto.

---

## Inconsistências Resolvidas no Backend

| ID | Descrição | Resolução |
|----|-----------|-----------|
| INC-006 | `GET /user` retornava senha hasheada | `UserPublicSchema` sem campo `password` |
| INC-007 | `POST /user` retornava senha hasheada | Mesmo fix — `createUser` retorna `UserPublicSchema` |
| INC-008 | `/home/scale/{my_id}` IDOR via URL | Renomeado para `/home/scale/me`, ID via JWT |
| INC-010 | `auth.jwt.ts` era código morto | Consolidado — `auth.service.ts` importa `createAccessToken()` |
| INC-012 | `AlertItemSchema` usava `id_escala` para ID de lembrete | Renomeado para `id_lembrete` |
| INC-016 | Rota de música frontend vs endpoint backend | Novo endpoint `GET /music/{id_music_escalas}` |
| INC-017 | Conflito de rota `/home/scale/{my_id}` vs `/home/scale/day` | Resolvido ao renomear para `/home/scale/me` |
| INC-018 | IDOR em minhas escalas | Corrigido ao usar JWT |
| INC-019 | `forgotPassword` exigia autenticação | Rota pública, identifica por email |
| INC-022 | `local` da escala era logradouro de membro | Adicionada coluna `local` em `escalas` |
| INC-023 | `musicas_escalas.tom` e `ordem` tipos inadequados | Corrigidos para `VARCHAR(10)` e `INTEGER` |
| INC-024 | `musicas.bpm` era `CHAR(3)` | Corrigido para `SMALLINT` |
| INC-026 | Notificações sem filtro por membro | `getReminder(idMembro)` filtra por `id_membro_fk` |
| PA-004 | `forgotPassword` requer autenticação | Corrigido |
| PA-005 | `auth.jwt.ts` código morto com tempo diferente | Consolidado |
| PA-006 | IDOR em `GET /home/scale/{my_id}` | Corrigido |
| DR-001 | Roteamento da tela de música | Novo endpoint `GET /music/{id_music_escalas}` |
| DR-002 | Formato de data inconsistente | API usa `YYYY-MM-DD` (ISO) |
| DR-005 | Local da escala | Coluna `local VARCHAR(255)` em `escalas` |
| PB-001 | Sem campo `local` em `escalas` | Adicionado |
| PB-002 | `ordem` como `CHAR(4)` | Corrigido para `INTEGER` |
| PB-003 | `tom` como `CHAR(4)` | Corrigido para `VARCHAR(10)` |
| PB-004 | `bpm` como `CHAR(3)` | Corrigido para `SMALLINT` |
| PB-006 | `notificacoes` sem campo `conteudo` | Adicionado `conteudo TEXT` |
| — | `logradouros` sem UNIQUE(rua, numero) | Constraint adicionada |
| — | `ON CONFLICT DO NOTHING` sem constraint | Corrigido para `ON CONFLICT (rua, numero)` |
| — | `getScaleDay` gerava múltiplas linhas por escala | GROUP BY corrigido |
| — | `POST /scale/sair` retornava músicas | Agora retorna `{ message }` |

---

## Problemas de Autenticação Pendentes

### PA-001 — Token não persistido (CRÍTICO)
`expo-secure-store` está instalado mas não usado. O token some ao fechar o app.

### PA-002 — Token não enviado nas requisições (CRÍTICO)
Sem interceptor Axios. Todas as chamadas autenticadas futuras falharão.

### PA-003 — Senha mínima inconsistente (login: 6 chars, cadastro backend: 8 chars)

---

## Funcionalidades Incompletas

| Funcionalidade | Status | O que falta |
|---------------|--------|-------------|
| Persistência de sessão | ❌ | Salvar e carregar token via `expo-secure-store` |
| Injeção de token nas requisições | ❌ | Interceptor Axios com token do storage |
| Home com dados reais | ❌ | Integrar calendário + escalas + indisponibilidades |
| Perfil com dados reais | ❌ | Integrar `GET /user/me` + PATCHes de edição |
| Avisos com dados reais | ❌ | Integrar `GET /alert/reminder` + navegação para detalhe |
| Escala com dados reais | ❌ | Integrar todas as abas + modais funcionais |
| Música com dados reais | ❌ | Integrar `GET /music/{id_music_escalas}` |
| Esqueci minha senha | ❌ | Tela é stub; endpoint existe e é público |
| Logout | ❌ | Não existe botão/fluxo de logout |

---

## Ordem Recomendada de Integração (Frontend)

### Fase 1 — Fundação (pré-requisito absoluto)
1. Persistência de token com `expo-secure-store`
2. Interceptor Axios para injetar token + tratar 401
3. Corrigir `LoginSchema`: `password.min(8)`
4. Implementar logout

### Fase 2 — Tela Perfil
5. Integrar `GET /user/me`
6. Conectar botões de edição aos PATCHes

### Fase 3 — Tela Home
7. Calendário com `GET /home/month/{mes}`
8. Escalas do dia com `GET /home/scale/day/{day}`
9. Minhas escalas com `GET /home/scale/me`
10. Indisponibilidades com `GET /home/unavailability/{mes}`

### Fase 4 — Tela Avisos
11. Lista com `GET /alert/reminder`
12. Detalhe com `GET /alert/reminder/{id}`

### Fase 5 — Tela Escala
13. Integrar todas as abas: info, músicas, membros
14. Modal "Sair" → `POST /scale/sair`
15. Modal "Substituir" → `POST /scale/substituir`

### Fase 6 — Tela Música
16. Integrar `GET /music/{id_music_escalas}`

### Fase 7 — Funcionalidades ausentes
17. Tela `forgotPassword.tsx`
