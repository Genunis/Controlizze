/* ========================================== */
/* 1. SIMULAÇÃO DE BANCO DE DADOS             */
/* ========================================== */

// Este objeto simula o que viria do seu banco de dados (API/Backend)
const bancoDeDados = {
    usuario: {
        nome: "Marina Costa", // Imutável
        email: "marina.costa@email.com",
        telefone: "(11) 99999-1234",
        cidade: "São Paulo, SP"
    },
    financeiro: {
        moeda: "BRL",
        renda: "2000.00", // Guardado como string numérica pura
        ciclo: "mensal"
    }
};

// Opções estáticas (podem vir do banco também no futuro)
const dadosMoedas = [
    { valor: "BRL", label: "Real brasileiro (R$)", simbolo: "R$" },
    { valor: "USD", label: "Dólar americano ($)", simbolo: "$" },
    { valor: "EUR", label: "Euro (€)", simbolo: "€" }
];

const dadosCiclos = [
    { valor: "mensal", label: "Mensal" },
    { valor: "quinzenal", label: "Quinzenal" },
    { valor: "semanal", label: "Semanal" },
    { valor: "anual", label: "Anual" }
];

/* ========================================== */
/* 2. FUNÇÕES AUXILIARES                      */
/* ========================================== */

// Gera as options do select
function gerarOptions(lista, valorSelecionado) {
    return lista.map(item => 
        `<option value="${item.valor}" ${item.valor === valorSelecionado ? 'selected' : ''}>${item.label}</option>`
    ).join('');
}

// Pega o símbolo da moeda baseada no valor
function obterSimboloMoeda(valorMoeda) {
    const moeda = dadosMoedas.find(m => m.valor === valorMoeda);
    return moeda ? moeda.simbolo : 'R$';
}

// Formata o valor numérico (ex: "2000.00" -> "R$ 2.000,00")
function formatarValorMonetario(valorString, moeda) {
    const simbolo = obterSimboloMoeda(moeda);
    const valorNumero = parseFloat(valorString) || 0;
    const valorFormatado = valorNumero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `${simbolo} ${valorFormatado}`;
}

/* ========================================== */
/* 3. TEMPLATES DE HTML (RENDERIZAÇÃO)        */
/* ========================================== */

function pessoais() {
    const user = bancoDeDados.usuario;
    const fin = bancoDeDados.financeiro;
    
    // Formata a renda para exibição inicial
    const rendaFormatada = formatarValorMonetario(fin.renda, fin.moeda);

    return `
        <!-- Card Dados Pessoais -->
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h2>Dados pessoais</h2>
                    <p class="subtitle">Como podemos chamar você?</p>
                </div>
                <button class="btn-sm" id="btn-alterar-pessoal">Alterar</button>
            </div>
            <div class="card-body">
                <form class="form-grid" id="form-pessoal">
                    <div class="input-group">
                        <label>Nome completo</label>
                        <input type="text" value="${user.nome}" disabled>
                    </div>
                    <div class="input-group">
                        <label>E-mail</label>
                        <input type="email" value="${user.email}" disabled class="input-editavel" data-field="email">
                    </div>
                    <div class="input-group">
                        <label>Telefone</label>
                        <input type="text" value="${user.telefone}" disabled class="input-editavel" data-field="telefone">
                    </div>
                    <div class="input-group">
                        <label>Cidade</label>
                        <input type="text" value="${user.cidade}" disabled class="input-editavel" data-field="cidade">
                    </div>
                </form>
                <p class="helper-text">Seu e-mail é usado para acessar sua conta.</p>
                
                <div class="card-actions-inline" id="actions-pessoal" style="display: none;">
                    <button class="btn-secondary" onclick="cancelarEdicao('pessoal')">Cancelar</button>
                    <button class="btn-primary" onclick="salvarEdicao('pessoal')">Salvar</button>
                </div>
            </div>
        </div>

        <!-- Card Perfil Financeiro -->
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h2>Perfil financeiro</h2>
                    <p class="subtitle">Um ponto de partida para planejar o seu mês.</p>
                </div>
                <button class="btn-sm" id="btn-alterar-financeiro">Alterar</button>
            </div>
            <div class="card-body">
                <div class="form-grid" id="form-financeiro">
                    
                    <div class="input-group">
                        <label>Moeda</label>
                        <select disabled class="input-editavel custom-select" id="select-moeda" data-field="moeda" onchange="atualizarSimboloMoeda()">
                            ${gerarOptions(dadosMoedas, fin.moeda)}
                        </select>
                    </div>

                    <div class="input-group">
                        <label>Renda mensal</label>
                        <input type="text" id="input-renda" value="${rendaFormatada}" disabled class="input-editavel" data-field="renda" oninput="mascaraRenda(this)">
                    </div>
                    
                    <div class="input-group">
                        <label>Ciclo do orçamento</label>
                        <select disabled class="input-editavel custom-select" data-field="ciclo">
                            ${gerarOptions(dadosCiclos, fin.ciclo)}
                        </select>
                    </div>
                </div>
                
                <div class="card-actions-inline" id="actions-financeiro" style="display: none;">
                    <button class="btn-secondary" onclick="cancelarEdicao('financeiro')">Cancelar</button>
                    <button class="btn-primary" onclick="salvarEdicao('financeiro')">Salvar</button>
                </div>
            </div>
        </div>

        <!-- Card Seu Plano -->
        <div class="card">
            <div class="card-header">
                <h2>Seu plano</h2>
                <p class="subtitle">Escolha como quer cuidar do seu dinheiro.</p>
            </div>
            <div class="card-body">
                <div class="pricing-container">
                    <div class="plan-box">
                        <div class="plan-top">
                            <div class="plan-name-row">
                                <h4>Gratuito</h4>
                                <span class="badge badge-outline">Plano atual</span>
                            </div>
                            <div class="price">R$ 0</div>
                            <p class="plan-desc">Para organizar o essencial.</p>
                        </div>
                        <ul class="features">
                            <li><span class="dot">•</span> Registro de receitas e despesas</li>
                            <li><span class="dot">•</span> Simulador de orçamento</li>
                            <li><span class="dot">•</span> Resumo financeiro do mês</li>
                        </ul>
                        <button class="btn-outline">Seu plano atual</button>
                    </div>

                    <div class="plan-box premium">
                        <div class="plan-top">
                            <div class="plan-name-row">
                                <h4>Premium</h4>
                                <span class="badge badge-solid">Recomendado</span>
                            </div>
                            <div class="price">R$ 5,00 <span class="period">/ mês</span></div>
                            <p class="plan-desc">Mais clareza para ir além.</p>
                        </div>
                        <ul class="features">
                            <li><span class="dot">•</span> Tudo do Gratuito</li>
                            <li><span class="dot">•</span> Insights e relatórios completos</li>
                            <li><span class="dot">•</span> Metas e alertas personalizados</li>
                        </ul>
                        <button class="btn-primary">Assinar Premium</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function config() {
    // Como essa tela não tem "banco de dados" ainda, mantemos estático
    return `
        <div class="card">
            <div class="card-header">
                <h2>Configurações e segurança</h2>
                <p class="subtitle">Proteja sua conta. Sua senha nunca fica visível no perfil.</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Senha atual</label>
                    <input type="password" value="********" placeholder="Digite sua senha atual">
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Nova senha</label>
                        <input type="password" placeholder="Digite nova senha">
                        <span class="helper-text">Use ao menos 8 caracteres, números, letras e símbolos.</span>
                    </div>
                    <div class="form-group">
                        <label>Confirmar nova senha</label>
                        <input type="password" placeholder="Repita a nova senha">
                    </div>
                </div>
                <div class="card-actions-inline" style="display: flex; border: none; padding-top: 0; margin-top: 1rem; justify-content: flex-start; gap: 1rem;">
                    <button class="btn-primary" style="width: auto;">Alterar senha</button>
                    <a href="#" class="link-forgot" style="color: var(--text-muted); font-size: 0.85rem; text-decoration: underline; align-self: center;">Esqueci minha senha</a>
                </div>
                
                <hr class="divider" style="border: 0; border-top: 1px solid var(--border-color); margin: 2rem 0 1rem 0;">
                
                <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0;">
                    <div class="setting-info">
                        <span class="setting-label" style="display: block; font-weight: 500;">Verificação em duas etapas</span>
                        <span class="setting-value" style="font-size: 0.8rem; color: var(--text-muted);">Adicione uma camada extra de segurança na sua conta.</span>
                    </div>
                    <button class="btn-secondary" style="width: auto;">Ativar</button>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2>Privacidade e dados</h2>
                <p class="subtitle">Você decide quem vê suas informações e como seus dados são usados.</p>
            </div>
            <div class="card-body">
                <div class="setting-row border-bottom" style="display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 0; border-bottom: 1px solid var(--border-color);">
                    <div class="setting-info">
                        <span class="setting-label" style="display: block; font-weight: 500;">Ocultar valores financeiros</span>
                        <span class="setting-value" style="font-size: 0.8rem; color: var(--text-muted);">Oculta valores nas telas e relatórios públicos.</span>
                    </div>
                    <label class="switch" style="position: relative; display: inline-block; width: 46px; height: 24px;">
                        <input type="checkbox" style="opacity: 0; width: 0; height: 0;">
                        <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border-color); transition: .4s; border-radius: 34px;"></span>
                    </label>
                </div>
                <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 0;">
                    <div class="setting-info">
                        <span class="setting-label" style="display: block; font-weight: 500;">Seus dados pessoais</span>
                        <span class="setting-value" style="font-size: 0.8rem; color: var(--text-muted);">Saiba quais dados são usados e compartilhados.</span>
                    </div>
                    <button class="btn-secondary" style="width: auto;">Solicitar cópia</button>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2>Preferências</h2>
            </div>
            <div class="card-body">
                <div class="setting-row border-bottom" style="display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 0; border-bottom: 1px solid var(--border-color);">
                    <div class="setting-info">
                        <span class="setting-label" style="display: block; font-weight: 500;">Lembretes de despesas</span>
                        <span class="setting-value" style="font-size: 0.8rem; color: var(--text-muted);">Receba notificações para registrar seus gastos.</span>
                    </div>
                    <label class="switch" style="position: relative; display: inline-block; width: 46px; height: 24px;">
                        <input type="checkbox" style="opacity: 0; width: 0; height: 0;">
                        <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border-color); transition: .4s; border-radius: 34px;"></span>
                    </label>
                </div>
                <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 0;">
                    <div class="setting-info">
                        <span class="setting-label" style="display: block; font-weight: 500;">Dicas por e-mail</span>
                        <span class="setting-value" style="font-size: 0.8rem; color: var(--text-muted);">Conteúdos para você melhorar seu dia a dia.</span>
                    </div>
                    <label class="switch" style="position: relative; display: inline-block; width: 46px; height: 24px;">
                        <input type="checkbox" style="opacity: 0; width: 0; height: 0;">
                        <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border-color); transition: .4s; border-radius: 34px;"></span>
                    </label>
                </div>
            </div>
        </div>
    `;
}

/* ========================================== */
/* 4. LÓGICA DE MÁSCARA E MOEDA               */
/* ========================================== */

function mascaraRenda(input) {
    const selectMoeda = document.getElementById('select-moeda');
    const moedaAtual = selectMoeda ? selectMoeda.value : 'BRL';
    const simbolo = obterSimboloMoeda(moedaAtual);

    let valorNumerico = input.value.replace(/\D/g, '');

    if (valorNumerico === '') {
        input.value = `${simbolo} `;
        return;
    }

    let valorFormatado = (Number(valorNumerico) / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    input.value = `${simbolo} ${valorFormatado}`;
}

function atualizarSimboloMoeda() {
    const inputRenda = document.getElementById('input-renda');
    if (inputRenda && !inputRenda.disabled) {
        mascaraRenda(inputRenda);
    }
}

/* ========================================== */
/* 5. LÓGICA DE SALVAR E CANCELAR             */
/* ========================================== */

let backups = {
    pessoal: {},
    financeiro: {}
};

function salvarEdicao(tipo) {
    const form = document.getElementById(`form-${tipo}`);
    const btnAlterar = document.getElementById(`btn-alterar-${tipo}`);
    const actions = document.getElementById(`actions-${tipo}`);
    const inputs = form.querySelectorAll('.input-editavel');

    // 1. Atualiza o "Banco de Dados" com os novos valores
    inputs.forEach(input => {
        const fieldName = input.getAttribute('data-field');
        if (fieldName) {
            let valorParaSalvar = input.value;

            // Se for o campo de renda, limpamos a formatação para salvar apenas o número puro
            if (fieldName === 'renda') {
                valorParaSalvar = input.value.replace(/\D/g, ''); // Remove tudo que não é número
                valorParaSalvar = (Number(valorParaSalvar) / 100).toFixed(2); // Converte para "2000.00"
            }

            // Atualiza no nosso objeto de banco de dados
            if (tipo === 'pessoal') {
                bancoDeDados.usuario[fieldName] = valorParaSalvar;
            } else if (tipo === 'financeiro') {
                bancoDeDados.financeiro[fieldName] = valorParaSalvar;
            }
        }
    });

    // 2. Atualiza a interface (re-renderiza a tela com os dados novos do banco)
    const viewPessoais = document.getElementById('view-pessoais');
    if (viewPessoais) viewPessoais.innerHTML = pessoais();

    // 3. Restaura os eventos do botão "Alterar" após re-renderizar
    inicializarEventosAlterar();
    
    alert(`Alterações de ${tipo} salvas no banco de dados com sucesso!`);
}

function cancelarEdicao(tipo) {
    // Para cancelar, basta re-renderizar a tela, pois os dados do banco não foram alterados
    const viewPessoais = document.getElementById('view-pessoais');
    if (viewPessoais) viewPessoais.innerHTML = pessoais();

    inicializarEventosAlterar();
}

/* ========================================== */
/* 6. INICIALIZAÇÃO E EVENTOS                 */
/* ========================================== */

// Função separada para podermos chamar novamente após re-renderizar
function inicializarEventosAlterar() {
    const btnAltPessoal = document.getElementById('btn-alterar-pessoal');
    if (btnAltPessoal) {
        btnAltPessoal.addEventListener('click', () => {
            const form = document.getElementById('form-pessoal');
            const inputs = form.querySelectorAll('.input-editavel');
            
            inputs.forEach(input => {
                input.disabled = false;
                input.classList.add('input-active');
            });

            btnAltPessoal.style.display = "none";
            document.getElementById('actions-pessoal').style.display = "flex";
        });
    }

    const btnAltFinanceiro = document.getElementById('btn-alterar-financeiro');
    if (btnAltFinanceiro) {
        btnAltFinanceiro.addEventListener('click', () => {
            const form = document.getElementById('form-financeiro');
            const inputs = form.querySelectorAll('.input-editavel');
            
            inputs.forEach(input => {
                input.disabled = false;
                input.classList.add('input-active');
            });

            btnAltFinanceiro.style.display = "none";
            document.getElementById('actions-financeiro').style.display = "flex";
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const viewPessoais = document.getElementById('view-pessoais');
    const viewConfig = document.getElementById('view-config');
    const btnPessoais = document.getElementById('btn-pessoais');
    const btnConfig = document.getElementById('btn-config');

    if (viewPessoais) viewPessoais.innerHTML = pessoais();
    if (viewConfig) viewConfig.innerHTML = config();

    function mostrarAba(aba) {
        if (aba === 'pessoais') {
            viewPessoais.style.display = 'block';
            viewConfig.style.display = 'none';
            btnPessoais.classList.add('active');
            btnConfig.classList.remove('active');
        } else if (aba === 'config') {
            viewPessoais.style.display = 'none';
            viewConfig.style.display = 'block';
            btnConfig.classList.add('active');
            btnPessoais.classList.remove('active');
        }
    }

    if (btnPessoais) btnPessoais.addEventListener('click', (e) => { e.preventDefault(); mostrarAba('pessoais'); });
    if (btnConfig) btnConfig.addEventListener('click', (e) => { e.preventDefault(); mostrarAba('config'); });

    // Inicializa os botões de alterar
    inicializarEventosAlterar();
});