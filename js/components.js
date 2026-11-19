
function criarNavbar() {
    const path = window.location.pathname;
    const isActive = (pagina) => path.includes(pagina) ? 'active' : '';

    return `
    <header class="navbar">
        <div class="nav-container">
            <a href="../index.html" class="logo">
                <img src="../assets/img/controlizze-logo-dois.png" alt="Controlizze Logo" class="logo-img">
            </a>
            <nav class="nav-links">
                <!-- Adicionado a função isActive() em cada link -->
                <a href="../pages/dashboard_premium.html" class="${isActive('dashboard_premium')}">Início</a>
                <a href="#" class="${isActive('planos')}">Planos</a>
                <a href="../pages/simulador.html" class="${isActive('simulador')}">Simulador</a>
                <a href="#" class="${isActive('despesas')}">Despesas</a>
                <a href="#" class="${isActive('resultados')}">Resultados</a>
            </nav>
            <div class="nav-profile">
                <div class="avatar-icon"><a href="../pages/config.html"><i class="ph ph-user"></i></a></div>
            </div>
        </div>
    </header>`;
}

function criarFooter() {
    return `
    <footer class="footer">
        <div class="footer-container">
 
            <div class="footer-top">
                <div class="footer-left">
                    <img src=".././assets/img/controlizze-logo.png" alt="Controlizze Logo" class="footer-logo-img">
                </div>
                
                <div class="footer-right">
                    <a href="mailto:controlizze@gmail.com" aria-label="E-mail">
                        <div class="social-icon"><i class="ph ph-envelope-simple"></i></div>
                    </a>
                    <a href="#" aria-label="Discord">
                        <div class="social-icon"><i class="ph ph-discord-logo"></i></div>
                    </a>
                    <a href="https://github.com/Genunis/Controlizze" aria-label="GitHub">
                        <div class="social-icon"><i class="ph ph-github-logo"></i></div>
                    </a>
                </div>
            </div>

            <!-- AQUI ESTÁ A LINHA DIVISÓRIA MÁGICA -->
            <div class="footer-divider"></div>

            <!-- Linha Inferior -->
            <div class="footer-bottom">
                <span class="copyright">© 2026 Controlizze.</span>
                
                <div class="footer-center">
                    <a href="#">Política de Privacidade</a>
                    <a href="#">Termos de Uso</a>
                    <a href="#">LGDP</a>
                </div>
            </div>

        </div>
    </footer>
    `;
}

// Quando a página carregar, insere os componentes
document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.createElement('div');
    document.body.prepend(navPlaceholder);
    navPlaceholder.outerHTML = criarNavbar();

    const footerPlaceholder = document.createElement('div');
    document.body.append(footerPlaceholder);
    footerPlaceholder.outerHTML = criarFooter();
});