# Como Executar com Docker — Calendly Hair

Guia para executar o sistema utilizando Docker e Docker Compose de forma rápida, isolada e sem necessidade de Node.js instalado no computador host.

---

## Stack e containers

| Container | Imagem / Base | Função | Porta Host |
| --- | --- | --- | --- |
| `calendly-hair-app` | `node:20-alpine` (Multi-stage) | Servidor Next.js Standalone | `3000` |

---

## 1) Preparar ambiente

Copie o arquivo de exemplo de ambiente:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Deixe o bloco `DOCKER` ativo e o bloco `LOCAL` comentado no `.env`:

```env
# LOCAL
# PORT=3000
# APP_URL=http://localhost:3000
# NODE_ENV=development
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=supersecret-calendly-hair-dev-key

# DOCKER
PORT=3000
APP_URL=http://localhost:3000
NODE_ENV=production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=supersecret-calendly-hair-docker-key
```

---

## 2) Subir containers

Execute o comando para construir a imagem multi-stage otimizada e subir o serviço em segundo plano:

```bash
docker compose up -d --build
docker compose ps
```

---

## 3) Acessos

| Recurso | URL |
| --- | --- |
| Aplicação | http://localhost:3000 |

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

## 4) Logs e diagnóstico

Para acompanhar os logs do container em tempo real:

```bash
docker compose logs -f
```

Para verificar o status e o healthcheck do container:

```bash
docker compose ps
```

---

## 5) Parar ou reconstruir

Para pausar os serviços:

```bash
docker compose stop
```

Para derrubar os containers:

```bash
docker compose down
```

Para forçar um rebuild completo sem cache:

```bash
docker compose build --no-cache
docker compose up -d
```
