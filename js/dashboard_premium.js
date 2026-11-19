// ==========================================
// SIMULAÇÃO DE DADOS VINDOS DE FORA (API/Banco)
// ==========================================
// Nota: Quando você integrar com o backend, você só precisa substituir 
// esse objeto pelos dados reais que vierem da sua API.
let dadosUsuario = {
    nome: "Usuário",
    salario: 0.00,
    despesas: [],
    metas: [],
    categoriasGrafico: []
};

// Para testar o layout enquanto você não tem o backend, 
// descomente as linhas abaixo para carregar dados de exemplo:

dadosUsuario = {
    nome: "Matheus",
    salario: 2100.00,
    despesas: [
        { nome: "Aluguel", valor: 850.00, categoria: "Moradia" },
        { nome: "Mercado", valor: 400.00, categoria: "Alimentação" },
        { nome: "Internet", valor: 99.90, categoria: "Utilidades" },
        { nome: "Streaming", valor: 55.00, categoria: "Lazer" },
        { nome: "Transporte", valor: 120.00, categoria: "Transporte" }
    ],
    metas: [
        { nome: "Reserva de Emergência", atual: 6000.00, alvo: 10000.00, emoji: "🛡️" },
        { nome: "Festa de Formatura", atual: 1500.00, alvo: 2000.00, emoji: "🎉" },
        { nome: "Upgrade do PC", atual: 900.00, alvo: 3000.00, emoji: "💻" }
    ],
    categoriasGrafico: [
        { label: "Alimentação", porcentagem: 40, cor: "#ef4444" },
        { label: "Transporte", porcentagem: 20, cor: "#f97316" },
        { label: "Lazer", porcentagem: 20, cor: "#06b6d4" },
        { label: "Outros", porcentagem: 20, cor: "#8b5cf6" }
    ]
};


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ==========================================
// INICIALIZAÇÃO DA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Se os dados ainda não chegaram, a tela mostra "Carregando..."
    if (dadosUsuario.nome === "Usuário") {
        console.warn("Aguardando dados do usuário. A tela está em modo de espera.");
    }

    // --- 1. DATA ATUAL ---
    const elDataAtual = document.getElementById('data-atual');
    if (elDataAtual) {
        const dataHoje = new Date();
        const opcoesData = { month: 'long', year: 'numeric' };
        let dataFormatada = dataHoje.toLocaleDateString('pt-BR', opcoesData);
        elDataAtual.innerText = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    }

    // --- 2. NOME DO USUÁRIO ---
    const elNome = document.getElementById('nome-usuario');
    if (elNome) elNome.innerText = dadosUsuario.nome;

    // --- 3. RESUMO FINANCEIRO (Saldo e Despesas) ---
    const totalDespesas = dadosUsuario.despesas.reduce((acc, d) => acc + d.valor, 0);
    const saldo = dadosUsuario.salario - totalDespesas;

    const elSaldo = document.getElementById('valor-saldo');
    const elDespesas = document.getElementById('valor-despesas');

    if (elSaldo) {
        elSaldo.innerText = formatarMoeda(saldo);
        if (saldo < 0) {
            elSaldo.classList.replace('value-green', 'value-red');
        }
    }
    if (elDespesas) elDespesas.innerText = formatarMoeda(totalDespesas);

    // --- 4. SIMULADOR DE ORÇAMENTO (Gráfico de Rosca) ---
    const elRendaSimulador = document.getElementById('renda-simulador');
    if (elRendaSimulador) elRendaSimulador.innerText = formatarMoeda(dadosUsuario.salario);

    const elDonutChart = document.getElementById('donut-chart');
    const elLegendaGrafico = document.getElementById('legenda-grafico');

    if (elDonutChart && elLegendaGrafico && dadosUsuario.categoriasGrafico.length > 0) {
        elLegendaGrafico.innerHTML = "";
        let gradientString = "";
        let acumuladoPorcentagem = 0;

        dadosUsuario.categoriasGrafico.forEach(cat => {
            const inicio = acumuladoPorcentagem;
            const fim = acumuladoPorcentagem + cat.porcentagem;
            
            gradientString += `${cat.cor} ${inicio}% ${fim}%, `;
            acumuladoPorcentagem = fim;

            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <span class="legend-dot" style="background: ${cat.cor};"></span> ${cat.label}
            `;
            elLegendaGrafico.appendChild(legendItem);
        });

        gradientString = gradientString.slice(0, -2);
        elDonutChart.style.background = `conic-gradient(${gradientString})`;
    }

    // --- 5. META MENSAL (Principal) ---
    if (dadosUsuario.metas.length > 0) {
        const metaPrincipal = dadosUsuario.metas[0];
        const elMetaNome = document.getElementById('meta-nome');
        const elMetaValores = document.getElementById('meta-valores');
        const elMetaPorcentagem = document.getElementById('meta-porcentagem');
        const elMetaBarra = document.getElementById('meta-barra');

        if (elMetaNome) {
            const porcentagemMeta = (metaPrincipal.atual / metaPrincipal.alvo) * 100;
            elMetaNome.innerText = metaPrincipal.nome;
            elMetaValores.innerText = `${formatarMoeda(metaPrincipal.atual)} / ${formatarMoeda(metaPrincipal.alvo)}`;
            elMetaPorcentagem.innerText = `${porcentagemMeta.toFixed(2)}%`;
            if (elMetaBarra) elMetaBarra.style.width = `${porcentagemMeta}%`;
        }
    }

    // --- 6. MINHAS METAS (Lista) ---
    const elListaMetas = document.getElementById('lista-metas');
    if (elListaMetas) {
        elListaMetas.innerHTML = "";
        dadosUsuario.metas.forEach(meta => {
            const porcentagem = (meta.atual / meta.alvo) * 100;
            const div = document.createElement('div');
            div.className = 'goal-item';
            div.innerHTML = `<span>${meta.emoji} ${meta.nome} - ${porcentagem.toFixed(0)}%</span>`;
            elListaMetas.appendChild(div);
        });
    }

});

// ==========================================
// FUNÇÃO DE EXPORTAÇÃO DE DADOS
// ==========================================
function exportarDados(formato) {
    if (dadosUsuario.despesas.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    const dadosExportacao = dadosUsuario.despesas.map(despesa => ({
        Nome: despesa.nome,
        Categoria: despesa.categoria,
        Valor: despesa.valor
    }));

    const total = dadosUsuario.despesas.reduce((acc, d) => acc + d.valor, 0);
    dadosExportacao.push({ Nome: "TOTAL", Categoria: "-", Valor: total });

    const nomeArquivo = `Relatorio_${dadosUsuario.nome.replace(/\s+/g, '_')}`;

    // --- JSON ---
    if (formato === 'json') {
        const jsonString = JSON.stringify(dadosExportacao, null, 2);
        baixarArquivo(jsonString, `${nomeArquivo}.json`, 'application/json');
    }

    // --- CSV ---
    else if (formato === 'csv') {
        let csvString = "Nome;Categoria;Valor\n";
        dadosExportacao.forEach(item => {
            csvString += `${item.Nome};${item.Categoria};${item.Valor.toFixed(2).replace('.', ',')}\n`;
        });
        baixarArquivo('\uFEFF' + csvString, `${nomeArquivo}.csv`, 'text/csv;charset=utf-8;');
    }

    // --- EXCEL (HTML Table) ---
    else if (formato === 'excel') {
        let tableHtml = "<table><tr><th>Nome</th><th>Categoria</th><th>Valor</th></tr>";
        dadosExportacao.forEach(item => {
            tableHtml += `<tr><td>${item.Nome}</td><td>${item.Categoria}</td><td>${item.Valor}</td></tr>`;
        });
        tableHtml += "</table>";
        baixarArquivo(tableHtml, `${nomeArquivo}.xls`, 'application/vnd.ms-excel');
    }

    // --- PDF (Impressão Nativa) ---
    else if (formato === 'pdf') {
        const janelaImpressao = window.open('', '_blank');
        if (!janelaImpressao) {
            alert("Por favor, permita pop-ups para exportar o PDF.");
            return;
        }
        
        janelaImpressao.document.write(`
            <html>
            <head>
                <title>Relatório PDF</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #8b5cf6; color: white; }
                </style>
            </head>
            <body>
                <h1>Relatório Financeiro - ${dadosUsuario.nome}</h1>
                <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
                <table>
                    <tr><th>Nome</th><th>Categoria</th><th>Valor (R$)</th></tr>
                    ${dadosExportacao.map(item => `<tr><td>${item.Nome}</td><td>${item.Categoria}</td><td>R$ ${item.Valor.toFixed(2).replace('.', ',')}</td></tr>`).join('')}
                </table>
            </body>
            </html>
        `);
        janelaImpressao.document.close();
        janelaImpressao.focus();
        setTimeout(() => {
            janelaImpressao.print();
            janelaImpressao.close();
        }, 500);
    }
}

// Função auxiliar para forçar o download
function baixarArquivo(conteudo, nomeArquivo, tipoMime) {
    const blob = new Blob([conteudo], { type: tipoMime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}

