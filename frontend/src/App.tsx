import { useEffect, useMemo, useState } from "react";

// Definindo a estrutura dos tipos
type Endereco = {
    id: string;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado?: string;
    numero?: string;
    complemento?: string;
};

type Cliente = {
    id: string;
    nome: string;
    email: string;
    whatsapp?: string;
    tipoDocumento: "CPF" | "CNPJ";
    numeroDocumento: string;
    dataCadastro: string;
    enderecos: Endereco[];
};

// Armazenando a url basica da api
const API = "/api";


function App() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [form, setForm] = useState({
        nome: "",
        email: "",
        whatsapp: "",
        tipoDocumento: "CPF",
        numeroDocumento: "",
    });
    const [addressForm, setAddressForm] = useState({
        customerId: "",
        cep: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
        numero: "",
        complemento: "",
    });
    const [editingCustomerId, setEditingCustomerId] = useState("");
    const [editingAddressId, setEditingAddressId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Lista todos os endereços de todos os clientes com referência ao cliente
    const addressOptions = useMemo(
        () =>
            clientes.flatMap((cliente) =>
                cliente.enderecos.map((endereco) => ({
                    ...endereco,
                    nomeCliente: cliente.nome,
                    customerId: cliente.id,
                })),
            ),
        [clientes],
    );

    //Carregar clientes

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("busca", search);
            if (startDate) params.set("dataInicio", startDate);
            if (endDate) params.set("dataFim", endDate);
            const response = await fetch(`${API}/clientes?${params.toString()}`);
            const data = await response.json();
            setClientes(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCustomers();
    }, []);

    const filteredCustomers = useMemo(() => clientes, [clientes]);

    //Clientes

    const resetCustomerForm = () => {
        setEditingCustomerId("");
        setForm({
            nome: "",
            email: "",
            whatsapp: "",
            tipoDocumento: "CPF",
            numeroDocumento: "",
        });
    };

    const startEditCustomer = (cliente: Cliente) => {
        setEditingCustomerId(cliente.id);
        setForm({
            nome: cliente.nome,
            email: cliente.email,
            whatsapp: cliente.whatsapp || "",
            tipoDocumento: cliente.tipoDocumento,
            numeroDocumento: cliente.numeroDocumento,
        });
    };

    const handleCreateCustomer = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(
                `${API}/clientes${editingCustomerId ? `/${editingCustomerId}` : ""}`,
                {
                    method: editingCustomerId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                },
            );
            if (!response.ok) {
                const erro = await response.text();
                setMessage(`Erro ${response.status}: ${erro}`);
                return;
            }
            const data = await response.json();
            setMessage(
                editingCustomerId
                    ? `Cliente atualizado: ${data.nome}`
                    : `Cliente criado: ${data.nome}`,
            );
            resetCustomerForm();
            await loadCustomers();
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCustomer = async (id: string) => {
        await fetch(`${API}/clientes/${id}`, { method: "DELETE" });
        await loadCustomers();
    };

    //Endereços

    const handleLookupCep = async () => {
        if (!addressForm.cep) return;
        const response = await fetch(
            `${API}/cep/${addressForm.cep.replace(/\D/g, "")}`,
        );
        const data = await response.json();
        if (response.ok) {
            setAddressForm((prev) => ({
                ...prev,
                rua: data.rua || prev.rua,
                bairro: data.bairro || prev.bairro,
                cidade: data.cidade || prev.cidade,
                estado: data.estado || prev.estado,
            }));
            setMessage("Endereço preenchido com dados do ViaCEP.");
        } else {
            setMessage(data.error || "CEP não encontrado.");
        }
    };

    const startEditAddress = (addressId: string) => {
        const selected = addressOptions.find((a) => a.id === addressId);
        if (!selected) return;
        setEditingAddressId(addressId);
        setAddressForm({
            customerId: selected.customerId,
            cep: selected.cep,
            rua: selected.rua,
            bairro: selected.bairro,
            cidade: selected.cidade,
            estado: selected.estado || "",
            numero: selected.numero || "",
            complemento: selected.complemento || "",
        });
    };

    const handleCreateAddress = async (event: React.FormEvent) => {
        event.preventDefault();
        const payload = {
            cep: addressForm.cep,
            rua: addressForm.rua,
            bairro: addressForm.bairro,
            cidade: addressForm.cidade,
            estado: addressForm.estado,
            numero: addressForm.numero,
            complemento: addressForm.complemento,
        };

        const response = await fetch(
            editingAddressId
                ? `${API}/enderecos/${editingAddressId}`
                : `${API}/clientes/${addressForm.customerId}/enderecos`,
            {
                method: editingAddressId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            },
        );
        if (!response.ok) {
            const erro = await response.text();
            setMessage(`Erro ${response.status}: ${erro}`);
            return;
        }
        setMessage(
            editingAddressId
                ? "Endereço atualizado com sucesso."
                : `Endereço adicionado ao cliente!`,
        );
        setEditingAddressId("");
        setAddressForm({
            customerId: "",
            cep: "",
            rua: "",
            bairro: "",
            cidade: "",
            estado: "",
            numero: "",
            complemento: "",
        });
        await loadCustomers();
    };

    const handleDeleteAddress = async (id: string) => {
        await fetch(`${API}/enderecos/${id}`, { method: "DELETE" });
        setEditingAddressId("");
        await loadCustomers();
    };

    const [darkMode, setDarkMode] = useState(false);
    
    useEffect(() => {
    if (darkMode) {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
}, [darkMode]);

    //JSX

    return (
        <main className="app-shell">
            <section className="hero-card">
                <div>
                    <h1>ClientHub</h1>
                    <p className="lede">
                        Gerenciamento de clientes e endereços com integração ViaCEP.
                    </p>
                </div>

                <button
                    type="button"
                    className="ghost"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? "☀️ Tema Claro" : "🌙 Tema Escuro"}
                </button>
            </section>

            <section className="grid two-column">
                {/*Formulário de cliente */}
                <article className="card">
                    <h2>Novo cliente</h2>
                    <form onSubmit={handleCreateCustomer} className="stack">
                        <input
                            aria-label="Nome completo"
                            value={form.nome}
                            onChange={(e) => setForm({ ...form, nome: e.target.value })}
                            placeholder="Nome completo"
                            required
                        />
                        <input
                            aria-label="E-mail"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="E-mail"
                            required
                        />
                        <input
                            aria-label="WhatsApp"
                            value={form.whatsapp}
                            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                            placeholder="WhatsApp"
                        />
                        <div className="row two">
                            <select
                                aria-label="Tipo de documento"
                                value={form.tipoDocumento}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        tipoDocumento: e.target.value as "CPF" | "CNPJ",
                                    })
                                }
                            >
                                <option value="CPF">CPF</option>
                                <option value="CNPJ">CNPJ</option>
                            </select>
                            <input
                                aria-label="Número do documento"
                                value={form.numeroDocumento}
                                onChange={(e) =>
                                    setForm({ ...form, numeroDocumento: e.target.value })
                                }
                                placeholder="Documento"
                                required
                            />
                        </div>
                        <div className="row two">
                            <button type="submit" disabled={loading}>
                                {editingCustomerId ? "Atualizar cliente" : "Cadastrar cliente"}
                            </button>
                            {editingCustomerId ? (
                                <button
                                    type="button"
                                    className="ghost"
                                    onClick={resetCustomerForm}
                                >
                                    Cancelar
                                </button>
                            ) : null}
                        </div>
                    </form>
                </article>

                {/*Formulário de endereço */}
                <article className="card">
                    <h2>Novo endereço</h2>
                    <form onSubmit={handleCreateAddress} className="stack">
                        <select
                            aria-label="Cliente"
                            value={addressForm.customerId}
                            onChange={(e) =>
                                setAddressForm({ ...addressForm, customerId: e.target.value })
                            }
                            required
                        >
                            <option value="">Selecione um cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                        <div className="row two">
                            <input
                                aria-label="CEP"
                                value={addressForm.cep}
                                onChange={(e) =>
                                    setAddressForm({ ...addressForm, cep: e.target.value })
                                }
                                placeholder="CEP"
                                required
                            />
                            <button type="button" className="ghost" onClick={handleLookupCep}>
                                Buscar ViaCEP
                            </button>
                        </div>
                        <input
                            aria-label="Rua"
                            value={addressForm.rua}
                            onChange={(e) =>
                                setAddressForm({ ...addressForm, rua: e.target.value })
                            }
                            placeholder="Rua"
                        />
                        <input
                            aria-label="Bairro"
                            value={addressForm.bairro}
                            onChange={(e) =>
                                setAddressForm({ ...addressForm, bairro: e.target.value })
                            }
                            placeholder="Bairro"
                        />
                        <div className="row two">
                            <input
                                aria-label="Cidade"
                                value={addressForm.cidade}
                                onChange={(e) =>
                                    setAddressForm({ ...addressForm, cidade: e.target.value })
                                }
                                placeholder="Cidade"
                            />
                            <input
                                aria-label="UF"
                                value={addressForm.estado}
                                onChange={(e) =>
                                    setAddressForm({ ...addressForm, estado: e.target.value })
                                }
                                placeholder="UF"
                            />
                        </div>
                        <div className="row two">
                            <input
                                aria-label="Número"
                                value={addressForm.numero}
                                onChange={(e) =>
                                    setAddressForm({ ...addressForm, numero: e.target.value })
                                }
                                placeholder="Número"
                            />
                            <input
                                aria-label="Complemento"
                                value={addressForm.complemento}
                                onChange={(e) =>
                                    setAddressForm({ ...addressForm, complemento: e.target.value })
                                }
                                placeholder="Complemento"
                            />
                        </div>
                        <div className="row two">
                            <button type="submit" disabled={loading}>
                                {editingAddressId ? "Atualizar endereço" : "Salvar endereço"}
                            </button>
                            {editingAddressId ? (
                                <button
                                    type="button"
                                    className="ghost"
                                    onClick={() => {
                                        setEditingAddressId("");
                                        setAddressForm({
                                            customerId: "",
                                            cep: "",
                                            rua: "",
                                            bairro: "",
                                            cidade: "",
                                            estado: "",
                                            numero: "",
                                            complemento: "",
                                        });
                                    }}
                                >
                                    Cancelar
                                </button>
                            ) : null}
                        </div>
                    </form>
                </article>
            </section>

            {/*Lista de clientes*/}
            <section className="card">
                <div className="toolbar">
                    <div>
                        <h2>Clientes cadastrados</h2>
                        <p>Filtre por nome, e-mail ou intervalo de datas.</p>
                    </div>
                    <button
                        type="button"
                        className="ghost"
                        onClick={() => {
                            setSearch("");
                            setStartDate("");
                            setEndDate("");
                            loadCustomers();
                        }}
                    >
                        Limpar
                    </button>
                </div>
                <div className="filters row three">
                    <input
                        aria-label="Buscar por nome ou e-mail"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome ou e-mail"
                    />
                    <input
                        aria-label="Data inicial"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        aria-label="Data final"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button type="button" onClick={() => loadCustomers()}>
                        Aplicar filtro
                    </button>
                </div>

                {message ? <p className="status">{message}</p> : null}
                {loading ? <p>Carregando...</p> : null}

                <div className="customer-list">
                    {filteredCustomers.map((cliente) => (
                        <article key={cliente.id} className="customer-card">
                            <div>
                                <h3>{cliente.nome}</h3>
                                <p>{cliente.email}</p>
                                <p>
                                    {cliente.tipoDocumento}: {cliente.numeroDocumento}
                                </p>
                                <p>WhatsApp: {cliente.whatsapp || "—"}</p>
                                <small>
                                    Cadastrado em{" "}
                                    {new Date(cliente.dataCadastro).toLocaleDateString("pt-BR")}
                                </small>
                            </div>
                            <div className="address-stack">
                                {cliente.enderecos.length > 0 ? (
                                    cliente.enderecos.map((endereco) => (
                                        <span key={endereco.id} className="chip">
                                            {endereco.cep} · {endereco.rua}, {endereco.bairro},{" "}
                                            {endereco.cidade}
                                            <button
                                                type="button"
                                                className="mini-link"
                                                onClick={() => startEditAddress(endereco.id)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                className="mini-link danger-link"
                                                onClick={() => handleDeleteAddress(endereco.id)}
                                            >
                                                Excluir
                                            </button>
                                        </span>
                                    ))
                                ) : (
                                    <span className="chip muted">Sem endereços cadastrados</span>
                                )}
                            </div>
                            <div className="stack compact-actions">
                                <button
                                    type="button"
                                    className="ghost"
                                    onClick={() => startEditCustomer(cliente)}
                                >
                                    Editar cliente
                                </button>
                                <button
                                    className="danger"
                                    type="button"
                                    onClick={() => handleDeleteCustomer(cliente.id)}
                                >
                                    Excluir cliente
                                </button>
                            </div>
                        </article>
                    ))}
                    {!filteredCustomers.length && !loading ? (
                        <p className="empty-state">Nenhum cliente encontrado.</p>
                    ) : null}
                </div>
            </section>
        </main>
    );
}

export default App;