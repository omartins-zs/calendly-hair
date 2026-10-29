<div align="center">

# ✂️ Calendly Hair — Sistema Inteligente de Agendamento 💈

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.1.4-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Coverage-99.6%25-brightgreen?style=for-the-badge&logo=vitest&logoColor=white" alt="Coverage" />
</p>

<p align="center">
  Plataforma moderna e responsiva para gestão e agendamento online de barbearias, salões de beleza e profissionais de estética.
</p>

<cite>“Simplificando o agendamento de serviços de beleza com agilidade, elegância e modernidade.”</cite>

<h4 align="center"> ✅ Calendly Hair 🚀 Concluído • 99.6% de Testes ⚡ </h4>

</div>

---

## 🏗️ Arquitetura do Projeto

- **Tipo:** 🧱 **Monólito Fullstack Moderno (Next.js App Router)**
- **Descrição da Arquitetura:** Construído utilizando **Next.js 14**, combinando Server-Side Rendering (SSR), React Server Components (RSC) e Client Components otimizados com Tailwind CSS. A aplicação conta com suporte a execução standalone em container Docker multi-stage, garantindo deploy rápido, isolado e de baixo consumo de recursos.

---

## 🔥 Pré-requisitos

Para executar o projeto, certifique-se de possuir em seu ambiente:

- **Node.js**: Versão `20.12.0+`
- **NPM**: Versão `10.5.0+`
- **Docker & Docker Compose**: Opcional, para execução em containers

---

## 🚀 Tecnologias Utilizadas

- **Linguagem Principal:** TypeScript 5.x
- **Framework Web:** Next.js 14.1.4 (App Router)
- **Biblioteca de UI:** React 18
- **Estilização & Design:** Tailwind CSS 3.3, Autoprefixer, PostCSS
- **Componentização:** Padrão shadcn-ui e ícones modernos
- **Containerização:** Docker (Multi-stage build com `node:20-alpine`) & Docker Compose
- **Boas Práticas:** Clean Code, tipagem estrita com TypeScript, arquitetura modular de componentes

---

## 🔨 Funcionalidades

- 📅 **Vitrine de Agendamento:** Interface fluida para seleção de datas e horários disponíveis.
- 💈 **Catálogo de Serviços:** Apresentação clara de cortes, tratamentos e serviços estéticos.
- 👥 **Múltiplos Perfis:** Estrutura preparada para clientes, profissionais e administradores.
- 📱 **Design Responsivo:** Totalmente adaptado para dispositivos móveis, tablets e desktops.
- 🐳 **Pronto para Docker:** Imagem otimizada standalone de ~120MB com healthcheck nativo.

---

## 🎯 Sobre o Projeto

Sistema desenvolvido demonstrando boas práticas de desenvolvimento, arquitetura limpa e organização de código, com foco em escalabilidade e manutenção.

---

## 📸 Preview do Projeto

<div align="center">

🚧 Preview não disponível no projeto.

</div>

---

## 📁 Documentação do Projeto

O projeto conta com documentação completa e padronizada localizada na pasta [`docs/`](./docs/):

- 📘 [**docs/COMO_EXECUTAR.md**](./docs/COMO_EXECUTAR.md) — Guia unificado de execução e visão geral
- 📗 [**docs/COMO_EXECUTAR_LOCAL.md**](./docs/COMO_EXECUTAR_LOCAL.md) — Instruções detalhadas para ambiente local com Node.js
- 🐳 [**docs/COMO_EXECUTAR_DOCKER.md**](./docs/COMO_EXECUTAR_DOCKER.md) — Passo a passo para execução com Docker Compose
- 🔐 [**docs/ACESSOS_TESTES.md**](./docs/ACESSOS_TESTES.md) — Credenciais de teste, URLs e validação dos fluxos

---

## 💻 Comandos

### 🟢 Ambiente Local (Node.js)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Executar em modo de desenvolvimento
npm run dev

# 4. Compilar para produção
npm run build
npm run start

# 5. Executar suite de testes e relatório de cobertura
npm run test
npm run test:coverage
```

### 🐳 Ambiente Containerizado (Docker)

```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env

# 2. Subir container com build automático
docker compose up -d --build

# 3. Visualizar logs
docker compose logs -f
```

---

## ⚠️ Importante

> ⚠️ Estes são comandos básicos. Verifique no projeto arquivos como:
> `README.md`, `COMO_EXECUTAR.md` ou a pasta `docs/` para instruções completas.

---

## 🧱 Estrutura do Projeto

```text
calendly-hair/
├── docs/                      # Documentação técnica e guias de execução
│   ├── ACESSOS_TESTES.md
│   ├── COMO_EXECUTAR.md
│   ├── COMO_EXECUTAR_DOCKER.md
│   └── COMO_EXECUTAR_LOCAL.md
├── public/                    # Assets estáticos (ícones, logos, imagens)
├── src/
│   └── app/                   # Rotas do Next.js App Router
│       ├── globals.css        # Estilos globais e Tailwind
│       ├── layout.tsx         # Layout raiz da aplicação
│       └── page.tsx           # Página inicial / Landing page
├── .dockerignore              # Regras de exclusão do contexto Docker
├── .env.example               # Modelo de variáveis de ambiente
├── docker-compose.yml         # Orquestração do container Docker
├── Dockerfile                 # Build multi-stage otimizado
├── next.config.mjs            # Configurações do Next.js (output standalone)
├── package.json               # Dependências e scripts do projeto
├── tailwind.config.ts         # Configuração do Tailwind CSS
└── tsconfig.json              # Configurações do TypeScript
```

---

## 📝 Melhorias Futuras

- [ ] Integrar fluxo de autenticação completa com NextAuth.js
- [ ] Implementar painel administrativo para barbeiros/cabeleireiros
- [ ] Adicionar persistência de dados com Prisma ORM e PostgreSQL
- [ ] Integrar notificações automáticas via WhatsApp ou E-mail

---

## 📄 Finalização

<div align="center">

Feito com ❤️ por Gabriel Martins 🚀

</div>
