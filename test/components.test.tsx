import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../src/components/ThemeToggle";
import { Header } from "../src/components/Header";
import { HeroSection } from "../src/components/HeroSection";
import { ServiceCard } from "../src/components/ServiceCard";
import { ProfessionalCard } from "../src/components/ProfessionalCard";
import { TimeSlotPicker } from "../src/components/TimeSlotPicker";
import { BookingModal } from "../src/components/BookingModal";
import { DashboardView } from "../src/components/DashboardView";
import { LoginModal } from "../src/components/LoginModal";
import Home from "../src/app/page";
import { INITIAL_SERVICES, INITIAL_PROFESSIONALS, INITIAL_BOOKINGS } from "../src/data/initialData";
import { StorageManager } from "../src/lib/storage";

// Mock do matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Componente ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("alterna entre tema claro e escuro ao clicar", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /modo escuro/i });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("calendly_theme")).toBe("dark");

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("calendly_theme")).toBe("light");
  });
});

describe("Componente Header", () => {
  it("renderiza o logo, links e botão de acesso quando deslogado", () => {
    const onOpenLogin = vi.fn();
    const onNavigate = vi.fn();

    render(
      <Header
        currentUser={null}
        onOpenLogin={onOpenLogin}
        onLogout={vi.fn()}
        currentView="home"
        onNavigate={onNavigate}
      />
    );

    expect(screen.getByText(/Calendly/i)).toBeDefined();
    expect(screen.getByText(/Painel da Agenda/i)).toBeDefined();

    // Navega pelo logo
    const logo = screen.getByRole("button", { name: /calendly hair agendamento inteligente/i });
    fireEvent.click(logo);
    expect(onNavigate).toHaveBeenCalledWith("home");

    // Navega por teclado no logo
    fireEvent.keyDown(logo, { key: "Enter" });
    fireEvent.keyDown(logo, { key: " " });
    expect(onNavigate).toHaveBeenCalledWith("home");

    // Navega para Dashboard
    fireEvent.click(screen.getByText(/Painel da Agenda/i));
    expect(onNavigate).toHaveBeenCalledWith("dashboard");

    // "Agendar Horário" sem onGoToBooking cai no fallback de navegação
    fireEvent.click(screen.getByText("Agendar Horário"));
    expect(onNavigate).toHaveBeenCalledWith("home");

    const loginBtn = screen.getByText("Acessar");
    fireEvent.click(loginBtn);
    expect(onOpenLogin).toHaveBeenCalledTimes(1);
  });

  it("exibe informações do usuário logado e permite logout", () => {
    const onLogout = vi.fn();

    render(
      <Header
        currentUser={{
          id: "1",
          name: "Gabriel Martins",
          email: "gabriel@test.com",
          role: "admin",
        }}
        onOpenLogin={vi.fn()}
        onLogout={onLogout}
        currentView="dashboard"
        onNavigate={vi.fn()}
      />
    );

    expect(screen.getByText("Gabriel Martins")).toBeDefined();
    expect(screen.getByText("admin")).toBeDefined();

    const logoutBtn = screen.getByText("Sair");
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});

describe("Componente HeroSection", () => {
  it("chama o callback onStartBooking ao clicar no botão principal", () => {
    const onStart = vi.fn();
    render(<HeroSection onStartBooking={onStart} />);

    expect(screen.getByText(/Agende seu horário com os melhores profissionais/i)).toBeDefined();

    const btn = screen.getByText(/Escolher Serviço & Agendar/i);
    fireEvent.click(btn);
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});

describe("Componente ServiceCard", () => {
  it("renderiza detalhes do serviço e dispara seleção por clique e teclado", () => {
    const onSelect = vi.fn();
    const service = INITIAL_SERVICES[0];

    const { rerender } = render(
      <ServiceCard service={service} isSelected={false} onSelect={onSelect} />
    );

    expect(screen.getByText(service.name)).toBeDefined();
    expect(screen.getByText(`${service.durationMinutes} min`)).toBeDefined();

    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledWith(service);

    fireEvent.keyDown(card, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(2);

    // Testa com outros ícones de serviço
    rerender(<ServiceCard service={INITIAL_SERVICES[1]} isSelected={true} onSelect={onSelect} />);
    rerender(<ServiceCard service={INITIAL_SERVICES[2]} isSelected={true} onSelect={onSelect} />);
    rerender(<ServiceCard service={INITIAL_SERVICES[3]} isSelected={true} onSelect={onSelect} />);
    rerender(<ServiceCard service={INITIAL_SERVICES[4]} isSelected={true} onSelect={onSelect} />);
  });
});

describe("Componente ProfessionalCard", () => {
  it("renderiza detalhes do profissional e dispara seleção por clique e teclado", () => {
    const onSelect = vi.fn();
    const pro = INITIAL_PROFESSIONALS[0];

    render(
      <ProfessionalCard professional={pro} isSelected={true} onSelect={onSelect} />
    );

    expect(screen.getByText(pro.name)).toBeDefined();
    expect(screen.getByText(pro.role)).toBeDefined();
    expect(screen.getByText(pro.specialty)).toBeDefined();

    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledWith(pro);

    fireEvent.keyDown(card, { key: " " });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});

describe("Componente TimeSlotPicker", () => {
  it("permite selecionar uma data e um horário disponível", () => {
    const onSelectDate = vi.fn();
    const onSelectTime = vi.fn();

    render(
      <TimeSlotPicker
        selectedService={INITIAL_SERVICES[0]}
        selectedProfessional={INITIAL_PROFESSIONALS[0]}
        selectedDate="2026-11-03"
        selectedTime={null}
        onSelectDate={onSelectDate}
        onSelectTime={onSelectTime}
        existingBookings={[]}
      />
    );

    expect(screen.getByText(/1. Selecione a Data/i)).toBeDefined();

    // Clica em um dia da semana disponível
    const dayButtons = screen.getAllByRole("button", { name: /\d{2}\/\d{2}/ });
    if (dayButtons.length > 1) {
      fireEvent.click(dayButtons[1]);
      expect(onSelectDate).toHaveBeenCalled();
    }

    const timeBtn = screen.getByText("09:00");
    fireEvent.click(timeBtn);
    expect(onSelectTime).toHaveBeenCalledWith("09:00");
  });

  it("exibe aviso quando o profissional não possui expediente no dia selecionado", () => {
    // Domingo
    render(
      <TimeSlotPicker
        selectedService={INITIAL_SERVICES[0]}
        selectedProfessional={INITIAL_PROFESSIONALS[0]}
        selectedDate="2026-11-01"
        selectedTime={null}
        onSelectDate={vi.fn()}
        onSelectTime={vi.fn()}
        existingBookings={[]}
      />
    );

    expect(screen.getByText(/não possui expediente neste dia/i)).toBeDefined();
  });
});

describe("Componente BookingModal", () => {
  it("valida formulário, exibe erros e emite confirmação de agendamento", async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(
      <BookingModal
        isOpen={true}
        onClose={onClose}
        service={INITIAL_SERVICES[0]}
        professional={INITIAL_PROFESSIONALS[0]}
        date="2099-12-31"
        time="10:00"
        onBookingConfirmed={onConfirm}
      />
    );

    // Tenta enviar com formulário vazio
    fireEvent.submit(screen.getByTestId("booking-form"));

    expect(await screen.findByText(/O nome completo deve conter pelo menos 3 caracteres/i)).toBeDefined();

    // Preenche com dados válidos
    fireEvent.change(screen.getByPlaceholderText(/Ex: Carlos Silva/i), {
      target: { value: "Carlos Silva" },
    });
    fireEvent.change(screen.getByPlaceholderText(/carlos@email.com/i), {
      target: { value: "carlos@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/\(11\) 98765-4321/i), {
      target: { value: "11987654321" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Ex: Cabelo com pomada/i), {
      target: { value: "Observação opcional de teste" },
    });

    fireEvent.submit(screen.getByTestId("booking-form"));

    // Deve exibir recibo de sucesso (reserva criada como pendente)
    expect(await screen.findByText(/Solicitação Enviada/i)).toBeDefined();
    expect(screen.getByText(/Recebemos o seu pedido de agendamento!/i)).toBeDefined();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ status: "pendente" })
    );

    // Conclui e fecha
    const finishBtn = screen.getByText(/Concluir & Voltar ao Início/i);
    fireEvent.click(finishBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("não renderiza nada se isOpen for false", () => {
    const { container } = render(
      <BookingModal
        isOpen={false}
        onClose={vi.fn()}
        service={INITIAL_SERVICES[0]}
        professional={INITIAL_PROFESSIONALS[0]}
        date="2099-12-31"
        time="10:00"
        onBookingConfirmed={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

describe("Componente DashboardView", () => {
  it("exibe métricas, tabela e permite filtrar e atualizar status", () => {
    const onUpdateStatus = vi.fn();
    const onBack = vi.fn();

    const mockMixedBookings: typeof INITIAL_BOOKINGS = [
      ...INITIAL_BOOKINGS,
      {
        id: "BK-CANCELADO",
        serviceId: "s1",
        serviceName: "Serviço Cancelado",
        professionalId: "pro-gabriel",
        professionalName: "Gabriel",
        date: "2026-11-04",
        startTime: "11:00",
        endTime: "11:30",
        clientName: "Cliente Cancelado",
        clientEmail: "c@c.com",
        clientPhone: "11999999999",
        price: 50,
        status: "cancelado",
        createdAt: "2026-10-29",
      },
      {
        id: "BK-PENDENTE",
        serviceId: "s2",
        serviceName: "Serviço Pendente",
        professionalId: "pro-gabriel",
        professionalName: "Gabriel",
        date: "2026-11-04",
        startTime: "15:00",
        endTime: "15:30",
        clientName: "Cliente Pendente",
        clientEmail: "p@p.com",
        clientPhone: "11999999999",
        price: 50,
        status: "pendente",
        createdAt: "2026-10-29",
      },
    ];

    const adminUser = {
      id: "usr-admin",
      name: "Administrador do Salão",
      email: "admin@calendlyhair.local",
      role: "admin" as const,
    };

    const { rerender } = render(
      <DashboardView
        bookings={mockMixedBookings}
        onUpdateStatus={onUpdateStatus}
        onBackToHome={onBack}
        currentUser={adminUser}
      />
    );

    expect(screen.getByText(/Painel da Agenda & Atendimentos/i)).toBeDefined();
    expect(screen.getByText("Faturamento Estimado")).toBeDefined();

    // Filtra por status "cancelado"
    fireEvent.click(screen.getByRole("button", { name: "Cancelado" }));
    expect(screen.getByText("Cliente Cancelado")).toBeDefined();

    // Filtra por status "todos"
    fireEvent.click(screen.getByRole("button", { name: "Todos" }));

    // Busca por cliente
    const searchInput = screen.getByPlaceholderText(/Pesquisar por cliente/i);
    fireEvent.change(searchInput, { target: { value: "Rodrigo" } });
    expect(screen.getByText("Rodrigo Almeida")).toBeDefined();

    // Filtra por status "confirmado"
    const confirmedFilterBtn = screen.getByRole("button", { name: "Confirmado" });
    fireEvent.click(confirmedFilterBtn);

    // Concluir agendamento
    const finishButtons = screen.getAllByText("Concluir");
    fireEvent.click(finishButtons[0]);
    expect(onUpdateStatus).toHaveBeenCalledWith(INITIAL_BOOKINGS[0].id, "concluido");

    // Cancelar agendamento
    const cancelButtons = screen.getAllByText("Cancelar");
    fireEvent.click(cancelButtons[0]);
    expect(onUpdateStatus).toHaveBeenCalledWith(INITIAL_BOOKINGS[0].id, "cancelado");

    // Voltar para Home
    fireEvent.click(screen.getByText(/Voltar para Vitrine Pública/i));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("exibe mensagem quando nenhum agendamento é encontrado", () => {
    render(
      <DashboardView
        bookings={[]}
        onUpdateStatus={vi.fn()}
        onBackToHome={vi.fn()}
        currentUser={{
          id: "usr-admin",
          name: "Administrador do Salão",
          email: "admin@calendlyhair.local",
          role: "admin",
        }}
      />
    );

    expect(screen.getByText(/Nenhum agendamento encontrado/i)).toBeDefined();
  });

  it("bloqueia o painel para visitantes não autenticados", () => {
    const onOpenLogin = vi.fn();
    render(
      <DashboardView
        bookings={INITIAL_BOOKINGS}
        onUpdateStatus={vi.fn()}
        onBackToHome={vi.fn()}
        currentUser={null}
        onOpenLogin={onOpenLogin}
      />
    );

    expect(screen.getByText(/Área Restrita/i)).toBeDefined();
    fireEvent.click(screen.getByText(/Fazer Login/i));
    expect(onOpenLogin).toHaveBeenCalledTimes(1);
  });

  it("escopa a agenda ao profissional logado e permite confirmar", () => {
    const onUpdateStatus = vi.fn();
    const proUser = {
      id: "usr-pro-thiago",
      name: "Thiago Silva",
      email: "thiago@calendlyhair.local",
      role: "professional" as const,
      professionalId: "pro-thiago",
    };

    render(
      <DashboardView
        bookings={INITIAL_BOOKINGS}
        onUpdateStatus={onUpdateStatus}
        onBackToHome={vi.fn()}
        currentUser={proUser}
      />
    );

    // Vê apenas o agendamento do Thiago (BK-1002); não vê os do Gabriel.
    expect(screen.getByText("Marcos Vinicius")).toBeDefined();
    expect(screen.queryByText("Rodrigo Almeida")).toBeNull();
  });

  it("cliente vê apenas as próprias reservas e pode cancelá-las", () => {
    const onUpdateStatus = vi.fn();
    const onBackToHome = vi.fn();
    const clientUser = {
      id: "usr-client",
      name: "Lucas Rocha",
      email: "cliente@calendlyhair.local",
      role: "client" as const,
    };

    render(
      <DashboardView
        bookings={INITIAL_BOOKINGS}
        onUpdateStatus={onUpdateStatus}
        onBackToHome={onBackToHome}
        currentUser={clientUser}
      />
    );

    // Apenas a reserva vinculada ao e-mail do cliente (BK-1003).
    expect(screen.getByText("Lucas Rocha")).toBeDefined();
    expect(screen.queryByText("Marcos Vinicius")).toBeNull();

    // Cliente não confirma nem conclui, mas pode cancelar.
    expect(screen.queryByText("Concluir")).toBeNull();
    const cancelBtn = screen.getByText("Cancelar");
    fireEvent.click(cancelBtn);
    expect(onUpdateStatus).toHaveBeenCalledWith("BK-1003", "cancelado");

    // Sem onGoToBooking, "Novo Agendamento" cai no fallback onBackToHome.
    fireEvent.click(screen.getByText(/Novo Agendamento/i));
    expect(onBackToHome).toHaveBeenCalledTimes(1);
  });

  it("permite que um membro da equipe (admin) abra o modal e feche", () => {
    const onClose = vi.fn();
    render(
      <BookingModal
        isOpen={true}
        onClose={onClose}
        service={INITIAL_SERVICES[0]}
        professional={INITIAL_PROFESSIONALS[0]}
        date="2099-12-31"
        time="10:00"
        onBookingConfirmed={vi.fn()}
        currentUser={{
          id: "a",
          name: "Admin",
          email: "admin@calendlyhair.local",
          role: "admin",
        }}
      />
    );

    // Staff não vê aviso de cliente logado nem o convite de login.
    expect(screen.queryByText(/Seus dados foram preenchidos/i)).toBeNull();
    expect(screen.queryByText(/Fazer login rápido/i)).toBeNull();

    fireEvent.click(screen.getByLabelText("Fechar"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Componente LoginModal", () => {
  it("permite preenchimento rápido de todas as contas demo e login", () => {
    const onLogin = vi.fn();
    const onClose = vi.fn();

    const { rerender } = render(
      <LoginModal isOpen={true} onClose={onClose} onLoginSuccess={onLogin} />
    );

    // 1. Admin
    const adminDemoBtn = screen.getByText("Administrador");
    fireEvent.click(adminDemoBtn);
    fireEvent.click(screen.getByText("Entrar no Painel"));
    expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({ role: "admin" }));

    // 2. Profissional (vinculado ao seu professionalId)
    rerender(<LoginModal isOpen={true} onClose={onClose} onLoginSuccess={onLogin} />);
    const proDemoBtn = screen.getByText("Gabriel (Profissional)");
    fireEvent.click(proDemoBtn);
    fireEvent.click(screen.getByText("Entrar no Painel"));
    expect(onLogin).toHaveBeenCalledWith(
      expect.objectContaining({ role: "professional", professionalId: "pro-gabriel" })
    );

    // 3. Cliente
    rerender(<LoginModal isOpen={true} onClose={onClose} onLoginSuccess={onLogin} />);
    const clientDemoBtn = screen.getByText("Cliente");
    fireEvent.click(clientDemoBtn);
    fireEvent.click(screen.getByText("Entrar no Painel"));
    expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({ role: "client" }));
  });

  it("exibe erro ao informar credenciais incorretas", () => {
    render(
      <LoginModal isOpen={true} onClose={vi.fn()} onLoginSuccess={vi.fn()} />
    );

    const emailInput = screen.getByDisplayValue("admin@calendlyhair.local");
    fireEvent.change(emailInput, { target: { value: "invalido@email.com" } });

    fireEvent.click(screen.getByText("Entrar no Painel"));
    expect(screen.getByText(/Credenciais inválidas/i)).toBeDefined();
  });

  it("não renderiza nada quando isOpen for false", () => {
    const { container } = render(
      <LoginModal isOpen={false} onClose={vi.fn()} onLoginSuccess={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("Fluxo Integrado - Home Page", () => {
  beforeEach(() => {
    StorageManager.reset();
  });

  it("restaura a sessão persistida ao carregar a página", async () => {
    StorageManager.setAuthUser({
      id: "usr-admin",
      name: "Administrador do Salão",
      email: "admin@calendlyhair.local",
      role: "admin",
    });

    render(<Home />);

    // Sessão restaurada: header e banner mostram o usuário e a opção de sair.
    expect((await screen.findAllByText("Administrador do Salão")).length).toBeGreaterThan(0);
    expect(screen.getByText("Sair")).toBeDefined();
  });

  it("renderiza a página inicial, interage com seleção e abre agendamento", async () => {
    render(<Home />);

    expect(screen.getAllByText(/Corte Degradê \/ Fade Moderno/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Gabriel Martins/i).length).toBeGreaterThan(0);

    // Seleciona outro serviço
    const barbaCards = screen.getAllByText(/Barboterapia Completa/i);
    fireEvent.click(barbaCards[0]);

    // Seleciona outro profissional
    const thiagoCards = screen.getAllByText(/Thiago Silva/i);
    fireEvent.click(thiagoCards[0]);

    // Clica no botão do Hero para rolar
    const heroBtn = screen.getByText(/Escolher Serviço & Agendar/i);
    fireEvent.click(heroBtn);

    // Seleciona outra data na grade (dispara onSelectDate na Home)
    const dayButtons = screen.getAllByRole("button", { name: /\d{2}\/\d{2}/ });
    if (dayButtons.length > 1) {
      fireEvent.click(dayButtons[1]);
    }

    // Navega ao Painel da Agenda e volta
    const navDashboardBtn = screen.getByText(/Painel da Agenda/i);
    fireEvent.click(navDashboardBtn);

    expect(await screen.findByText(/Painel da Agenda & Atendimentos/i)).toBeDefined();

    // Visitante não logado: painel restrito, volta pela ação "Agendar sem login"
    const backBtn = screen.getByText(/Agendar sem login/i);
    fireEvent.click(backBtn);

    expect(await screen.findByText(/Escolha o Serviço Desejado/i)).toBeDefined();
  });

  it("permite login direto pela navbar e abre o painel da agenda", async () => {
    render(<Home />);

    const acessarBtn = screen.getByText("Acessar");
    fireEvent.click(acessarBtn);

    // Loga como admin
    fireEvent.click(screen.getByText("Administrador"));
    fireEvent.click(screen.getByText("Entrar no Painel"));

    expect(await screen.findByText(/Painel da Agenda & Atendimentos/i)).toBeDefined();

    // Atualiza status do agendamento pela Home
    const finishBtns = screen.getAllByText("Concluir");
    fireEvent.click(finishBtns[0]);
  });

  it("realiza o fluxo completo de agendamento pela interface da Home", async () => {
    render(<Home />);

    // Clica no horário 09:00 disponível da grade
    const timeSlotBtn = screen.getByText("09:00");
    fireEvent.click(timeSlotBtn);

    // Modal de agendamento deve abrir
    expect(await screen.findByText(/Finalizar Agendamento/i)).toBeDefined();

    // Preenche dados do cliente
    fireEvent.change(screen.getByPlaceholderText(/Ex: Carlos Silva/i), {
      target: { value: "Mariana Souza" },
    });
    fireEvent.change(screen.getByPlaceholderText(/carlos@email.com/i), {
      target: { value: "mariana@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/\(11\) 98765-4321/i), {
      target: { value: "11977778888" },
    });

    // Submete formulário
    fireEvent.submit(screen.getByTestId("booking-form"));

    // Valida recibo (reserva pendente) e conclui
    expect(await screen.findByText(/Solicitação Enviada/i)).toBeDefined();
    fireEvent.click(screen.getByText(/Concluir & Voltar ao Início/i));
  });

  it("profissional loga, vê apenas a sua agenda e faz logout", async () => {
    render(<Home />);

    fireEvent.click(screen.getByText("Acessar"));
    fireEvent.click(screen.getByText("Gabriel (Profissional)"));
    fireEvent.click(screen.getByText("Entrar no Painel"));

    // Vai direto ao painel; escopo mostra só os atendimentos do Gabriel
    expect(await screen.findByText(/Painel da Agenda & Atendimentos/i)).toBeDefined();
    expect(screen.getByText("Rodrigo Almeida")).toBeDefined();
    expect(screen.queryByText("Marcos Vinicius")).toBeNull();

    // Logout volta para a vitrine pública
    fireEvent.click(screen.getByText("Sair"));
    expect(await screen.findByText(/Escolha o Serviço Desejado/i)).toBeDefined();
  });

  it("cliente loga, permanece na vitrine e acessa suas reservas", async () => {
    render(<Home />);

    fireEvent.click(screen.getByText("Acessar"));
    fireEvent.click(screen.getByText("Cliente"));
    fireEvent.click(screen.getByText("Entrar no Painel"));

    // Cliente não é levado ao painel automaticamente: segue na vitrine
    expect(await screen.findByText(/Escolha o Serviço Desejado/i)).toBeDefined();

    // Banner de boas-vindas leva às reservas do cliente
    fireEvent.click(screen.getByText(/Ver Minhas Reservas/i));
    expect(await screen.findByText(/Painel da Agenda & Atendimentos/i)).toBeDefined();

    // "Novo Agendamento" volta à vitrine (currentView dashboard -> home)
    fireEvent.click(screen.getByText(/Novo Agendamento/i));
    expect(await screen.findByText(/Escolha o Serviço Desejado/i)).toBeDefined();
  });
});

describe("Header - variações por papel", () => {
  it("renderiza selo e dados do profissional e aciona agendamento", () => {
    const onGoToBooking = vi.fn();
    render(
      <Header
        currentUser={{
          id: "p",
          name: "Thiago Silva",
          email: "thiago@calendlyhair.local",
          role: "professional",
          professionalId: "pro-thiago",
        }}
        onOpenLogin={vi.fn()}
        onLogout={vi.fn()}
        currentView="dashboard"
        onNavigate={vi.fn()}
        onGoToBooking={onGoToBooking}
      />
    );

    expect(screen.getByText("Minha Agenda")).toBeDefined();

    // Link "Agendar Horário" usa o callback direto quando fornecido
    fireEvent.click(screen.getByText("Agendar Horário"));
    expect(onGoToBooking).toHaveBeenCalledTimes(1);
  });

  it("renderiza o selo de reservas do cliente", () => {
    render(
      <Header
        currentUser={{
          id: "c",
          name: "Lucas Rocha",
          email: "cliente@calendlyhair.local",
          role: "client",
        }}
        onOpenLogin={vi.fn()}
        onLogout={vi.fn()}
        currentView="home"
        onNavigate={vi.fn()}
      />
    );

    expect(screen.getByText("Minhas Reservas")).toBeDefined();
  });
});

describe("BookingModal - variações por papel", () => {
  it("pré-preenche e sinaliza cliente logado", () => {
    render(
      <BookingModal
        isOpen={true}
        onClose={vi.fn()}
        service={INITIAL_SERVICES[0]}
        professional={INITIAL_PROFESSIONALS[0]}
        date="2099-12-31"
        time="10:00"
        onBookingConfirmed={vi.fn()}
        currentUser={{
          id: "c",
          name: "Lucas Rocha",
          email: "cliente@calendlyhair.local",
          role: "client",
          phone: "(11) 99887-7665",
        }}
      />
    );

    expect(screen.getByText(/Seus dados foram preenchidos automaticamente/i)).toBeDefined();
    expect(screen.getByDisplayValue("Lucas Rocha")).toBeDefined();
    expect(screen.getByDisplayValue("(11) 99887-7665")).toBeDefined();
  });

  it("oferece login rápido ao visitante", () => {
    const onClose = vi.fn();
    const onOpenLogin = vi.fn();
    render(
      <BookingModal
        isOpen={true}
        onClose={onClose}
        service={INITIAL_SERVICES[0]}
        professional={INITIAL_PROFESSIONALS[0]}
        date="2099-12-31"
        time="10:00"
        onBookingConfirmed={vi.fn()}
        currentUser={null}
        onOpenLogin={onOpenLogin}
      />
    );

    fireEvent.click(screen.getByText(/Fazer login rápido/i));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onOpenLogin).toHaveBeenCalledTimes(1);
  });
});
