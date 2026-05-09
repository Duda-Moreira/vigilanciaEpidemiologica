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
    registros: []
};

const elementos = {
    apiStatus: document.querySelector('#apiStatus'),
    cidadeSelecionada: document.querySelector('#cidadeSelecionada'),
    casosSelecionados: document.querySelector('#casosSelecionados'),
    ultimaColeta: document.querySelector('#ultimaColeta'),
    casoForm: document.querySelector('#casoForm'),
    casoId: document.querySelector('#casoId'),
    cidade: document.querySelector('#cidade'),
    dataColeta: document.querySelector('#dataColeta'),
    casos: document.querySelector('#casos'),
    populacao: document.querySelector('#populacao'),
    formTitle: document.querySelector('#formTitle'),
    submitButton: document.querySelector('#submitButton'),
    resetButton: document.querySelector('#resetButton'),
    refreshButton: document.querySelector('#refreshButton'),
    reportRefreshButton: document.querySelector('#reportRefreshButton'),
    exportCsvButton: document.querySelector('#exportCsvButton'),
    relTotalRegistros: document.querySelector('#relTotalRegistros'),
    relTotalCasos: document.querySelector('#relTotalCasos'),
    relCidadeMaiorCasos: document.querySelector('#relCidadeMaiorCasos'),
    relIncidenciaMedia: document.querySelector('#relIncidenciaMedia'),
    formMessage: document.querySelector('#formMessage'),
    registrosTabela: document.querySelector('#registrosTabela'),
    totalCasos: document.querySelector('#totalCasos'),
    cidadesMonitoradas: document.querySelector('#cidadesMonitoradas'),
    ultimaAtualizacao: document.querySelector('#ultimaAtualizacao'),
    casosHoje: document.querySelector('#casosHoje')
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');
    // Aguardar o Leaflet carregar
    if (typeof L === 'undefined') {
        console.log('Leaflet não carregado, tentando novamente em 100ms...');
        setTimeout(iniciar, 100);
    } else {
        iniciar();
    }
});

function ehServidorLocalForaDoSpring() {
    const hostLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    return hostLocal && window.location.port && window.location.port !== '8080';
}

function iniciar() {
    preencherCidades();
    iniciarMapa();
    configurarEventos();
    carregarRegistros();
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
        scrollWheelZoom: true
    }).setView([-23.59, -46.62], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(estado.mapa);

    estado.layerMarcadores = L.layerGroup().addTo(estado.mapa);
    setTimeout(() => {
        if (estado.mapa) {
            estado.mapa.invalidateSize(true);
        }
    }, 0);
}

function configurarEventos() {
    elementos.casoForm.addEventListener('submit', salvarRegistro);
    elementos.resetButton.addEventListener('click', limparFormulario);
    elementos.refreshButton.addEventListener('click', carregarRegistros);
    elementos.reportRefreshButton.addEventListener('click', atualizarRelatorios);
    elementos.exportCsvButton.addEventListener('click', exportarRelatorioCsv);

    elementos.cidade.addEventListener('change', () => {
        const cidade = cidades.find((item) => item.nome === elementos.cidade.value);
        if (cidade && !elementos.populacao.value) {
            elementos.populacao.value = cidade.populacao;
        }
    });
}

async function carregarRegistros() {
    definirStatusApi('Conectando API...', '');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro HTTP: ' + response.status);
        }
        estado.registros = await response.json();
        atualizarInterface();
        atualizarMarcadores();
    } catch (error) {
        console.error('Erro ao carregar registros:', error);
        mostrarMensagem('Erro ao carregar registros. Verifique se o backend está rodando.', 'error');
    }
}

function atualizarInterface() {
    const totalCasos = estado.registros.reduce((sum, reg) => sum + reg.casos, 0);
    const cidadesMonitoradas = new Set(estado.registros.map(reg => reg.cidade)).size;
    const hoje = new Date().toISOString().split('T')[0];
    const casosHoje = estado.registros.filter(reg => reg.dataColeta === hoje).reduce((sum, reg) => sum + reg.casos, 0);
    const ultimaAtualizacao = estado.registros.length > 0 ? new Date(Math.max(...estado.registros.map(reg => new Date(reg.dataColeta)))).toLocaleDateString('pt-BR') : '-';

    elementos.totalCasos.textContent = totalCasos;
    elementos.cidadesMonitoradas.textContent = cidadesMonitoradas;
    elementos.casosHoje.textContent = casosHoje;
    elementos.ultimaAtualizacao.textContent = ultimaAtualizacao;

    atualizarTabela();
}

function atualizarTabela() {
    const tbody = elementos.registrosTabela.querySelector('tbody') || elementos.registrosTabela;
    tbody.innerHTML = '';

    estado.registros.forEach((registro) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.cidade}</td>
            <td>${new Date(registro.dataColeta).toLocaleDateString('pt-BR')}</td>
            <td>${registro.casos}</td>
            <td>${registro.populacao}</td>
            <td>
                <button onclick="editarRegistro(${registro.id})">Editar</button>
                <button onclick="deletarRegistro(${registro.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function atualizarMarcadores() {
    if (!estado.layerMarcadores) return;

    estado.layerMarcadores.clearLayers();

    const marcadoresPorCidade = {};

    estado.registros.forEach((registro) => {
        const cidade = cidades.find((c) => c.nome === registro.cidade);
        if (!cidade) return;

        if (!marcadoresPorCidade[registro.cidade]) {
            marcadoresPorCidade[registro.cidade] = {
                lat: cidade.lat,
                lng: cidade.lng,
                casos: 0,
                populacao: cidade.populacao,
                registros: []
            };
        }

        estado.registros = await resposta.json();
        definirStatusApi('API conectada', 'ok');
        renderizarMapa();
        renderizarTabela();
        atualizarRelatorios();
    } catch (erro) {
        console.error(erro);
        definirStatusApi('API indisponível', 'error');
        mostrarMensagem('Não foi possível carregar a API. Verifique se o backend está rodando.', 'error');
        renderizarMapa();
        renderizarTabela();
        atualizarRelatorios();
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

        const cor = obterCorPorCasos(dados.totalCasos);
        const marcador = L.circleMarker([cidade.lat, cidade.lng], {
            radius: obterRaioPorCasos(dados.totalCasos),
            color: cor,
            fillColor: cor,
            fillOpacity: 0.78,
            weight: 2
        });

        marcador.bindPopup(criarPopup(cidade.nome, dados));
        marcador.on('click', () => selecionarCidade(cidade.nome, dados));
        marcador.addTo(estado.layerMarcadores);
    });

    Object.values(marcadoresPorCidade).forEach((dados) => {
        const risco = calcularRisco(dados.casos, dados.populacao);
        const cor = obterCorRisco(risco);
    });

function renderizarTabela() {
    elementos.registrosTabela.innerHTML = '';

    if (!estado.registros.length) {
        const linha = document.createElement('tr');
        linha.innerHTML = '<td colspan="6">Nenhum registro cadastrado.</td>';
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
                    <button type="button" class="edit-button" data-action="edit" data-id="${registro.id}">Editar</button>
                    <button type="button" class="danger-button" data-action="delete" data-id="${registro.id}">Excluir</button>
                </td>
            `;
            elementos.registrosTabela.appendChild(linha);
        });

        const popupContent = `
            <div style="font-family: Arial, sans-serif; max-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #333;">${dados.registros[0].cidade}</h3>
                <p style="margin: 4px 0;"><strong>Casos totais:</strong> ${dados.casos}</p>
                <p style="margin: 4px 0;"><strong>População:</strong> ${dados.populacao.toLocaleString()}</p>
                <p style="margin: 4px 0;"><strong>Risco:</strong> ${risco}</p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">Última atualização: ${new Date(Math.max(...dados.registros.map(r => new Date(r.dataColeta)))).toLocaleDateString('pt-BR')}</p>
            </div>
        `;

        L.marker([dados.lat, dados.lng], { icon: marker })
            .bindPopup(popupContent)
            .addTo(estado.layerMarcadores);
    };
};

async function salvarRegistro(event) {
    event.preventDefault();

    const registro = {
        cidade: elementos.cidade.value,
        dataColeta: elementos.dataColeta.value,
        populacao: parseInt(elementos.populacao.value),
        casos: parseInt(elementos.casos.value)
    };

    const id = elementos.casoId.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registro)
        });

        if (!response.ok) {
            throw new Error('Erro HTTP: ' + response.status);
        }

        mostrarMensagem(id ? 'Registro atualizado com sucesso!' : 'Registro salvo com sucesso!', 'success');
        limparFormulario();
        mostrarMensagem('Registro salvo com sucesso.', 'success');
        await carregarRegistros();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message, 'error');
    }
}

function editarRegistro(id) {
    const registro = estado.registros.find(r => r.id === id);
    if (!registro) return;

    elementos.casoId.value = registro.id;
    elementos.cidade.value = registro.cidade;
    elementos.dataColeta.value = registro.dataColeta;
    elementos.populacao.value = registro.populacao;
    elementos.formTitle.textContent = `Editar registro #${registro.id}`;
    elementos.submitButton.textContent = 'Atualizar registro';
    mostrarMensagem('Editando registro selecionado.', '');
    elementos.cidade.focus();
}

async function deletarRegistro(id) {
    if (!confirm('Tem certeza que deseja deletar este registro?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Erro HTTP: ' + response.status);
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
    elementos.formTitle.textContent = 'Cadastrar novo caso';
    elementos.submitButton.textContent = 'Salvar caso';
    elementos.formMessage.textContent = '';
}

function mostrarMensagem(mensagem, tipo) {
    elementos.formMessage.textContent = mensagem;
    elementos.formMessage.className = orm-message ;
    setTimeout(() => {
        elementos.formMessage.textContent = '';
        elementos.formMessage.className = 'form-message';
    }, 5000);
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
        <p class="popup-title">${nomeCidade}</p>
        <p class="popup-line"><strong>${formatarNumero(dados.totalCasos)}</strong> casos</p>
        <p class="popup-line">População: ${formatarNumero(dados.populacao)}</p>
        <p class="popup-line">Incidência: ${incidencia} por 100 mil hab.</p>
    `;
}

function obterCorPorCasos(casos) {
    if (casos >= 500) {
        return '#d94b3d';
    }

    if (casos >= 100) {
        return '#d5a514';
    }

    return '#1f9d55';
}

function obterRaioPorCasos(casos) {
    if (casos >= 500) {
        return 18;
    }

    if (casos >= 100) {
        return 14;
    }

    return 10;
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

function mostrarMensagem(texto, tipo) {
    elementos.formMessage.textContent = texto;
    elementos.formMessage.className = `form-message ${tipo || ''}`.trim();
}

function definirStatusApi(texto, tipo) {
    elementos.apiStatus.textContent = texto;
    elementos.apiStatus.className = `status-pill ${tipo || ''}`.trim();
}
