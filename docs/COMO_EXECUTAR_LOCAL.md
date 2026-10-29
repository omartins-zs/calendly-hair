# Como Executar Localmente — Calendly Hair

Guia para rodar **sem Docker**, utilizando **Node.js** e **NPM** com o servidor do Next.js.

> **Não quer instalar Node.js ou dependências no sistema?** Use [COMO_EXECUTAR_DOCKER.md](COMO_EXECUTAR_DOCKER.md) — basta o Docker Desktop em qualquer Windows, Mac ou Linux.

---

## Requisitos

Para rodar localmente de forma nativa:

| Ferramenta | Obrigatório? | Versão mínima |
| --- | --- | --- |
| **Node.js** | Sim | 20+ |
| **NPM** | Sim | 10+ |

### Ambiente de referência (máquina de desenvolvimento)

Stack usada na elaboração deste projeto — **não é requisito fixo**, apenas referência do que já foi testado:

| Ferramenta | Versão |
| --- | --- |
| **Node.js** | **20.12.1+** |
| **NPM** | **10.5.0+** |
| Next.js (no projeto) | 14.1.4 |
| React | 18.x |
| TypeScript | 5.x |

Para conferir no seu computador:

```bash
node -v
npm -v
```

---

## 1) Preparar ambiente

### 1.1 Acessar a pasta do projeto

```bash
cd f:/SSD_UEBRADO_CLONADO/calendly-hair
```

### 1.2 Copiar variáveis de ambiente

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

### 1.3 Ativar o ambiente local

Deixe o bloco `LOCAL` ativo e o bloco `DOCKER` comentado no `.env`:

```env
# LOCAL
PORT=3000
APP_URL=http://localhost:3000
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=supersecret-calendly-hair-dev-key

# DOCKER
# PORT=3000
# APP_URL=http://localhost:3000
# NODE_ENV=production
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=supersecret-calendly-hair-docker-key
```

---

## 2) Instalar dependências

```bash
npm install
```

---

## 3) Compilação e Produção

Para testar o build de produção:

```bash
npm run build
npm run start
```

---

## 4) Modo de Desenvolvimento

Para trabalhar no código com Hot Reload em tempo real:

```bash
npm run dev
```

Aplicação disponível em:

http://localhost:3000

---

## 5) Acessos e Perfis de Teste

| Recurso | URL |
| --- | --- |
| Página Inicial | http://localhost:3000 |
| Agendamento | http://localhost:3000 |

### Credenciais de Teste

```txt
Perfil Administrador
E-mail: admin@calendlyhair.local
Senha: admin123

Perfil Profissional
E-mail: profissional@calendlyhair.local
Senha: pro123

Perfil Cliente
E-mail: cliente@calendlyhair.local
Senha: cliente123
```

---

## 6) Comandos úteis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Executa compilação e validação de tipos
npm run start        # Executa bundle compilado de produção
npm run lint         # Executa checagem de código com ESLint
```

---

## 7) Problemas comuns

### Porta 3000 em uso

Caso a porta 3000 já esteja ocupada, defina outra porta:

```bash
npx next dev -p 3001
```

### Alterações no `.env` não foram aplicadas

Reinicie o servidor de desenvolvimento (`Ctrl + C` e execute `npm run dev` novamente).

---

## Próximo passo

Para executar em ambiente containerizado isolado, consulte [COMO_EXECUTAR_DOCKER.md](COMO_EXECUTAR_DOCKER.md).

