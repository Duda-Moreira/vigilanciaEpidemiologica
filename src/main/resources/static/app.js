const API_URL = window.location.protocol === 'file:' || ehServidorLocalForaDoSpring()
    ? 'http://localhost:8080/api/casos'
    : '/api/casos';

const cidades = [
    { nome: 'São Paulo', lat: -23.55052, lng: -46.633308, populacao: 11451245 },
    { nome: 'Guarulhos', lat: -23.454315, lng: -46.533652, populacao: 1291784 },
    { nome: 'Osasco', lat: -23.532486, lng: -46.791681, populacao: 728615 },
    { nome: 'Santo André', lat: -23.66389, lng: -46.53833, populacao: 748919 },
    { nome: 'São Bernardo do Campo', lat: -23.69141, lng: -46.5646, populacao: 810729 }
];

const estado = {
    mapa: null,
    layerMarcadores: null,
    registros: [],
    tema: localStorage.getItem('theme') || 'light'
};

const elementos = {
    apiStatusDot: document.querySelector('#apiStatusDot'),
    apiStatusText: document.querySelector('#apiStatusText'),
    casoForm: document.querySelector('#casoForm'),
    casoId: document.querySelector('#casoId'),
    cidade: document.querySelector('#cidade'),
    dataColeta: document.querySelector('#dataColeta'),
    casos: document.querySelector('#casos'),
    populacao: document.querySelector('#populacao'),
    submitButton: document.querySelector('#submitButton'),
    refreshButton: document.querySelector('#refreshButton'),
    formMessage: document.querySelector('#formMessage'),
    registrosTabela: document.querySelector('#registrosTabela'),
    themeToggle: document.querySelector('#themeToggle'),
    totalCasos: document.querySelector('#totalCasos'),
    cidadesMonitoradas: document.querySelector('#cidadesMonitoradas'),
    ultimaAtualizacao: document.querySelector('#ultimaAtualizacao'),
    casosHoje: document.querySelector('#casosHoje')
};

document.addEventListener('DOMContentLoaded', iniciar);

function ehServidorLocalForaDoSpring() {
    const hostLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    return hostLocal && window.location.port && window.location.port !== '8080';
}

function iniciar() {
    aplicarTema();
    preencherCidades();
    iniciarMapa();
    configurarEventos();
    carregarRegistros();
    configurarSidebar();
}

function configurarSidebar() {
    // Set active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Set dashboard as active by default
    document.querySelector('.nav-item[data-section="dashboard"]').classList.add('active');
}

function aplicarTema() {
    document.documentElement.setAttribute('data-theme', estado.tema);
}

function toggleTema() {
    estado.tema = estado.tema === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', estado.tema);
    aplicarTema();
}

function preencherCidades() {
    cidades.forEach((cidade) => {
        const option = document.createElement('option');
        option.value = cidade.nome;
        option.textContent = cidade.nome;
        elementos.cidade.appendChild(option);
    });
}

function iniciarMapa() {
    estado.mapa = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true
    }).setView([-23.59, -46.62], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(estado.mapa);

    estado.layerMarcadores = L.layerGroup().addTo(estado.mapa);

    // Add custom CSS for markers
    const style = document.createElement('style');
    style.textContent = `
        .custom-marker {
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-marker:hover {
            transform: scale(1.2);
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        if (estado.mapa) {
            estado.mapa.invalidateSize(true);
        }
    }, 0);
}

function configurarEventos() {
    elementos.casoForm.addEventListener('submit', salvarRegistro);
    elementos.refreshButton.addEventListener('click', carregarRegistros);
    elementos.themeToggle.addEventListener('click', toggleTema);

    elementos.cidade.addEventListener('change', () => {
        const cidade = cidades.find((item) => item.nome === elementos.cidade.value);
        if (cidade && !elementos.populacao.value) {
            elementos.populacao.value = cidade.populacao;
        }
    });
}

async function carregarRegistros() {
    definirStatusApi('Conectando API...', false);

    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status} ao buscar registros.`);
        }

        estado.registros = await resposta.json();
        definirStatusApi('API conectada', true);
        renderizarMapa();
        renderizarTabela();
        atualizarEstatisticas();
    } catch (erro) {
        console.error(erro);
        definirStatusApi('API indisponível', false);
        mostrarMensagem('Não foi possível carregar a API. Verifique se o backend está rodando.', 'error');
        renderizarMapa();
        renderizarTabela();
        atualizarEstatisticas();
    }
}

function renderizarMapa() {
    estado.layerMarcadores.clearLayers();
    const resumo = agruparPorCidade(estado.registros);

    cidades.forEach((cidade) => {
        const dados = resumo.get(chaveCidade(cidade.nome)) || {
            cidade: cidade.nome,
            totalCasos: 0,
            populacao: cidade.populacao,
            ultimaColeta: null
        };

        const risco = obterRiscoPorCasos(dados.totalCasos);
        const marcador = L.circleMarker([cidade.lat, cidade.lng], {
            radius: obterRaioPorCasos(dados.totalCasos),
            color: risco.cor,
            fillColor: risco.cor,
            fillOpacity: 0.8,
            weight: 3,
            className: 'custom-marker'
        });

        marcador.bindPopup(criarPopup(cidade.nome, dados));
        marcador.addTo(estado.layerMarcadores);
    });

    if (estado.mapa) {
        setTimeout(() => estado.mapa.invalidateSize(true), 100);
    }
}

function renderizarTabela() {
    elementos.registrosTabela.innerHTML = '';

    if (!estado.registros.length) {
        const linha = document.createElement('tr');
        linha.innerHTML = '<td colspan="6" class="empty-state">Nenhum registro cadastrado.</td>';
        elementos.registrosTabela.appendChild(linha);
        return;
    }

    [...estado.registros]
        .sort((a, b) => new Date(b.dataColeta) - new Date(a.dataColeta))
        .forEach((registro) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${registro.id}</td>
                <td>${registro.cidade}</td>
                <td>${formatarData(registro.dataColeta)}</td>
                <td>${formatarNumero(registro.casos)}</td>
                <td>${formatarNumero(registro.populacao)}</td>
                <td>
                    <button type="button" class="edit-btn" data-action="edit" data-id="${registro.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Editar
                    </button>
                    <button type="button" class="delete-btn" data-action="delete" data-id="${registro.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Excluir
                    </button>
                </td>
            `;
            elementos.registrosTabela.appendChild(linha);
        });

    elementos.registrosTabela.querySelectorAll('button[data-action]').forEach((botao) => {
        botao.addEventListener('click', tratarAcaoTabela);
    });
}

function atualizarEstatisticas() {
    const totalRegistros = estado.registros.length;
    const totalCasos = estado.registros.reduce((acc, item) => acc + Number(item.casos), 0);
    const cidadesMonitoradas = new Set(estado.registros.map(r => r.cidade)).size;

    // Última atualização
    const datas = estado.registros.map(r => new Date(r.dataColeta)).filter(d => !isNaN(d));
    const ultimaAtualizacao = datas.length > 0 ? new Date(Math.max(...datas)) : null;

    // Casos hoje
    const hoje = new Date().toISOString().split('T')[0];
    const casosHoje = estado.registros
        .filter(r => r.dataColeta === hoje)
        .reduce((acc, item) => acc + Number(item.casos), 0);

    elementos.totalCasos.textContent = formatarNumero(totalCasos);
    elementos.cidadesMonitoradas.textContent = cidadesMonitoradas;
    elementos.ultimaAtualizacao.textContent = ultimaAtualizacao ? formatarData(ultimaAtualizacao.toISOString()) : 'Nunca';
    elementos.casosHoje.textContent = formatarNumero(casosHoje);
}

async function salvarRegistro(event) {
    event.preventDefault();

    const id = elementos.casoId.value;
    const payload = {
        cidade: elementos.cidade.value,
        dataColeta: elementos.dataColeta.value,
        casos: Number(elementos.casos.value),
        populacao: Number(elementos.populacao.value)
    };

    const url = id ? `${API_URL}/${id}` : API_URL;
    const metodo = id ? 'PUT' : 'POST';

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => null);
            throw new Error(erro?.mensagem || `Erro ${resposta.status} ao salvar.`);
        }

        limparFormulario();
        mostrarMensagem('Registro salvo com sucesso!', 'success');
        await carregarRegistros();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message, 'error');
    }
}

function tratarAcaoTabela(event) {
    const id = Number(event.currentTarget.dataset.id);
    const action = event.currentTarget.dataset.action;
    const registro = estado.registros.find((item) => item.id === id);

    if (!registro) {
        return;
    }

    if (action === 'edit') {
        preencherFormularioParaEdicao(registro);
        return;
    }

    if (action === 'delete') {
        deletarRegistro(registro);
    }
}

function preencherFormularioParaEdicao(registro) {
    elementos.casoId.value = registro.id;
    elementos.cidade.value = registro.cidade;
    elementos.dataColeta.value = registro.dataColeta;
    elementos.casos.value = registro.casos;
    elementos.populacao.value = registro.populacao;
    elementos.submitButton.textContent = 'Atualizar Caso';
    mostrarMensagem('Editando registro selecionado.', '');
    elementos.cidade.focus();
}

async function deletarRegistro(registro) {
    const confirmado = window.confirm(`Excluir o registro #${registro.id} de ${registro.cidade}?`);
    if (!confirmado) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${registro.id}`, { method: 'DELETE' });
        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status} ao excluir.`);
        }

        mostrarMensagem('Registro excluído com sucesso!', 'success');
        await carregarRegistros();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message, 'error');
    }
}

function mostrarMensagem(texto, tipo) {
    elementos.formMessage.textContent = texto;
    elementos.formMessage.className = `form-message ${tipo || ''}`.trim();
}

function definirStatusApi(texto, conectado) {
    elementos.apiStatusText.textContent = texto;
    elementos.apiStatusDot.className = `status-dot ${conectado ? '' : 'error'}`;
}

function agruparPorCidade(registros) {
    const resumo = new Map();

    registros.forEach((registro) => {
        const chave = chaveCidade(registro.cidade);
        const atual = resumo.get(chave) || {
            cidade: registro.cidade,
            totalCasos: 0,
            populacao: registro.populacao,
            ultimaColeta: null
        };

        atual.totalCasos += Number(registro.casos);
        atual.populacao = registro.populacao || atual.populacao;

        if (!atual.ultimaColeta || new Date(registro.dataColeta) > new Date(atual.ultimaColeta)) {
            atual.ultimaColeta = registro.dataColeta;
        }

        resumo.set(chave, atual);
    });

    return resumo;
}

function criarPopup(nomeCidade, dados) {
    const incidencia = dados.populacao
        ? ((dados.totalCasos / dados.populacao) * 100000).toFixed(2)
        : '0.00';

    return `
        <div style="font-family: 'Inter', sans-serif; min-width: 200px;">
            <p class="popup-title">${nomeCidade}</p>
            <p class="popup-line"><strong>${formatarNumero(dados.totalCasos)}</strong> casos registrados</p>
            <p class="popup-line">População: ${formatarNumero(dados.populacao)}</p>
            <p class="popup-line">Incidência: ${incidencia} por 100 mil hab.</p>
            <p class="popup-line">Última coleta: ${dados.ultimaColeta ? formatarData(dados.ultimaColeta) : 'Nunca'}</p>
        </div>
    `;
}

function obterRiscoPorCasos(casos) {
    if (casos >= 500) {
        return { cor: '#ef4444', risco: 'high' }; // Vermelho - Alto
    }

    if (casos >= 100) {
        return { cor: '#f59e0b', risco: 'medium' }; // Amarelo - Médio
    }

    return { cor: '#10b981', risco: 'low' }; // Verde - Baixo
}

function obterRaioPorCasos(casos) {
    if (casos >= 500) {
        return 20;
    }

    if (casos >= 100) {
        return 16;
    }

    return 12;
}

function chaveCidade(cidade) {
    return cidade
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function formatarData(dataIso) {
    if (!dataIso) {
        return '-';
    }

    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(dataIso));
}

function formatarNumero(numero) {
    return new Intl.NumberFormat('pt-BR').format(numero || 0);
}

function tratarAcaoTabela(event) {
    const id = Number(event.currentTarget.dataset.id);
    const action = event.currentTarget.dataset.action;
    const registro = estado.registros.find((item) => item.id === id);

    if (!registro) {
        return;
    }

    if (action === 'edit') {
        preencherFormularioParaEdicao(registro);
        return;
    }

    if (action === 'delete') {
        deletarRegistro(registro);
    }
}

function preencherFormularioParaEdicao(registro) {
    elementos.casoId.value = registro.id;
    elementos.cidade.value = registro.cidade;
    elementos.dataColeta.value = registro.dataColeta;
    elementos.casos.value = registro.casos;
    elementos.populacao.value = registro.populacao;
    elementos.formTitle.textContent = `Editar registro #${registro.id}`;
    elementos.submitButton.textContent = 'Atualizar registro';
    mostrarMensagem('Editando registro selecionado.', '');
    elementos.cidade.focus();
}

async function deletarRegistro(registro) {
    const confirmado = window.confirm(`Excluir o registro #${registro.id} de ${registro.cidade}?`);
    if (!confirmado) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${registro.id}`, { method: 'DELETE' });
        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status} ao excluir.`);
        }

        mostrarMensagem('Registro excluído com sucesso.', 'success');
        await carregarRegistros();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message, 'error');
    }
}

function limparFormulario() {
    elementos.casoForm.reset();
    elementos.casoId.value = '';
    elementos.formTitle.textContent = 'Cadastrar caso';
    elementos.submitButton.textContent = 'Salvar registro';
    mostrarMensagem('', '');
}

function selecionarCidade(nomeCidade, dados) {
    elementos.cidadeSelecionada.textContent = nomeCidade;
    elementos.casosSelecionados.textContent = formatarNumero(dados.totalCasos);
    elementos.ultimaColeta.textContent = dados.ultimaColeta
        ? `Última coleta: ${formatarData(dados.ultimaColeta)}`
        : 'Sem coletas cadastradas.';
}

function atualizarRelatorios() {
    const totalRegistros = estado.registros.length;
    const totalCasos = estado.registros.reduce((acc, item) => acc + Number(item.casos), 0);
    const porCidade = agruparPorCidade(estado.registros);
    const maiorCidade = Array.from(porCidade.values()).sort((a, b) => b.totalCasos - a.totalCasos)[0];
    const populacaoTotal = Array.from(porCidade.values()).reduce((acc, item) => acc + Number(item.populacao || 0), 0);
    const incidenciaMedia = populacaoTotal > 0
        ? ((totalCasos / populacaoTotal) * 100000).toFixed(2)
        : '0.00';

    elementos.relTotalRegistros.textContent = formatarNumero(totalRegistros);
    elementos.relTotalCasos.textContent = formatarNumero(totalCasos);
    elementos.relCidadeMaiorCasos.textContent = maiorCidade ? maiorCidade.cidade : '-';
    elementos.relIncidenciaMedia.textContent = incidenciaMedia;
}

function exportarRelatorioCsv() {
    if (!estado.registros.length) {
        mostrarMensagem('Não há dados para exportar.', 'error');
        return;
    }

    const headers = ['ID', 'Cidade', 'Data de coleta', 'Casos', 'População'];
    const linhas = estado.registros.map((registro) => [
        registro.id,
        registro.cidade,
        registro.dataColeta,
        registro.casos,
        registro.populacao
    ].map((valor) => `"${String(valor).replace(/"/g, '""')}"`).join(';'));

    const csv = '\uFEFF' + [headers.map((cabecalho) => `"${cabecalho}"`).join(';'), ...linhas].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-casos-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    mostrarMensagem('Relatório CSV gerado com sucesso.', 'success');
}
