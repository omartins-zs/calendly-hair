# Como Executar — Calendly Hair

Escolha **um** guia conforme seu ambiente:

| Guia | Quando usar | Requisitos no PC |
| --- | --- | --- |
| **[COMO_EXECUTAR_DOCKER.md](COMO_EXECUTAR_DOCKER.md)** | Executar em qualquer máquina com containers | Docker Desktop |
| **[COMO_EXECUTAR_LOCAL.md](COMO_EXECUTAR_LOCAL.md)** | Desenvolver com Node.js e NPM | Node.js 20+ e NPM 10+ |
| **[ACESSOS_TESTES.md](ACESSOS_TESTES.md)** | Logins, URLs e fluxos de teste | — |

---

## Início rápido

### Local — Node.js e NPM

Ative o bloco `LOCAL` no `.env` e execute:

```bash
cp .env.example .env
npm install
npm run build
npm run start
```

Para desenvolvimento com hot-reload:

```bash
npm run dev
```

Aplicação:

http://localhost:3000

---

### Docker

Ative o bloco `DOCKER` no `.env` e execute:

```bash
cp .env.example .env
docker compose up -d --build
```

Aplicação:

http://localhost:3000

---

## Logins demo

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | admin@calendlyhair.local | admin123 |
| Profissional | profissional@calendlyhair.local | pro123 |
| Cliente | cliente@calendlyhair.local | cliente123 |

---

## URLs principais

| Área | Local | Docker |
| --- | --- | --- |
| Página inicial / Agendamento | http://localhost:3000 | http://localhost:3000 |
| Documentação de Acessos | docs/ACESSOS_TESTES.md | docs/ACESSOS_TESTES.md |

---

## Outros documentos

- [ACESSOS_TESTES.md](ACESSOS_TESTES.md) — Credenciais e fluxos de teste
- [COMO_EXECUTAR_LOCAL.md](COMO_EXECUTAR_LOCAL.md) — Passo a passo do ambiente local
- [COMO_EXECUTAR_DOCKER.md](COMO_EXECUTAR_DOCKER.md) — Guia detalhado para Docker

