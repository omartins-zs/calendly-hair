# 🔐 Acessos e Dados de Teste — Calendly Hair

Utilize as credenciais e rotas abaixo para testar os fluxos, perfis e permissões da plataforma de agendamento **Calendly Hair**.

---

## 1. Acesso ao Sistema (Usuários de Teste)

Credenciais preparadas para simulação de autenticação no ambiente de desenvolvimento:

| Perfil | E-mail / Usuário | Senha | Permissão / Detalhes |
| --- | --- | --- | --- |
| Administrador (Salão) | `admin@calendlyhair.local` | `admin123` | Gestão de horários, profissionais, serviços e faturamento |
| Barbeiro / Cabeleireiro | `profissional@calendlyhair.local` | `pro123` | Visualização de agenda pessoal, atendimentos e confirmações |
| Cliente | `cliente@calendlyhair.local` | `cliente123` | Agendamento online, consulta de horários disponíveis e histórico |

---

## 2. URLs Principais

| Ambiente | Aplicação (Home) | Agendamento / Serviços |
| --- | --- | --- |
| **Local** (`npm run dev`) | `http://localhost:3000` | `http://localhost:3000` |
| **Docker** (`docker compose up`) | `http://localhost:3000` | `http://localhost:3000` |

---

## 3. Vitrine Pública / Páginas para Clientes

| Item | Link | Descrição |
| --- | --- | --- |
| Página Inicial | `http://localhost:3000/` | Apresentação do salão e catálogo de serviços |
| Fluxo de Agendamento | `http://localhost:3000/#agendar` | Seleção de profissional, data e horário |
| Healthcheck da Aplicação | `http://localhost:3000/api/health` | Verificação do status de saúde da aplicação |

---

## 4. Validação do Acesso

Validação da saúde da aplicação no ambiente de desenvolvimento:

| Verificação | Resultado Esperado |
| --- | --- |
| Container (`calendly-hair-app`) | Saudável (`healthy`) / Executando |
| Página inicial | HTTP `200` |
| Build e compilação de assets | Concluído sem erros (`✓ Compiled successfully`) |

---

## 5. Carregar Dados e Inicialização

Caso o ambiente precise ser reinicializado do zero:

**Com Docker:**
```bash
docker compose down
docker compose up -d --build
```

**Rodando Localmente (Sem Docker):**
```bash
npm install
npm run build
npm run start
```

---

### 📝 Observações:
- Em ambiente local de desenvolvimento, utilize `npm run dev` para hot-reload em tempo real.
- As credenciais acima são destinadas exclusivamente a testes de validação local e containers.
